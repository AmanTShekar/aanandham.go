export const events = [
    {
        id: 1,
        title: "Vattavada Strawberry Camp",
        location: "Vattavada, Munnar",
        date: "Every Weekend",
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efbe75?auto=format&fit=crop&q=80",
        price: "₹2,200 / person",
        maxGuests: 20,
        coordinator: {
            name: "Ravi Kumar",
            role: "Camp host",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
            phone: "+91 9400 987 654"
        },
        description: "Experience the unique charm of Vattavada, Kerala's strawberry hub. Stay in premium tents right next to strawberry farms, enjoy fresh fruit picking, and cozy campfire nights under the clearest skies in Kerala.",
        itinerary: [
            { time: "03:00 PM", activity: "Check-in & Farm Walk" },
            { time: "05:00 PM", activity: "Strawberry Picking Session" },
            { time: "07:30 PM", activity: "Campfire & BBQ" },
            { time: "09:00 PM", activity: "Traditional Kerala Dinner" },
            { time: "07:00 AM", activity: "Sunrise Farm Trek" }
        ],
        inclusions: ["Premium Tent Stay", "Strawberry Picking", "Dinner & Breakfast", "Campfire Access"]
    },
    {
        id: 2,
        title: "Kolukkumalai Sunrise Expedition",
        location: "Suryanelli, Munnar",
        date: "Daily",
        image: "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&w=800&q=80",
        price: "₹1,800 / person",
        maxGuests: 15,
        coordinator: {
            name: "Arjun Nair",
            role: "Trek Leader",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
            phone: "+91 9400 123 456"
        },
        description: "The ultimate sunrise experience at the world's highest tea estate. Includes a rugged 4x4 Jeep safari through tea plantations and a short trek to the peak for a breathtaking view of the sea of clouds.",
        itinerary: [
            { time: "04:00 PM", activity: "Check-in at Base Camp" },
            { time: "08:00 PM", activity: "Dinner & Briefing" },
            { time: "04:30 AM", activity: "Jeep Safari Starts" },
            { time: "06:00 AM", activity: "Sunrise at Tiger Rock" },
            { time: "08:30 AM", activity: "Tea Factory Visit & Breakfast" }
        ],
        inclusions: ["Tent Stay", "4x4 Jeep Safari", "Tea Factory Tour", "Dinner & Breakfast"]
    },
    {
        id: 3,
        title: "Wayanad Rainforest Retreat",
        location: "Vythiri, Wayanad",
        date: "Fri - Sun",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80",
        price: "₹2,800 / person",
        maxGuests: 12,
        coordinator: {
            name: "David Guide",
            role: "Naturalist",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
            phone: "+91 999 888 777"
        },
        description: "Immerse yourself in the deep rainforests of Wayanad. This retreat focuses on nature walks, bird watching, and sustainable living. Stay in eco-friendly glamping pods with the sounds of the wild as your soundtrack.",
        itinerary: [
            { time: "02:00 PM", activity: "Rainforest Check-in" },
            { time: "04:30 PM", activity: "Guided Nature Walk" },
            { time: "07:00 PM", activity: "Night Trail (Optional)" },
            { time: "08:30 PM", activity: "Forest-to-Table Dinner" },
            { time: "06:30 AM", activity: "Bird Watching Session" }
        ],
        inclusions: ["Eco-Glamping Pod", "Guided Nature Walks", "All Organic Meals", "Naturalist Support"]
    },
    {
        id: 4,
        title: "Vagamon Paragliding Camp",
        location: "Kollahalamedu, Vagamon",
        date: "Every Weekend",
        image: "https://images.unsplash.com/photo-1634980969450-dd03af212b16?auto=format&fit=crop&q=80",
        price: "₹4,500 / person",
        maxGuests: 10,
        coordinator: {
            name: "Rahul Chandran",
            role: "Adventure Lead",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
            phone: "+91 987 654 321"
        },
        description: "Soar over the rolling green meadows of Vagamon. This event combines the thrill of paragliding with a peaceful night stay in the meadows. Perfect for adrenaline junkies and nature lovers alike.",
        itinerary: [
            { time: "11:00 AM", activity: "Paragliding Session" },
            { time: "04:00 PM", activity: "Meadow Camp Check-in" },
            { time: "06:00 PM", activity: "Sunset at Pine Forest" },
            { time: "08:00 PM", activity: "BBQ & Music" },
            { time: "08:00 AM", activity: "Meadow Trek & Breakfast" }
        ],
        inclusions: ["Paragliding Flight", "Meadow Tent Stay", "BBQ Dinner", "Breakfast"]
    }
];

export const sightseeing = [
    {
        id: 1,
        title: "Athirappilly Waterfalls",
        location: "Thrissur (Niagara of India)",
        image: "https://images.unsplash.com/photo-1596706037009-8488e0193134?auto=format&fit=crop&w=800&q=80",
        description: "Experience the majesty of Kerala's largest waterfall, a stunning 80ft drop surrounded by tropical forests."
    },
    {
        id: 2,
        title: "Alleppey Backwaters",
        location: "Alappuzha (Venice of the East)",
        image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
        description: "Cruise through serene palm-fringed canals on a traditional luxury houseboat for the ultimate Kerala experience."
    },
    {
        id: 3,
        title: "Munnar Tea Gardens",
        location: "Idukki (Emerald Hills)",
        image: "https://images.unsplash.com/photo-1590253901335-3d5a0f82e07d?auto=format&fit=crop&w=800&q=80",
        description: "Witness the iconic rolling emerald tea plantations stretching into the misty Western Ghats."
    },
    {
        id: 4,
        title: "Thekkady Periyar Lake",
        location: "Idukki (Wildlife Sanctuary)",
        image: "https://images.unsplash.com/photo-1675617668722-bdb8a74b3a7a?auto=format&fit=crop&w=800&q=80",
        description: "Take a boat ride on Periyar Lake to spot wild elephants and diverse wildlife in their natural habitat."
    },
    {
        id: 5,
        title: "Wayanad Banasura Sagar",
        location: "Wayanad (Largest Earth Dam)",
        image: "https://images.unsplash.com/photo-1707050017627-89476b7bd42d?q=80&w=800&auto=format&fit=crop",
        description: "Explore the largest earth dam in India, offering stunning views of the reservoir and surrounding hills."
    },
    {
        id: 6,
        title: "Vagamon Meadows",
        location: "Idukki (Scotland of Asia)",
        image: "https://images.unsplash.com/photo-1634980969450-dd03af212b16?auto=format&fit=crop&q=80",
        description: "Serene, lush green meadows and deep valleys characteristic of the Vagamon highlands."
    },
    {
        id: 7,
        title: "Bekal Fort",
        location: "Kasaragod (Coastal Majesty)",
        image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=800&q=80",
        description: "A historic 17th-century fort overlooking the Arabian Sea, famous for its unique keyhole shape."
    }
];

export const topSeoListings = [
    {
        id: 'seo-1',
        title: "Cloud Beds Suryanelli",
        location: "Suryanelli, Munnar",
        price: 1500,
        rating: 4.9,
        reviews: 320,
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9e6342?auto=format&fit=crop&w=800&q=80",
        category: "Premium Tent Stay",
        amenities: ["Sunrise View", "Campfire & BBQ", "Dinner Included"]
    },
    {
        id: 'seo-2',
        title: "Kolukkumalai Base Camp",
        location: "Kolukkumalai",
        price: 1800,
        rating: 4.8,
        reviews: 215,
        image: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80",
        category: "Adventure Camping",
        amenities: ["Jeep Safari Info", "High Altitude", "Trekking Guide"]
    },
    {
        id: 'seo-3',
        title: "Exoticamp Munnar",
        location: "Vattavada, Munnar",
        price: 1499,
        rating: 4.7,
        reviews: 180,
        image: "https://images.unsplash.com/photo-1496545672479-79ad2204a806?auto=format&fit=crop&q=80",
        category: "Forest Glamping",
        amenities: ["Night Walk", "Music", "All Meals"]
    },
    {
        id: 'seo-4',
        title: "Vagamon Meadows Stay",
        location: "Vagamon, Idukki",
        price: 1200,
        rating: 4.6,
        reviews: 145,
        image: "https://images.unsplash.com/photo-1634980969450-dd03af212b16?auto=format&fit=crop&q=80",
        category: "Meadow Camping",
        amenities: ["Paragliding Info", "Pine Forest Trek", "Campfire"]
    },
    {
        id: 'seo-5',
        title: "Vagamon Meadows Luxury Glamp",
        location: "Kollahalamedu, Vagamon",
        price: 2500,
        rating: 4.9,
        reviews: 88,
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80",
        category: "Luxury Glamping",
        amenities: ["Meadow View", "Ensuite Bath", "Paragliding Info"]
    }
];

export const whyChooseUs = {
    title: "Why Choose Aanandham.go?",
    description: "Aanandham.go is Kerala's most trusted platform for Glamping and Wild Trekking. We are the only agency offering 100% Verified Stays in Munnar and Wayanad.",
    features: [
        {
            title: "The Aanandham Guarantee",
            description: "Every tent and trek is personally verified by the Aanandham team. We ensure safety, hygiene, and premium views."
        },
        {
            title: "Exclusive Wild Access",
            description: "Book restricted Kolukkumalai & Deep Forest zones only available through Aanandham.go. Experience the untouched wild."
        }
    ],
    images: [
        "https://images.unsplash.com/photo-1596541223130-5d31a73fb6c6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534234828560-6323cf370395?auto=format&fit=crop&w=800&q=80"
    ]
};

export const galleryImages = [
    "/images/why_choose_us/luxury_tent.png",
    "/images/why_choose_us/campfire.png",
    "/images/previous_events/music_camp.png",
    "/images/previous_events/trekking_group.png",
    "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1510312305653-8ed496efbe75?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1496545672479-79ad2204a806?auto=format&fit=crop&w=800&q=80"
];

export const previousEvents = [
    {
        id: 1,
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
        duration: "2 Days"
    },
    {
        id: 2,
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
        duration: "1 Night"
    },
    {
        id: 3,
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
        duration: "2 Days"
    },
    {
        id: 4,
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
        duration: "1 Night"
    }
];

export const travelStories = [
    {
        id: 'insta-1',
        title: "Strangers to Friends: A Camping Story",
        category: "Community Experience",
        image: "https://scontent.cdninstagram.com/v/t51.75761-15/500481916_17872715106366614_3993402189379714778_n.webp?_nc_cat=100&ig_cache_key=MzYzODg5MTg5MTA5NTQzNTM0NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEwODB4MTI1MC5zZHIuQzMifQ%3D%3D&_nc_ohc=er9Te_WStokQ7kNvwFc8myz&_nc_oc=AdlAlJ2mln_7eFy0nzld8KRoV84AMOu1zR53d0KBNwjk71WSmBvXeZZrsIdBksI3WN97FaEyZm8aH1gVpQih9MjI&_nc_ad=z-m&_nc_cid=1174&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=0huGEjWwzPXyrcP1KXhAUA&oh=00_Afo1cYJLVycM3v9E0brmaTYWKkM-0iK8iITPbTsWdUZqEA&oe=6961B908",
        link: "/stories/strangers-camp",
        date: "Jan 5, 2025"
    },
    {
        id: 1,
        title: "The Ultimate Guide to Munnar Tent Camping",
        category: "Camping Guide",
        image: "https://images.unsplash.com/photo-1544735230-c128445cb89d?w=600&q=80",
        link: "/stories/munnar-camping-guide",
        date: "Jan 2, 2025"
    },
    {
        id: 2,
        title: "Top 5 Glamping Spots in Wayanad for Couples",
        category: "Glamping Kerala",
        image: "https://images.unsplash.com/photo-1630938819488-ba7d1440d48b?w=600&q=80",
        link: "/stories/wayanad-glamping",
        date: "Dec 28, 2024"
    },
    {
        id: 3,
        title: "Is Kolukkumalai Trekking Safe? What You Need to Know",
        category: "Trekking Tips",
        image: "https://images.unsplash.com/photo-1544834830-4e2079f97621?w=600&q=80",
        link: "/stories/kolukkumalai-safety",
        date: "Dec 15, 2024"
    },
    {
        id: 4,
        title: "Hidden Waterfalls & Secret Campgrounds in Suryanelli",
        category: "Secret Spots",
        image: "https://images.unsplash.com/photo-1510312305653-8ed496efbe75?w=600&q=80",
        link: "/stories/suryanelli-spots",
        date: "Dec 10, 2024"
    },
    {
        id: 5,
        title: "Vagamon Glamping: Sleeping in Scotland of Asia",
        category: "Misty Paradise",
        image: "https://images.unsplash.com/photo-1634980969450-dd03af212b16?w=600&q=80",
        link: "/stories/vagamon-glamping-guide",
        date: "Jan 7, 2026"
    },
    {
        id: 6,
        title: "Become a Camping Partner: Collaboration & Trip Planning",
        category: "Partnerships",
        image: "https://images.unsplash.com/photo-1517824806704-9040b037703b?w=600&q=80",
        link: "/stories/camping-partner-collaboration",
        date: "Jan 7, 2026"
    }
];
