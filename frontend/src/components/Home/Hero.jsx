import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex items-center justify-center pt-20">
            {/* Background Splashes */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neonPurple/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-hotPink/20 blur-[120px] rounded-full"></div>

            <div className="container mx-auto px-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-6">
                        <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-limeGreen font-bold tracking-widest text-sm mb-4">
                            KGiSL INSTITUTE OF TECHNOLOGY
                        </span>
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-400 tracking-widest">
                            DEPARTMENT OF COMPUTER SCIENCE AND BUSINESS SYSTEMS
                        </h2>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-bold graffiti-text mb-6">
                        <span className="neon-glow-purple">Z-NEXUS</span>
                        <span className="text-electricBlue ml-4">2K26</span>
                    </h1>

                    <p className="text-2xl md:text-3xl text-gray-300 font-bold tracking-widest mb-12 uppercase">
                        Where <span className="text-hotPink">Innovation</span> Converges
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <button
                            onClick={() => navigate('/register')}
                            className="px-10 py-4 bg-neonPurple text-white font-bold rounded-full paint-btn shadow-neon-purple text-lg"
                        >
                            REGISTER NOW
                        </button>
                        <button
                            onClick={() => navigate('/events')}
                            className="px-10 py-4 border-2 border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all text-lg"
                        >
                            EXPLORE EVENTS
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Paint Drip Effect (CSS) */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-urbanDark to-transparent"></div>
        </div>
    );
};

export default Hero;
