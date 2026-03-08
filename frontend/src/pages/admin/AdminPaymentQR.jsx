import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { paymentQRService } from '../../services/api';
import { Camera, Save } from 'lucide-react';

const AdminPaymentQR = () => {
    const [currentQR, setCurrentQR] = useState({ image: '', text: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [upiText, setUpiText] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        loadQR();
    }, []);

    const loadQR = async () => {
        try {
            const { data } = await paymentQRService.get();
            const safe = data && typeof data === 'object' ? data : { image: '', text: '' };
            setCurrentQR(safe);
            setUpiText(safe.text || '');
            if (safe.image) {
                setPreview(`http://localhost:5000${safe.image}`);
            }
        } catch (err) {
            console.error('Failed to load QR:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!imageFile && !currentQR.image) {
            alert('Please upload a QR image first');
            return;
        }
        setSaving(true);
        try {
            const form = new FormData();
            // Field names match the backend route: image + text
            if (imageFile) form.append('image', imageFile);
            form.append('text', upiText || '');

            const { data } = await paymentQRService.save(form);
            setCurrentQR(data);
            setImageFile(null);
            alert('QR saved successfully!');
        } catch (err) {
            console.error('Save failed:', err.message);
            alert('Error saving QR: ' + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-40 font-black graffiti-text text-4xl">LOADING...</div>;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="mb-12">
                <h1 className="text-4xl font-black graffiti-text text-hotPink uppercase">PAYMENT QR MANAGEMENT</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest mt-2">Upload QR code and UPI ID for the Register page</p>
            </div>

            <div className="max-w-xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticker-card p-8 border-t-8 border-hotPink space-y-8"
                >
                    <form onSubmit={handleSave} className="space-y-8">
                        {/* QR Image Upload */}
                        <div className="space-y-4">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">QR CODE IMAGE</label>
                            <div
                                onClick={() => document.getElementById('qr-upload-input').click()}
                                className="w-56 h-56 mx-auto bg-white/5 border-4 border-dashed border-white/20 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden relative group hover:border-hotPink transition-colors p-2"
                            >
                                {preview ? (
                                    <img src={preview} className="w-full h-full object-contain bg-white rounded-xl" alt="QR Preview" />
                                ) : (
                                    <div className="text-center">
                                        <Camera className="text-gray-500 mx-auto mb-2" size={40} />
                                        <span className="text-xs font-bold text-gray-500">CLICK TO UPLOAD QR</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                    <span className="text-sm font-bold tracking-widest">CHANGE IMAGE</span>
                                </div>
                            </div>
                            <input
                                id="qr-upload-input"
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* UPI ID Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">UPI ID</label>
                            <input
                                type="text"
                                className="w-full"
                                placeholder="e.g. znexus2026@upi"
                                value={upiText || ''}
                                onChange={(e) => setUpiText(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-4 bg-hotPink text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            <Save size={20} />
                            {saving ? 'SAVING...' : 'SAVE QR CONFIGURATION'}
                        </button>
                    </form>

                    {currentQR.text && (
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">CURRENTLY ACTIVE</p>
                            <p className="font-bold text-electricBlue">UPI ID: {currentQR.text}</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminPaymentQR;
