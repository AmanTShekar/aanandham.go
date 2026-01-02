const mongoose = require('mongoose');
const { Experience, SiteImage, User } = require('./models');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/airbnb_clone')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const seedData = async () => {
    try {
        // 1. Clear existing generic data (optional, but cleaner for demo)
        await Experience.deleteMany({});
        await SiteImage.deleteMany({});

        console.log('Cleared old Events and Gallery data.');

        // 2. Seed Site Images (Bento Grid - needs 5 specific ones)
        const galleryImages = [
            {
                url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2649&auto=format&fit=crop",
                title: "Serene Mornings",
                category: "bento",
                order: 0 // Hero (2x2)
            },
            {
                url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2670&auto=format&fit=crop",
                title: "Velvet Hills",
                category: "bento",
                order: 1 // Tall (1x2)
            },
            {
                url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop",
                title: "Misty Peaks",
                category: "bento",
                order: 2 // Standard
            },
            {
                url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop",
                title: "Tea Gardens",
                category: "bento",
                order: 3 // Standard
            },
            {
                url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2674&auto=format&fit=crop",
                title: "Nature's Embrace",
                category: "bento",
                order: 4 // Standard
            }
        ];

        await SiteImage.insertMany(galleryImages);
        console.log('Added 5 Site Images for Bento Grid.');

        // 3. Seed Experiences (Camps & Events)
        const experiences = [
            {
                title: "Luxury Mountain Camp",
                location: "Munnar Top Station",
                price: 4999,
                duration: "24",
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800",
                images: [
                    "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7",
                    "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d"
                ],
                category: "Camp",
                groupSize: 15,
                description: "Experience the magic of sleeping under the stars in our premium luxury tents. Located at the highest point in Munnar, this camp offers breathtaking sunrise views, campfire music, and gourmet outdoor dining.",
                coordinator: {
                    name: "Arjun Nair",
                    role: "Senior Expedition Leader",
                    image: "https://randomuser.me/api/portraits/men/32.jpg",
                    phone: "+91 98765 43210"
                },
                itinerary: [
                    { time: "04:00 PM", activity: "Check-in & Welcome Drink" },
                    { time: "05:30 PM", activity: "Sunset Trek to Top Station" },
                    { time: "07:30 PM", activity: "Campfire & Live Music" },
                    { time: "09:00 PM", activity: "Gourmet Dinner Buffet" },
                    { time: "06:00 AM", activity: "Sunrise Yoga Session" }
                ],
                inclusions: ["Luxury Tent Stay", "All Meals", "Trekking Guide", "Campfire", "BBQ Kit"]
            },
            {
                title: "Tea Tasting Workshop",
                location: "Colonial Tea Estate",
                price: 1299,
                duration: "3",
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800",
                category: "Workshop",
                groupSize: 10,
                description: "Journey through the history of Munnar's tea legacy. Learn to pluck, process, and brew the perfect cup of tea with our master blenders.",
                coordinator: {
                    name: "Sarah John",
                    role: "Tea Sommelier",
                    image: "https://randomuser.me/api/portraits/women/44.jpg",
                    phone: "+91 98765 12345"
                },
                itinerary: [
                    { time: "10:00 AM", activity: "Estate Walk & History" },
                    { time: "11:00 AM", activity: "Tea Plucking Session" },
                    { time: "12:00 PM", activity: "Factory Tour" },
                    { time: "12:30 PM", activity: "Tasting Masterclass" }
                ],
                inclusions: ["Estate Entry", "Guided Tour", "Tea Tasting", "Take-home Tea Sampler"]
            },
            {
                title: "Munnar Flower Show 2024",
                location: "Botanical Garden",
                price: 499,
                duration: "4",
                rating: 4.7,
                image: "https://images.unsplash.com/photo-1490750967868-58cb75069ed6?auto=format&fit=crop&q=80&w=800",
                category: "Event",
                groupSize: 500,
                description: "The biggest floral exhibition of the year. Witness rare orchids, exotic blooms, and artistic floral sculptures in the heart of Munnar.",
                coordinator: {
                    name: "Botanical Society",
                    role: "Organizer",
                    image: "https://randomuser.me/api/portraits/men/88.jpg",
                    phone: "+91 99999 88888"
                },
                itinerary: [
                    { time: "10:00 AM", activity: "Gates Open" },
                    { time: "11:00 AM", activity: "Orchid Unveiling" },
                    { time: "02:00 PM", activity: "Flower Arrangement Contest" }
                ],
                inclusions: ["Entry Ticket", "Guide Map", "Souvenir"]
            }
        ];

        await Experience.insertMany(experiences);
        console.log('Added 3 Rich Events/Camps.');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
