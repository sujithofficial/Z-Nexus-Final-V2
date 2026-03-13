import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users } from 'lucide-react';

const Register = () => {
    const internalFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSdVgsxz0Z708re-3MOwSrsXGg5cQ_X7KzEnX3A6El6bHnLnEQ/viewform?usp=header";
    const externalFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSdTipAxb8_RLTJCAZegJKzV69KEP3xhTyacNzsTRMow7-U9Fg/viewform?usp=sharing&ouid=118148100826276095168";

    const registrationOptions = [
        {
            title: "Internal Registration",
            description: "FOR STUDENTS OF KGiSL INSTITUTE OF TECHNOLOGY.",
            icon: <GraduationCap size={40} />,
            link: internalFormLink,
            delay: 0.1
        },
        {
            title: "External Registration",
            description: "FOR PARTICIPANTS FROM OTHER COLLEGES.",
            icon: <Users size={40} />,
            link: externalFormLink,
            delay: 0.2
        }
    ];

    return (
        <div id="register-top" className="min-h-screen py-32 container mx-auto px-4 sm:px-6 relative overflow-hidden scroll-mt-24">
            {/* Atmosphere Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.04),transparent_40%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.03),transparent_40%)]" />
            </div>

            <div className="mb-24 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-8 leading-none tracking-tighter fast-red-gradient uppercase">
                        REGISTRATION
                    </h1>
                    <p className="text-gray-300 text-xs font-black uppercase tracking-[0.3em]">SELECT YOUR REGISTRATION TYPE TO PROCEED.</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto relative z-10">
                {registrationOptions.map((option, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, delay: option.delay, ease: [0.16, 1, 0.3, 1] }}
                        className="sticker-card p-12 bg-white/[0.02] border border-white/5 rounded-[3.5rem] shadow-2xl flex flex-col items-center text-center group hover:bg-white/[0.04] transition-all duration-700 h-full"
                    >
                        <div className="p-8 bg-white/5 rounded-[2rem] text-white/20 mb-10 group-hover:text-white transition-colors duration-700">
                            {option.icon}
                        </div>
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">{option.title}</h2>
                        <p className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em] mb-12 flex-grow leading-loose">
                            {option.description}
                        </p>
                        <button
                            onClick={() => window.open(option.link, "_blank")}
                            className="w-full py-6 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.05] active:scale-[0.95] transition-all duration-700 ease-[0.16, 1, 0.3, 1] shadow-2xl"
                        >
                            REGISTER NOW
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Register;
