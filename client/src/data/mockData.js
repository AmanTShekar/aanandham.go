export const listings = [
    {
        title: "Munnar Tea Hills Resort",
        location: "Munnar, Kerala",
        latitude: 10.0889,
        longitude: 77.0595,
        price: 8500,
        rating: 4.88,
        image: "/images/listings/munnar_tea_hills.png",
        images: [
            "/images/listings/munnar_tea_hills.png",
            "https://images.unsplash.com/photo-1544509747-642f4c3a2727?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
        ],
        host: { name: "Anand Menon", avatar: "https://randomuser.me/api/portraits/men/4.jpg", isSuperhost: true },
        details: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        amenities: ["Tea Garden View", "Spa", "Trekking", "Restaurant"],
        description: "Stay amidst lush green tea plantations with panoramic views of the foggy hills.",
        guestFavorite: true,
        category: "Hill Stations"
    },
    {
        title: "Blanket Hotel & Spa",
        location: "Pallivasal, Munnar",
        latitude: 10.0600,
        longitude: 77.0600,
        price: 12000,
        rating: 4.95,
        image: "/images/listings/blanket_hotel.png",
        images: [
            "/images/listings/blanket_hotel.png"
        ],
        host: { name: "Sarah Thomas", avatar: "https://randomuser.me/api/portraits/women/6.jpg", isSuperhost: true },
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Infinity Pool", "Ayurvedic Spa", "Waterfall View"],
        description: "Luxury 5-star hotel offering world-class amenities and breathtaking waterfall views.",
        guestFavorite: true,
        category: "Luxury"
    },
    {
        title: "Cloud Valley Homestay",
        location: "Old Munnar",
        latitude: 10.0800,
        longitude: 77.0500,
        price: 3500,
        rating: 4.75,
        image: "/images/listings/cloud_valley.png",
        images: [
            "/images/listings/cloud_valley.png"
        ],
        host: { name: "Joseph Kurian", avatar: "https://randomuser.me/api/portraits/men/8.jpg", isSuperhost: false },
        details: { guests: 3, bedrooms: 1, beds: 2, baths: 1 },
        amenities: ["Wifi", "Kitchen", "Parking", "Breakfast"],
        description: "Cozy homestay located near the town center, perfect for budget travelers.",
        guestFavorite: false,
        category: "Bed & Breakfast"
    },
    {
        title: "Amber Dale Luxury Hotel",
        location: "Pallivasal, Munnar",
        latitude: 10.0500,
        longitude: 77.0400,
        price: 9500,
        rating: 4.82,
        image: "/images/listings/amber_dale.png",
        images: [
            "/images/listings/amber_dale.png"
        ],
        host: { name: "Munnar Hospitality", avatar: "https://randomuser.me/api/portraits/men/11.jpg", isSuperhost: true },
        details: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        amenities: ["Gym", "Game Room", "Valley View"],
        description: "Experience luxury with a blend of nature at Amber Dale.",
        guestFavorite: true,
        category: "Luxury"
    },
    {
        title: "Campy Resort Munnar",
        location: "Vattavada, Munnar",
        latitude: 10.1500,
        longitude: 77.2500,
        price: 4500,
        rating: 4.90,
        image: "/images/listings/campy_resort.png",
        images: [
            "/images/listings/campy_resort.png"
        ],
        host: { name: "Rahul Dravid", avatar: "https://randomuser.me/api/portraits/men/15.jpg", isSuperhost: true },
        details: { guests: 2, bedrooms: 1, beds: 1, baths: 1 },
        amenities: ["Campfire", "Tent Stay", "Trekking"],
        description: "Adventure camping experience under the stars in Vattavada.",
        guestFavorite: true,
        category: "Camping"
    },
    {
        title: "Forest Glade",
        location: "Pallivasal, Munnar",
        latitude: 10.0650,
        longitude: 77.0550,
        price: 7800,
        rating: 4.78,
        image: "/images/listings/forest_glade.png",
        images: [
            "/images/listings/forest_glade.png"
        ],
        host: { name: "Nature Stays", avatar: "https://randomuser.me/api/portraits/women/22.jpg", isSuperhost: false },
        details: { guests: 4, bedrooms: 2, beds: 2, baths: 2 },
        amenities: ["Balcony", "Garden", "Bird Watching"],
        description: "A serene getaway nestled in the woods, perfect for nature lovers.",
        guestFavorite: false,
        category: "Hill Stations"
    },
    {
        title: "Whispering Waters",
        location: "Paniely Poru, Munnar",
        latitude: 10.1200,
        longitude: 76.9500,
        price: 6500,
        rating: 4.65,
        image: "/images/listings/whispering_waters.png",
        images: [
            "/images/listings/whispering_waters.png"
        ],
        host: { name: "River Retreats", avatar: "https://randomuser.me/api/portraits/men/33.jpg", isSuperhost: false },
        details: { guests: 3, bedrooms: 1, beds: 2, baths: 1 },
        amenities: ["River Access", "Kayaking", "Restaurant"],
        description: "Riverside resort offering water activities and peaceful ambience.",
        guestFavorite: true,
        category: "Lakefront"
    }
];
