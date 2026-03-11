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
                <section className="py-32 relative overflow-hidden">
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
                                }
                                .partners-scroll::after {
                                    content: '';
                                    position: absolute;
                                    inset: 0;
                                    background: linear-gradient(90deg, #000 0%, transparent 20%, transparent 80%, #000 100%);
                                    pointer-events: none;
                                    z-index: 10;
                                }
                                .partners-track {
                                    display: flex;
                                    gap: 4rem;
                                    width: max-content;
                                    animation: partnerScroll 30s linear infinite;
                                }
                                .partners-scroll:hover .partners-track {
                                    animation-play-state: paused;
                                }
                                @keyframes partnerScroll {
                                    from { transform: translateX(0); }
                                    to { transform: translateX(-50%); }
                                }
                            `}</style>
                            <div className="partners-scroll py-10">
                                <div className="partners-track">
                                    {[...partners, ...partners].map((partner, index) => {
                                        const logoElement = (
                                            <div className="group/logo w-full h-40 flex items-center justify-center overflow-hidden rounded-[4rem] bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.03] group-hover:border-white/10 transition-all duration-1000 ease-[0.16, 1, 0.3, 1] shadow-2xl p-10 relative">
                                                {/* Glass Reflection Component */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-1000" />

                                                <img
                                                    src={getImageUrl(partner.logo)}
                                                    alt={partner.name}
                                                    className="max-w-full max-h-full object-contain grayscale opacity-20 contrast-125 group-hover/logo:grayscale-0 group-hover/logo:opacity-80 transition-all duration-1000 ease-[0.16, 1, 0.3, 1] group-hover/logo:scale-110"
                                                />
                                            </div>
                                        );

                                        return (
                                            <div key={`partner-${index}`} className="flex flex-col items-center text-center w-[280px] shrink-0 group">
                                                <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 mb-8 group-hover:text-white transition-colors duration-700">{partner.name}</h3>

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
            <section className="py-40 relative overflow-hidden">
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
