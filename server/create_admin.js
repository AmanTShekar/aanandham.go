const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const email = 'admin@airbnb.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        let admin = await User.findOne({ email });
        if (admin) {
            console.log('Admin already exists');
            admin.role = 'admin'; // Ensure role is admin
            admin.password = hashedPassword; // Reset password just in case
            await admin.save();
            console.log('Admin updated');
        } else {
            admin = new User({
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'admin',
                avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
            });
            await admin.save();
            console.log('Admin created');
        }

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
