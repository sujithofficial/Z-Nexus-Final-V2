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
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/payment'
                });

                console.log("Cloudinary URL:", uploadResult.secure_url);

                if (!uploadResult || !uploadResult.secure_url) {
                    return res.status(500).json({ message: "Cloudinary upload failed" });
                }

                imageUrl = uploadResult.secure_url;

                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'QR upload failed: ' + uploadError.message });
            }
        } else {
            const existing = await PaymentQR.findOne();
            if (existing) imageUrl = existing.image;
        }

        if (!imageUrl) {
            return res.status(400).json({ message: "QR image is required" });
        }

        const text = req.body.text || '';
        await PaymentQR.deleteMany({});

        const qr = await PaymentQR.create({ image: imageUrl, text });

        console.log('PaymentQR created with Cloudinary URL:', imageUrl);
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
