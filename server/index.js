const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const axios = require('axios');
const multer = require('multer'); // Added for file upload
require('dotenv').config();

// Force development mode if not specified
if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}

console.log(`🚀 Environment: ${process.env.NODE_ENV}`);
console.log(`🔑 Google API Key: ${process.env.GOOGLE_MAPS_API_KEY ? 'Loaded' : 'Missing'}`);

const { User, Listing, Booking, Experience, Review, Wishlist, SiteImage } = require('./models');
const bookingRoutes = require('./routes/bookings');
const listingRoutes = require('./routes/listings');
const wishlistRoutes = require('./routes/wishlists');
const destinationRoutes = require('./routes/destinations');
const packageRoutes = require('./routes/packages');
const guideRoutes = require('./routes/guides');

const app = express();

// ==================== SECURITY MIDDLEWARE ====================

// Set security HTTP headers
app.use(helmet());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Middleware
app.use(cors({
    origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'https://booking-site-react.vercel.app'
    ],
    credentials: true
}));

// Serve static files in production if they exist
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    if (fs.existsSync(clientBuildPath)) {
        app.use(express.static(clientBuildPath));
    }
}

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB error:', err));

const { auth, adminAuth } = require('./middleware/auth');
console.log('Auth Middleware Loaded:', { auth: !!auth, adminAuth: !!adminAuth });

// Upload Route (Moved here)
app.post('/api/upload', auth, adminAuth, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.json({ url: imageUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/guides', guideRoutes);

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role: role || 'user' });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name, email, role: user.role, avatar: user.avatar } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const loginLimiter = rateLimit({
    max: 5, // 5 attempts
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts, please try again in 15 minutes'
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role, avatar: user.avatar } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== EXPERIENCE ROUTES ====================
// Helper to transform Google Place to Experience format
const transformGoogleExperience = (place, forcedCategory = null) => {
    const categories = [
        'Art & Culture', 'Entertainment', 'Food & Drink', 'Sports', 'Tours', 'Sightseeing', 'Wellness', 'Nature & Outdoors'
    ];
    const category = forcedCategory || categories[Math.floor(Math.random() * categories.length)];

    let images = [
        "https://a0.muscache.com/im/pictures/lombard/MtTemplate-2496585-poster/original/e6d1261a-7d1b-4234-8b5d-36c057043539.jpeg?im_w=720"
    ];

    if (place.photos && place.photos.length > 0) {
        images = place.photos.slice(0, 5).map(photo =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );
    }

    return {
        title: place.name,
        location: place.formatted_address,
        price: Math.floor(Math.random() * 150) + 30,
        duration: `${Math.floor(Math.random() * 4) + 1} hours`,
        rating: place.rating || 4.8,
        image: images[0],
        images: images,
        host: {
            name: "Local Expert",
            avatar: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 50)}.jpg`
        },
        category: category,
        groupSize: Math.floor(Math.random() * 10) + 2,
        description: `Join us for an amazing experience at ${place.name}. ${place.editorial_summary?.overview || ''}`,
        included: ["Equipment", "Drinks", "Guide"]
    };
};

app.get('/api/experiences', async (req, res) => {
    try {
        const { category, minPrice, maxPrice } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }

        // Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let experiences = await Experience.find(query);

        // If few results, fetch from Google
        if (experiences.length < 5) {
            try {
                const searchTerm = category ? `things to do in Munnar ${category}` : 'things to do in Munnar';
                const googleRes = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchTerm)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
                );

                if (googleRes.data.status === 'OK') {
                    const externalExperiences = googleRes.data.results
                        .slice(0, 8)
                        .map(place => {
                            const transformed = transformGoogleExperience(place, category);
                            return { ...transformed, _id: place.place_id };
                        });

                    let newExternalExperiences = externalExperiences;

                    // Apply in-memory filters
                    if (minPrice || maxPrice) {
                        newExternalExperiences = newExternalExperiences.filter(exp => {
                            const price = exp.price;
                            if (minPrice && price < Number(minPrice)) return false;
                            if (maxPrice && price > Number(maxPrice)) return false;
                            return true;
                        });
                    }

                    experiences = [...experiences, ...newExternalExperiences];
                }
            } catch (googleErr) {
                console.error('Google API Error (Experiences):', googleErr.message);
            }
        }

        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/experiences', async (req, res) => {
    try {
        const experience = new Experience(req.body);
        await experience.save();
        res.status(201).json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/experiences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let experience;

        // 1. Try finding in DB if it looks like an ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            experience = await Experience.findById(id);
        }

        // 2. If not found in DB, try Google Places
        if (!experience) {
            try {
                const googleRes = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${process.env.GOOGLE_MAPS_API_KEY}`
                );

                if (googleRes.data.status === 'OK') {
                    const place = googleRes.data.result;
                    experience = { ...transformGoogleExperience(place), _id: place.place_id };
                }
            } catch (googleErr) {
                console.error('Google API Error (Experience Details):', googleErr.message);
            }
        }

        if (!experience) return res.status(404).json({ message: 'Not found' });
        res.json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== REVIEW ROUTES ====================
app.get('/api/listings/:id/reviews', async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await Listing.findById(listingId);

        // 1. Fetch Local Reviews
        let reviews = await Review.find({ listing: listingId })
            .populate('user', 'name avatar')
            .lean(); // Convert to plain JS object to allow modification

        // 2. Fetch Google Reviews if applicable
        if (listing && listing.googlePlaceId) {
            try {
                const googleRes = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${listing.googlePlaceId}&fields=reviews&key=${process.env.GOOGLE_MAPS_API_KEY}`
                );

                if (googleRes.data.status === 'OK' && googleRes.data.result.reviews) {
                    const googleReviews = googleRes.data.result.reviews.map(gReview => ({
                        _id: `google_${gReview.time}`, // Fake ID
                        user: {
                            name: gReview.author_name,
                            avatar: gReview.profile_photo_url
                        },
                        rating: gReview.rating,
                        comment: gReview.text,
                        createdAt: new Date(gReview.time * 1000),
                        source: 'google'
                    }));
                    reviews = [...reviews, ...googleReviews];
                }
            } catch (googleErr) {
                console.error('Error fetching Google reviews:', googleErr.message);
            }
        }

        // 3. Sort by date (newest first)
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/reviews', auth, async (req, res) => {
    try {
        const { listingId, rating, subRatings, comment } = req.body;

        // Check if user already reviewed
        const existingReview = await Review.findOne({ listing: listingId, user: req.user._id });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this listing' });
        }

        const review = new Review({
            listing: listingId,
            user: req.user._id,
            rating,
            subRatings,
            comment
        });
        await review.save();

        // Update listing rating
        const reviews = await Review.find({ listing: listingId });
        const avgRating = reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

        await Listing.findByIdAndUpdate(listingId, { rating: avgRating.toFixed(1) });

        await review.populate('user', 'name avatar');
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ==================== ADMIN ROUTES ====================
app.get('/api/admin/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalListings = await Listing.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalExperiences = await Experience.countDocuments();

        const totalRevenue = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const recentBookings = await Booking.find()
            .populate('user listing')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            stats: {
                totalUsers, totalListings, totalBookings, totalExperiences,
                totalRevenue: totalRevenue[0]?.total || 0
            },
            recentBookings
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/admin/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.patch('/api/admin/users/:id/role', auth, adminAuth, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/admin/users/:id', auth, adminAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create Host (Admin Only)
app.post('/api/admin/create-host', auth, adminAuth, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const host = new User({
            name,
            email,
            password: hashedPassword,
            role: 'business', // Host role
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D4AF37&color=fff`
        });

        await host.save();
        res.status(201).json({ message: 'Host created successfully', host });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Listings
app.get('/api/admin/listings', auth, adminAuth, async (req, res) => {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/admin/listings/:id', auth, adminAuth, async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.json({ message: 'Listing deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Bookings
app.get('/api/admin/bookings', auth, adminAuth, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user listing')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.patch('/api/admin/bookings/:id', auth, adminAuth, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('user listing');
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Experiences
app.get('/api/admin/experiences', auth, adminAuth, async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ createdAt: -1 });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/admin/experiences/:id', auth, adminAuth, async (req, res) => {
    try {
        await Experience.findByIdAndDelete(req.params.id);
        res.json({ message: 'Experience deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Reviews
app.get('/api/admin/reviews', auth, adminAuth, async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name email')
            .populate('listing', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete('/api/admin/reviews/:id', auth, adminAuth, async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Handle React routing, return all requests to React app
if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, '../client/dist');
    if (fs.existsSync(clientBuildPath)) {
        app.get('*', (req, res) => {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        });
    }
}

// --- Admin Site Images Routes ---
app.get('/api/admin/site-images', async (req, res) => {
    try {
        const images = await SiteImage.find().sort({ order: 1, createdAt: -1 });
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/site-images', auth, adminAuth, async (req, res) => {
    // Role check handled by adminAuth
    try {
        const newImage = new SiteImage(req.body);
        await newImage.save();
        res.status(201).json(newImage);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/admin/site-images/:id', auth, adminAuth, async (req, res) => {
    // Role check handled by adminAuth
    try {
        await SiteImage.findByIdAndDelete(req.params.id);
        res.json({ message: 'Image deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
