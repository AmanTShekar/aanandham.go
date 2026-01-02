const express = require('express');
const router = express.Router();
const { Wishlist, Listing } = require('../models');
const { auth } = require('../middleware/auth');
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

// Get user's wishlist
router.get('/', auth, async (req, res) => {
    try {
        const wishlists = await Wishlist.find({ user: req.user._id })
            .populate('listing')
            .sort({ createdAt: -1 });

        const listings = wishlists.map(w => w.listing).filter(l => l !== null);
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add to wishlist
router.post('/', auth, async (req, res) => {
    try {
        const { listingId } = req.body;

        const resolvedId = await resolveListingId(listingId);
        if (!resolvedId) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check if already in wishlist
        const existing = await Wishlist.findOne({
            user: req.user._id,
            listing: resolvedId
        });

        if (existing) {
            return res.status(400).json({ message: 'Already in wishlist' });
        }

        const wishlist = new Wishlist({
            user: req.user._id,
            listing: resolvedId
        });

        await wishlist.save();
        await wishlist.populate('listing');

        res.status(201).json(wishlist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove from wishlist
router.delete('/:listingId', auth, async (req, res) => {
    try {
        const resolvedId = await resolveListingId(req.params.listingId);
        if (!resolvedId) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const wishlist = await Wishlist.findOneAndDelete({
            user: req.user._id,
            listing: resolvedId
        });

        if (!wishlist) {
            return res.status(404).json({ message: 'Not found in wishlist' });
        }

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check if listing is in wishlist
router.get('/check/:listingId', auth, async (req, res) => {
    try {
        const resolvedId = await resolveListingId(req.params.listingId);
        if (!resolvedId) {
            return res.json({ inWishlist: false });
        }

        const wishlist = await Wishlist.findOne({
            user: req.user._id,
            listing: resolvedId
        });

        res.json({ inWishlist: !!wishlist });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
