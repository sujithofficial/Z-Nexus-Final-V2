import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Trophy, Users, Lightbulb } from 'lucide-react';

const Highlights = () => {
    const highlightItems = [
        {
            icon: <Cpu size={40} className="text-white/60" />,
            title: "TECH INNOVATION",
            desc: "Experience cutting-edge technologies and domains."
        },
        {
            icon: <Trophy size={40} className="text-white/50" />,
            title: "BIG PRIZES",
            desc: "Compete for substantial cash prizes and goodies."
        },
        {
            icon: <Users size={40} className="text-white/60" />,
            title: "NETWORKING",
            desc: "Connect with peers and industry professionals."
        },
        {
            icon: <Lightbulb size={40} className="text-white/50" />,
            title: "IDEATION",
            desc: "Pitch your business ideas to expert panels."
        }
    ];

    return (
        <section className="py-32 relative overflow-hidden">
            {/* Premium Atmosphere Layers */}
            <div className="absolute inset-x-0 top-0 h-px bg-white/10 opacity-80" />
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_60%)]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="mb-24"
                >
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-6">WHY JOIN US?</p>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tighter fast-red-gradient uppercase">
                        SYMPOSIUM HIGHLIGHTS
                    </h3>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {highlightItems.map((item, index) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30, scale: 0.98 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.9, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="sticker-card card-lift p-12 flex flex-col items-center group relative overflow-hidden"
                        >
                            <div className="mb-10 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                {item.icon}
                            </div>
                            <h3 className="text-[10px] font-black mb-4 tracking-[0.3em] text-white/80 uppercase">{item.title}</h3>
                            <p className="text-gray-300 text-xs leading-relaxed font-bold uppercase tracking-widest group-hover:text-white transition-colors duration-700">{item.desc}</p>

                            {/* Reflexive Layer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Highlights;
