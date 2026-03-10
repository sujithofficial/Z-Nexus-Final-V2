import React, { useState, useEffect } from 'react';
import { contactService, getImageUrl } from '../services/api';
// Converts an email address to a mailto: link; leaves other URLs untouched
const resolveContactHref = (link) => {
    if (!link) return '#';
    if (link.startsWith('mailto:')) return link;
    // If it looks like an email address (contains @ but no protocol)
    if (link.includes('@') && !link.startsWith('http')) return `mailto:${link}`;
    return link;
};

const Footer = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const { data } = await contactService.getAll();
                setContacts(data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            }
        };
        fetchContacts();
    }, []);
    return (
        <footer className="bg-black py-32 border-t border-white/5 relative overflow-hidden">
            {/* Atmosphere Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.03),transparent_50%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_100%,rgba(255,255,255,0.02),transparent_50%)]" />
            </div>

            <div className="container mx-auto px-4 sm:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mb-24">
                    <div className="space-y-8 text-center md:text-left flex flex-col items-center md:items-start">
                        <h3 className="text-3xl font-black tracking-tighter text-white">Z-NEXUS <span className="text-white/20">2K26</span></h3>
                        <p className="text-white/20 text-xs leading-relaxed max-w-sm font-black uppercase tracking-[0.2em] break-words">
                            NATIONAL LEVEL TECHNICAL SYMPOSIUM ORGANIZED BY THE DEPARTMENT OF COMPUTER SCIENCE AND BUSINESS SYSTEMS, KGiSL INSTITUTE OF TECHNOLOGY.
                        </p>
                        <p className="mt-4 text-white/40 email-glow text-[10px] font-black tracking-[0.2em]">
                            Email: znexus.csbs@gmail.com
                        </p>
                    </div>
                    <div className="text-center md:text-left flex flex-col items-center md:items-start">
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10">QUICK LINKS</h4>
                        <ul className="space-y-5 text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">
                            <li>
                                <a href="/" className="hover:text-white transition-all duration-700 ease-[0.16, 1, 0.3, 1] hover:translate-x-2 inline-block">HOME</a>
                            </li>
                            <li>
                                <a href="/events" className="hover:text-white transition-all duration-700 ease-[0.16, 1, 0.3, 1] hover:translate-x-2 inline-block">EVENTS</a>
                            </li>
                            <li>
                                <a href="/register" className="hover:text-white transition-all duration-700 ease-[0.16, 1, 0.3, 1] hover:translate-x-2 inline-block">REGISTER</a>
                            </li>
                            <li>
                                <a href="/gallery" className="hover:text-white transition-all duration-700 ease-[0.16, 1, 0.3, 1] hover:translate-x-2 inline-block">GALLERY</a>
                            </li>
                        </ul>
                    </div>
                    <div className="text-center md:text-left flex flex-col items-center md:items-start">
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-10">LOCATION</h4>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] leading-normal mb-8">
                                    KGiSL INSTITUTE OF TECHNOLOGY
                                    <br />
                                    <span className="text-white/20 font-bold block mt-3 lowercase tracking-widest italic">
                                        KGiSL Campus, 365, Thudiyalur Road
                                        <br />
                                        Saravanampatti, Coimbatore – 641035
                                    </span>
                                </p>
                            </div>

                            <a
                                href="https://www.google.com/maps/search/?api=1&query=3XMW%2BPVQ+Kgisl+Campus+365+Thudiyalur+Road+Saravanampatti+Coimbatore+Tamil+Nadu+641035"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 text-[9px] font-black text-white/40 hover:text-white transition-all duration-700 ease-[0.16, 1, 0.3, 1] uppercase tracking-[0.3em] border-b border-white/5 pb-2 hover:border-white/20"
                            >
                                VIEW ON MAP
                            </a>

                            {/* Dynamic Contacts */}
                            <div className="flex gap-8 items-center justify-center md:justify-start pt-6">
                                {contacts.map((contact) => (
                                    <a
                                        key={contact._id}
                                        href={resolveContactHref(contact.link)}
                                        target={contact.link && contact.link.includes('@') && !contact.link.startsWith('http') ? '_self' : '_blank'}
                                        rel="noopener noreferrer"
                                        className="opacity-20 hover:opacity-100 transition-all duration-700 ease-[0.16, 1, 0.3, 1] hover:scale-125 hover:-translate-y-1"
                                        title={contact.name}
                                    >
                                        <img
                                            src={getImageUrl(contact.logo)}
                                            alt={contact.name}
                                            className="w-5 h-5 object-contain grayscale invert"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8 text-center md:text-left text-white/40 text-[9px] font-black uppercase tracking-[0.5em] px-4 sm:px-0">
                    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-12">
                        <p className="break-words">© 2026 Z-NEXUS 2K26. ALL RIGHTS RESERVED.</p>
                        <p className="text-white/20">DEPARTMENT OF CSBS, KGiSL</p>
                    </div>
                    <p className="text-white/60 animate-pulse tracking-[0.3em]">MADE WITH ❤️ BY CSBS ASSOCIATION [NEXORA]</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
