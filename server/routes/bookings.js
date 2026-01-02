const express = require('express');
const router = express.Router();
const { Booking, Listing } = require('../models');
const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Helper to resolve listing ID (handles Google Place IDs)
const resolveListingId = async (id) => {
    // 1. If it's a valid MongoDB ObjectId, return it
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        return id;
    }

    // 2. If not, check if we already have this external listing in DB
    let listing = await Listing.findOne({ googlePlaceId: id });
    if (listing) {
        return listing._id;
    }

    // 3. If not in DB, fetch from Google and create it
    try {
        const googleRes = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${GOOGLE_API_KEY}`
        );

        if (googleRes.data.status === 'OK') {
            const place = googleRes.data.result;

            // Generate details similar to listings.js
            const guests = Math.floor(Math.random() * 6) + 2;
            let image = "https://a0.muscache.com/im/pictures/miso/Hosting-53274539/original/365299e3-f926-47ee-bcbf-606b6a0370b9.jpeg?im_w=720";

            if (place.photos && place.photos.length > 0) {
                const photoRef = place.photos[0].photo_reference;
                image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
            }

            const newListing = new Listing({
                title: place.name,
                location: place.formatted_address,
                price: Math.floor(Math.random() * 400) + 80,
                rating: place.rating || 4.5,
                image: image,
                images: [image, image, image],
                host: {
                    name: "Local Host",
                    avatar: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
                    isSuperhost: Math.random() > 0.7
                },
                details: {
                    guests,
                    bedrooms: Math.floor(guests / 2) + 1,
                    beds: Math.ceil(guests / 1.5),
                    baths: Math.floor(Math.random() * 2) + 1
                },
                amenities: ["Wifi", "Pool", "Kitchen", "Air conditioning"],
                description: `Enjoy a stay at ${place.name}, located in ${place.formatted_address}.`,
                isExternal: true,
                googlePlaceId: place.place_id
            });

            await newListing.save();
            return newListing._id;
        }
    } catch (error) {
        console.error('Error fetching/creating external listing:', error);
    }

    return null;
};

// Create a new booking
router.post('/', async (req, res) => {
    try {
        const { listingId, userId, guest, checkIn, checkOut, guests, totalPrice } = req.body;

        // Basic validation
        if (!listingId || (!userId && (!guest?.name || !guest?.email)) || !checkIn || !checkOut || !totalPrice) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const resolvedListingId = await resolveListingId(listingId);
        if (!resolvedListingId) {
            return res.status(404).json({ message: 'Listing not found or could not be created' });
        }

        // Handle guests structure
        let guestData = guests;
        if (typeof guests === 'number') {
            guestData = { adults: guests, children: 0, infants: 0, pets: 0 };
        }

        const bookingData = {
            listing: resolvedListingId,
            checkIn,
            checkOut,
            numberOfGuests: guestData,
            totalPrice
        };

        if (userId) {
            bookingData.user = userId;
        } else {
            bookingData.guest = guest;
        }

        const newBooking = new Booking(bookingData);

        const savedBooking = await newBooking.save();

        // --- Send Email Notification ---
        try {
            // Only attempt if credentials exist
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const nodemailer = require('nodemailer');
                const transporter = nodemailer.createTransport({
                    service: 'gmail', // Standard Gmail. For custom domain, host/port needed.
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const listingDetails = await Listing.findById(resolvedListingId);

                const guestName = userId ? 'Registered User' : guest?.name;
                const guestEmail = userId ? 'Registered User' : guest?.email;
                const guestPhone = userId ? 'Registered User' : guest?.phone;

                const mailOptions = {
                    from: `"Aanandham Booking System" <${process.env.EMAIL_USER}>`,
                    to: 'bookings@aanandhamgo.in',
                    subject: `New Request: ${listingDetails.title}`,
                    html: `
                        <h3>New Booking Request Received</h3>
                        <p><strong>Listing:</strong> ${listingDetails.title}</p>
                        <p><strong>Location:</strong> ${listingDetails.location}</p>
                        <hr/>
                        <h4>Guest Details</h4>
                        <p><strong>Name:</strong> ${guestName}</p>
                        <p><strong>Email:</strong> ${guestEmail}</p>
                        <p><strong>Phone:</strong> ${guestPhone || 'Not provided'}</p>
                        <hr/>
                        <h4>Booking Details</h4>
                        <p><strong>Check-in:</strong> ${checkIn}</p>
                        <p><strong>Check-out:</strong> ${checkOut}</p>
                        <p><strong>Guests:</strong> ${JSON.stringify(guestData)}</p>
                        <p><strong>Total Price:</strong> ₹${totalPrice}</p>
                        <br/>
                        <p><em>Please contact the guest to confirm.</em></p>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log('Booking email sent successfully to bookings@aanandhamgo.in');
            } else {
                console.log('Skipping email: No EMAIL_USER/PASS env variables set.');
            }
        } catch (emailError) {
            console.error('Failed to send booking email:', emailError);
        }
        // -------------------------------

        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
});

// Get bookings for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId })
            .populate('listing')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

module.exports = router;
