import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    name: { type: String },
    college: { type: String },
    department: { type: String },
    phone: { type: String }
});

const registrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    college: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    technicalEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    nonTechnicalEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    teamName: { type: String },
    teamMembers: [teamMemberSchema],
    upiId: { type: String, required: true },
    paymentScreenshot: { type: String, required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);
