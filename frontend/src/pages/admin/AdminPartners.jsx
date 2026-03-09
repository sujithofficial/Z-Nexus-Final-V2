import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { partnerService } from '../../services/api';
import { Plus, Edit2, Trash2, Camera, LinkIcon } from 'lucide-react';

const AdminPartners = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        website: '',
        logo: null
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const { data } = await partnerService.getAll();
            setPartners(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name,
            website: partner.website || '',
            logo: null
        });
        setPreview(`http://localhost:5000${partner.logo}`);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this partner?')) {
            try {
                await partnerService.delete(id);
                fetchPartners();
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
        if (formData.website) {
            data.append('website', formData.website);
        }
        if (formData.logo) {
            data.append('logo', formData.logo);
        }

        try {
            if (editingPartner) {
                await partnerService.update(editingPartner._id, data);
            } else {
                if (!formData.logo) throw new Error('Logo is required');
                await partnerService.create(data);
            }
            setShowModal(false);
            fetchPartners();
        } catch (error) {
            alert(error.message || 'Error saving partner');
        }
    };

    if (loading) return <div className="text-center py-40">Loading...</div>;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black graffiti-text text-hotPink uppercase">PARTNERS</h1>
                <button
                    onClick={() => { setEditingPartner(null); setPreview(null); setFormData({ name: '', website: '', logo: null }); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-hotPink text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                    <Plus size={20} /> ADD PARTNER
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {partners.map((partner) => (
                    <motion.div
                        key={partner._id} layout
                        className="sticker-card p-6 flex flex-col items-center text-center group"
                    >
                        <div className="w-full h-32 rounded-xl bg-white/5 overflow-hidden mb-4 border-2 border-transparent group-hover:border-hotPink transition-colors flex items-center justify-center p-2">
                            <img src={`http://localhost:5000${partner.logo}`} alt={partner.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <h3 className="font-bold uppercase tracking-tight mb-2">{partner.name}</h3>
                        {partner.website && (
                            <div className="text-xs text-hotPink mb-4 flex items-center justify-center gap-1">
                                <LinkIcon size={12} /> <a href={partner.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a>
                            </div>
                        )}
                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => handleEdit(partner)} className="p-2 text-gray-500 hover:text-white transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(partner._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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
                            className="sticker-card w-full max-w-md bg-urbanDark p-8 relative border-t-8 border-hotPink max-h-[90vh] overflow-y-auto"
                        >
                            <h2 className="text-2xl font-black graffiti-text mb-8 text-hotPink uppercase">
                                {editingPartner ? 'UPDATE PARTNER' : 'ADD NEW PARTNER'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex flex-col items-center justify-center mb-6">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">PARTNER LOGO</label>
                                    <div
                                        onClick={() => document.getElementById('logo-up').click()}
                                        className="w-full h-32 rounded-xl border-4 border-dashed border-white/10 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-hotPink transition-colors"
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
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">PARTNER NAME</label>
                                    <input
                                        type="text" required className="w-full"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter partner name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">WEBSITE (OPTIONAL)</label>
                                    <input
                                        type="url" className="w-full"
                                        value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-hotPink text-white font-black rounded-xl shadow-lg mt-4 uppercase hover:scale-105 transition-all"
                                >
                                    {editingPartner ? 'SAVE CHANGES' : 'CREATE PARTNER'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminPartners;
