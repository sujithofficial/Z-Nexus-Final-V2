import Countdown from '../models/Countdown.js';

export const getCountdown = async (req, res) => {
    try {
        const countdown = await Countdown.findOne().sort({ createdAt: -1 });
        if (countdown) {
            res.json(countdown);
        } else {
            res.status(404).json({ message: 'No countdown found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createCountdown = async (req, res) => {
    try {
        const { title, targetDate } = req.body;

        // Remove existing countdowns to keep only one active
        await Countdown.deleteMany({});

        const countdown = new Countdown({
            title,
            targetDate,
        });

        const createdCountdown = await countdown.save();
        res.status(201).json(createdCountdown);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCountdown = async (req, res) => {
    try {
        const { title, targetDate } = req.body;
        const countdown = await Countdown.findById(req.params.id);

        if (countdown) {
            countdown.title = title || countdown.title;
            countdown.targetDate = targetDate || countdown.targetDate;

            const updatedCountdown = await countdown.save();
            res.json(updatedCountdown);
        } else {
            res.status(404).json({ message: 'Countdown not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCountdown = async (req, res) => {
    try {
        const countdown = await Countdown.findById(req.params.id);

        if (countdown) {
            await Countdown.deleteOne({ _id: countdown._id });
            res.json({ message: 'Countdown removed' });
        } else {
            res.status(404).json({ message: 'Countdown not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
