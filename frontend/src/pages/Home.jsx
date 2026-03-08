import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Countdown from '../components/Home/Countdown';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import Highlights from '../components/Home/Highlights';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="overflow-x-hidden">
            <Hero />
            <Countdown />
            <About />
            <Highlights />

            {/* Call to Action */}
            <section className="py-20 bg-gradient-to-r from-neonPurple/20 to-hotPink/20 relative">
                <div className="container mx-auto px-6 text-center">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-6xl font-bold graffiti-text mb-8 neon-glow-purple"
                    >
                        BE PART OF THE FUTURE
                    </motion.h2>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        Don't miss the chance to showcase your talent and innovate with the best minds.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <button
                            onClick={() => navigate('/register')}
                            className="px-10 py-4 bg-neonPurple text-white font-bold rounded-full paint-btn shadow-neon-purple hover:scale-105"
                        >
                            REGISTER NOW
                        </button>
                        <button
                            onClick={() => navigate('/events')}
                            className="px-10 py-4 border-2 border-electricBlue text-electricBlue font-bold rounded-full hover:bg-electricBlue hover:text-white transition-all shadow-neon-blue"
                        >
                            VIEW EVENTS
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
