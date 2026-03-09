
import mongoose from 'mongoose';
import Contact from './models/Contact.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const id = '69aeae69abf1d04aef74f963';
        const updateData = { name: 'Test Validators ' + Date.now() };
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        console.log('Update result:', updatedContact.name);
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err.message);
        process.exit(1);
    }
}
test();
