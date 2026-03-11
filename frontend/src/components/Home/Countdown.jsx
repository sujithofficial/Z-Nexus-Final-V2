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
                    <h2 className="text-3xl md:text-5xl font-black uppercase section-title">COUNTDOWN WILL BE <span className="red-gradient-animate">ANNOUNCED</span> SOON.</h2>
                </div>
            </section>
        );
    }

    const timerItems = [
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HOURS', value: timeLeft.hours },
        { label: 'MINUTES', value: timeLeft.minutes },
        { label: 'SECONDS', value: timeLeft.seconds },
    ];

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Premium Atmosphere Layers */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.02),transparent_60%)]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6 sm:gap-8 max-w-5xl mx-auto justify-items-center items-center">
                    {timerItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="sticker-card p-3 sm:p-6 w-full text-center flex flex-col items-center justify-center relative group backdrop-blur-3xl rounded-xl sm:rounded-2xl"
                        >
                            {/* Glass Reflection Component */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none" />

                            <span className="text-3xl sm:text-5xl md:text-8xl font-black mb-2 sm:mb-6 text-white tabular-nums tracking-tighter group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                {String(item.value).padStart(2, '0')}
                            </span>
                            <span className="text-xs sm:text-sm md:text-[10px] font-black tracking-[0.4em] text-gray-300 uppercase group-hover:text-white transition-colors duration-1000">{item.label}</span>

                            <div className="absolute inset-x-0 bottom-0 h-px bg-white/40 scale-x-0 group-hover:scale-x-50 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"></div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Countdown;
