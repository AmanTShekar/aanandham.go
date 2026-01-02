const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'business'], default: 'user' },
    avatar: { type: String, default: 'https://randomuser.me/api/portraits/lego/1.jpg' }
}, { timestamps: true });

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [String],
    host: {
        name: String,
        avatar: String,
        isSuperhost: Boolean
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Owner reference for B2B
    details: {
        guests: Number,
        bedrooms: Number,
        beds: Number,
        baths: Number
    },
    amenities: [String],
    description: String,
    guestFavorite: { type: Boolean, default: false },
    isExternal: { type: Boolean, default: false },
    googlePlaceId: { type: String, unique: true, sparse: true },
    category: { type: String, index: true },
    roomTypes: [{
        name: { type: String, required: true },
        description: String,
        price: { type: Number, required: true },
        capacity: { type: Number, required: true }, // Max guests
        size: Number, // sq ft
        beds: Number,
        amenities: [String], // e.g., ["Wifi", "AC", "TV"]
        images: [String],
        available: { type: Number, default: 1 },
        cancellation: { type: String, default: 'Free cancellation' }
    }]
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    experience: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    guests: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

const experienceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [String],
    host: { name: String, avatar: String },
    category: { type: String, required: true },
    groupSize: { type: Number, required: true },
    description: String,
    included: [String],
    itinerary: [{
        time: String,
        activity: String
    }],
    coordinator: {
        name: String,
        role: String,
        image: String,
        phone: String
    },
    inclusions: [String] // detailed inclusions list
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    subRatings: {
        cleanliness: { type: Number, min: 1, max: 5, required: true },
        accuracy: { type: Number, min: 1, max: 5, required: true },
        checkIn: { type: Number, min: 1, max: 5, required: true },
        communication: { type: Number, min: 1, max: 5, required: true },
        location: { type: Number, min: 1, max: 5, required: true },
        value: { type: Number, min: 1, max: 5, required: true }
    },
    comment: { type: String, required: true }
}, { timestamps: true });

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }
}, { timestamps: true });

// Destination Schema
const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    details: { type: String },
    highlights: [String],
    bestTimeToVisit: String,
    currency: String,
    language: String
}, { timestamps: true });

// Package Schema
const packageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // e.g., "7 Days"
    description: { type: String, required: true },
    itinerary: [{ day: Number, title: String, description: String }],
    inclusions: [String],
    exclusions: [String],
    location: String
}, { timestamps: true });

// Guide Schema
const guideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, default: 'Travel Expert' },
    date: { type: Date, default: Date.now },
    content: { type: String, required: true } // HTML or Markdown content
}, { timestamps: true });

const siteImageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    title: { type: String, default: "Experience" },
    category: { type: String, default: "bento" }, // 'bento', 'hero', etc.
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Create compound index to prevent duplicate wishlist entries
wishlistSchema.index({ user: 1, listing: 1 }, { unique: true });

module.exports = {
    User: mongoose.model('User', userSchema),
    Listing: mongoose.model('Listing', listingSchema),
    Booking: mongoose.model('Booking', bookingSchema),
    Experience: mongoose.model('Experience', experienceSchema),
    Review: mongoose.model('Review', reviewSchema),
    Wishlist: mongoose.model('Wishlist', wishlistSchema),
    Destination: mongoose.model('Destination', destinationSchema),
    Package: mongoose.model('Package', packageSchema),
    Guide: mongoose.model('Guide', guideSchema),
    SiteImage: mongoose.model('SiteImage', siteImageSchema)
};
