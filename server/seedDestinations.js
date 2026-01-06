const mongoose = require('mongoose');
const { Destination } = require('./models');
require('dotenv').config();

const destinations = [
    {
        name: 'Kolukkumalai',
        image: 'https://images.unsplash.com/photo-1591012911204-61aa3daaf73f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', // Sunrise/Hills
        description: 'The world\'s highest organic tea plantation.',
        details: 'Kolukkumalai is about 38 km from Munnar. The hilltop is accessible only by jeep and offers a panoramic view of the misty plains of Tamil Nadu and the hills of Kerala. It is famous for its sunrise which is a spectacle to behold.',
        highlights: ['World\'s Highest Tea Estate', 'Sunrise Jeep Safari', 'Tiger Rock', 'Organic Tea Factory'],
        bestTimeToVisit: 'September to March',
        currency: 'INR (₹)',
        language: 'Malayalam, Tamil'
    },
    {
        name: 'Eravikulam National Park',
        image: 'https://images.unsplash.com/photo-1588863644078-43d7c713c4cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', // Tahr/Hills
        description: 'Home to the endangered Nilgiri Tahr and Anamudi Peak.',
        details: 'Eravikulam National Park is the first national park in Kerala. It is located in the Western Ghats and is home to the largest surviving population of the Nilgiri Tahr. The park also houses Anamudi, the highest peak in South India.',
        highlights: ['Nilgiri Tahr Sighting', 'Anamudi Peak View', 'Neelakurinji Blooms', 'Eco-Bus Safari'],
        bestTimeToVisit: 'September to February (Closed Feb-March for calving)',
        currency: 'INR (₹)',
        language: 'Malayalam, English'
    },
    {
        name: 'Vattavada',
        image: 'https://images.unsplash.com/photo-1627896676100-3aa012c499f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', // Vegetable farms/Village
        description: 'The vegetable basket of Kerala, famous for cool weather.',
        details: 'Vattavada is known for its terraced vegetable farms and temperate climate. Unlike other parts of Munnar, Vattavada produces apples, plums, pears, strawberries, and winter vegetables. It offers a rustic village experience.',
        highlights: ['Strawberry Farms', 'Terraced Agriculture', 'Pampadum Shola Trek', 'Cool Climate'],
        bestTimeToVisit: 'August to April',
        currency: 'INR (₹)',
        language: 'Tamil, Malayalam'
    },
    {
        name: 'Mattupetty & Echo Point',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', // Lake/Dam
        description: 'Scenic dam, boating, and the famous Echo Point.',
        details: 'Mattupetty Dam is a gravity dam known for its boating facilities and the surrounding tea gardens. Nearby is Echo Point, where the natural acoustics reproduce your voice. It is a popular spot for families and photographers.',
        highlights: ['Speed Boating', 'Echo Point', 'Elephant Sightings', 'Tea Garden Walks'],
        bestTimeToVisit: 'August to May',
        currency: 'INR (₹)',
        language: 'Malayalam, English'
    },
    {
        name: 'Marayoor',
        image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', // Forest/Sandalwood
        description: 'Ancient dolmens and natural sandalwood forests.',
        details: 'Marayoor is the only place in Kerala with natural sandalwood forests. It is also famous for its ancient dolmens (Muniyaras) from the Stone Age and prehistoric rock paintings. The Pambar river flows through this rain-shadow village.',
        highlights: ['Sandalwood Forest', 'Muniyara Dolmens', 'Rock Paintings', 'Jaggery Making'],
        bestTimeToVisit: 'All Year Round',
        currency: 'INR (₹)',
        language: 'Malayalam, Tamil'
    },
    {
        name: 'Top Station',
        image: 'https://images.unsplash.com/photo-1579246132034-4a2420311d8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', // Viewpoint/Clouds
        description: 'Highest point in Munnar with breathtaking views.',
        details: 'Located on the Kerala-Tamil Nadu border, Top Station offers a panoramic view of the Western Ghats and the plains of Theni. It was historically a transshipment point for tea delivered by ropeway. It is often covered in low-lying clouds.',
        highlights: ['Panoramic View', 'Ropeway Ruins', 'Kurinjimala Sanctuary', 'Camping'],
        bestTimeToVisit: 'October to April',
        currency: 'INR (₹)',
        language: 'Malayalam, Tamil'
    },
    {
        name: 'Vagamon',
        image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1080&q=80', // Meadows/Mist
        description: 'The Scotland of Asia, famous for pine forests and meadows.',
        details: 'Vagamon is a serene hill station located on the border of Kottayam and Idukki districts. Known for its rolling meadows, pine forests, and Orchid gardens, it offers a peaceful escape from the crowds. It is also a prime location for paragliding.',
        highlights: ['Vagamon Meadows', 'Pine Forest', 'Thangal Para', 'Paragliding'],
        bestTimeToVisit: 'December to February',
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
