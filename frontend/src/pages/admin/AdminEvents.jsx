import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService } from '../../services/api';
import { Plus, Edit2, Trash2, X, Check, AlertTriangle } from 'lucide-react';
import Loading from '../../components/common/Loading';

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        rules: '',
        venue: '',
        date: '',
        eventType: 'Individual',
        maxTeamSize: 1,
        coordinatorName: '',
        coordinatorPhone: ''
    });

    useEffect(() => {
        let isMounted = true;
        const loadInitialData = async () => {
            try {
                const { data } = await eventService.getAll();
                if (isMounted) setEvents(data);
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadInitialData();
        return () => { isMounted = false; };
    }, []);

    const fetchEvents = async () => {
        try {
            const { data } = await eventService.getAll();
            setEvents(data);
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            rules: '',
            venue: '',
            date: '',
            eventType: 'Individual',
            maxTeamSize: 1,
            coordinatorName: '',
            coordinatorPhone: ''
        });
        setEditingEvent(null);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            rules: event.rules,
            venue: event.venue,
            date: event.date,
            eventType: event.eventType,
            maxTeamSize: event.maxTeamSize,
            coordinatorName: event.coordinatorName,
            coordinatorPhone: event.coordinatorPhone
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await eventService.delete(id);
                fetchEvents();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEvent) {
                await eventService.update(editingEvent._id, formData);
            } else {
                await eventService.create(formData);
            }
            setShowModal(false);
            resetForm();
            fetchEvents();
        } catch (error) {
            alert('Error saving event');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black graffiti-text text-neonPurple">MANAGE EVENTS</h1>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-neonPurple text-white font-bold rounded-xl shadow-neon-purple hover:scale-105 transition-all"
                >
                    <Plus size={20} /> CREATE NEW EVENT
                </button>
            </div>

            <div className="overflow-x-auto sticker-card p-0 border-none rounded-2xl">
                <table className="w-full text-left">
                    <thead className="bg-concreteGray/50 border-b border-white/10">
                        <tr>
                            <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-500">EVENT TITLE</th>
                            <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-500">TYPE</th>
                            <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-500">COORDINATOR</th>
                            <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-500">STATUS</th>
                            <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-500 text-center">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {events.map((event) => (
                            <tr key={event._id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6">
                                    <div className="font-bold text-lg">{event.title}</div>
                                    <div className="text-xs text-gray-500">{event.date} @ {event.venue}</div>
                                </td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${event.eventType === 'Team' ? 'bg-hotPink/20 text-hotPink' : 'bg-electricBlue/20 text-electricBlue'}`}>
                                        {event.eventType}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="text-sm font-semibold">{event.coordinatorName}</div>
                                    <div className="text-xs text-gray-500">{event.coordinatorPhone}</div>
                                </td>
                                <td className="p-6">
                                    <span className="flex items-center gap-1 text-limeGreen text-xs font-bold">
                                        <Check size={14} /> ACTIVE
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-center gap-3">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="p-3 bg-white/5 text-gray-400 hover:text-white rounded-lg transition-colors border border-white/5"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="p-3 bg-red-500/10 text-red-500/50 hover:text-red-500 rounded-lg transition-colors border border-red-500/10"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="sticker-card w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-urbanDark p-8 sm:p-12 relative border-t-8 border-neonPurple"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-8 right-8 text-gray-500 hover:text-white"
                            >
                                <X size={32} />
                            </button>

                            <h2 className="text-3xl font-black graffiti-text mb-10 text-neonPurple uppercase">
                                {editingEvent ? 'UPDATE EVENT' : 'CREATE NEW EVENT'}
                            </h2>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">TITLE</label>
                                    <input
                                        type="text" required className="w-full" placeholder="Event Name"
                                        value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">DESCRIPTION</label>
                                    <textarea
                                        rows="3" required className="w-full" placeholder="Short description for card"
                                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">RULES (One per line)</label>
                                    <textarea
                                        rows="5" required className="w-full" placeholder="Event rules and guidelines..."
                                        value={formData.rules} onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">DATE & TIME</label>
                                    <input
                                        type="text" required className="w-full" placeholder="e.g. 25th March, 10:00 AM"
                                        value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">VENUE</label>
                                    <input
                                        type="text" required className="w-full" placeholder="e.g. Lab 4, CSE Block"
                                        value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">EVENT TYPE</label>
                                    <select
                                        className="w-full"
                                        value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                                    >
                                        <option value="Individual">Individual</option>
                                        <option value="Team">Team</option>
                                    </select>
                                </div>

                                {formData.eventType === 'Team' && (
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">MAX TEAM SIZE</label>
                                        <input
                                            type="number" required className="w-full" min="1"
                                            value={formData.maxTeamSize} onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })}
                                        />
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">COORDINATOR NAME</label>
                                    <input
                                        type="text" required className="w-full"
                                        value={formData.coordinatorName} onChange={(e) => setFormData({ ...formData, coordinatorName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">COORDINATOR PHONE</label>
                                    <input
                                        type="tel" required className="w-full"
                                        value={formData.coordinatorPhone} onChange={(e) => setFormData({ ...formData, coordinatorPhone: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="md:col-span-2 py-4 bg-neonPurple text-white font-black rounded-xl shadow-lg mt-4"
                                >
                                    {editingEvent ? 'UPDATE EVENT' : 'PUBLISH EVENT'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminEvents;
