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
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-y-auto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/[0.01] blur-[150px] pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="p-10 md:p-14 w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black mb-2 text-white uppercase tracking-tighter red-gradient-animate">CONTROL</h1>
                    <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-[10px]">AUTHORIZED ACCESS ONLY</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                            <User size={12} className="opacity-75" /> USERNAME
                        </label>
                        <input
                            type="text" required
                            className="w-full bg-white/[0.03] border border-white/5 focus:border-white/20 rounded-xl px-5 py-4 text-white outline-none transition-all placeholder:text-white/10"
                            placeholder="admin"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                            <Lock size={12} className="opacity-75" /> PASSWORD
                        </label>
                        <input
                            type="password" required
                            className="w-full bg-white/[0.03] border border-white/5 focus:border-white/20 rounded-xl px-5 py-4 text-white outline-none transition-all placeholder:text-white/10"
                            placeholder="••••••••"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-500 bg-red-500/5 p-4 rounded-xl border border-red-500/10 text-xs font-bold uppercase tracking-widest"
                        >
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}

                    <button
                        type="submit" disabled={loading}
                        className="w-full py-5 bg-white text-black font-black rounded-2xl transition-all duration-500 hover:tracking-[0.1em] shadow-[0_20px_40px_rgba(255,255,255,0.05)] disabled:opacity-50 uppercase tracking-widest text-xs"
                    >
                        {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
