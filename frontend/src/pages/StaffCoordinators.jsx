import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staffService } from '../services/api';
import { Award, BookOpen } from 'lucide-react';

const StaffCoordinators = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const { data } = await staffService.getAll();
                setStaff(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-neonPurple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="mb-16 text-center">
                <h1 className="text-5xl md:text-7xl font-bold section-title mb-4">
                    FACULTY <span className="animated-gradient-text">GUIDES</span>
                </h1>
                <p className="text-gray-400">The mentors guiding Z-NEXUS 2K26 to excellence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                {staff.map((member, index) => (
                    <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="sticker-card p-0 flex flex-col items-center text-center overflow-hidden group"
                    >
                        <div className="w-full h-80 relative overflow-hidden">
                            <img
                                src={member.photo ? `${import.meta.env.VITE_API_URL}${member.photo}` : 'https://via.placeholder.com/400x500'}
                                alt={member.name}
                                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-electricBlue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="p-8 w-full bg-concreteGray/80 backdrop-blur-md relative">
                            {/* Corner Tag */}
                            <div className="absolute top-0 right-0 w-12 h-12 bg-electricBlue -translate-y-1/2 translate-x-1/2 rotate-45"></div>

                            <h3 className="text-2xl font-black mb-1 uppercase tracking-tight text-white group-hover:text-electricBlue transition-colors">{member.name}</h3>
                            <p className="text-electricBlue font-bold text-sm mb-4 tracking-widest">{member.designation}</p>

                            <div className="flex items-center justify-center gap-2 text-gray-500 font-semibold italic">
                                <BookOpen size={16} />
                                <span>Dept. of {member.department}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StaffCoordinators;
