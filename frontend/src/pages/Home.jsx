import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Countdown from '../components/Home/Countdown';
import Hero from '../components/Home/Hero';
import About from '../components/Home/About';
import Highlights from '../components/Home/Highlights';
import { partnerService, getImageUrl } from '../services/api';

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
        <div className="overflow-x-hidden bg-black">
            <Hero />
            <Countdown />
            <About />
            <Highlights />

            {/* Partners Section */}
            {partners.length > 0 && (
                <section className="py-32 relative overflow-hidden section-glow">
                    {/* Atmosphere Layer */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_60%)]" />
                    </div>

                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        <div className="text-center mb-24 px-4">
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h1 className="text-4xl md:text-6xl font-black mb-8 leading-none tracking-tighter fast-red-gradient uppercase">
                                    INTERNAL PARTNERS
                                </h1>
                                <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.4em]">STRATEGIC COLLABORATORS DRIVING INNOVATION</p>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="max-w-7xl mx-auto w-full"
                        >
                            <style>{`
                                .partners-scroll {
                                    overflow: hidden;
                                    width: 100%;
                                    position: relative;
                                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                                }
                                .partners-track {
                                    display: flex;
                                    gap: 5rem;
                                    width: max-content;
                                    animation: partnerScroll 40s linear infinite;
                                    padding: 2rem 0;
                                }
                                .partners-scroll:hover .partners-track {
                                    animation-play-state: paused;
                                }
                                @keyframes partnerScroll {
                                    from { transform: translateX(0); }
                                    to { transform: translateX(-50%); }
                                }

                                .futuristic-card {
                                    position: relative;
                                    width: 300px;
                                    height: 180px;
                                    background: rgba(255, 255, 255, 0.03);
                                    backdrop-filter: blur(20px);
                                    border: 1px solid rgba(255, 255, 255, 0.05);
                                    border-radius: 40px 4px 40px 4px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                                    overflow: hidden;
                                    cursor: pointer;
                                }

                                .futuristic-card::before {
                                    content: '';
                                    position: absolute;
                                    inset: 0;
                                    background: linear-gradient(135deg, 
                                        rgba(0, 255, 255, 0.1) 0%, 
                                        rgba(255, 0, 255, 0.1) 100%
                                    );
                                    opacity: 0;
                                    transition: opacity 0.7s ease;
                                }

                                .futuristic-card::after {
                                    content: '';
                                    position: absolute;
                                    top: -50%;
                                    left: -50%;
                                    width: 200%;
                                    height: 200%;
                                    background: linear-gradient(
                                        45deg,
                                        transparent 45%,
                                        rgba(255, 255, 255, 0.1) 50%,
                                        transparent 55%
                                    );
                                    transform: translateX(-100%);
                                    transition: transform 0.8s ease;
                                    pointer-events: none;
                                }

                                .futuristic-card:hover {
                                    transform: translateY(-10px) rotateX(10deg) rotateY(10deg) scale(1.05);
                                    border-color: rgba(255, 255, 255, 0.2);
                                    box-shadow: 
                                        0 20px 40px rgba(0, 0, 0, 0.4),
                                        0 0 20px rgba(0, 255, 255, 0.1),
                                        0 0 40px rgba(255, 0, 255, 0.1);
                                }

                                .futuristic-card:hover::before {
                                    opacity: 1;
                                }

                                .futuristic-card:hover::after {
                                    transform: translateX(100%);
                                }

                                .logo-container {
                                    position: relative;
                                    z-index: 2;
                                    width: 70%;
                                    height: 70%;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }

                                .logo-glow {
                                    position: absolute;
                                    width: 80%;
                                    height: 80%;
                                    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
                                    filter: blur(20px);
                                    opacity: 0.5;
                                    transition: opacity 0.7s ease;
                                }

                                .futuristic-card:hover .logo-glow {
                                    opacity: 0.8;
                                    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
                                }

                                .partner-logo {
                                    max-width: 100%;
                                    max-height: 100%;
                                    object-fit: contain;
                                    transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
                                    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
                                }

                                .futuristic-card:hover .partner-logo {
                                    transform: scale(1.1) translateY(-5px);
                                    filter: drop-shadow(0 10px 20px rgba(255, 255, 255, 0.3));
                                }
                            `}</style>
                            <div className="partners-scroll py-10">
                                <div className="partners-track">
                                    {[...partners, ...partners].map((partner, index) => {
                                        const logoElement = (
                                            <div className="futuristic-card group/card">
                                                <div className="logo-glow" />
                                                <div className="logo-container">
                                                    <img
                                                        src={getImageUrl(partner.logo)}
                                                        alt={partner.name}
                                                        className="partner-logo"
                                                    />
                                                </div>
                                            </div>
                                        );

                                        return (
                                            <div key={`partner-${index}`} className="flex flex-col items-center text-center group">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-8 group-hover:text-white transition-colors duration-700">{partner.name}</h3>

                                                {partner.website ? (
                                                    <a
                                                        href={partner.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="outline-none"
                                                    >
                                                        {logoElement}
                                                    </a>
                                                ) : (
                                                    <div className="cursor-default">
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
            <section className="py-40 relative overflow-hidden section-glow">
                <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-5xl mx-auto bg-white/[0.02] border border-white/5 p-12 md:p-32 rounded-[2.5rem] md:rounded-[5rem] premium-shadow premium-hover relative overflow-hidden group"
                    >
                        {/* Atmosphere & Reflections */}
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.03),transparent_70%)]" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-1000" />

                        <h2 className="text-5xl md:text-8xl font-black mb-10 leading-none tracking-tighter fast-red-gradient uppercase">
                            BE PART OF THE FUTURE
                        </h2>
                        <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.5em] mb-16 max-w-2xl mx-auto leading-loose">
                            SHOWCASE YOUR TALENT AND INNOVATE WITH THE BEST MINDS IN THE SYMPOSIUM.
                        </p>
                        <div className="flex flex-wrap justify-center gap-10 relative z-10">
                            <button
                                onClick={() => navigate('/register')}
                                className="px-12 py-6 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:scale-110 active:scale-95 transition-all duration-700 ease-[0.16, 1, 0.3, 1] shadow-2xl"
                            >
                                REGISTER NOW
                            </button>
                            <button
                                onClick={() => navigate('/events')}
                                className="px-12 py-6 bg-white/5 text-gray-300 font-black text-xs uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 hover:text-white border border-white/5 transition-all duration-700 ease-[0.16, 1, 0.3, 1] active:scale-95"
                            >
                                VIEW EVENTS
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
