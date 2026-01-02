const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path if needed
require('dotenv').config();

const createHost = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const args = process.argv.slice(2);
        if (args.length < 3) {
            console.log('Usage: node create_host.js <name> <email> <password>');
            process.exit(1);
        }

        const [name, email, password] = args;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('User already exists');
            process.exit(1);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const host = new User({
            name,
            email,
            password: hashedPassword,
            role: 'business', // Host/Business role
            avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
        });

        await host.save();
        console.log(`Host created successfully: ${email}`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createHost();
