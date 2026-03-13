import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/', id: 'home-top' },
        { name: 'Events', path: '/events', id: 'events-top' },
        { name: 'Register', path: 'https://forms.gle/xyWFHC5fbjeftLMr7', id: 'register-top' },
        { name: 'Association', path: '/association', id: 'association-top' },
        { name: 'Staff', path: '/staff', id: 'staff-top' },
        { name: 'Gallery', path: '/gallery', id: 'gallery-top' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleMobileNavClick = (path, id) => {
        // 1. Close the mobile menu immediately
        setIsOpen(false);

        // 2. Scroll to the very top of the page first
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // 3. After the scroll-to-top completes (~500ms), navigate to the target section
        setTimeout(() => {
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }, 500);
    };

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? 'bg-black/40 backdrop-blur-2xl border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none opacity-50" />

                <div className="container mx-auto px-6 flex justify-between items-center relative z-10">
                    <Link to="/" className="group transition-all duration-500">
                        <span className="text-2xl font-black text-white uppercase tracking-tighter group-hover:tracking-normal transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">Z-NEXUS</span>
                        <span className="text-white/20 font-black ml-1 group-hover:text-white/60 transition-colors duration-700">2K26</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => {
                            const isExternal = link.path.startsWith('http');
                            if (isExternal) {
                                return (
                                    <a
                                        key={link.path}
                                        href={link.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 relative group text-gray-300 hover:text-white"
                                    >
                                        {link.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"></span>
                                    </a>
                                );
                            }
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-110 active:scale-95 relative group ${location.pathname === link.path ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                >
                                    {link.name}
                                    <span className={`absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`}></span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-white/40 hover:text-white transition-all duration-300 p-2 hover:bg-white/5 rounded-full active:scale-90"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu — rendered outside <nav> so it always covers the full viewport */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center gap-8 z-[60] md:hidden shadow-2xl overflow-y-auto"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
                        {navLinks.map((link) => {
                            const isExternal = link.path.startsWith('http');
                            if (isExternal) {
                                return (
                                    <a
                                        key={link.path}
                                        href={link.path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-4xl font-black uppercase tracking-tighter transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 text-gray-300 hover:text-white"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                );
                            }
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`text-4xl font-black uppercase tracking-tighter transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 ${location.pathname === link.path ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                    onClick={() => handleMobileNavClick(link.path, link.id)}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        <button
                            className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={32} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
