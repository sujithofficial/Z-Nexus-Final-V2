import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService, registrationService, paymentQRService, getImageUrl } from '../services/api';
import { User, Mail, Phone, School, BookOpen, GraduationCap, Trophy, Plus, Trash2, Upload, CheckCircle2, Users } from 'lucide-react';

const Register = () => {
    const query = new URLSearchParams(useLocation().search);
    const preSelectedEventId = query.get('eventId');
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [selectedTechnicalEvent, setSelectedTechnicalEvent] = useState(null);
    const [selectedNonTechnicalEvent, setSelectedNonTechnicalEvent] = useState(null);
    const [isTeam, setIsTeam] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [paymentQR, setPaymentQR] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        department: '',
        year: '',
        eventId: preSelectedEventId || '',
        technicalEventId: '',
        nonTechnicalEventId: '',
        teamName: '',
        upiId: '',
    });

    const [teamMembers, setTeamMembers] = useState([]);
    const [screenshot, setScreenshot] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await eventService.getAll();
                setEvents(data);
                if (preSelectedEventId) {
                    const event = data.find(e => e._id === preSelectedEventId);
                    if (event?.category === 'Technical') {
                        setSelectedTechnicalEvent(event);
                        setFormData(prev => ({ ...prev, technicalEventId: preSelectedEventId, eventId: preSelectedEventId }));
                    } else if (event?.category === 'Non-Technical') {
                        setSelectedNonTechnicalEvent(event);
                        setFormData(prev => ({ ...prev, nonTechnicalEventId: preSelectedEventId, eventId: preSelectedEventId }));
                    }
                }

                try {
                    const qrRes = await paymentQRService.get();
                    // Only use dynamic QR if a real image path was stored
                    if (qrRes.data && qrRes.data.image) {
                        setPaymentQR(qrRes.data);
                    }
                } catch (qrErr) {
                    console.error("Failed to fetch payment QR:", qrErr);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchEvents();
    }, [preSelectedEventId]);

    const handleTechnicalEventChange = (e) => {
        const id = e.target.value;
        const event = events.find(ev => ev._id === id);
        setSelectedTechnicalEvent(event);
        setFormData({ ...formData, technicalEventId: id, eventId: id });
        // Only reset team if neither event is team-based
        if (event?.eventType !== 'Team' && selectedNonTechnicalEvent?.eventType !== 'Team') {
            setIsTeam(false);
            setTeamMembers([]);
        }
    };

    const handleNonTechnicalEventChange = (e) => {
        const id = e.target.value;
        const event = events.find(ev => ev._id === id);
        setSelectedNonTechnicalEvent(event);
        setFormData({ ...formData, nonTechnicalEventId: id, eventId: id });
        // Only reset team if neither event is team-based
        if (event?.eventType !== 'Team' && selectedTechnicalEvent?.eventType !== 'Team') {
            setIsTeam(false);
            setTeamMembers([]);
        }
    };

    const maxTeamSize = Math.max(
        selectedTechnicalEvent?.maxTeamSize || 1,
        selectedNonTechnicalEvent?.maxTeamSize || 1
    );

    const addTeamMember = () => {
        if (teamMembers.length + 1 < maxTeamSize) {
            setTeamMembers([...teamMembers, { name: '', college: '', department: '', phone: '' }]);
        }
    };

    const removeTeamMember = (index) => {
        const updated = teamMembers.filter((_, i) => i !== index);
        setTeamMembers(updated);
    };

    const handleMemberChange = (index, field, value) => {
        const updated = [...teamMembers];
        updated[index][field] = value;
        setTeamMembers(updated);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                teamMembers: isTeam ? teamMembers : [],
            };

            const data = new FormData();
            data.append('data', JSON.stringify(payload));
            if (screenshot) {
                data.append('screenshot', screenshot);
            } else {
                throw new Error('Please upload payment screenshot');
            }

            await registrationService.register(data);
            setSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen py-40 flex items-center justify-center container mx-auto px-4 sm:px-6 bg-black">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="sticker-card p-16 text-center max-w-2xl bg-white/[0.02] border border-white/5 rounded-[4rem] shadow-3xl relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-30 pointer-events-none" />

                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-10">
                        <CheckCircle2 size={48} className="text-white" />
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-black mb-6 uppercase tracking-tighter text-white">REGISTRATION SUCCESSFUL!</h2>
                    <p className="text-xs text-gray-300 mb-12 font-black uppercase tracking-[0.4em] leading-relaxed">
                        YOUR REGISTRATION HAS BEEN RECEIVED. <br />
                        WE WILL VERIFY YOUR PAYMENT AND CONFIRM YOUR SPOT SOON.
                    </p>
                    <button
                        onClick={() => navigate('/events')}
                        className="px-12 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.05] active:scale-[0.95] transition-all duration-700 ease-[0.16, 1, 0.3, 1] shadow-2xl"
                    >
                        GO TO EVENTS
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div id="register-top" className="min-h-screen py-32 container mx-auto px-4 sm:px-6 max-w-4xl relative overflow-hidden scroll-mt-24">
            {/* Atmosphere Layer */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.04),transparent_40%)]" />
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.03),transparent_40%)]" />
            </div>

            <div className="mb-24 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-8 leading-none tracking-tighter fast-red-gradient uppercase">
                        REGISTRATION
                    </h1>
                    <p className="text-gray-300 text-xs font-black uppercase tracking-[0.3em]">SECURE YOUR SPOT IN THE UPCOMING TECHNICAL SYMPOSIUM.</p>
                </motion.div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
                {/* Personal Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="sticker-card p-6 sm:p-12 space-y-12 bg-white/[0.02] border border-white/5 rounded-[2rem] sm:rounded-[3rem] shadow-2xl group"
                >
                    <h2 className="text-xs font-black flex items-center gap-5 text-gray-300 uppercase tracking-[0.3em]">
                        <User size={16} className="opacity-75" /> PARTICIPANT DETAILS
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">FULL NAME</label>
                            <input
                                type="text" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all placeholder:text-white/20" placeholder="John Doe"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">EMAIL ADDRESS</label>
                            <input
                                type="email" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all placeholder:text-white/20" placeholder="email@example.com"
                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">PHONE NUMBER</label>
                            <input
                                type="tel" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all placeholder:text-white/20" placeholder="+91 00000 00000"
                                value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">COLLEGE NAME</label>
                            <input
                                type="text" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all placeholder:text-white/20" placeholder="College Name"
                                value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">DEPARTMENT</label>
                            <input
                                type="text" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all placeholder:text-white/20" placeholder="e.g. CSBS, CSE"
                                value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">YEAR OF STUDY</label>
                            <div className="relative">
                                <select
                                    required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                                    value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                >
                                    <option value="" className="bg-black text-gray-300">SELECT YEAR</option>
                                    <option value="1" className="bg-black">1st Year</option>
                                    <option value="2" className="bg-black">2nd Year</option>
                                    <option value="3" className="bg-black">3rd Year</option>
                                    <option value="4" className="bg-black">4th Year</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 font-black">↓</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Event Selection Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="sticker-card p-6 sm:p-12 space-y-12 bg-white/[0.02] border border-white/5 rounded-[2rem] sm:rounded-[3rem] shadow-2xl group"
                >
                    <h2 className="text-xs font-black flex items-center gap-5 text-gray-300 uppercase tracking-[0.3em]">
                        <Trophy size={16} className="opacity-75" /> CORE SELECTION
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">SELECT TECHNICAL EVENT</label>
                            <div className="relative">
                                <select
                                    required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                                    value={formData.technicalEventId} onChange={handleTechnicalEventChange}
                                >
                                    <option value="" className="bg-black">SELECT TECHNICAL EVENT</option>
                                    {events.filter(ev => ev.category === 'Technical').map(ev => (
                                        <option key={ev._id} value={ev._id} className="bg-black">{ev.title.toUpperCase()} ({ev.eventType.toUpperCase()})</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 font-black">↓</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">SELECT NON-TECHNICAL EVENT</label>
                            <div className="relative">
                                <select
                                    required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all appearance-none cursor-pointer"
                                    value={formData.nonTechnicalEventId} onChange={handleNonTechnicalEventChange}
                                >
                                    <option value="" className="bg-black">SELECT NON-TECHNICAL EVENT</option>
                                    {events.filter(ev => ev.category === 'Non-Technical').map(ev => (
                                        <option key={ev._id} value={ev._id} className="bg-black">{ev.title.toUpperCase()} ({ev.eventType.toUpperCase()})</option>
                                    ))}
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 font-black">↓</div>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {(selectedTechnicalEvent?.eventType === 'Team' || selectedNonTechnicalEvent?.eventType === 'Team') && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="pt-6"
                            >
                                <label className="flex items-center gap-6 cursor-pointer group w-fit">
                                    <div className="relative">
                                        <input
                                            type="checkbox" className="sr-only"
                                            checked={isTeam} onChange={(e) => setIsTeam(e.target.checked)}
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-all duration-500 border border-white/10 ${isTeam ? 'bg-white' : 'bg-white/5'}`}>
                                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-500 ${isTeam ? 'left-7 bg-black' : 'left-1 bg-white/20'}`} />
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-white uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">REGISTER AS A TEAM</span>
                                </label>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Team Details (Conditional) */}
                <AnimatePresence>
                    {isTeam && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, scale: 0.97 }}
                            animate={{ height: 'auto', opacity: 1, scale: 1 }}
                            exit={{ height: 0, opacity: 0, scale: 0.97 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="sticker-card p-6 sm:p-12 space-y-12 bg-white/[0.02] border border-white/5 rounded-[2rem] sm:rounded-[3rem] shadow-2xl mb-12">
                                <h2 className="text-xs font-black flex items-center gap-5 text-gray-300 uppercase tracking-[0.3em]">
                                    <Users size={16} className="opacity-75" /> TEAM COMPOSITION
                                </h2>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">TEAM NAME</label>
                                    <input
                                        type="text" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all placeholder:text-white/5" placeholder="Team Name"
                                        value={formData.teamName} onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-10">
                                    <div className="flex justify-between items-center px-1">
                                        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">TEAM MEMBERS ({teamMembers.length + 1}/{maxTeamSize})</h3>
                                        {teamMembers.length + 1 < maxTeamSize && (
                                            <button
                                                type="button" onClick={addTeamMember}
                                                className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all duration-300"
                                            >
                                                <Plus size={14} className="opacity-75" /> ADD MEMBER
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-8">
                                        {teamMembers.map((member, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className="p-10 bg-white/[0.01] rounded-[2rem] border border-white/5 relative group/member"
                                            >
                                                <button
                                                    type="button" onClick={() => removeTeamMember(idx)}
                                                    className="absolute top-8 right-8 text-white/10 hover:text-white transition-all active:scale-90"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <h4 className="text-[9px] font-black text-white/10 mb-8 tracking-[0.5em] uppercase">TEAM MEMBER #{idx + 2}</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <input
                                                        type="text" placeholder="NAME" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/10 rounded-xl px-5 py-4 text-xs text-white outline-none transition-all placeholder:text-white/5"
                                                        value={member.name} onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                    />
                                                    <input
                                                        type="text" placeholder="DEPARTMENT" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/10 rounded-xl px-5 py-4 text-xs text-white outline-none transition-all placeholder:text-white/5"
                                                        value={member.department} onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                                                    />
                                                    <input
                                                        type="text" placeholder="COLLEGE" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/10 rounded-xl px-5 py-4 text-xs text-white outline-none transition-all placeholder:text-white/5"
                                                        value={member.college} onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                                                    />
                                                    <input
                                                        type="tel" placeholder="PHONE" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/10 rounded-xl px-5 py-4 text-xs text-white outline-none transition-all placeholder:text-white/5"
                                                        value={member.phone} onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Payment Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="sticker-card p-6 sm:p-12 space-y-16 bg-white/[0.02] border border-white/5 rounded-[2rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden"
                >
                    <h2 className="text-xs font-black flex items-center gap-5 text-gray-300 uppercase tracking-[0.3em] relative z-10">
                        <Upload size={16} className="opacity-75" /> PAYMENT VERIFICATION
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
                        <div className="space-y-12">
                            <div className="p-12 bg-white/3 rounded-[2.5rem] space-y-8 border border-white/5 text-center relative overflow-hidden group/qr">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">PAYMENT QR CODE</p>
                                <div className="w-52 h-52 bg-white mx-auto flex items-center justify-center rounded-[2.5rem] p-6 shadow-3xl relative z-10 scale-100 group-hover/qr:scale-[1.03] transition-transform duration-700 ease-[0.16, 1, 0.3, 1]">
                                    {paymentQR && paymentQR.image ? (
                                        <img src={getImageUrl(paymentQR.image)} alt="Payment QR" className="w-full h-full object-contain" />
                                    ) : (
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=znexus2026@upi&pn=ZNexus" alt="QR Code" className="w-full h-full" />
                                    )}
                                </div>
                                <div className="space-y-3 relative z-10">
                                    <p className="font-black text-white text-[10px] tracking-[0.2em] break-all cursor-pointer hover:text-white/60 transition-colors uppercase">
                                        {paymentQR && paymentQR.text ? paymentQR.text : 'znexus2026@upi'}
                                    </p>
                                    <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">CLICK TO COPY UPI ID</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1">UPI TRANSACTION ID</label>
                                <input
                                    type="text" required className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 rounded-2xl px-6 py-5 text-sm text-white outline-none transition-all placeholder:text-white/5 uppercase tracking-[0.2em]" placeholder="E.G. TXN8945723165"
                                    value={formData.upiId} onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] ml-1 block">UPLOAD RECEIPT</label>
                            <div
                                onClick={() => document.getElementById('screenshot').click()}
                                className={`h-96 border border-dashed rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-1000 ease-[0.16, 1, 0.3, 1] overflow-hidden relative group ${preview ? 'border-white/20' : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10'}`}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center">
                                            <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] underline underline-offset-8">CHANGE FILE</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-12 relative z-10">
                                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-700 ease-[0.16, 1, 0.3, 1]">
                                            <Upload size={24} className="text-white/40" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">UPLOAD SCREENSHOT</p>
                                        <p className="text-[9px] text-white/20 mt-4 uppercase tracking-[0.3em]">MAX_FILE_SIZE: 5.0MB</p>
                                    </div>
                                )}
                            </div>
                            <input
                                id="screenshot" type="file" hidden accept="image/*" required
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 bg-white text-black rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl"
                    >
                        REGISTRATION ERROR: {error}
                    </motion.div>
                )}

                <button
                    type="submit" disabled={loading}
                    className="w-full py-10 bg-white text-black font-black text-xl md:text-2xl rounded-3xl transition-all duration-700 ease-[0.16, 1, 0.3, 1] hover:scale-[1.02] active:scale-[0.98] shadow-[0_30px_60px_rgba(255,255,255,0.1)] hover:shadow-[0_40px_80px_rgba(255,255,255,0.15)] disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-tighter"
                >
                    {loading ? 'PROCESSING...' : 'REGISTER NOW'}
                </button>
            </form>
        </div>
    );
};

export default Register;
