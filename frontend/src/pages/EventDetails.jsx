import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventService } from '../services/api';
import { Calendar, MapPin, User, Phone, ArrowLeft, Trophy, Info, List } from 'lucide-react';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await eventService.getById(id);
                setEvent(data);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-neonPurple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!event) return <div className="text-center py-40">Event not found</div>;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-12 group transition-colors"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                BACK TO EVENTS
            </button>

            <div className="flex flex-col lg:flex-row gap-16">
                {/* Event Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:w-1/3"
                >
                    <div className="sticker-card p-8 border-l-8 border-neonPurple">
                        <h1 className="text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter">{event.title}</h1>
                        <div className="inline-block px-4 py-1 bg-limeGreen/20 text-limeGreen rounded-full font-bold text-sm mb-8">
                            {event.eventType} EVENT
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-lg text-electricBlue"><Calendar size={24} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Date</p>
                                    <p className="text-lg font-semibold">{event.date}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-lg text-hotPink"><MapPin size={24} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Venue</p>
                                    <p className="text-lg font-semibold">{event.venue}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/5 rounded-lg text-orangeSplash"><User size={24} /></div>
                                <div>
                                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Coordinator</p>
                                    <p className="text-lg font-semibold">{event.coordinatorName}</p>
                                    <p className="text-gray-400">{event.coordinatorPhone}</p>
                                </div>
                            </div>
                        </div>

                        <Link
                            to={`/register?eventId=${event._id}`}
                            className="mt-12 block w-full py-4 bg-neonPurple text-center font-black text-xl rounded-xl paint-btn shadow-neon-purple"
                        >
                            REGISTER NOW
                        </Link>
                    </div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:w-2/3 space-y-12"
                >
                    {/* Description */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Info className="text-neonPurple" />
                            <h2 className="text-2xl font-bold tracking-tight">OVERVIEW</h2>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap bg-white/5 p-8 rounded-2xl border border-white/10">
                            {event.description}
                        </p>
                    </section>

                    {/* Rules */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <List className="text-hotPink" />
                            <h2 className="text-2xl font-bold tracking-tight">RULES & GUIDELINES</h2>
                        </div>
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                            <div className="text-gray-300 whitespace-pre-wrap prose prose-invert max-w-none">
                                {event.rules}
                            </div>
                        </div>
                    </section>

                    {event.eventType === 'Team' && (
                        <section className="bg-electricBlue/10 p-8 rounded-2xl border-2 border-dashed border-electricBlue/30">
                            <div className="flex items-center gap-4">
                                <Trophy className="text-electricBlue" size={32} />
                                <div>
                                    <h3 className="text-xl font-bold">TEAM REQUIREMENTS</h3>
                                    <p className="text-gray-400">Maximum team size allowed: <span className="text-electricBlue font-bold">{event.maxTeamSize} Members</span></p>
                                </div>
                            </div>
                        </section>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default EventDetails;
