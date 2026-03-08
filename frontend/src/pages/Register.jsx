import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { eventService, registrationService, paymentQRService } from '../services/api';
import { User, Mail, Phone, School, BookOpen, GraduationCap, Trophy, Plus, Trash2, Upload, CheckCircle2, Users } from 'lucide-react';

const Register = () => {
    const query = new URLSearchParams(useLocation().search);
    const preSelectedEventId = query.get('eventId');
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
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
                    setSelectedEvent(event);
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

    const handleEventChange = (e) => {
        const id = e.target.value;
        const event = events.find(ev => ev._id === id);
        setSelectedEvent(event);
        setFormData({ ...formData, eventId: id });
        setIsTeam(false);
        setTeamMembers([]);
    };

    const addTeamMember = () => {
        if (teamMembers.length + 1 < (selectedEvent?.maxTeamSize || 1)) {
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
            <div className="min-h-screen py-40 flex items-center justify-center container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="sticker-card p-12 text-center max-w-2xl bg-limeGreen/10 border-limeGreen/50"
                >
                    <CheckCircle2 size={80} className="text-limeGreen mx-auto mb-6" />
                    <h2 className="text-4xl font-black mb-4 graffiti-text">REGISTRATION SUCCESSFUL!</h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Your registration is pending verification. We will notify you once it's approved.
                    </p>
                    <button
                        onClick={() => navigate('/events')}
                        className="px-10 py-4 bg-limeGreen text-black font-bold rounded-xl"
                    >
                        GO TO EVENTS
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-24 container mx-auto px-6 max-w-4xl">
            <div className="mb-16 text-center">
                <h1 className="text-5xl md:text-7xl font-bold graffiti-text mb-4 neon-glow-purple">JOIN THE NEXUS</h1>
                <p className="text-gray-400">Lock in your spot and show what you're made of.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Details Card */}
                <div className="sticker-card p-8 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                        <User className="text-neonPurple" /> LEAD PARTICIPANT DETAILS
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">FULL NAME</label>
                            <input
                                type="text" required className="w-full" placeholder="Enter your full name"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">EMAIL ADDRESS</label>
                            <input
                                type="email" required className="w-full" placeholder="example@email.com"
                                value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">PHONE NUMBER</label>
                            <input
                                type="tel" required className="w-full" placeholder="10-digit number"
                                value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">COLLEGE NAME</label>
                            <input
                                type="text" required className="w-full" placeholder="Enter college name"
                                value={formData.college} onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">DEPARTMENT</label>
                            <input
                                type="text" required className="w-full" placeholder="e.g. CSE, IT"
                                value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">YEAR OF STUDY</label>
                            <select
                                required className="w-full"
                                value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            >
                                <option value="">Select Year</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Event Selection Card */}
                <div className="sticker-card p-8 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                        <Trophy className="text-electricBlue" /> EVENT SELECTION
                    </h2>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-400">SELECT EVENT</label>
                        <select
                            required className="w-full"
                            value={formData.eventId} onChange={handleEventChange}
                        >
                            <option value="">Choose an event</option>
                            {events.map(ev => (
                                <option key={ev._id} value={ev._id}>{ev.title} ({ev.eventType})</option>
                            ))}
                        </select>
                    </div>

                    {selectedEvent?.eventType === 'Team' && (
                        <div className="pt-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox" className="w-5 h-5 accent-neonPurple"
                                    checked={isTeam} onChange={(e) => setIsTeam(e.target.checked)}
                                />
                                <span className="font-bold text-lg group-hover:text-neonPurple transition-colors">REGISTER AS TEAM</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Team Details (Conditional) */}
                <AnimatePresence>
                    {isTeam && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="sticker-card p-8 space-y-8 mt-8 border-l-8 border-hotPink">
                                <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                                    <Users className="text-hotPink" /> TEAM COMPOSITION
                                </h2>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-400">TEAM NAME</label>
                                    <input
                                        type="text" required className="w-full" placeholder="Enter team name"
                                        value={formData.teamName} onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-gray-400">ADDITIONAL MEMBERS ({teamMembers.length + 1}/{selectedEvent?.maxTeamSize})</h3>
                                        {teamMembers.length + 1 < (selectedEvent?.maxTeamSize || 1) && (
                                            <button
                                                type="button" onClick={addTeamMember}
                                                className="flex items-center gap-2 text-hotPink hover:text-white transition-colors text-sm font-bold"
                                            >
                                                <Plus size={18} /> ADD MEMBER
                                            </button>
                                        )}
                                    </div>

                                    {teamMembers.map((member, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-6 bg-black/40 rounded-xl space-y-4 border border-white/5 relative group"
                                        >
                                            <button
                                                type="button" onClick={() => removeTeamMember(idx)}
                                                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                            <h4 className="font-bold text-hotPink">MEMBER #{idx + 2}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    type="text" placeholder="Name" required className="text-sm"
                                                    value={member.name} onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                                                />
                                                <input
                                                    type="text" placeholder="Department" required className="text-sm"
                                                    value={member.department} onChange={(e) => handleMemberChange(idx, 'department', e.target.value)}
                                                />
                                                <input
                                                    type="text" placeholder="College" required className="text-sm"
                                                    value={member.college} onChange={(e) => handleMemberChange(idx, 'college', e.target.value)}
                                                />
                                                <input
                                                    type="tel" placeholder="Phone" required className="text-sm"
                                                    value={member.phone} onChange={(e) => handleMemberChange(idx, 'phone', e.target.value)}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Payment Section */}
                <div className="sticker-card p-8 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 bg-orangeSplash text-white font-black skew-x-12 translate-x-4 -translate-y-2">PAYMENT</div>

                    <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-white/10 pb-4">
                        VERIFICATION
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="p-6 bg-white/5 rounded-2xl space-y-4 border-2 border-dashed border-white/10">
                                <p className="text-sm font-bold text-gray-400">SCAN & PAY</p>
                                <div className="w-48 h-48 bg-white mx-auto flex items-center justify-center rounded-xl p-2">
                                    {paymentQR && paymentQR.image ? (
                                        <img src={`http://localhost:5000${paymentQR.image}`} alt="Payment QR" className="w-full h-full object-contain" />
                                    ) : (
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=znexus2026@upi&pn=ZNexus" alt="QR Code" className="w-full h-full" />
                                    )}
                                </div>
                                <p className="text-center font-bold text-electricBlue">UPI ID: {paymentQR && paymentQR.text ? paymentQR.text : 'znexus2026@upi'}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-400">YOUR UPI ID (USED FOR PAYMENT)</label>
                                <input
                                    type="text" required className="w-full" placeholder="e.g. user@okaxis"
                                    value={formData.upiId} onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-gray-400">UPLOAD PAYMENT SCREENSHOT</label>
                            <div
                                onClick={() => document.getElementById('screenshot').click()}
                                className={`h-64 border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${preview ? 'border-limeGreen/50 bg-limeGreen/5' : 'border-white/10 hover:border-neonPurple/50 hover:bg-white/5'}`}
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="h-full w-full object-contain p-4 rounded-3xl" />
                                ) : (
                                    <>
                                        <Upload size={48} className="text-gray-600 mb-4" />
                                        <p className="text-gray-500 font-bold">CLICK TO UPLOAD</p>
                                        <p className="text-xs text-gray-600">JPG, PNG allowed</p>
                                    </>
                                )}
                            </div>
                            <input
                                id="screenshot" type="file" hidden accept="image/*" required
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg text-center font-bold">
                        {error}
                    </div>
                )}

                <button
                    type="submit" disabled={loading}
                    className="w-full py-6 bg-neonPurple text-white font-black text-2xl rounded-2xl paint-btn shadow-neon-purple disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? 'PROCESSING...' : 'COMPLETE REGISTRATION'}
                </button>
            </form>
        </div>
    );
};

export default Register;
