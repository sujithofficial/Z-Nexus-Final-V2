import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService, eventService } from '../../services/api';
import { LayoutDashboard, Users, Calendar, Image, Shield, GraduationCap, LogOut, CheckCircle, Clock, Link as LinkIcon } from 'lucide-react';

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
        const fetchStats = async () => {
            try {
                const statsRes = await authService.getStats();
                const eventsRes = await eventService.getAll();
                setStats({
                    ...statsRes.data,
                    totalEvents: eventsRes.data.length
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    const menuItems = [
        { name: 'Events', path: '/admin/events', icon: <Calendar size={24} />, color: 'bg-neonPurple' },
        { name: 'Registrations', path: '/admin/registrations', icon: <Users size={24} />, color: 'bg-hotPink' },
        { name: 'Gallery', path: '/admin/gallery', icon: <Image size={24} />, color: 'bg-limeGreen' },
        { name: 'Association', path: '/admin/association', icon: <Shield size={24} />, color: 'bg-electricBlue' },
        { name: 'Staff', path: '/admin/staff', icon: <GraduationCap size={24} />, color: 'bg-orangeSplash' },
        { name: 'Countdown', path: '/admin/countdown', icon: <Clock size={24} />, color: 'bg-white/20' },
        { name: 'Payment QR', path: '/admin/payment', icon: <Image size={24} />, color: 'bg-orangeSplash' },
        { name: 'Partners', path: '/admin/partners', icon: <LinkIcon size={24} />, color: 'bg-electricBlue' },
    ];

    if (loading) return <div className="min-h-screen py-40 text-center font-black graffiti-text text-4xl">LOADING...</div>;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                <div>
                    <h1 className="text-5xl font-black graffiti-text text-white neon-glow-purple">DASHBOARD</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest mt-2">Welcome back, Admin</p>
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
                <StatCard title="TOTAL EVENTS" value={stats.totalEvents} icon={<Calendar />} color="border-neonPurple" />
                <StatCard title="TOTAL REGISTRATIONS" value={stats.totalRegistrations} icon={<Users />} color="border-electricBlue" />
                <StatCard title="PENDING" value={stats.pendingRegistrations} icon={<Clock />} color="border-hotPink" />
                <StatCard title="APPROVED" value={stats.approvedRegistrations} icon={<CheckCircle />} color="border-limeGreen" />
            </div>

            {/* Navigation Menu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {menuItems.map((item) => (
                    <Link key={item.name} to={item.path}>
                        <motion.div
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="sticker-card p-8 flex flex-col items-center justify-center text-center h-full border-b-8 border-transparent hover:border-white/20"
                        >
                            <div className={`${item.color} p-4 rounded-2xl mb-4 shadow-lg text-white`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight">{item.name}</h3>
                            <p className="text-xs text-gray-500 mt-2 font-bold uppercase">Manage Content</p>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`sticker-card p-8 border-l-8 ${color}`}>
        <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-black text-gray-500 tracking-widest uppercase">{title}</span>
            <div className="text-gray-600">{icon}</div>
        </div>
        <div className="text-5xl font-black graffiti-text">{value}</div>
    </div>
);

export default AdminDashboard;
