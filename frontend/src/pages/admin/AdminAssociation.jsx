import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { associationService } from '../../services/api';
import { Plus, Edit2, Trash2, X, Shield, Camera } from 'lucide-react';
import Loading from '../../components/common/Loading';

const AdminAssociation = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        contact: '',
        photo: null
    });

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const { data } = await associationService.getAll();
                if (isMounted) setMembers(data || []);
            } catch (error) {
                console.error("Admin API error:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, []);

    const fetchMembers = async () => {
        try {
            const { data } = await associationService.getAll();
            setMembers(data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            contact: member.contact || '',
            photo: null
        });
        setPreview(`http://localhost:5000${member.photo}`);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this member?')) {
            try {
                await associationService.delete(id);
                fetchMembers();
            } catch (error) {
                alert('Error deleting');
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('role', formData.role);
        data.append('contact', formData.contact);
        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        try {
            if (editingMember) {
                await associationService.update(editingMember._id, data);
            } else {
                if (!formData.photo) throw new Error('Photo is required');
                await associationService.create(data);
            }
            setShowModal(false);
            fetchMembers();
        } catch (error) {
            alert(error.message || 'Error saving member');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black graffiti-text text-electricBlue uppercase">STUDENT ASSOCIATION</h1>
                <button
                    onClick={() => { setEditingMember(null); setPreview(null); setFormData({ name: '', role: '', contact: '', photo: null }); setShowModal(true); }}
                    className="flex items-center gap-2 px-6 py-3 bg-electricBlue text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                >
                    <Plus size={20} /> ADD MEMBER
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.isArray(members) && members.map((member) => (
                    <motion.div
                        key={member._id} layout
                        className="sticker-card p-6 flex flex-col items-center text-center group"
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-electricBlue transition-colors">
                            <img src={`http://localhost:5000${member.photo}`} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-bold uppercase tracking-tight">{member.name}</h3>
                        <p className="text-xs text-electricBlue font-black uppercase mb-4 tracking-widest">{member.role}</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(member)} className="p-2 text-gray-500 hover:text-white transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(member._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="sticker-card w-full max-w-md bg-urbanDark p-8 relative border-t-8 border-electricBlue"
                        >
                            <h2 className="text-2xl font-black graffiti-text mb-8 text-electricBlue uppercase">
                                {editingMember ? 'UPDATE MEMBER' : 'ADD NEW MEMBER'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="flex justify-center mb-6">
                                    <div
                                        onClick={() => document.getElementById('photo-up').click()}
                                        className="w-32 h-32 rounded-full border-4 border-dashed border-white/10 flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-electricBlue transition-colors"
                                    >
                                        {preview ? (
                                            <img src={preview} className="w-full h-full object-cover" />
                                        ) : (
                                            <Camera className="text-gray-600" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <span className="text-[10px] font-bold">UPLOAD</span>
                                        </div>
                                    </div>
                                    <input id="photo-up" type="file" hidden accept="image/*" onChange={handleFileChange} />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">NAME</label>
                                    <input
                                        type="text" required className="w-full"
                                        value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">ROLE</label>
                                    <select
                                        required className="w-full"
                                        value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="">Select Role</option>
                                        <option value="President">President</option>
                                        <option value="Vice President">Vice President</option>
                                        <option value="Secretary">Secretary</option>
                                        <option value="Joint Secretary">Joint Secretary</option>
                                        <option value="Treasurer">Treasurer</option>
                                        <option value="Media Member">Media Member</option>
                                        <option value="Event Coordinator">Event Coordinator</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">CONTACT (OPTIONAL)</label>
                                    <input
                                        type="tel" className="w-full"
                                        value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-electricBlue text-white font-black rounded-xl shadow-lg mt-4"
                                >
                                    SAVE MEMBER
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminAssociation;
