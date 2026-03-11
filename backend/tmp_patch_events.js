import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function patchEvents() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const Event = mongoose.model('Event', new mongoose.Schema({}, { strict: false }));

        const result = await Event.updateMany(
            { $or: [{ time: { $exists: false } }, { time: '' }] },
            { $set: { time: '10:00 AM - 04:00 PM' } }
        );

        console.log(`Matched ${result.matchedCount} documents and modified ${result.modifiedCount} documents.`);

        process.exit(0);
    } catch (error) {
        console.error('Error patching events:', error);
        process.exit(1);
    }
}

patchEvents();
