import mongoose from 'mongoose';
import Contact from './models/Contact.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id = '69aeae69abf1d04aef74f963';
        const updateData = {};
        console.log('Updating with empty set...');
        const res = await Contact.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: false }
        );
        console.log('Update result:', res);
    } catch (e) {
        console.error('Error during empty update:', e);
    } finally {
        process.exit();
    }
}
test();
