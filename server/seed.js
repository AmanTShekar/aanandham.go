const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Listing, User, Experience } = require('./models');
require('dotenv').config();

const mockListings = [
    // Top 3 Camping Listings (Matching SEO Content)
    {
        title: "Cloud Beds Suryanelli",
        location: "Suryanelli, Munnar, Kerala",
        latitude: 10.0889,
        longitude: 77.0595,
        price: 1500, // Real price point
        rating: 4.95,
        image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1591012911204-61aa3daaf73f?auto=format&fit=crop&q=80"
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
        location: "Kolukkumalai, Munnar, Kerala",
        latitude: 10.0892,
        longitude: 77.0620,
        price: 1800,
        rating: 4.88,
        image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1591089101324-2280d9260000?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1579246132034-4a2420311d8c?auto=format&fit=crop&q=80"
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
        location: "Vattavada, Munnar, Kerala",
        latitude: 10.1389,
        longitude: 77.2505,
        price: 1499,
        rating: 4.75,
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1470246973918-29a53221c197?w=800&q=80",
            "https://images.unsplash.com/photo-1579632652768-6cb9dcf75912?auto=format&fit=crop&q=80"
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
        location: "Vagamon, Idukki, Kerala",
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
    {
        title: "Vagamon Meadows Luxury Glamp",
        location: "Kollahalamedu, Vagamon, Kerala",
        latitude: 9.6890,
        longitude: 76.9050,
        price: 2500,
        rating: 4.92,
        image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?w=800&q=80",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"
        ],
        host: { name: "Aanandham Premium", avatar: "https://randomuser.me/api/portraits/women/15.jpg", isSuperhost: true },
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Meadow View", "Ensuite Bath", "Organic Breakfast", "Sun Deck"],
        description: "The peak of luxury glamping in Vagamon. Watch the paragliders from your private sun deck. Experience the misty meadows of Kollahalamedu in style.",
        guestFavorite: true,
        category: "Glamping"
    },
    {
        title: "Foggy Knolls Vagamon",
        location: "Pine Valley, Vagamon, Kerala",
        latitude: 9.6850,
        longitude: 76.8850,
        price: 3200,
        rating: 4.85,
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efbe75?w=800&q=80",
        images: [
            "https://images.unsplash.com/photo-1510312305653-8ed496efbe75?w=800&q=80",
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80"
        ],
        host: { name: "Aanandham Host", avatar: "https://randomuser.me/api/portraits/men/12.jpg", isSuperhost: true },
        details: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        amenities: ["Mist View", "Private BBQ", "Trekking Access", "Wifi"],
        description: "A premium cottage stay in the heart of Vagamon's pine valley. Perfect for families looking for a misty retreat with all modern amenities.",
        guestFavorite: true,
        category: "Resort"
    },

    // Top 3 Hotel Listings (Real-ish Data)
    {
        title: "Munnar Tea Hills Resort",
        location: "Chithirapuram, Munnar, Kerala",
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
        location: "Chithirapuram, Munnar, Kerala",
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
        location: "Pallivasal, Munnar, Kerala",
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
    },
    {
        title: "Athirappilly Forest Stay",
        location: "Athirappilly, Thrissur, Kerala",
        latitude: 10.2851,
        longitude: 76.5698,
        price: 3500,
        rating: 4.85,
        image: "https://images.unsplash.com/photo-1596706037009-8488e0193134?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1596706037009-8488e0193134?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571216682006-c4d33a1e36c2?w=800&q=80"
        ],
        host: { name: "Forest Host", avatar: "https://randomuser.me/api/portraits/men/15.jpg", isSuperhost: true },
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Waterfall View", "Forest Trek", "Traditional Meals"],
        description: "Stay near the majestic Athirappilly waterfalls. Our forest stay offers a unique opportunity to wake up to the sound of cascading water and birdsong.",
        guestFavorite: true,
        category: "Nature"
    },
    {
        title: "Alleppey Luxury Houseboat",
        location: "Alleppey, Alappuzha, Kerala",
        latitude: 9.4981,
        longitude: 76.3329,
        price: 8500,
        rating: 4.95,
        image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1571896349842-6e5a513e610a?w=800&auto=format&fit=crop&q=80"
        ],
        host: { name: "Captain Babu", avatar: "https://randomuser.me/api/portraits/men/32.jpg", isSuperhost: true },
        details: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        amenities: ["AC Bedrooms", "Private Chef", "Sunset Deck", "Backwater View"],
        description: "Experience the magic of Alleppey backwaters on our traditional luxury houseboat. Includes all meals prepared fresh on board.",
        guestFavorite: true,
        category: "Houseboat"
    },
    {
        title: "Wayanad Treehouse Glamp",
        location: "Vythiri, Wayanad, Kerala",
        latitude: 11.5503,
        longitude: 76.0315,
        price: 4200,
        rating: 4.90,
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
        images: [
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&auto=format&fit=crop&q=80"
        ],
        host: { name: "Nature David", avatar: "https://randomuser.me/api/portraits/men/6.jpg", isSuperhost: true },
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Rainforest View", "Bird Watching", "Organic Meals", "Ensuite Bath"],
        description: "A unique glamping experience in a luxury treehouse nestled deep within the Wayanad rainforest.",
        guestFavorite: true,
        category: "Glamping"
    }
];

const mockExperiences = [
    {
        title: "Vattavada Strawberry Camp",
        location: "Vattavada, Munnar",
        date: "Every Weekend",
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efbe75?auto=format&fit=crop&q=80",
        price: 2200,
        duration: "1 Night",
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1510312305653-8ed496efbe75?auto=format&fit=crop&q=80"],
        host: { name: "Ravi Kumar", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
        category: "Event",
        groupSize: 20,
        coordinator: {
            name: "Ravi Kumar",
            role: "Camp host",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
            phone: "+91 9400 987 654"
        },
        description: "Experience the unique charm of Vattavada, Kerala's strawberry hub. Stay in premium tents right next to strawberry farms, enjoy fresh fruit picking, and cozy campfire nights.",
        itinerary: [
            { time: "03:00 PM", activity: "Check-in & Farm Walk" },
            { time: "05:00 PM", activity: "Strawberry Picking Session" },
            { time: "07:30 PM", activity: "Campfire & BBQ" },
            { time: "09:00 PM", activity: "Traditional Kerala Dinner" }
        ],
        inclusions: ["Premium Tent Stay", "Strawberry Picking", "Dinner & Breakfast", "Campfire Access"]
    },
    {
        title: "Kolukkumalai Sunrise Expedition",
        location: "Suryanelli, Munnar",
        date: "Daily",
        image: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&w=800&q=80",
        price: 1800,
        duration: "1 Night",
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&w=800&q=80"],
        host: { name: "Arjun Nair", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
        category: "Trek",
        groupSize: 15,
        coordinator: {
            name: "Arjun Nair",
            role: "Trek Leader",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
            phone: "+91 9400 123 456"
        },
        description: "The ultimate sunrise experience at the world's highest tea estate. Includes a rugged 4x4 Jeep safari and a short trek to the peak.",
        itinerary: [
            { time: "04:00 PM", activity: "Check-in at Base Camp" },
            { time: "08:00 PM", activity: "Dinner & Briefing" },
            { time: "04:30 AM", activity: "Jeep Safari Starts" },
            { time: "06:00 AM", activity: "Sunrise at Tiger Rock" }
        ],
        inclusions: ["Tent Stay", "4x4 Jeep Safari", "Tea Factory Tour", "Dinner & Breakfast"]
    },
    {
        title: "Wayanad Rainforest Retreat",
        location: "Vythiri, Wayanad",
        date: "Fri - Sun",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
        price: 2800,
        duration: "2 Nights",
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80"],
        host: { name: "David Guide", avatar: "https://randomuser.me/api/portraits/men/6.jpg" },
        category: "Event",
        groupSize: 12,
        coordinator: {
            name: "David Guide",
            role: "Naturalist",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
            phone: "+91 999 888 777"
        },
        description: "Immerse yourself in the deep rainforests of Wayanad. This retreat focuses on nature walks, bird watching, and sustainable living.",
        itinerary: [
            { time: "02:00 PM", activity: "Rainforest Check-in" },
            { time: "04:30 PM", activity: "Guided Nature Walk" },
            { time: "08:30 PM", activity: "Forest-to-Table Dinner" }
        ],
        inclusions: ["Eco-Glamping Pod", "Guided Nature Walks", "All Organic Meals", "Naturalist Support"]
    },
    {
        title: "Vagamon Paragliding Camp",
        location: "Kollahalamedu, Vagamon",
        date: "Every Weekend",
        image: "https://images.unsplash.com/photo-1634980969450-dd03af212b16?auto=format&fit=crop&q=80",
        price: 4500,
        duration: "1 Night",
        rating: 4.8,
        images: ["https://images.unsplash.com/photo-1634980969450-dd03af212b16?auto=format&fit=crop&q=80"],
        host: { name: "Rahul Chandran", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
        category: "Event",
        groupSize: 10,
        coordinator: {
            name: "Rahul Chandran",
            role: "Adventure Lead",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
            phone: "+91 987 654 321"
        },
        description: "Soar over the rolling green meadows of Vagamon. This event combines the thrill of paragliding with a peaceful night stay in the meadows.",
        itinerary: [
            { time: "11:00 AM", activity: "Paragliding Session" },
            { time: "04:00 PM", activity: "Meadow Camp Check-in" },
            { time: "08:00 PM", activity: "BBQ & Music" }
        ],
        inclusions: ["Paragliding Flight", "Meadow Tent Stay", "BBQ Dinner", "Breakfast"]
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
