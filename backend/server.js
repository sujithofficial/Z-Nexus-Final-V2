import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import associationRoutes from './routes/associationRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import countdownRoutes from './routes/countdownRoutes.js';
import paymentQRRoutes from './routes/paymentQRRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://znexus2k26.netlify.app"
    ],
    credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/association', associationRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/countdown', countdownRoutes);
app.use('/api/payment-qr', paymentQRRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/', (req, res) => {
    res.send('Z-NEXUS 2K26 API is running...');
});

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
