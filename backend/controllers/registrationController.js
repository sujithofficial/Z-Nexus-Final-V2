import Registration from '../models/Registration.js';
import mongoose from 'mongoose';

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

        const paymentScreenshot = req.file ? req.file.path : '';

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
        const registrations = await Registration.find({}).populate('eventId', 'title');
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
