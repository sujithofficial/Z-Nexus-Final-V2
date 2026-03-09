import mongoose from 'mongoose';
import Contact from './models/Contact.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const res = await Contact.findByIdAndUpdate('invalid-id', { $set: {} }, { new: true });
        console.log(res);
    } catch (e) {
        console.error('CAUGHT:', e.name);
    } finally {
        process.exit();
    }
}
test();
