import React, { useState, useEffect } from 'react';
import { contactService } from '../services/api';
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
        <footer className="bg-concreteGray py-12 border-t-4 border-neonPurple mt-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-hotPink/10 blur-[100px] -z-10"></div>
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold graffiti-text mb-4 neon-glow-purple">Z-NEXUS 2K26</h3>
                        <p className="text-gray-400 max-w-sm">
                            National Level Technical Symposium organized by the Department of Computer Science and Business Systems, KGiSL Institute of Technology.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-electricBlue mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/" className="hover:text-neonPurple transition-colors">Home</a></li>
                            <li><a href="/events" className="hover:text-neonPurple transition-colors">Events</a></li>
                            <li><a href="/register" className="hover:text-neonPurple transition-colors">Register</a></li>
                            <li><a href="/gallery" className="hover:text-neonPurple transition-colors">Gallery</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-hotPink mb-4">Department of CSBS</h4>
                        <p className="text-gray-400 mb-1 text-sm font-semibold uppercase tracking-wide">
                            KGiSL Institute of Technology
                        </p>
                        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                            KGiSL Campus, 365, Thudiyalur Road<br />
                            Saravanampatti, Coimbatore – 641035
                        </p>
                        <a
                            href="https://www.google.com/maps/search/?api=1&query=3XMW%2BPVQ+Kgisl+Campus+365+Thudiyalur+Road+Saravanampatti+Coimbatore+Tamil+Nadu+641035"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-bold text-hotPink hover:text-white transition-colors underline underline-offset-4"
                        >
                            📍 View on Google Maps
                        </a>

                        {/* Dynamic Contacts */}
                        <div className="flex gap-4 items-center">
                            {contacts.map((contact) => (
                                <a
                                    key={contact._id}
                                    href={resolveContactHref(contact.link)}
                                    target={contact.link && contact.link.includes('@') && !contact.link.startsWith('http') ? '_self' : '_blank'}
                                    rel="noopener noreferrer"
                                    className="hover:scale-110 transition-transform"
                                    title={contact.name}
                                >
                                    <img
                                        src={`http://localhost:5000${contact.logo}`}
                                        alt={contact.name}
                                        className="w-6 h-6 object-contain"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>© 2026 Z-NEXUS. All Rights Reserved. Built with ❤️ for Innovation.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
