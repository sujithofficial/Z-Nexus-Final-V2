import express from 'express';
import PaymentQR from '../models/PaymentQR.js';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const router = express.Router();

// POST — save image + text (replace any existing record)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (req.file) {
            try {
                // 1. Upload the file from Multer to Cloudinary
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/payment'
                });

                // 5. Add debugging logs to verify Cloudinary returns a URL
                console.log("Cloudinary URL:", uploadResult.secure_url);

                // 6. If the upload fails or the URL is missing, stop the database save
                if (!uploadResult || !uploadResult.secure_url) {
                    return res.status(500).json({ message: "Image upload failed: Cloudinary did not return a URL" });
                }

                // 4. Delete the temporary Multer file after uploading
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                // Clear existing records
                await PaymentQR.deleteMany({});

                // 2 & 3. Save the Cloudinary secure URL in MongoDB ONLY after upload completes
                const qr = await PaymentQR.create({
                    image: uploadResult.secure_url,
                    text: req.body.text || ''
                });

                return res.json(qr);
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'QR upload failed: ' + uploadError.message });
            }
        }

        // Handle case where NO new image is uploaded (Update Text Only)
        const existing = await PaymentQR.findOne();
        if (!existing || !existing.image) {
            return res.status(400).json({ message: "QR image is required. Please upload an image." });
        }

        const text = req.body.text || '';
        await PaymentQR.deleteMany({});

        const updatedRecord = await PaymentQR.create({
            image: existing.image,
            text
        });

        res.json(updatedRecord);
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
