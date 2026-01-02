const mongoose = require('mongoose');
const { Experience } = require('./models');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const count = await Experience.countDocuments();
        console.log(`Found ${count} experiences in the database.`);
        if (count > 0) {
            const sample = await Experience.findOne();
            console.log('Sample experience:', JSON.stringify(sample, null, 2));
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
