export const events = [
    {
        id: 1,
        title: "Campfire & Music Night",
        location: "Suryanelli Base Camp",
        date: "Every Friday",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80",
        price: "₹1,500 / person",
        maxGuests: 25,
        coordinator: {
            name: "Ravi Kumar",
            role: "Camp host",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
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
        id: 2,
        title: "Kolukkumalai Sunrise Trek",
        location: "Top Station, Munnar",
        date: "Daily",
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&auto=format&fit=crop&q=60",
        price: "₹1,800 / person",
        maxGuests: 12,
        coordinator: {
            name: "Arjun Nair",
            role: "Trek Leader",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80",
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
        id: 3,
        title: "Forest Glamping New Year",
        location: "Vattavada, Munnar",
        date: "Dec 31",
        image: "https://images.unsplash.com/photo-1496545672479-7ac372c7a611?w=800&auto=format&fit=crop&q=80",
        price: "₹2,499 / person",
        maxGuests: 40,
        coordinator: {
            name: "David Guide",
            role: "Event Manager",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
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

export const sightseeing = [
    {
        id: 1,
        title: "Eravikulam National Park",
        location: "Munnar (Home of Nilgiri Tahr)",
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"
    },
    {
        id: 2,
        title: "Mattupetty Dam",
        location: "Munnar Boating & Views",
        image: "/images/gallery/mattupetty.jpg"
    },
    {
        id: 3,
        title: "Kolukkumalai Peak",
        location: "Suryanelli (World's Highest Tea Estate)",
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"
    },
    {
        id: 4,
        title: "Top Station",
        location: "Munnar Panoramic Views",
        image: "https://images.unsplash.com/photo-1544509747-642f4c3a2727?w=800&q=80"
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
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1496545672479-7ac372c7a611?w=800&auto=format&fit=crop&q=80",
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
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&auto=format&fit=crop&q=80",
        category: "Forest Glamping",
        amenities: ["Night Walk", "Music", "All Meals"]
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
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
        "https://images.unsplash.com/photo-1544509747-642f4c3a2727?w=600&q=80"
    ]
};

export const galleryImages = [
    "/images/gallery/img-1.jpg",
    "/images/gallery/img-2.jpg",
    "/images/gallery/img-3.jpg",
    "/images/gallery/img-4.jpg",
    "/images/gallery/img-5.jpg",
    "/images/gallery/img-6.jpg",
    "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&auto=format&fit=crop&q=80"
];

export const previousEvents = [
    {
        id: 1,
        title: "Monsoon Camp Meet",
        date: "August 2024",
        image: "https://images.unsplash.com/photo-1515404929826-76fff9fef6fe?w=800&auto=format&fit=crop&q=80",
        description: "Embracing the mist and rain from our waterproof tents.",
        recapImages: [
            "https://images.unsplash.com/photo-1515404929826-76fff9fef6fe?w=800&q=80",
            "https://images.unsplash.com/photo-1504194569055-6dd883b6329c?w=800&q=80",
            "https://images.unsplash.com/photo-1534081333815-ae5019106622?w=800&q=80"
        ]
    },
    {
        id: 2,
        title: "High-Altitude Trek",
        date: "October 2024",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
        description: "Conquering Meesapulimala with our camper community.",
        recapImages: [
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
            "https://images.unsplash.com/photo-1544980649-6f92025e14cb?w=800&q=80",
            "https://images.unsplash.com/photo-1571216682006-c4d33a1e36c2?w=800&q=80"
        ]
    },
    {
        id: 3,
        title: "Winter Bonfire Night",
        date: "December 2023",
        image: "https://images.unsplash.com/photo-1478146896981-b80c463b43a6?w=800&auto=format&fit=crop&q=80",
        description: "Warmth, stories, and stargazing under zero degrees.",
        recapImages: [
            "https://images.unsplash.com/photo-1478146896981-b80c463b43a6?w=800&q=80",
            "https://images.unsplash.com/photo-1504280390367-361c6d9e6342?w=800&q=80",
            "https://images.unsplash.com/photo-1483385573906-8ae8ced90122?w=800&q=80"
        ]
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
        image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&q=80",
        link: "/stories/munnar-camping-guide",
        date: "Jan 2, 2025"
    },
    {
        id: 2,
        title: "Top 5 Glamping Spots in Wayanad for Couples",
        category: "Glamping Kerala",
        image: "https://images.unsplash.com/photo-1496545672479-7ac372c7a611?w=600&q=80",
        link: "/stories/wayanad-glamping",
        date: "Dec 28, 2024"
    },
    {
        id: 3,
        title: "Is Kolukkumalai Trekking Safe? What You Need to Know",
        category: "Trekking Tips",
        image: "https://images.unsplash.com/photo-1544509747-642f4c3a2727?w=600&q=80",
        link: "/stories/kolukkumalai-safety",
        date: "Dec 15, 2024"
    },
    {
        id: 4,
        title: "Hidden Waterfalls & Secret Campgrounds in Suryanelli",
        category: "Secret Spots",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80",
        link: "/stories/suryanelli-spots",
        date: "Dec 10, 2024"
    }
];
