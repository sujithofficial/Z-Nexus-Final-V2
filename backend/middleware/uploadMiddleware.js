import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Ensure configuration is set
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

console.log("Cloudinary Middleware Configured:", {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY ? "PRESENT" : "MISSING"
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'znexus_uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    },
});

const upload = multer({ storage });

export default upload;
