const mongoose = require('mongoose');
const { Package } = require('./models');
require('dotenv').config();

const packages = [
    {
        title: 'Bali Bliss',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4',
        price: 899,
        duration: '7 Days',
        description: 'Experience the tropical paradise of Bali with this all-inclusive package. From pristine beaches to lush rice terraces, discover the magic of the Island of the Gods.',
        location: 'Bali, Indonesia',
        inclusions: ['Airport transfers', '6 nights accommodation', 'Daily breakfast', 'Guided tours', 'Spa treatment'],
        exclusions: ['International flights', 'Personal expenses', 'Travel insurance'],
        itinerary: [
            { day: 1, title: 'Arrival in Bali', description: 'Transfer to your hotel in Seminyak. Welcome dinner.' },
            { day: 2, title: 'Ubud Cultural Tour', description: 'Visit the Sacred Monkey Forest and Ubud Palace.' },
            { day: 3, title: 'Rice Terraces & Volcano', description: 'Tegalalang Rice Terrace and Mount Batur view.' },
            { day: 4, title: 'Beach Day', description: 'Relax on the white sands of Nusa Dua.' },
            { day: 5, title: 'Temple Run', description: 'Visit Uluwatu Temple for sunset and Kecak dance.' },
            { day: 6, title: 'Free Day', description: 'Explore at your own pace or book optional activities.' },
            { day: 7, title: 'Departure', description: 'Transfer to the airport for your flight home.' }
        ]
    },
    {
        title: 'Parisian Escape',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34',
        price: 1299,
        duration: '5 Days',
        description: 'Romance and culture await in the heart of France. Explore iconic landmarks, world-class museums, and charming cafes.',
        location: 'Paris, France',
        inclusions: ['Airport transfers', '4 nights accommodation', 'Seine River Cruise', 'Louvre Museum entry'],
        exclusions: ['Flights', 'Meals (except breakfast)', 'City tax'],
        itinerary: [
            { day: 1, title: 'Bienvenue à Paris', description: 'Arrival and check-in. Evening Seine cruise.' },
            { day: 2, title: 'The Iron Lady', description: 'Eiffel Tower visit and Champs-Élysées stroll.' },
            { day: 3, title: 'Art & History', description: 'Guided tour of the Louvre Museum.' },
            { day: 4, title: 'Montmartre', description: 'Explore the artistic district and Sacré-Cœur.' },
            { day: 5, title: 'Au Revoir', description: 'Free morning before departure.' }
        ]
    },
    {
        title: 'Tokyo Explorer',
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26',
        price: 1599,
        duration: '9 Days',
        description: 'Dive into the vibrant culture and technology of Tokyo. A perfect blend of modern neon lights and traditional temples.',
        location: 'Tokyo, Japan',
        inclusions: ['Airport transfers', '8 nights accommodation', '7-day JR Pass', 'TeamLab Borderless ticket'],
        exclusions: ['Flights', 'Meals', 'Optional tours'],
        itinerary: [
            { day: 1, title: 'Arrival in Tokyo', description: 'Check-in to your Shinjuku hotel.' },
            { day: 2, title: 'Modern Tokyo', description: 'Shibuya Crossing and Harajuku fashion.' },
            { day: 3, title: 'Old Tokyo', description: 'Senso-ji Temple and Asakusa district.' },
            { day: 4, title: 'Tech & Anime', description: 'Akihabara electronics and anime culture.' },
            { day: 5, title: 'Day Trip to Nikko', description: 'Visit the Toshogu Shrine.' },
            { day: 6, title: 'TeamLab Planets', description: 'Immersive digital art experience.' },
            { day: 7, title: 'Free Day', description: 'Shopping in Ginza or visit Disney.' },
            { day: 8, title: 'Meiji Shrine', description: 'Peaceful walk in Yoyogi Park.' },
            { day: 9, title: 'Departure', description: 'Train to Narita/Haneda airport.' }
        ]
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Package.deleteMany({});
        await Package.insertMany(packages);
        console.log('✅ Seeded packages');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
