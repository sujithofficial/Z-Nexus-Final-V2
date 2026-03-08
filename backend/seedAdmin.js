import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        await Admin.deleteMany({});

        const admin = new Admin({
            username: process.env.ADMIN_USERNAME || 'admin',
            password: process.env.ADMIN_PASSWORD || 'admin123'
        });

        await admin.save();
        console.log('Admin user seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
