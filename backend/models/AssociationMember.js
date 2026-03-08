import mongoose from 'mongoose';

const associationMemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    photo: { type: String, required: true },
    contact: { type: String }
}, { timestamps: true });

export default mongoose.model('AssociationMember', associationMemberSchema);
