import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService, eventService } from '../../services/api';
import { Users, Calendar, Image, Shield, GraduationCap, LogOut, CheckCircle, Clock, Link as LinkIcon } from 'lucide-react';
import Loading from '../../components/common/Loading';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        pendingRegistrations: 0,
        approvedRegistrations: 0,
        totalEvents: 0
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        const fetchStats = async () => {
            try {
                const [statsRes, eventsRes] = await Promise.all([
                    authService.getStats(),
                    eventService.getAll()
                ]);

                if (isMounted) {
                    setStats({
                        ...statsRes.data || {},
                        totalEvents: (eventsRes.data || []).length
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchStats();
        return () => { isMounted = false; };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/system-access');
    };

    const menuItems = [
        { name: 'Events', path: '/admin/events', icon: <Calendar size={24} />, color: 'bg-white/5' },
        { name: 'Registrations', path: '/admin/registrations', icon: <Users size={24} />, color: 'bg-white/5' },
        { name: 'Gallery', path: '/admin/gallery', icon: <Image size={24} />, color: 'bg-white/5' },
        { name: 'Association', path: '/admin/association', icon: <Shield size={24} />, color: 'bg-white/5' },
        { name: 'Staff', path: '/admin/staff', icon: <GraduationCap size={24} />, color: 'bg-white/5' },
        { name: 'Countdown', path: '/admin/countdown', icon: <Clock size={24} />, color: 'bg-white/5' },
        { name: 'Payment QR', path: '/admin/payment', icon: <Image size={24} />, color: 'bg-white/5' },
        { name: 'Partners', path: '/admin/partners', icon: <LinkIcon size={24} />, color: 'bg-white/5' },
        { name: 'Contacts', path: '/admin/contacts', icon: <Users size={24} />, color: 'bg-white/5' },
    ];

    if (loading) return <Loading />;

    try {
        return (
            <div className="min-h-screen py-16 md:py-24 container mx-auto px-4 md:px-6 overflow-x-hidden overflow-y-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                    <div>
                        <h1 className="text-5xl font-black text-white red-gradient-animate uppercase">DASHBOARD</h1>
                        <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] mt-4">Authorized Admin Access</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/50 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
                    >
                        <LogOut size={20} /> LOGOUT
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    <StatCard title="TOTAL EVENTS" value={stats.totalEvents} icon={<Calendar />} color="border-white/10" />
                    <StatCard title="TOTAL REGISTRATIONS" value={stats.totalRegistrations} icon={<Users />} color="border-white/10" />
                    <StatCard title="PENDING" value={stats.pendingRegistrations} icon={<Clock />} color="border-white/10" />
                    <StatCard title="APPROVED" value={stats.approvedRegistrations} icon={<CheckCircle />} color="border-white/10" />
                </div>

                {/* Navigation Menu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {menuItems.map((item) => (
                        <Link key={item.name} to={item.path}>
                            <motion.div
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="sticker-card p-8 flex flex-col items-center justify-center text-center h-full border-b-8 border-white/5 hover:border-white/20 group"
                            >
                                <div className={`${item.color} p-4 rounded-2xl mb-4 shadow-lg text-white/40 group-hover:text-white transition-colors`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tight text-white/60 group-hover:text-white transition-colors">{item.name}</h3>
                                <p className="text-[9px] text-white/10 mt-3 font-black uppercase tracking-widest">Manage Content</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error("Admin Dashboard render error:", error);
        return <div className="min-h-screen flex items-center justify-center text-white">Admin panel error occurred. Check console for details.</div>;
    }
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`sticker-card p-8 border-l-8 ${color}`}>
        <div className="flex justify-between items-center mb-4">
            <span className="text-[9px] font-black text-white/20 tracking-[0.3em] uppercase">{title}</span>
            <div className="text-white/10">{icon}</div>
        </div>
        <div className="text-5xl font-black">{value}</div>
    </div>
);

export default AdminDashboard;
