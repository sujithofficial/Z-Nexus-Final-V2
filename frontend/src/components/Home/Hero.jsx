import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div id="home-top" className="relative min-h-screen flex items-center justify-center hero-section overflow-hidden scroll-mt-24">
            {/* Premium Atmosphere Layers */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_40%)]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.04),transparent_50%)]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="mb-12">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="institute-label text-base md:text-lg uppercase tracking-[0.4em] font-black text-white/60 mb-4 glow-pulse-text"
                        >
                            KGiSL Institute of Technology
                        </motion.div>
                        <h2 className="text-[11px] md:text-sm font-black text-white/50 tracking-[0.5em] uppercase max-w-2xl mx-auto leading-relaxed glow-pulse-text">
                            DEPARTMENT OF COMPUTER SCIENCE AND BUSINESS SYSTEMS
                        </h2>
                    </div>

                    <div className="relative inline-block mb-12">
                        <h1 className="hero-title tracking-tighter text-6xl md:text-9xl font-black fast-red-gradient uppercase">
                            Z-NEXUS 2K26
                        </h1>
                    </div>

                    <p className="tagline mb-16 text-white font-bold uppercase tracking-[0.4em] text-xs" style={{ textShadow: '0 0 12px rgba(255,255,255,0.6)' }}>
                        WHERE INNOVATION CONVERGES
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 px-4 sm:px-0">
                        <Link
                            to="/register"
                            className="px-12 py-5 bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.05] active:scale-[0.95] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_20px_50px_rgba(255,255,255,0.1)] text-center flex items-center justify-center"
                        >
                            REGISTER NOW
                        </Link>
                        <button
                            onClick={() => navigate('/events')}
                            className="px-12 py-5 bg-white/5 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl border border-white/5 hover:bg-white/10 hover:scale-[1.05] active:scale-[0.95] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-md"
                        >
                            VIEW EVENTS
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Elegant Bottom Transition */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </div>
    );
};

export default Hero;
