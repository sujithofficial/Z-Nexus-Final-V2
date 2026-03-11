import express from 'express';
import PaymentQR from '../models/PaymentQR.js';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const router = express.Router();

// POST — save image + text (replace any existing record)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        let imageUrl = '';

        if (req.file) {
            console.log("File detected for upload:", req.file.path);
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/payment'
                });
                console.log("Cloudinary upload success. Secure URL:", result.secure_url);
                imageUrl = result.secure_url;
                // Delete local file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                    console.log("Local file deleted successfully.");
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'QR upload to Cloudinary failed' });
            }
        }

        const text = req.body.text || '';

        await PaymentQR.deleteMany({});

        const qr = new PaymentQR({ image: imageUrl, text });
        await qr.save();

        console.log('PaymentQR saved:', { image: imageUrl, text });
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
