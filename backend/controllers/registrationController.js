import Registration from '../models/Registration.js';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const registerForEvent = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }

        if (!req.body.data) {
            return res.status(400).json({ message: 'Registration data is missing' });
        }

        let registrationData;
        try {
            registrationData = JSON.parse(req.body.data);
        } catch (parseErr) {
            return res.status(400).json({ message: 'Invalid registration data format' });
        }

        let paymentScreenshot = '';

        if (req.file) {
            try {
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/registrations'
                });

                console.log("Cloudinary URL:", uploadResult.secure_url);

                if (!uploadResult || !uploadResult.secure_url) {
                    throw new Error("Cloudinary upload failed to return a secure URL");
                }

                paymentScreenshot = uploadResult.secure_url;

                // Delete local file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Screenshot upload to Cloudinary failed: ' + uploadError.message });
            }
        }

        if (!paymentScreenshot) {
            return res.status(400).json({ message: 'Payment screenshot is required' });
        }

        const registration = new Registration({
            ...registrationData,
            paymentScreenshot,
        });

        const createdRegistration = await registration.save();
        res.status(201).json(createdRegistration);
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: error.message || 'Registration failed' });
    }
};

export const getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({})
            .populate('technicalEventId', 'title')
            .populate('nonTechnicalEventId', 'title');
        res.json(registrations);
    } catch (error) {
        console.error("Get Registrations Error:", error);
        res.status(500).json({ message: 'Failed to fetch registrations', error: error.message });
    }
};

export const updateRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid registration ID format' });
        }

        if (!req.body || !req.body.status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const { status } = req.body;
        const registration = await Registration.findById(id);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        registration.paymentStatus = status;
        const updatedRegistration = await registration.save();
        res.json(updatedRegistration);
    } catch (error) {
        console.error("Update Registration Status Error:", error);
        res.status(500).json({ message: 'Failed to update status', error: error.message });
    }
};

export const getStats = async (req, res) => {
    try {
        const totalRegistrations = await Registration.countDocuments();
        const pendingRegistrations = await Registration.countDocuments({ paymentStatus: 'Pending' });
        const approvedRegistrations = await Registration.countDocuments({ paymentStatus: 'Approved' });
        res.json({ totalRegistrations, pendingRegistrations, approvedRegistrations });
    } catch (error) {
        console.error("Get Stats Error:", error);
        res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
    }
};
