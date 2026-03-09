import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Countdown from '../components/Home/Countdown';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import Highlights from '../components/Home/Highlights';
import { partnerService } from '../services/api';

const Home = () => {
    const navigate = useNavigate();
    const [partners, setPartners] = useState([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const { data } = await partnerService.getAll();
                setPartners(data);
            } catch (error) {
                console.error('Error fetching partners:', error);
            }
        };
        fetchPartners();
    }, []);

    return (
        <div className="overflow-x-hidden">
            <Hero />
            <Countdown />
            <About />
            <Highlights />

            {/* Partners Section */}
            {partners.length > 0 && (
                <section className="py-20 relative">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-black graffiti-text text-white neon-glow-purple uppercase tracking-widest mb-4"
                            >
                                INTERNAL PARTNERS
                            </motion.h2>
                            <p className="text-xl text-gray-400 font-bold uppercase tracking-widest mt-2">
                                Our valued internal partners
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="max-w-7xl mx-auto w-full"
                        >
                            <style>{`
                                .partners-scroll {
                                    overflow: hidden;
                                    width: 100%;
                                }
                                .partners-track {
                                    display: flex;
                                    gap: 3rem;
                                    width: max-content;
                                    animation: partnerScroll 10s linear infinite;
                                }
                                .partners-scroll:hover .partners-track {
                                    animation-play-state: paused;
                                }
                                @keyframes partnerScroll {
                                    from { transform: translateX(0); }
                                    to { transform: translateX(-50%); }
                                }
                            `}</style>
                            <div className="partners-scroll">
                                <div className="partners-track">
                                    {[...partners, ...partners].map((partner, index) => {
                                        const logoElement = (
                                            <div className="w-full h-32 flex items-center justify-center overflow-hidden rounded-xl bg-white/5 border border-transparent hover:border-hotPink/50 transition-all duration-300">
                                                <img
                                                    src={`http://localhost:5000${partner.logo}`}
                                                    alt={partner.name}
                                                    className="max-w-full max-h-full object-contain p-4 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_12px_rgba(255,0,120,0.5)] transition-all duration-300"
                                                />
                                            </div>
                                        );

                                        return (
                                            <div key={`partner-${index}`} className="flex flex-col items-center text-center w-[250px] shrink-0 group">
                                                <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-6 group-hover:text-hotPink transition-colors duration-300">{partner.name}</h3>

                                                {partner.website ? (
                                                    <a
                                                        href={partner.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full group outline-none"
                                                    >
                                                        {logoElement}
                                                    </a>
                                                ) : (
                                                    <div className="w-full cursor-default">
                                                        {logoElement}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

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
