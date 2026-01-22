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
    latitude: { type: Number },
    longitude: { type: Number },

    // Property Type Classification
    propertyType: {
        type: String,
        enum: ['hotel', 'tent', 'resort', 'villa', 'cottage', 'campsite'],
        default: 'hotel',
        index: true
    },

    // Booking Type
    bookingType: {
        type: String,
        enum: ['instant', 'inquiry'], // instant = direct booking, inquiry = contact first
        default: 'instant'
    },

    // Group & Event Support
    supportsGroups: { type: Boolean, default: false },
    supportsEvents: { type: Boolean, default: false },
    maxGroupSize: { type: Number, default: 0 }, // 0 means no group bookings
    eventTypes: [String], // e.g., ['wedding', 'corporate', 'birthday', 'retreat']

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
    gallery: [String],
    topPlaces: [{
        name: String,
        image: String,
        description: String
    }],
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

// Contact/Inquiry Schema
const inquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    inquiryType: {
        type: String,
        enum: ['general', 'listing', 'experience', 'event', 'group'],
        default: 'general'
    },
    // Reference to listing or experience if applicable
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    experience: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
    // Additional details for specific inquiries
    checkIn: { type: Date },
    checkOut: { type: Date },
    guests: { type: Number },

    // Group & Event Specific Fields
    isGroupBooking: { type: Boolean, default: false },
    groupSize: { type: Number },
    eventType: { type: String }, // 'wedding', 'corporate', 'birthday', etc.
    eventDate: { type: Date },
    eventDuration: { type: String }, // '1 day', '2 days', etc.
    specialRequirements: { type: String },
    budget: { type: Number },

    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'closed'],
        default: 'new'
    }
}, { timestamps: true });

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
    SiteImage: mongoose.model('SiteImage', siteImageSchema),
    Inquiry: mongoose.model('Inquiry', inquirySchema),
    Sightseeing: mongoose.model('Sightseeing', new mongoose.Schema({
        title: { type: String, required: true },
        location: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        order: { type: Number, default: 0 }
    })),
    TravelStory: mongoose.model('TravelStory', new mongoose.Schema({
        title: { type: String, required: true },
        category: { type: String, required: true },
        image: { type: String, required: true },
        link: { type: String, required: true },
        date: { type: String, required: true }, // Keeping as String for flexibility or Date
        order: { type: Number, default: 0 }
    })),
    SiteContent: mongoose.model('SiteContent', new mongoose.Schema({
        key: { type: String, required: true, unique: true }, // e.g., 'whyChooseUs', 'heroSection'
        content: { type: mongoose.Schema.Types.Mixed, required: true }
    }, { timestamps: true })),
    PreviousEvent: mongoose.model('PreviousEvent', new mongoose.Schema({
        title: { type: String, required: true },
        date: { type: String, required: true },
        image: { type: String, required: true },
        description: { type: String, required: true },
        recapImages: [String],
        order: { type: Number, default: 0 },
        // New fields for "Happening Now" rich cards
        price: { type: String }, // e.g., "₹2,500 / person"
        location: { type: String },
        duration: { type: String } // e.g., "2 Days"
    }))
};
