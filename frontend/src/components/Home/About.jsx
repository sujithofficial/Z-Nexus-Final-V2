import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section className="py-24 bg-concreteGray/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hotPink to-transparent"></div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="md:w-1/2"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold section-title mb-8">
                            THE CONVERGENCE OF <span className="animated-gradient-text">MINDS</span>
                        </h2>
                        <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                            <p>
                                Z-NEXUS 2K26 is the premier National Level Technical Symposium organized by the Department of Computer Science and Business Systems at KGiSL Institute of Technology.
                            </p>
                            <p>
                                Our objective is to provide a platform for aspiring engineers and innovators to showcase their technical prowess, creative problem-solving skills, and business acumen through a diverse range of events.
                            </p>
                            <p>
                                From intensive coding challenges to strategic business pitching, Z-NEXUS is where technology meets enterprise, fostering an environment of collaborative learning and healthy competition.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="md:w-1/2 relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"
                                alt="Collaboration"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                        {/* Graffiti Splatter */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-limeGreen/20 blur-[60px] rounded-full -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-hotPink/20 blur-[60px] rounded-full -z-10"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
