import mongoose from 'mongoose';

const countdownSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        targetDate: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Countdown = mongoose.model('Countdown', countdownSchema);

export default Countdown;
