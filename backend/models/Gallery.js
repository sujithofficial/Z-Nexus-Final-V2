import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Gallery', gallerySchema);
