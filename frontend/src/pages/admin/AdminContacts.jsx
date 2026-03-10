import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contactService } from '../../services/api';
import { Plus, Edit2, Trash2, Camera, Link as LinkIcon } from 'lucide-react';
import Loading from '../../components/common/Loading';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        link: '',
        logo: null
    });

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const { data } = await contactService.getAll();
                if (isMounted) setContacts(data || []);
            } catch (error) {
                console.error("Admin API error:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const fetchContacts = async () => {
        try {
            const { data } = await contactService.getAll();
            setContacts(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (contact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            link: contact.link || '',
            logo: null
        });
        setPreview(`${import.meta.env.VITE_API_URL}${contact.logo}`);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this contact?')) {
            try {
                await contactService.delete(id);
                fetchContacts();
            } catch (error) {
                alert('Error deleting');
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logo: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('link', formData.link);
        if (formData.logo) {
            data.append('logo', formData.logo);
        }

        try {
            if (editingContact) {
                await contactService.update(editingContact._id, data);
            } else {
                if (!formData.logo) throw new Error('Logo is required');
                await contactService.create(data);
            }
            setShowModal(false);
            fetchContacts();
        } catch (error) {
            alert(error.message || 'Error saving contact');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black graffiti-text text-neonPurple uppercase">CONTACT ICONS</h1>
                <button
                    onClick={() => { setEditingContact(null); setPreview(null); setFormData({ name: '', link: '', logo: null }); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-neonPurple text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                    <Plus size={20} /> ADD CONTACT
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.isArray(contacts) && contacts.map((contact) => (
                    <motion.div
                        key={contact._id} layout
                        className="sticker-card p-6 flex flex-col items-center text-center group"
                    >
                        <div className="w-full h-32 rounded-xl bg-white/5 overflow-hidden mb-4 border-2 border-transparent group-hover:border-neonPurple transition-colors flex items-center justify-center p-2">
                            <img src={`${import.meta.env.VITE_API_URL}${contact.logo}`} alt={contact.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <h3 className="font-bold uppercase tracking-tight mb-2">{contact.name}</h3>
                        <div className="text-xs text-neonPurple mb-4 flex items-center justify-center gap-1 overflow-hidden max-w-full">
                            <LinkIcon size={12} className="flex-shrink-0" />
                            <a href={contact.link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{contact.link}</a>
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => handleEdit(contact)} className="p-2 text-gray-500 hover:text-white transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(contact._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 mt-16 md:mt-0">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="sticker-card w-full max-w-md bg-urbanDark p-8 relative border-t-8 border-neonPurple max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-black graffiti-text mb-8 text-neonPurple uppercase">
                                {editingContact ? 'UPDATE CONTACT' : 'ADD NEW CONTACT'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col items-center justify-center mb-6">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">CONTACT LOGO</label>
                                    <div
                                        onClick={() => document.getElementById('logo-up').click()}
                                        className="w-full h-32 rounded-xl border-4 border-dashed border-white/10 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-neonPurple transition-colors"
                                    >
                                        {preview ? (
                                            <img src={preview} className="max-w-full max-h-full object-contain p-2" />
                                        ) : (
                                            <Camera className="text-gray-600" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-xs font-bold text-white uppercase">Upload Logo</span>
                                        </div>
                                    </div>
                                    <input id="logo-up" type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">CONTACT NAME</label>
                                    <input
                                        type="text" required className="w-full"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Instagram, WhatsApp"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">CONTACT LINK</label>
                                    <input
                                        type="url" required className="w-full"
                                        value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-neonPurple text-white font-black rounded-xl shadow-lg mt-4 uppercase hover:scale-105 transition-all"
                                >
                                    {editingContact ? 'SAVE CHANGES' : 'CREATE CONTACT'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminContacts;
