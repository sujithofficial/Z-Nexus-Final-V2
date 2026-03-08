import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/api';
import { Lock, User, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await authService.login({ username, password });
            localStorage.setItem('adminInfo', JSON.stringify(data));
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 blur-[150px] pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonPurple rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electricBlue rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticker-card p-12 w-full max-w-md bg-urbanDark/80 backdrop-blur-xl border-t-8 border-neonPurple"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black graffiti-text mb-2 text-neonPurple uppercase">CONTROL CENTER</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Authorized Access Only</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <User size={14} className="text-neonPurple" /> USERNAME
                        </label>
                        <input
                            type="text" required
                            className="w-full bg-black/50 border-white/10 focus:border-neonPurple"
                            placeholder="admin"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Lock size={14} className="text-neonPurple" /> PASSWORD
                        </label>
                        <input
                            type="password" required
                            className="w-full bg-black/50 border-white/10 focus:border-neonPurple"
                            placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-hotPink bg-hotPink/10 p-3 rounded-lg border border-hotPink/20 text-sm font-bold animate-shake">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-4 bg-neonPurple text-white font-black rounded-xl paint-btn shadow-neon-purple mt-4 disabled:opacity-50"
                    >
                        {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
