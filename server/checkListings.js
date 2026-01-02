const mongoose = require('mongoose');
const { Listing } = require('./models');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const count = await Listing.countDocuments();
        console.log(`Listing count: ${count}`);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
