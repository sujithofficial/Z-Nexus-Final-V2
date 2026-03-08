import mongoose from 'mongoose';

const PaymentQRSchema = new mongoose.Schema({
    image: String,
    text: String
});

export default mongoose.model('PaymentQR', PaymentQRSchema);
