import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/association" element={<AssociationMembers />} />
                    <Route path="/staff" element={<StaffCoordinators />} />
                    <Route path="/gallery" element={<Gallery />} />

                    <Route path="/admin/login" element={<AdminLogin />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/events" element={<AdminEvents />} />
                        <Route path="/admin/registrations" element={<AdminRegistrations />} />
                        <Route path="/admin/gallery" element={<AdminGallery />} />
                        <Route path="/admin/association" element={<AdminAssociation />} />
                        <Route path="/admin/staff" element={<AdminStaff />} />
                        <Route path="/admin/countdown" element={<AdminCountdown />} />
                        <Route path="/admin/payment" element={<AdminPaymentQR />} />
                        <Route path="/admin/partners" element={<AdminPartners />} />
                    </Route>
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
