import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Trophy, Users, Lightbulb } from 'lucide-react';

const Highlights = () => {
    const highlightItems = [
        {
            icon: <Cpu size={40} className="text-neonPurple" />,
            title: "TECH INNOVATION",
            desc: "Experience cutting-edge technologies and domains."
        },
        {
            icon: <Trophy size={40} className="text-electricBlue" />,
            title: "BIG PRIZES",
            desc: "Compete for substantial cash prizes and goodies."
        },
        {
            icon: <Users size={40} className="text-hotPink" />,
            title: "NETWORKING",
            desc: "Connect with peers and industry professionals."
        },
        {
            icon: <Lightbulb size={40} className="text-limeGreen" />,
            title: "IDEATION",
            desc: "Pitch your business ideas to expert panels."
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold graffiti-text mb-16 inline-block relative">
                    SYMPOSIUM HIGHLIGHTS
                    <div className="absolute -bottom-2 left-0 w-full h-2 bg-orangeSplash transform skew-x-12"></div>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {highlightItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="sticker-card p-10 flex flex-col items-center group"
                        >
                            <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-transform">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-black mb-4 tracking-wider">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Highlights;
