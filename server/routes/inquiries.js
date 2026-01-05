const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Inquiry, Listing, Experience } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');

// Create a new inquiry
router.post('/', async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            subject,
            message,
            inquiryType,
            listingId,
            experienceId,
            checkIn,
            checkOut,
            guests
        } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                error: 'Name, email, subject, and message are required'
            });
        }

        // Create inquiry object
        const inquiryData = {
            name,
            email,
            phone,
            subject,
            message,
            inquiryType: inquiryType || 'general'
        };

        // Add optional fields
        if (listingId) inquiryData.listing = listingId;
        if (experienceId) inquiryData.experience = experienceId;
        if (checkIn) inquiryData.checkIn = checkIn;
        if (checkOut) inquiryData.checkOut = checkOut;
        if (guests) inquiryData.guests = guests;

        const inquiry = new Inquiry(inquiryData);
        await inquiry.save();

        // Send email notification to admin
        try {
            // Check if email configuration exists
            const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;

            if (hasEmailConfig) {
                const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                    port: process.env.EMAIL_PORT || 587,
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });

                // Get listing/experience title if available
                let entityTitle = '';
                if (listingId) {
                    const listing = await Listing.findById(listingId);
                    if (listing) entityTitle = `for ${listing.title}`;
                } else if (experienceId) {
                    const experience = await Experience.findById(experienceId);
                    if (experience) entityTitle = `for ${experience.title}`;
                }

                const mailOptions = {
                    from: `"${name}" <${email}>`, // sender address
                    to: process.env.EMAIL_USER, // list of receivers (admin)
                    subject: `New Inquiry: ${subject} ${entityTitle}`, // Subject line
                    html: `
                        <h2>New Inquiry Received</h2>
                        <p><strong>Type:</strong> ${inquiryType}</p>
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                        ${checkIn ? `<p><strong>Check-in:</strong> ${checkIn}</p>` : ''}
                        ${checkOut ? `<p><strong>Check-out:</strong> ${checkOut}</p>` : ''}
                        ${guests ? `<p><strong>Guests:</strong> ${guests}</p>` : ''}
                        <hr/>
                        <h3>Message:</h3>
                        <p>${message}</p>
                        <br/>
                        <p><small>This inquiry was sent from the Aanandham website.</small></p>
                    `,
                };

                await transporter.sendMail(mailOptions);
                console.log('Inquiry email notification sent successfully');
            } else {
                console.log('Skipping email notification: EMAIL_USER or EMAIL_PASS not set in environment variables');
            }
        } catch (emailError) {
            console.error('Error sending email notification:', emailError);
            // Don't fail the request if email sending fails
        }

        res.status(201).json({
            message: 'Inquiry submitted successfully',
            inquiry
        });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        res.status(500).json({ error: 'Failed to submit inquiry' });
    }
});

// Get all inquiries (Admin only)
router.get('/', auth, adminAuth, async (req, res) => {
    try {
        const { status, type, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;
        if (type) query.inquiryType = type;

        const inquiries = await Inquiry.find(query)
            .populate('listing', 'title location image')
            .populate('experience', 'title location image')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Inquiry.countDocuments(query);

        res.json({
            inquiries,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

// Get inquiry statistics (Admin only)
router.get('/stats/overview', auth, adminAuth, async (req, res) => {
    try {
        const total = await Inquiry.countDocuments();
        const newInquiries = await Inquiry.countDocuments({ status: 'new' });
        const replied = await Inquiry.countDocuments({ status: 'replied' });
        const closed = await Inquiry.countDocuments({ status: 'closed' });

        const byType = await Inquiry.aggregate([
            {
                $group: {
                    _id: '$inquiryType',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            total,
            newInquiries,
            replied,
            closed,
            byType
        });
    } catch (error) {
        console.error('Error fetching inquiry stats:', error);
        res.status(500).json({ error: 'Failed to fetch inquiry statistics' });
    }
});

// Get inquiry by ID (Admin only)
router.get('/:id', auth, adminAuth, async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id)
            .populate('listing')
            .populate('experience');

        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        // Mark as read if it's new
        if (inquiry.status === 'new') {
            inquiry.status = 'read';
            await inquiry.save();
        }

        res.json(inquiry);
    } catch (error) {
        console.error('Error fetching inquiry:', error);
        res.status(500).json({ error: 'Failed to fetch inquiry' });
    }
});

// Update inquiry status (Admin only)
router.patch('/:id/status', auth, adminAuth, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['new', 'read', 'replied', 'closed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        res.json(inquiry);
    } catch (error) {
        console.error('Error updating inquiry:', error);
        res.status(500).json({ error: 'Failed to update inquiry' });
    }
});

// Delete inquiry (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

        if (!inquiry) {
            return res.status(404).json({ error: 'Inquiry not found' });
        }

        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        console.error('Error deleting inquiry:', error);
        res.status(500).json({ error: 'Failed to delete inquiry' });
    }
});

module.exports = router;
