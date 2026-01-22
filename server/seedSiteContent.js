const mongoose = require('mongoose');
const { Sightseeing, TravelStory, SiteContent, SiteImage, PreviousEvent } = require('./models');
require('dotenv').config();

const sightseeing = [
    {
        title: "Kolukkumalai Sunrise Peak",
        location: "Munnar, Kerala (World's Highest Tea Estate)",
        image: "https://images.unsplash.com/photo-1591012911204-62507664268d?auto=format&fit=crop&w=800&q=80",
        description: "Witness the legendary sunrise at the world's highest organic tea plantation. A must-visit for every trekker in Kerala.",
        order: 1
    },
    {
        title: "900 Kandi Skywalk",
        location: "Wayanad, Kerala (Glass Bridge)",
        image: "https://images.unsplash.com/photo-1688625642875-52082260840b?auto=format&fit=crop&w=800&q=80",
        description: "Walk above the clouds on the glass bridge at 900 Kandi. The ultimate Wayanad adventure experience.",
        order: 2
    },
    {
        title: "Vagamon Pine Forest",
        location: "Vagamon, Kerala (Film Shooting Spot)",
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=80",
        description: "Stroll through the misty pine forests of Vagamon, a favorite spot for movies and nature lovers included in Kerala Tourism.",
        order: 3
    },
    {
        title: "Edakkal Caves",
        location: "Wayanad, Kerala (Ancient History)",
        image: "https://images.unsplash.com/photo-1695646875899-783267d3454b?auto=format&fit=crop&w=800&q=80",
        description: "Explore the prehistoric rock carvings inside the Edakkal Caves, a historic gem in the heart of Kerala.",
        order: 4
    }
];

const previousEvents = [
    {
        title: "Wayanad Forest New Year Bash",
        date: "Jan 1, 2025",
        image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80",
        description: "40 Campers. One bonfire. An unforgettable night in the deep woods of Wayanad.",
        recapImages: [
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
            "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800&q=80",
            "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
            "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&q=80"
        ],
        price: "₹2,499",
        location: "Wayanad, Kerala",
        duration: "2 Days",
        order: 1
    },
    {
        title: "Munnar Mist Festival",
        date: "Dec 25, 2024",
        image: "https://images.unsplash.com/photo-1544980649-6f92025e14cb?w=1200&q=80",
        description: "Celebrating Christmas above the clouds at our Suryanelli base camp.",
        recapImages: [
            "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
            "https://images.unsplash.com/photo-1510312305653-8ed496efbe75?w=800&q=80",
            "https://images.unsplash.com/photo-1596066190600-297634daa496?w=800&q=80"
        ],
        price: "₹1,999",
        location: "Suryanelli, Munnar",
        duration: "1 Night",
        order: 2
    },
    {
        title: "Vattavada Strawberry Camp",
        date: "Live Now",
        image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=800&q=80",
        description: "Experience the strawberry harvest season with a premium tent stay in Vattavada. Includes farm visit and tasting.",
        recapImages: [
            "https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?w=800&q=80",
            "https://images.unsplash.com/photo-1510312305653-8ed496efbe75?w=800&q=80",
            "https://commons.wikimedia.org/wiki/Special:FilePath/Vagamon_Pine_Forest.jpg",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"
        ],
        price: "₹2,800",
        location: "Vattavada, Munnar",
        duration: "2 Days",
        order: 3
    },
    {
        title: "Vagamon Meadows Night",
        date: "Nov 15, 2024",
        image: "https://images.unsplash.com/photo-1595231776515-ddffb1f4eb73?w=800&q=80",
        description: "Stargazing and campfire stories at the rolling meadows of Vagamon.",
        recapImages: [
            "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
            "https://images.unsplash.com/photo-1532339142463-fd0a8979791a?w=800&q=80",
            "https://images.unsplash.com/photo-1504280390367-361c6d9e6342?w=800&q=80"
        ],
        price: "₹2,200",
        location: "Vagamon, Kerala",
        duration: "1 Night",
        order: 4
    }
];

// Re-defining travelStories to include Couples and Groups specifically
const travelStories = [
    {
        title: "Top 5 Romantic Glamping Spots in Munnar for Couples",
        category: "Couples Getaway",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
        link: "/stories/munnar-couples-camping",
        date: "Jan 14, 2025",
        order: 1
    },
    {
        title: "Wayanad Group Trekking: The Ultimate Friend's Trip",
        category: "Group Adventure",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
        link: "/stories/wayanad-group-trek",
        date: "Jan 12, 2025",
        order: 2
    },
    {
        title: "Strangers to Friends: Solo, Couples & Groups Welcome",
        category: "Community Event",
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
        link: "/stories/strangers-camp",
        date: "Jan 10, 2025",
        order: 3
    },
    {
        title: "Why Vagamon is Best for Weekend Group Trips",
        category: "Vagamon Guide",
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
        link: "/stories/vagamon-group-camping",
        date: "Jan 5, 2025",
        order: 4
    },
    {
        title: "Safe Camping for Families in Kerala",
        category: "Family Friendly",
        image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=800&q=80",
        link: "/stories/family-camping-kerala",
        date: "Dec 28, 2024",
        order: 5
    }
];

const whyChooseUs = [
    {
        title: "Expert Guides",
        description: "Our team consists of certified trekkers and local experts who know every trail.",
        icon: "FaCompass"
    },
    {
        title: "Safety First",
        description: "We prioritize your safety with top-notch equipment and emergency protocols.",
        icon: "FaShieldAlt"
    },
    {
        title: "Eco-Friendly",
        description: "We practice Leave No Trace principles to preserve the beauty of nature.",
        icon: "FaLeaf"
    },
    {
        title: "Authentic Experience",
        description: "Immerse yourself in the local culture and untouched wilderness of Kerala.",
        icon: "FaCampground"
    }
];

const seedSiteContent = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Seed Sightseeing
        await Sightseeing.deleteMany({});
        await Sightseeing.insertMany(sightseeing);
        console.log('✅ Sightseeing seeded');

        // Seed Travel Stories
        await TravelStory.deleteMany({});
        await TravelStory.insertMany(travelStories);
        console.log('✅ Travel Stories seeded');

        // Seed Previous Events
        await PreviousEvent.deleteMany({});
        await PreviousEvent.insertMany(previousEvents);
        console.log('✅ Previous Events seeded');

        // Seed Site Content (Why Choose Us)
        await SiteContent.findOneAndUpdate(
            { key: 'whyChooseUs' },
            { content: whyChooseUs },
            { upsert: true, new: true }
        );
        console.log('✅ Why Choose Us content seeded');

        console.log('🎉 SEO Content Update Complete!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedSiteContent();
