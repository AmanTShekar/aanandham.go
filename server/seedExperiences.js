const mongoose = require('mongoose');
const { Experience } = require('./models');
require('dotenv').config();

const sampleExperiences = [
    {
        title: "Pasta Making with Nonna",
        location: "Rome, Italy",
        price: 85,
        duration: "3 hours",
        image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Learn the secrets of authentic Italian pasta from a local grandmother.",
        rating: 4.9,
        reviews: 1240,
        category: "Food & Drink",
        groupSize: 6,
        included: ["Pasta", "Wine", "Apron"]
    },
    {
        title: "Sunset Boat Tour",
        location: "Santorini, Greece",
        price: 150,
        duration: "5 hours",
        image: "https://images.unsplash.com/photo-1566371486490-560ded23b5e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Sail around the caldera and watch the famous Santorini sunset.",
        rating: 4.8,
        reviews: 850,
        category: "Nature & Outdoors",
        groupSize: 12,
        included: ["Drinks", "Snacks"]
    },
    {
        title: "Street Food Hunt",
        location: "Bangkok, Thailand",
        price: 45,
        duration: "4 hours",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Taste the best street food Bangkok has to offer with a local guide.",
        rating: 4.95,
        reviews: 2100,
        category: "Food & Drink",
        groupSize: 8,
        included: ["Food tastings", "Water"]
    },
    {
        title: "Northern Lights Chase",
        location: "Tromsø, Norway",
        price: 200,
        duration: "6 hours",
        image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Hunt for the aurora borealis in the Arctic wilderness.",
        rating: 4.7,
        reviews: 500,
        category: "Nature & Outdoors",
        groupSize: 15,
        included: ["Transport", "Hot chocolate"]
    },
    {
        title: "Surf Lessons for Beginners",
        location: "Bali, Indonesia",
        price: 35,
        duration: "2 hours",
        image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Catch your first wave at Kuta Beach.",
        rating: 4.85,
        reviews: 1500,
        category: "Sports",
        groupSize: 5,
        included: ["Surfboard", "Rash guard"]
    },
    {
        title: "Louvre Museum Tour",
        location: "Paris, France",
        price: 90,
        duration: "3 hours",
        image: "https://images.unsplash.com/photo-1499856871940-a09627c6d7db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Skip the line and see the Mona Lisa with an art historian.",
        rating: 4.6,
        reviews: 3200,
        category: "Art & Culture",
        groupSize: 20,
        included: ["Ticket", "Guide"]
    },
    {
        title: "Kyoto Tea Ceremony",
        location: "Kyoto, Japan",
        price: 60,
        duration: "1.5 hours",
        image: "https://images.unsplash.com/photo-1545048702-79362596cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Experience the tranquility of a traditional tea ceremony.",
        rating: 4.9,
        reviews: 900,
        category: "Art & Culture",
        groupSize: 4,
        included: ["Tea", "Sweets"]
    },
    {
        title: "Helicopter Ride over NYC",
        location: "New York, USA",
        price: 250,
        duration: "30 mins",
        image: "https://images.unsplash.com/photo-1522083165195-642550937ac0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "See the Big Apple from above.",
        rating: 4.8,
        reviews: 450,
        category: "Sightseeing",
        groupSize: 4,
        included: ["Flight"]
    },
    {
        title: "Wine Tasting in Tuscany",
        location: "Florence, Italy",
        price: 110,
        duration: "6 hours",
        image: "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Visit vineyards and taste Chianti wines.",
        rating: 4.9,
        reviews: 1800,
        category: "Food & Drink",
        groupSize: 10,
        included: ["Wine", "Lunch"]
    },
    {
        title: "Desert Safari & BBQ",
        location: "Dubai, UAE",
        price: 75,
        duration: "6 hours",
        image: "https://images.unsplash.com/photo-1451337516015-6b6fcd1f901e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Dune bashing, camel riding, and dinner under the stars.",
        rating: 4.7,
        reviews: 2500,
        category: "Nature & Outdoors",
        groupSize: 30,
        included: ["Dinner", "Transport"]
    },
    {
        title: "Salsa Dancing Class",
        location: "Havana, Cuba",
        price: 25,
        duration: "1.5 hours",
        image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Learn to move like a local.",
        rating: 4.8,
        reviews: 600,
        category: "Art & Culture",
        groupSize: 10,
        included: ["Lesson", "Drink"]
    },
    {
        title: "Rainforest Hiking",
        location: "Costa Rica",
        price: 55,
        duration: "4 hours",
        image: "https://images.unsplash.com/photo-1518182170546-0766aa6f694e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Spot sloths and monkeys in the wild.",
        rating: 4.9,
        reviews: 1100,
        category: "Nature & Outdoors",
        groupSize: 8,
        included: ["Guide", "Snack"]
    },
    {
        title: "Pottery Workshop",
        location: "Lisbon, Portugal",
        price: 50,
        duration: "2.5 hours",
        image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Make your own ceramic souvenir.",
        rating: 4.8,
        reviews: 400,
        category: "Art & Culture",
        groupSize: 6,
        included: ["Materials"]
    },
    {
        title: "Jazz Club Experience",
        location: "New Orleans, USA",
        price: 40,
        duration: "3 hours",
        image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Enjoy live jazz in the French Quarter.",
        rating: 4.7,
        reviews: 950,
        category: "Entertainment",
        groupSize: 50,
        included: ["Entry"]
    },
    {
        title: "Great Barrier Reef Snorkel",
        location: "Cairns, Australia",
        price: 180,
        duration: "8 hours",
        image: "https://images.unsplash.com/photo-1582967788606-a171f1080ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Explore the world's largest coral reef system.",
        rating: 4.8,
        reviews: 1300,
        category: "Nature & Outdoors",
        groupSize: 20,
        included: ["Gear", "Lunch"]
    },
    {
        title: "Tango Show & Dinner",
        location: "Buenos Aires, Argentina",
        price: 100,
        duration: "4 hours",
        image: "https://images.unsplash.com/photo-1533147670608-2a2f9775d3a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Watch a passionate tango performance.",
        rating: 4.6,
        reviews: 700,
        category: "Entertainment",
        groupSize: 40,
        included: ["Dinner", "Show"]
    },
    {
        title: "Coffee Farm Tour",
        location: "Medellín, Colombia",
        price: 65,
        duration: "5 hours",
        image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "From bean to cup in the Colombian mountains.",
        rating: 4.9,
        reviews: 800,
        category: "Food & Drink",
        groupSize: 8,
        included: ["Coffee", "Transport"]
    },
    {
        title: "Harry Potter Walking Tour",
        location: "London, UK",
        price: 30,
        duration: "2.5 hours",
        image: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Visit filming locations and inspirations.",
        rating: 4.5,
        reviews: 3000,
        category: "Tours",
        groupSize: 20,
        included: ["Guide"]
    },
    {
        title: "Hot Air Balloon Ride",
        location: "Cappadocia, Turkey",
        price: 220,
        duration: "3 hours",
        image: "https://images.unsplash.com/photo-1583207804784-198ba4353030?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Float over fairy chimneys at sunrise.",
        rating: 4.95,
        reviews: 2800,
        category: "Sightseeing",
        groupSize: 12,
        included: ["Flight", "Breakfast"]
    },
    {
        title: "Flamenco Night",
        location: "Seville, Spain",
        price: 45,
        duration: "1.5 hours",
        image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Feel the passion of authentic flamenco.",
        rating: 4.7,
        reviews: 1200,
        category: "Entertainment",
        groupSize: 30,
        included: ["Show", "Drink"]
    },
    {
        title: "Yoga Retreat",
        location: "Ubud, Bali",
        price: 120,
        duration: "1 day",
        image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Rejuvenate your mind and body in the jungle.",
        rating: 4.9,
        reviews: 600,
        category: "Wellness",
        groupSize: 15,
        included: ["Yoga", "Lunch", "Massage"]
    },
    {
        title: "Meditation by the Sea",
        location: "Malibu, USA",
        price: 40,
        duration: "1 hour",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Guided meditation with ocean sounds.",
        rating: 4.8,
        reviews: 300,
        category: "Wellness",
        groupSize: 10,
        included: ["Mat"]
    },
    {
        title: "City Bike Tour",
        location: "Amsterdam, Netherlands",
        price: 35,
        duration: "3 hours",
        image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Cycle through the canals like a local.",
        rating: 4.7,
        reviews: 1500,
        category: "Tours",
        groupSize: 12,
        included: ["Bike", "Helmet"]
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Experience.deleteMany({}); // Clear existing
        await Experience.insertMany(sampleExperiences);
        console.log('✅ Seeded experiences');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
