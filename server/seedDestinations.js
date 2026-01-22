const mongoose = require('mongoose');
const { Destination } = require('./models');
require('dotenv').config();

const destinations = [
    {
        name: 'Munnar',
        image: '/images/destinations/munnar_user/munnar_user_1.jpg',
        description: 'Green hill station with tea gardens.',
        details: 'Munnar is a town in the Western Ghats mountain range in India’s Kerala state. A hill station and former resort for the British Raj elite, it\'s surrounded by rolling hills dotted with tea plantations established in the late 19th century.',
        highlights: ['Tea Gardens', 'Eravikulam National Park', 'Mattupetty Dam', 'Anamudi Peak', 'Top Station'],
        gallery: [
            '/images/destinations/munnar_user/munnar_user_2.jpg',
            '/images/destinations/munnar_eravikulam.png',
            '/images/destinations/munnar_user/munnar_user_mattupetty.jpg',
            '/images/destinations/munnar_user/munnar_user_top_station.jpg',
            '/images/destinations/munnar_user/munnar_user_3.jpg',
            '/images/destinations/munnar_user/munnar_user_4.jpg',
            '/images/destinations/munnar_user/munnar_user_5.jpg'
        ],
        topPlaces: [
            {
                name: 'Eravikulam National Park',
                image: '/images/destinations/munnar_eravikulam.png',
                description: 'Home to the endangered Nilgiri Tahr, offering breathtaking views of the rolling hills and tea plantations.'
            },
            {
                name: 'Mattupetty Dam',
                image: '/images/destinations/munnar_user/munnar_user_mattupetty.jpg',
                description: 'A concrete gravity dam built in the mountains, famous for its storage masonry dam and the beautiful lake.'
            },
            {
                name: 'Tea Museum',
                image: '/images/destinations/munnar_tea_museum.png',
                description: 'Showcases the history of tea plantations in Munnar, featuring photographs and machinery used in tea processing.'
            },
            {
                name: 'Anamudi Peak',
                image: '/images/destinations/munnar_anamudi.png',
                description: 'The highest peak in South India, standing at an elevation of 2,695 meters, offering trekking opportunities and scenic views.'
            },
            {
                name: 'Top Station',
                image: '/images/destinations/munnar_user/munnar_user_top_station.jpg',
                description: 'The highest point in Munnar, offering panoramic views of the Western Ghats and the valley of Theni district below.'
            }
        ],
        bestTimeToVisit: 'September to March',
        currency: 'INR (₹)',
        language: 'Malayalam, English'
    },
    {
        name: 'Wayanad',
        image: '/images/destinations/wayanad_main.png',
        description: 'A spice garden in the hills.',
        details: 'Wayanad is known for its spice plantations, prehistoric caves, and lush greenery. It is a perfect destination for adventure seekers and nature lovers.',
        highlights: ['Banasura Sagar Dam', 'Edakkal Caves', 'Chembra Peak', 'Soochipara Falls'],
        gallery: [
            'https://images.unsplash.com/photo-1591873322143-6d0d249ceb8b?w=800&q=80',
            'https://images.unsplash.com/photo-1627341235121-65355609439b?w=800&q=80',
            'https://images.unsplash.com/photo-1616641835706-03f392265008?w=800&q=80',
            'https://images.unsplash.com/photo-1544980649-6f92025e14cb?w=800&q=80'
        ],
        topPlaces: [
            {
                name: 'Banasura Sagar Dam',
                image: '/images/destinations/wayanad_banasura.png',
                description: 'The largest earth dam in India and the second largest in Asia, offering a spectacular view of the Banasura hills.'
            },
            {
                name: 'Edakkal Caves',
                image: '/images/destinations/wayanad_edakkal.png',
                description: 'Natural caves featuring prehistoric carvings dating back to the Neolithic era, located at an altitude of 1,200m.'
            },
            {
                name: 'Chembra Peak',
                image: '/images/destinations/wayanad_chembra.png',
                description: 'The highest peak in Wayanad, famous for its heart-shaped lake that is believed to have never dried up.'
            },
            {
                name: 'Lakkidi View Point',
                image: 'https://images.unsplash.com/photo-1616641835706-03f392265008?w=600&q=80',
                description: 'A gateway to Wayanad, offering a bird\'s eye view of the winding ghat roads and misty valleys below.'
            }
        ],
        bestTimeToVisit: 'October to May',
        currency: 'INR (₹)',
        language: 'Malayalam, English'
    },
    {
        name: 'Alleppey',
        image: '/images/destinations/alleppey_main.png',
        description: 'Venice of the East.',
        details: 'Alappuzha (Alleppey) is famous for its houseboat cruises through the serene backwaters, beautiful beaches, and vibrant culture.',
        highlights: ['Houseboat Cruise', 'Alleppey Beach', 'Marari Beach', 'Vembanad Lake'],
        gallery: [
            '/images/destinations/alleppey_houseboat.png',
            'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?w=800&q=80',
            'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&q=80',
            'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&q=80'
        ],
        topPlaces: [
            {
                name: 'Marari Beach',
                image: '/images/destinations/alleppey_marari.png',
                description: 'A serene and pristine beach destination, perfect for relaxation and witnessing authentic Keralan village life.'
            },
            {
                name: 'Pathiramanal Island',
                image: '/images/destinations/alleppey_pathiramanal.png',
                description: 'A small island in the Vembanad Lake, home to a wide variety of migratory birds and rare flora.'
            },
            {
                name: 'Krishnapuram Palace',
                image: '/images/destinations/alleppey_krishnapuram.png',
                description: 'An 18th-century palace featuring traditional Kerala architecture and famous for its mural paintings and museum.'
            },
            {
                name: 'Revi Karunakaran Museum',
                image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=600&q=80',
                description: 'A private museum showcasing classic art, artifacts, and a large collection of Swarovski crystal and porcelain.'
            }
        ],
        bestTimeToVisit: 'November to February',
        currency: 'INR (₹)',
        language: 'Malayalam, English'
    },
    {
        name: 'Vagamon',
        image: '/images/destinations/vagamon_main.png',
        description: 'The Scotland of Asia.',
        details: 'Vagamon is an offbeat hill station with pine forests, meadows, and rolling hills. It is a peaceful retreat far from the city noise.',
        highlights: ['Pine Forests', 'Vagamon Meadows', 'Kurisumala', 'Thangal Para'],
        gallery: [
            '/images/destinations/vagamon_pine.png',
            '/images/destinations/vagamon_meadows.png',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80'
        ],
        topPlaces: [
            {
                name: 'Pine Forest',
                image: '/images/destinations/vagamon_pine.png',
                description: 'A man-made forest of pine trees, providing a hauntingly beautiful and cool atmosphere for walks and photography.'
            },
            {
                name: 'Vagamon Meadows',
                image: '/images/destinations/vagamon_meadows.png',
                description: 'Endless rolling lush green hills that seem to touch the sky, perfect for a picnic or just soaking in the views.'
            },
            {
                name: 'Kurisumala',
                image: '/images/destinations/vagamon_kurisumala.png',
                description: 'A significant pilgrimage center and a trekking spot, known for its serenity and the cross at its summit.'
            },
            {
                name: 'Thangal Para',
                image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80',
                description: 'A spherical rock formation that has a religious significance and offers a breathtaking view of the valley.'
            }
        ],
        bestTimeToVisit: 'March to May',
        currency: 'INR (₹)',
        language: 'Malayalam, English'
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Destination.deleteMany({});
        await Destination.insertMany(destinations);
        console.log('✅ Seeded destinations');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
