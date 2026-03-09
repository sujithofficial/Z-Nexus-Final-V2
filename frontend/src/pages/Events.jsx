import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { MapPin, Calendar, Users, User, Phone } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await eventService.getAll();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
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
                    ALL <span className="animated-gradient-text">EVENTS</span>
                </h1>
                <p className="text-gray-400 text-lg">Choose your arena and dominate the competition.</p>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
                    <p className="text-2xl text-gray-500 font-bold">NO EVENTS DISCOVERED YET</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {events.map((event, index) => (
                        <motion.div
                            key={event._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="sticker-card overflow-hidden flex flex-col h-full"
                        >
                            <div className="h-48 bg-gradient-to-br from-neonPurple/40 to-electricBlue/40 relative flex items-center justify-center overflow-hidden">
                                <span className="graffiti-text text-4xl opacity-20 absolute rotate-12 -right-4 -top-4">{event.title}</span>
                                <div className="p-6 text-center z-10">
                                    <h3 className="text-3xl font-black text-white drop-shadow-lg uppercase tracking-tighter">{event.title}</h3>
                                    <div className="mt-4 flex gap-2 justify-center">
                                        <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs font-bold border border-white/10">
                                            {event.eventType}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <p className="text-gray-400 line-clamp-2 mb-8">{event.description}</p>

                                <div className="space-y-4 text-sm text-gray-300 mb-8">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-hotPink" />
                                        <span>{event.date}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <MapPin size={18} className="text-electricBlue" />
                                        <span>{event.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <User size={18} className="text-limeGreen" />
                                        <span>{event.coordinatorName}</span>
                                    </div>
                                </div>

                                <div className="mt-auto flex gap-4">
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-center font-bold rounded-lg border border-white/10 transition-colors"
                                    >
                                        DETAILS
                                    </Link>
                                    <Link
                                        to={`/register?eventId=${event._id}`}
                                        className="flex-1 py-3 bg-neonPurple hover:bg-hotPink text-center font-bold rounded-lg transition-colors shadow-lg"
                                    >
                                        REGISTER
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;
