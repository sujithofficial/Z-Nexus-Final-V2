import Registration from '../models/Registration.js';

export const registerForEvent = async (req, res) => {
    try {
        const registrationData = JSON.parse(req.body.data);
        const paymentScreenshot = req.file ? `/uploads/${req.file.filename}` : '';

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
        res.status(500).json({ message: error.message });
    }
};

export const getRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({}).populate('eventId', 'title');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRegistrationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const registration = await Registration.findById(req.params.id);

        if (registration) {
            registration.paymentStatus = status;
            const updatedRegistration = await registration.save();
            res.json(updatedRegistration);
        } else {
            res.status(404).json({ message: 'Registration not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStats = async (req, res) => {
    try {
        const totalRegistrations = await Registration.countDocuments();
        const pendingRegistrations = await Registration.countDocuments({ paymentStatus: 'Pending' });
        const approvedRegistrations = await Registration.countDocuments({ paymentStatus: 'Approved' });
        // Total events count is also needed but will be added in dashboard response
        res.json({ totalRegistrations, pendingRegistrations, approvedRegistrations });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
