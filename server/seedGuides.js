const mongoose = require('mongoose');
const { Guide } = require('./models');
require('dotenv').config();

const guides = [
    {
        title: 'The Ultimate Packing List',
        category: 'Tips & Tricks',
        image: 'https://images.unsplash.com/photo-1565514020176-db792f4b6d96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Sarah Jenkins',
        date: new Date('2023-10-12'),
        content: `
            <h2>Pack Smart, Travel Light</h2>
            <p>Packing can be the most stressful part of a trip, but it doesn't have to be. Here is our ultimate guide to packing efficiently.</p>
            <h3>The Essentials</h3>
            <ul>
                <li>Passport and Travel Documents</li>
                <li>Universal Power Adapter</li>
                <li>Portable Charger</li>
                <li>First Aid Kit</li>
            </ul>
            <h3>Clothing Strategy</h3>
            <p>Stick to a color palette so you can mix and match. Roll your clothes instead of folding to save space and reduce wrinkles.</p>
        `
    },
    {
        title: 'Hidden Gems in Italy',
        category: 'Destinations',
        image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Marco Rossi',
        date: new Date('2023-09-28'),
        content: `
            <h2>Beyond Rome and Venice</h2>
            <p>Italy is full of surprises. While the main cities are beautiful, the real magic lies in the smaller towns.</p>
            <h3>Matera</h3>
            <p>Known for its ancient cave dwellings, Sassi di Matera is a UNESCO World Heritage site that feels like stepping back in time.</p>
            <h3>Alberobello</h3>
            <p>Famous for its unique trulli buildings with conical roofs.</p>
        `
    },
    {
        title: 'Traveling on a Budget',
        category: 'Budget Travel',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        author: 'Alex Chen',
        date: new Date('2023-09-15'),
        content: `
            <h2>See the World for Less</h2>
            <p>You don't need to be rich to travel. With a few smart choices, you can stretch your budget further.</p>
            <h3>Accommodation</h3>
            <p>Consider hostels, guesthouses, or even couchsurfing. Night trains are also a great way to save on a night's stay.</p>
            <h3>Food</h3>
            <p>Eat like a local. Street food is often delicious, authentic, and cheap.</p>
        `
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await Guide.deleteMany({});
        await Guide.insertMany(guides);
        console.log('✅ Seeded guides');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
