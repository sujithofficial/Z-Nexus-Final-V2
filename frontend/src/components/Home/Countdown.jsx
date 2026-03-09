import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { countdownService } from '../../services/api';

const Countdown = () => {
    const [countdownData, setCountdownData] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCountdown = async () => {
            try {
                const { data } = await countdownService.get();
                if (data && data.targetDate) {
                    setCountdownData({ date: data.targetDate });
                }
            } catch (error) {
                console.error('Error fetching countdown:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCountdown();
    }, []);

    const targetDate = countdownData ? new Date(countdownData.date).getTime() : null;

    useEffect(() => {
        if (!targetDate) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance <= 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((distance / (1000 * 60)) % 60),
                seconds: Math.floor((distance / 1000) % 60)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (loading) return null;

    if (!targetDate || isNaN(targetDate)) {
        return (
            <section className="py-20 relative">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-gray-500 tracking-widest graffiti-text">Countdown will be announced soon.</h2>
                </div>
            </section>
        );
    }

    const timerItems = [
        { label: 'DAYS', value: timeLeft.days, color: 'text-neonPurple', border: 'var(--neon-purple)' },
        { label: 'HOURS', value: timeLeft.hours, color: 'text-electricBlue', border: 'var(--electric-blue)' },
        { label: 'MINUTES', value: timeLeft.minutes, color: 'text-hotPink', border: 'var(--hot-pink)' },
        { label: 'SECONDS', value: timeLeft.seconds, color: 'text-limeGreen', border: 'var(--lime-green)' },
    ];

    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    {timerItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="sticker-card p-6 text-center flex flex-col items-center justify-center border-b-8 border-r-8"
                            style={{ borderColor: item.border || '#555' }}
                        >
                            <span className={`text-5xl md:text-6xl font-black mb-2 ${item.color} tabular-nums`}>
                                {String(item.value).padStart(2, '0')}
                            </span>
                            <span className="text-sm font-bold tracking-widest text-gray-400">{item.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Countdown;
