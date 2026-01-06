const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Listing, User, Experience } = require('./models');
require('dotenv').config();

const mockListings = [
    // Top 3 Camping Listings (Matching SEO Content)
    {
        title: "Cloud Beds Suryanelli",
        location: "Suryanelli, Munnar",
        latitude: 10.0889,
        longitude: 77.0595,
        price: 1500, // Real price point
        rating: 4.95,
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
            "https://images.unsplash.com/photo-1496545672479-7ac372c7a611?w=800&q=80",
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80"
        ],
        host: { name: "Aanandham Host", avatar: "https://randomuser.me/api/portraits/men/12.jpg", isSuperhost: true },
        details: { guests: 3, bedrooms: 1, beds: 2, baths: 1 },
        amenities: ["Sunrise View", "Campfire", "BBQ", "Breakfast"],
        description: "Wake up above the clouds. Our premium Cloud Beds tent stay in Suryanelli offers unmatched views of the sunrise over the tea plantations. Includes safe parking and campfire.",
        guestFavorite: true,
        category: "Camping"
    },
    {
        title: "Kolukkumalai Base Camp",
        location: "Kolukkumalai, Munnar",
        latitude: 10.0892,
        longitude: 77.0620,
        price: 1800,
        rating: 4.88,
        image: "https://images.unsplash.com/photo-1496545672479-7ac372c7a611?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1496545672479-7ac372c7a611?w=800&q=80",
            "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=80"
        ],
        host: { name: "Jeep Team", avatar: "https://randomuser.me/api/portraits/men/22.jpg", isSuperhost: true },
        details: { guests: 4, bedrooms: 1, beds: 4, baths: 2 },
        amenities: ["Jeep Safari", "Trekking", "Dinner", "Guide"],
        description: "The gateway to the world's highest tea estate. Stay at our base camp and get exclusive access to early morning Jeep safaris for the famous Kolukkumalai sunrise.",
        guestFavorite: true,
        category: "Adventure"
    },
    {
        title: "Exoticamp Munnar",
        location: "Vattavada, Munnar",
        latitude: 10.1389,
        longitude: 77.2505,
        price: 1499,
        rating: 4.75,
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
            "https://images.unsplash.com/photo-1470246973918-29a53221c197?w=800&q=80"
        ],
        host: { name: "Forest Ranger", avatar: "https://randomuser.me/api/portraits/men/33.jpg", isSuperhost: false },
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Forest View", "Night Walk", "Music", "All Meals"],
        description: "Deep forest glamping experience in Vattavada. Surrounded by garlic farms and eucalyptus forests, this is nature at its rawest.",
        guestFavorite: true,
        category: "Glamping"
    },
    {
        title: "Vagamon Pine Forest Stay",
        location: "Vagamon, Idukki",
        latitude: 9.6865,
        longitude: 76.8916,
        price: 1200,
        rating: 4.65,
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
            "https://images.unsplash.com/photo-1579246132034-4a2420311d8c?w=800&q=80"
        ],
        host: { name: "Vagamon Host", avatar: "https://randomuser.me/api/portraits/men/45.jpg", isSuperhost: false },
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Pine Forest View", "Campfire", "Orchid Garden Access"],
        description: "Stay amidst the rolling hills and pine forests of Vagamon. A peaceful retreat perfect for nature lovers and paragliding enthusiasts.",
        guestFavorite: false,
        category: "Camping"
    },

    // Top 3 Hotel Listings (Real-ish Data)
    {
        title: "Munnar Tea Hills Resort",
        location: "Chithirapuram, Munnar",
        latitude: 10.0544,
        longitude: 77.0425,
        price: 4500,
        rating: 4.80,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        ],
        host: { name: "Hotel Manager", avatar: "https://randomuser.me/api/portraits/women/44.jpg", isSuperhost: true },
        details: { guests: 3, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Spa", "Restaurant", "Tea Garden View", "Wifi"],
        description: "Nestled among rolling tea gardens, offering luxury cottages with panoramic views of the misty hills.",
        guestFavorite: false,
        category: "Resort"
    },
    {
        title: "The Fog Munnar",
        location: "Chithirapuram, Munnar",
        latitude: 10.0570,
        longitude: 77.0450,
        price: 5200,
        rating: 4.90,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        images: [
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1571896349842-6e5a513e610a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        ],
        host: { name: "Fog Team", avatar: "https://randomuser.me/api/portraits/men/55.jpg", isSuperhost: true },
        details: { guests: 4, bedrooms: 1, beds: 2, baths: 1 },
        amenities: ["Infinity Pool", "Clubhouse", "Balcony", "Free Breakfast"],
        description: "Experience the magic of the mist. Explore eco-friendly luxury with breathtaking valley views.",
        guestFavorite: true,
        category: "Resort"
    },
    {
        title: "Blanket Hotel & Spa",
        location: "Pallivasal, Munnar",
        latitude: 10.0630,
        longitude: 77.0600,
        price: 7500,
        rating: 4.98,
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        images: [
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
            "https://images.unsplash.com/photo-1564501049412-61c25086b086?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        ],
        host: { name: "Luxury Host", avatar: "https://randomuser.me/api/portraits/women/66.jpg", isSuperhost: true },
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Luxury Spa", "Waterfall View", "Fine Dining", "Gym"],
        description: "Munnar's finest luxury hotel. Located near the Attukad waterfalls, offering world-class amenities and serenity.",
        guestFavorite: true,
        category: "Luxury"
    }
];

const mockExperiences = [
    {
        title: "Campfire & Music Night",
        location: "Suryanelli Base Camp",
        date: "Every Friday",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 1500,
        duration: "5 hours",
        rating: 4.8,
        images: ["https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "Ravi Kumar", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
        category: "Event",
        groupSize: 25,
        coordinator: {
            name: "Ravi Kumar",
            role: "Camp host",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&w=200&q=80",
            phone: "+91 9400 987 654"
        },
        description: "Join us for a classic Munnar night. Live acoustic music, grilled corn & BBQ, and stories around a warm fire at our Suryanelli base camp.",
        itinerary: [
            { time: "05:00 PM", activity: "Check-in & Welcome Drink" },
            { time: "07:30 PM", activity: "Music & Campfire Start" },
            { time: "09:00 PM", activity: "Dinner Buffet" },
            { time: "11:00 PM", activity: "Stargazing" }
        ],
        inclusions: ["Tent Stay", "Dinner", "Breakfast", "Music Access"]
    },
    {
        title: "Kolukkumalai Sunrise Trek",
        location: "Top Station, Munnar",
        date: "Daily",
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 1800,
        duration: "1 Day",
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "Arjun Nair", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
        category: "Trek",
        groupSize: 12,
        coordinator: {
            name: "Arjun Nair",
            role: "Trek Leader",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&w=200&q=80",
            phone: "+91 9400 123 456"
        },
        description: "The classic Munnar bucket-list experience. Sleep at high altitude and wake up for a Jeep ride to see the world's most beautiful sunrise.",
        itinerary: [
            { time: "04:00 PM", activity: "Check-in at Base" },
            { time: "08:00 PM", activity: "Dinner & Rest" },
            { time: "04:30 AM", activity: "Jeep Safari Starts" },
            { time: "06:00 AM", activity: "Sunrise at Peak" },
            { time: "08:30 AM", activity: "Return & Breakfast" }
        ],
        inclusions: ["Tent Stay", "Jeep Safari (Shared)", "Dinner", "Breakfast"]
    },
    {
        title: "Forest Glamping New Year",
        location: "Vattavada, Munnar",
        date: "Dec 31",
        image: "https://images.unsplash.com/photo-1496545672479-7ac372c7a611?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        price: 2499,
        duration: "1 Night",
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1496545672479-7ac372c7a611?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"],
        host: { name: "David Guide", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        category: "Event",
        groupSize: 40,
        coordinator: {
            name: "David Guide",
            role: "Event Manager",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=200&q=80",
            phone: "+91 999 888 777"
        },
        description: "Welcome the New Year in the wild. Premium tents, gala dinner, firecrackers (eco-friendly), and a DJ night deep in the Vattavada woods.",
        itinerary: [
            { time: "06:00 PM", activity: "Check-in" },
            { time: "08:00 PM", activity: "DJ Night Begins" },
            { time: "09:00 PM", activity: "Gala Dinner" },
            { time: "12:00 AM", activity: "New Year Celebration" }
        ],
        inclusions: ["Premium Tent", "Gala Dinner", "Breakfast", "Party Access"]
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // Clear existing
        await Listing.deleteMany({});
        await Experience.deleteMany({});
        await User.deleteMany({});
        console.log('Cleared listings, experiences, and users');

        // Create Users
        const hashedPassword = await bcrypt.hash('password123', 10);

        const admin = await User.create({
            name: "Admin User",
            email: "admin@airbnb.com",
            password: hashedPassword,
            role: "admin",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg"
        });

        const user = await User.create({
            name: "John Doe",
            email: "user@airbnb.com",
            password: hashedPassword,
            role: "user",
            avatar: "https://randomuser.me/api/portraits/men/2.jpg"
        });

        const host = await User.create({
            name: "Business Owner",
            email: "host@airbnb.com",
            password: hashedPassword,
            role: "business",
            avatar: "https://randomuser.me/api/portraits/women/3.jpg"
        });

        console.log('Created users (Admin, User, Host)');

        // Assign listings to the host
        const listingsWithOwner = mockListings.map(listing => ({
            ...listing,
            owner: host._id
        }));

        // Insert new
        await Listing.insertMany(listingsWithOwner);
        await Experience.insertMany(mockExperiences);
        console.log('Inserted listings and experiences');

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
