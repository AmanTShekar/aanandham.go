const mongoose = require('mongoose');
const { PreviousEvent } = require('./models');
require('dotenv').config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const events = await PreviousEvent.find({});
        console.log('Previous Events in DB:');
        events.forEach(evt => {
            console.log(`Title: ${evt.title}`);
            console.log(`Image: ${evt.image}`);
            console.log(`Recap Images: ${evt.recapImages}`);
            console.log('---');
        });

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDB();
