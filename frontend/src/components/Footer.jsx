import React from 'react';
const Footer = () => {
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
                        <h4 className="text-lg font-bold text-hotPink mb-4">Location</h4>
                        <p className="text-gray-400">
                            KGiSL Institute of Technology,<br />
                            Department of CS & BS,<br />
                            Coimbatore, Tamil Nadu.
                        </p>
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
