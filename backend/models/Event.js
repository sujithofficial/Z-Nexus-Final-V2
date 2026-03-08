import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    rules: { type: String, required: true },
    venue: { type: String, required: true },
    date: { type: String, required: true },
    eventType: { type: String, enum: ['Individual', 'Team'], required: true },
    maxTeamSize: { type: Number, default: 1 },
    coordinatorName: { type: String, required: true },
    coordinatorPhone: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
