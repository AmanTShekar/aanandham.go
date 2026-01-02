const mongoose = require('mongoose');
const axios = require('axios');
const { Listing } = require('./models');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Fallback if env not loaded

// Helper to generate random details
const getRandomDetails = () => {
    const guests = Math.floor(Math.random() * 6) + 2;
    return {
        guests,
        bedrooms: Math.floor(guests / 2) + 1,
        beds: Math.ceil(guests / 1.5),
        baths: Math.floor(Math.random() * 2) + 1
    };
};

const getRandomPrice = () => Math.floor(Math.random() * 400) + 80; // $80 - $480

const getRandomAmenities = () => {
    const all = ["Wifi", "Pool", "Kitchen", "Free parking", "Gym", "Air conditioning", "Heating", "Washer", "Dryer"];
    return all.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 3);
};

const importFromGoogle = async (cityQuery) => {
    try {
        console.log(`\n🔍 Searching Google for places in "${cityQuery}"...`);

        // 1. Search Text API
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=vacation+rentals+in+${cityQuery}&key=${GOOGLE_API_KEY}`;
        const response = await axios.get(searchUrl);

        if (response.data.status !== 'OK') {
            throw new Error(`Google API Error: ${response.data.status}`);
        }

        const results = response.data.results;
        console.log(`✅ Found ${results.length} places. Processing...`);

        const newListings = results.map(place => {
            // Get photo URL if available
            let image = "https://a0.muscache.com/im/pictures/miso/Hosting-53274539/original/365299e3-f926-47ee-bcbf-606b6a0370b9.jpeg?im_w=720"; // Default
            if (place.photos && place.photos.length > 0) {
                const photoRef = place.photos[0].photo_reference;
                image = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
            }

            return {
                title: place.name,
                location: place.formatted_address,
                price: getRandomPrice(),
                rating: place.rating || 4.5,
                image: image,
                images: [image, image, image], // Use same image for gallery for now
                host: {
                    name: "Local Host",
                    avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`,
                    isSuperhost: Math.random() > 0.7
                },
                details: getRandomDetails(),
                amenities: getRandomAmenities(),
                description: `Experience a wonderful stay at ${place.name}. Located centrally in ${cityQuery}, this place offers everything you need for a comfortable trip.`,
                guestFavorite: place.rating > 4.5
            };
        });

        // 2. Save to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🔌 Connected to DB');

        await Listing.insertMany(newListings);
        console.log(`🎉 Successfully added ${newListings.length} new listings from ${cityQuery}!`);

        process.exit();

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Get city from command line arg
const city = process.argv[2];
if (!city) {
    console.log('Please provide a city name. Example: node import_listings.js "New York"');
    process.exit(1);
}

importFromGoogle(city);
