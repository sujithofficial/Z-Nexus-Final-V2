import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import PaymentQR from '../models/PaymentQR.js';

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Self-contained multer config — no shared middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// POST — save image + text (replace any existing record)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const image = req.file ? req.file.path : '';
        const text = req.body.text || '';

        await PaymentQR.deleteMany({});

        const qr = new PaymentQR({ image, text });
        await qr.save();

        console.log('PaymentQR saved:', { image, text });
        res.json(qr);
    } catch (error) {
        console.error('PaymentQR save error:', error.message);
        res.status(500).json({ message: 'Save failed: ' + error.message });
    }
});

// GET — return current record
router.get('/', async (req, res) => {
    try {
        const qr = await PaymentQR.findOne();
        res.json(qr || { image: '', text: '' });
    } catch (error) {
        console.error('PaymentQR fetch error:', error.message);
        res.status(500).json({ message: 'Fetch failed' });
    }
});

export default router;
