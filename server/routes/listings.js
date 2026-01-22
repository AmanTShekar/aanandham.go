const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Listing, Review } = require('../models');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const categories = [
    'Beach', 'Windmills', 'Modern', 'Countryside', 'Pools', 'Islands', 'Lake',
    'Skiing', 'Castles', 'Caves', 'Camping', 'Arctic', 'Desert', 'Camper vans', 'OMG!'
];

// Helper to transform Google Place to our Listing format
const transformGooglePlace = (place, forcedCategory = null) => {
    const guests = Math.floor(Math.random() * 6) + 2;

    // Process Photos
    let images = [
        "https://a0.muscache.com/im/pictures/miso/Hosting-53274539/original/365299e3-f926-47ee-bcbf-606b6a0370b9.jpeg?im_w=720"
    ];

    if (place.photos && place.photos.length > 0) {
        images = place.photos.slice(0, 5).map(photo =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`
        );
    }

    let price = Math.floor(Math.random() * 400) + 80; // Default random
    if (place.price_level !== undefined) {
        const basePrices = { 0: 0, 1: 80, 2: 150, 3: 300, 4: 500 };
        const base = basePrices[place.price_level] || 100;
        price = Math.floor(Math.random() * 100) + base;
    }

    const category = forcedCategory || categories[Math.floor(Math.random() * categories.length)];

    return {
        title: place.name,
        location: place.formatted_address,
        latitude: place.geometry?.location?.lat,
        longitude: place.geometry?.location?.lng,
        price: price,
        rating: place.rating || 4.5,
        image: images[0],
        images: images,
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
        amenities: ["Wifi", "Pool", "Kitchen", "Air conditioning", "Heating", "Washer"],
        description: `Experience a wonderful stay at ${place.name}. Located in the heart of ${place.formatted_address}, this place offers easy access to local attractions. ${place.editorial_summary?.overview || ''}`,
        isExternal: true,
        googlePlaceId: place.place_id,
        category: category
    };
};

// GET /api/listings/search/bounds
router.get('/search/bounds', async (req, res) => {
    try {
        const { north, south, east, west } = req.query;

        if (!north || !south || !east || !west) {
            return res.status(400).json({ message: 'Missing bounds parameters' });
        }

        const n = parseFloat(north);
        const s = parseFloat(south);
        const e = parseFloat(east);
        const w = parseFloat(west);

        // 1. Search Local DB
        // Note: This assumes simple box query. For crossing dateline, logic needs adjustment.
        let query = {
            latitude: { $lte: n, $gte: s },
            longitude: { $lte: e, $gte: w }
        };

        let listings = await Listing.find(query).limit(20);

        // 2. Fetch from Google Places if we need more results
        // We'll calculate a center point and a radius that covers the box roughly
        if (listings.length < 10) {
            try {
                const centerLat = (n + s) / 2;
                const centerLng = (e + w) / 2;

                // Estimate radius in meters (rough approximation)
                // 1 degree lat is ~111km. 
                const latDiff = n - s;
                const radius = Math.max(Math.abs(latDiff) * 111000 / 2, 5000); // Min 5km

                const googleRes = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${centerLat},${centerLng}&radius=${radius}&type=lodging&key=${GOOGLE_API_KEY}`
                );

                if (googleRes.data.status === 'OK') {
                    const externalListings = googleRes.data.results
                        .map(place => {
                            const transformed = transformGooglePlace(place);
                            return { ...transformed, _id: place.place_id };
                        });

                    // Filter out duplicates and those outside bounds (Google radius is circular)
                    const existingIds = new Set(listings.map(l => l.googlePlaceId || l._id.toString()));

                    const newExternalListings = externalListings.filter(l => {
                        if (existingIds.has(l.googlePlaceId)) return false;
                        // Check bounds
                        return l.latitude <= n && l.latitude >= s && l.longitude <= e && l.longitude >= w;
                    });

                    listings = [...listings, ...newExternalListings];
                }
            } catch (googleErr) {
                console.error('Google API Error (Bounds):', googleErr.message);
            }
        }

        res.json(listings);
    } catch (error) {
        console.error('Bounds Search Error:', error);
        res.status(500).json({ message: error.message });
    }
});

const { auth } = require('../middleware/auth');

// GET /api/listings/current-user-listings (My Listings)
router.get('/my-listings', auth, async (req, res) => {
    try {
        const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/listings (with search, category, and filters support)
router.get('/', async (req, res) => {

    try {
        console.log('GET /api/listings request received');
        const { search, category, minPrice, maxPrice, type, amenities } = req.query;
        let listings = [];

        // 1. Search Local DB
        let query = {};
        if (search) {
            query.$or = [
                { location: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } }
            ];
        }
        if (category) {
            query.category = category;
        }

        // Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Amenities Filter
        if (amenities) {
            const amenitiesList = amenities.split(',');
            query.amenities = { $all: amenitiesList };
        }

        // Type Filter (Note: 'type' field might need to be added to schema if not present, or mapped to something else)
        // For now, let's assume we might filter by description or title if type is not in schema, 
        // or just ignore if schema doesn't support it yet. 
        // Ideally, we should add 'type' to Listing schema.
        // But for "Entire place" vs "Private room", we can check 'title' or 'description' or add a field.
        // Let's skip strict type filtering on DB for now unless we add the field, 
        // or we can do a regex match on description.
        if (type && type !== 'Any') {
            query.description = { $regex: type, $options: 'i' };
        }

        listings = await Listing.find(query);

        // 2. If few results (especially for specific category), fetch from Google
        // Only fetch from Google if we are NOT strictly filtering by amenities/price which Google API might not support easily in text search
        // However, we can fetch and then filter in memory.
        if (listings.length < 5) {
            try {
                const searchTerm = search ? `hotels in ${search}` : (category ? `lodging near ${category}` : 'lodging');
                console.log(`Fetching from Google for: ${searchTerm}`);
                console.log(`Using API Key: ${GOOGLE_API_KEY ? 'Present' : 'Missing'}`);

                const googleRes = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchTerm)}&key=${GOOGLE_API_KEY}`
                );

                console.log('Google API Status:', googleRes.data.status);

                if (googleRes.data.status === 'OK') {
                    const externalListings = googleRes.data.results
                        .slice(0, 8) // Limit to 8 external results
                        .map(place => {
                            // If user requested a category, assign it to these new results
                            const transformed = transformGooglePlace(place, category);
                            return { ...transformed, _id: place.place_id };
                        });

                    // Filter out duplicates
                    const existingGoogleIds = new Set(listings.map(l => l.googlePlaceId).filter(Boolean));
                    let newExternalListings = externalListings.filter(l => !existingGoogleIds.has(l.googlePlaceId));

                    // Apply in-memory filters to external listings
                    if (minPrice || maxPrice) {
                        newExternalListings = newExternalListings.filter(l => {
                            const price = l.price;
                            if (minPrice && price < Number(minPrice)) return false;
                            if (maxPrice && price > Number(maxPrice)) return false;
                            return true;
                        });
                    }

                    // Amenities are random on external, so maybe don't filter strict or they will all disappear
                    // But if user asks for Pool, we should check if we added Pool.
                    if (amenities) {
                        const amenitiesList = amenities.split(',');
                        newExternalListings = newExternalListings.filter(l =>
                            amenitiesList.every(a => l.amenities.includes(a))
                        );
                    }

                    listings = [...listings, ...newExternalListings];
                } else {
                    console.log('Google API returned non-OK status:', googleRes.data);
                }
            } catch (googleErr) {
                console.error('Google API Error:', googleErr.message);
                if (googleErr.response) {
                    console.error('Google API Error Details:', googleErr.response.data);
                }
            }
        }

        console.log(`Returning ${listings.length} listings`);
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Check if it's a valid MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const listing = await Listing.findById(id);
            if (listing) return res.json(listing);
        }

        // 2. If not found in DB, try fetching from Google Places using the ID
        // This handles the case where frontend sends a googlePlaceId
        try {
            // First check if we already saved this googlePlaceId but user navigated with the Place ID
            const existingListing = await Listing.findOne({ googlePlaceId: id });
            if (existingListing) {
                return res.json(existingListing);
            }

            // Fetch details from Google
            const googleRes = await axios.get(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,formatted_address,geometry,photos,rating,reviews,editorial_summary,place_id,price_level&key=${GOOGLE_API_KEY}`
            );

            if (googleRes.data.status === 'OK') {
                const place = googleRes.data.result;
                const listingData = transformGooglePlace(place);

                // PERSIST TO DB: Create a real MongoDB document for this listing
                // This is crucial for the booking system to work
                const newListing = new Listing(listingData);
                await newListing.save();

                return res.json(newListing);
            }
        } catch (googleErr) {
            console.error('Google Place Details Error:', googleErr.message);
        }

        res.status(404).json({ message: 'Listing not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/listings (Create)
router.post('/', async (req, res) => {
    try {
        const listing = new Listing(req.body);
        await listing.save();
        res.status(201).json(listing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT /api/listings/:id (Update)
router.put('/:id', async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!listing) return res.status(404).json({ message: 'Listing not found' });
        res.json(listing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
