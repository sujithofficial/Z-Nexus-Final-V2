import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { associationService } from '../services/api';
import { User, Phone, Mail } from 'lucide-react';

const AssociationMembers = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const { data } = await associationService.getAll();
                setMembers(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-neonPurple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const leadershipRoles = ['President', 'Vice President', 'Secretary', 'Joint Secretary', 'Treasurer'];

    const leadershipMembers = [...members]
        .filter(m => leadershipRoles.includes(m.role))
        .sort((a, b) => leadershipRoles.indexOf(a.role) - leadershipRoles.indexOf(b.role));

    const mediaMembers = members.filter(m => m.role === 'Media Member');
    const eventCoordinators = members.filter(m => m.role === 'Event Coordinator');

    const renderMemberCard = (member, index) => (
        <motion.div
            key={member._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { delay: index * 0.1 } }}
            className="sticker-card p-6 flex flex-col items-center text-center relative group"
        >
            <div className="w-48 h-48 rounded-full border-4 border-white/10 mb-6 shadow-2xl relative profile-img-container">
                <img
                    src={member.photo ? `${import.meta.env.VITE_API_URL}${member.photo}` : 'https://via.placeholder.com/200'}
                    alt={member.name}
                    className="w-full h-full object-cover flex-shrink-0 rounded-full border-[3px] border-pink-500 profile-neon-ring"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-hotPink/40 to-transparent opacity-0"></div>
            </div>

            <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{member.name}</h3>
            <span className="px-4 py-1 bg-hotPink text-white font-bold rounded-full text-sm mb-4">
                {member.role}
            </span>

            {member.contact && (
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors duration-[350ms]">
                    <Phone size={16} className="text-hotPink" />
                    <span className="font-semibold">{member.contact}</span>
                </div>
            )}

            {/* Graffiti Splatter Overlay */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                <svg viewBox="0 0 100 100" className="fill-hotPink">
                    <path d="M20,20 Q40,0 60,20 T100,20 L100,100 L0,100 Z" />
                </svg>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <style>{`
                .sticker-card {
                    transition: transform 0.25s ease, box-shadow 0.25s ease;
                }
                .sticker-card:hover {
                    transform: translateY(-6px) !important;
                    box-shadow:
                        0 10px 25px rgba(0,0,0,0.4),
                        0 0 18px rgba(255,0,150,0.35);
                    animation: softGlow 2.5s ease-in-out infinite;
                }

                .profile-img-container {
                    transition: box-shadow 0.25s ease;
                }
                .sticker-card:hover .profile-img-container {
                    box-shadow: 0 0 12px rgba(255,0,150,0.4);
                }

                @keyframes softGlow {
                    0% { filter: brightness(1); }
                    50% { filter: brightness(1.1); }
                    100% { filter: brightness(1); }
                }

                .profile-neon-ring {
                    animation: neonPulse 2.5s ease-in-out infinite;
                }
                
                @keyframes neonPulse {
                    0% {
                        box-shadow: 0 0 10px #ff0099;
                    }
                    50% {
                        box-shadow: 0 0 22px #ff0099;
                    }
                    100% {
                        box-shadow: 0 0 10px #ff0099;
                    }
                }
            `}</style>
            <div className="mb-10 md:mb-16 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold section-title mb-4">
                    THE <span className="animated-gradient-text">CREW</span>
                </h1>
                <p className="text-gray-400 text-base md:text-lg px-4">The leaders behind the vision of Z-NEXUS 2K26.</p>
            </div>

            {leadershipMembers.length > 0 && (
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-white section-title uppercase tracking-widest">Leadership</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {leadershipMembers.map((member, index) => renderMemberCard(member, index))}
                    </div>
                </div>
            )}

            {mediaMembers.length > 0 && (
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-white section-title uppercase tracking-widest">Media Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {mediaMembers.map((member, index) => renderMemberCard(member, index))}
                    </div>
                </div>
            )}

            {eventCoordinators.length > 0 && (
                <div className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-black mb-12 text-center text-white section-title uppercase tracking-widest">Event Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {eventCoordinators.map((member, index) => renderMemberCard(member, index))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssociationMembers;
