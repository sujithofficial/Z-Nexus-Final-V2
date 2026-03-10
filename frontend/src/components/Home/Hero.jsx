import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence>
                {loading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="game-loader"
                    >
                        <motion.h1
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                        >
                            Z-NEXUS
                        </motion.h1>
                        <div className="loader-bar"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative min-h-screen flex items-center justify-center hero-section">
                {/* Background Splashes */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neonPurple/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-hotPink/10 blur-[120px] rounded-full"></div>

                <div className="container mx-auto px-6 text-center z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="mb-10">
                            <div className="institute-label">
                                KGiSL INSTITUTE OF TECHNOLOGY
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-400 tracking-[0.2em] uppercase">
                                Department of Computer Science and Business Systems
                            </h2>
                        </div>

                        <div className="relative inline-block mb-10">
                            <h1 className="hero-title">
                                <span className="hero-z">Z-</span>
                                <span className="nexus">NEXUS</span>
                                <span className="year ml-4">2K26</span>
                            </h1>
                        </div>

                        <p className="tagline text-gray-300 mb-14">
                            Where <span>Innovation</span> Converges
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 px-4 sm:px-0">
                            <button
                                onClick={() => navigate('/register')}
                                className="cta-button register-btn text-lg w-full sm:w-auto"
                            >
                                REGISTER NOW
                            </button>
                            <button
                                onClick={() => navigate('/events')}
                                className="cta-button explore-btn text-lg w-full sm:w-auto"
                            >
                                EXPLORE EVENTS
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Paint Drip Effect (CSS) */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-urbanDark to-transparent"></div>
            </div>
        </>
    );
};

export default Hero;
