import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Register from './pages/Register';
import AssociationMembers from './pages/AssociationMembers';
import StaffCoordinators from './pages/StaffCoordinators';
import Gallery from './pages/Gallery';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import AdminGallery from './pages/admin/AdminGallery';
import AdminAssociation from './pages/admin/AdminAssociation';
import AdminStaff from './pages/admin/AdminStaff';
import AdminCountdown from './pages/admin/AdminCountdown';
import AdminPaymentQR from './pages/admin/AdminPaymentQR';
import AdminPartners from './pages/admin/AdminPartners';
import AdminContacts from './pages/admin/AdminContacts';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX;
            const y = e.clientY;
            document.documentElement.style.setProperty('--mouse-x', `${x}px`);
            document.documentElement.style.setProperty('--mouse-y', `${y}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Global Initial Loader Timer
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1800);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(timer);
        };
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden overflow-y-auto selection:bg-white selection:text-black bg-black">
            <div className="atmosphere-overlay" />

            <Navbar />
            <main className="flex-grow pt-24 sm:pt-20 relative">
                <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_40%)]" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.03),transparent_50%)]" />
                </div>

                <ScrollToTop />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/association" element={<AssociationMembers />} />
                    <Route path="/staff" element={<StaffCoordinators />} />
                    <Route path="/gallery" element={<Gallery />} />

                    <Route path="/system-access" element={<AdminLogin />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/events" element={<AdminEvents />} />
                        <Route path="/admin/registrations" element={<AdminRegistrations />} />
                        <Route path="/admin/gallery" element={<AdminGallery />} />
                        <Route path="/admin/association" element={<AdminAssociation />} />
                        <Route path="/admin/staff" element={<AdminStaff />} />
                        <Route path="/admin/countdown" element={<AdminCountdown />} />
                        <Route path="/admin/payment" element={<AdminPaymentQR />} />
                        <Route path="/admin/partners" element={<AdminPartners />} />
                        <Route path="/admin/contacts" element={<AdminContacts />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
