import mongoose from 'mongoose';

const staffCoordinatorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    department: { type: String, required: true },
    photo: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('StaffCoordinator', staffCoordinatorSchema);
