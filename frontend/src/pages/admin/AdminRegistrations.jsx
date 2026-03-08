import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { registrationService } from '../../services/api';
import { Check, X, Eye, Clock, AlertCircle, Phone, Mail, Award, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AdminRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReg, setSelectedReg] = useState(null);

    const [filterEvent, setFilterEvent] = useState('');
    const [filterCollege, setFilterCollege] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterYear, setFilterYear] = useState('');

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const { data } = await registrationService.getAll();
            setRegistrations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await registrationService.updateStatus(id, status);
            fetchRegistrations();
            setSelectedReg(null);
        } catch (error) {
            alert('Error updating status');
        }
    };

    const filteredRegistrations = registrations.filter(reg => {
        return (
            (filterEvent === '' || (reg.eventId?.title || '').toLowerCase().includes(filterEvent.toLowerCase())) &&
            (filterCollege === '' || (reg.college || '').toLowerCase().includes(filterCollege.toLowerCase())) &&
            (filterStatus === '' || reg.paymentStatus === filterStatus) &&
            (filterYear === '' || String(reg.year) === filterYear)
        );
    });

    const handleExport = () => {
        const exportData = filteredRegistrations.map(reg => ({
            'Participant Name': reg.name,
            'Email': reg.email,
            'Phone Number': reg.phone,
            'College Name': reg.college,
            'Department': reg.department,
            'Year of Study': reg.year,
            'Event Name': reg.eventId?.title || '',
            'Team Name': reg.teamName || 'N/A',
            'Payment Status': reg.paymentStatus
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(data, 'registrations_export.xlsx');
    };

    if (loading) return <div className="text-center py-40">Loading...</div>;

    return (
        <div className="min-h-screen py-24 container mx-auto px-6">
            <div className="mb-12">
                <h1 className="text-4xl font-black graffiti-text text-hotPink">EVENT REGISTRATIONS</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest mt-2">{filteredRegistrations.length} total entries</p>
            </div>

            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Filter by Event Name"
                    value={filterEvent}
                    onChange={e => setFilterEvent(e.target.value)}
                    className="flex-1"
                />
                <input
                    type="text"
                    placeholder="Filter by College Name"
                    value={filterCollege}
                    onChange={e => setFilterCollege(e.target.value)}
                    className="flex-1"
                />
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="flex-1 appearance-none"
                    style={{ WebkitAppearance: 'none' }}
                >
                    <option value="">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <select
                    value={filterYear}
                    onChange={e => setFilterYear(e.target.value)}
                    className="flex-1 appearance-none"
                    style={{ WebkitAppearance: 'none' }}
                >
                    <option value="">All Years</option>
                    <option value="1">Year 1</option>
                    <option value="2">Year 2</option>
                    <option value="3">Year 3</option>
                    <option value="4">Year 4</option>
                </select>
                <button
                    onClick={handleExport}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-limeGreen text-black font-black rounded-xl hover:scale-105 transition-all shadow-lg whitespace-nowrap"
                >
                    <Download size={20} /> <span className="hidden lg:inline">EXPORT TO EXCEL</span>
                </button>
            </div>

            <div className="overflow-x-auto sticker-card p-0 border-none rounded-2xl">
                <table className="w-full text-left">
                    <thead className="bg-concreteGray/50 border-b border-white/10">
                        <tr>
                            <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-500">PARTICIPANT / EVENT</th>
                            <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-500">COLLEGE</th>
                            <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-500">PAYMENT STATUS</th>
                            <th className="p-6 font-black uppercase text-xs tracking-widest text-gray-500 text-center">ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredRegistrations.map((reg) => (
                            <tr key={reg._id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6">
                                    <div className="font-bold text-lg uppercase tracking-tight">{reg.name}</div>
                                    <div className="text-xs text-hotPink font-black tracking-widest uppercase">{reg.eventId?.title}</div>
                                </td>
                                <td className="p-6">
                                    <div className="text-sm font-semibold">{reg.college}</div>
                                    <div className="text-xs text-gray-500">{reg.department} - Year {reg.year}</div>
                                </td>
                                <td className="p-6">
                                    <span className={`flex items-center gap-1 text-xs font-black uppercase ${reg.paymentStatus === 'Approved' ? 'text-limeGreen' :
                                        reg.paymentStatus === 'Rejected' ? 'text-red-500' :
                                            'text-orange-500'
                                        }`}>
                                        {reg.paymentStatus === 'Pending' && <Clock size={14} />}
                                        {reg.paymentStatus === 'Approved' && <Check size={14} />}
                                        {reg.paymentStatus === 'Rejected' && <X size={14} />}
                                        {reg.paymentStatus}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => setSelectedReg(reg)}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/5 text-sm font-bold"
                                        >
                                            <Eye size={16} /> VIEW DETAILS
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedReg && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedReg(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="sticker-card w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-urbanDark p-0 border-none relative flex flex-col md:flex-row"
                        >
                            <button
                                onClick={() => setSelectedReg(null)}
                                className="absolute top-6 right-6 z-10 text-white/50 hover:text-white bg-black/50 p-2 rounded-full"
                            >
                                <X size={28} />
                            </button>

                            {/* Payment Screenshot Side */}
                            <div className="md:w-1/2 bg-black flex items-center justify-center p-8 border-r border-white/5 min-h-[400px]">
                                <div className="relative group w-full h-full flex items-center justify-center">
                                    <img
                                        src={`http://localhost:5000${selectedReg.paymentScreenshot}`}
                                        alt="Payment Screenshot"
                                        className="max-w-full max-h-[70vh] rounded-lg shadow-2xl"
                                    />
                                    <div className="absolute top-4 left-4 px-4 py-2 bg-black/70 backdrop-blur-md rounded-full text-xs font-black tracking-widest border border-white/10">
                                        PAYMENT SCREENSHOT
                                    </div>
                                </div>
                            </div>

                            {/* Information Side */}
                            <div className="md:w-1/2 p-10 space-y-8 overflow-y-auto">
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">{selectedReg.name}</h2>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm italic">Registration Details</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">EVENT</p>
                                        <p className="font-bold text-hotPink">{selectedReg.eventId?.title}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">TEAM TYPE</p>
                                        <p className="font-bold">{selectedReg.teamName ? 'TEAM' : 'INDIVIDUAL'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">UPI ID PROVIDED</p>
                                        <p className="font-bold text-electricBlue">{selectedReg.upiId}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">STATUS</p>
                                        <p className="font-bold">{selectedReg.paymentStatus}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">CONTACT INFO</p>
                                    <div className="flex gap-4">
                                        <a href={`tel:${selectedReg.phone}`} className="flex-1 flex items-center gap-2 p-3 bg-white/5 rounded-xl text-sm font-bold border border-white/5">
                                            <Phone size={16} className="text-limeGreen" /> {selectedReg.phone}
                                        </a>
                                        <a href={`mailto:${selectedReg.email}`} className="flex-1 flex items-center gap-2 p-3 bg-white/5 rounded-xl text-sm font-bold border border-white/5">
                                            <Mail size={16} className="text-neonPurple" /> EMAIL
                                        </a>
                                    </div>
                                </div>

                                {selectedReg.teamName && (
                                    <div className="space-y-4">
                                        <p className="text-gray-600 font-black uppercase text-[10px] tracking-widest">TEAM MEMBERS ({selectedReg.teamMembers.length + 1})</p>
                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="p-3 bg-hotPink/10 border border-hotPink/20 rounded-lg text-sm font-bold">
                                                LEAD: {selectedReg.name}
                                            </div>
                                            {selectedReg.teamMembers.map((m, i) => (
                                                <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-lg text-sm font-semibold">
                                                    {m.name} ({m.department})
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-8 mt-8 border-t border-white/5 flex gap-4">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedReg._id, 'Rejected')}
                                        className="flex-1 py-4 bg-red-500/10 text-red-500 p-2 rounded-xl font-black border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        REJECT PAYMENT
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedReg._id, 'Approved')}
                                        className="flex-1 py-4 bg-limeGreen text-black p-2 rounded-xl font-black hover:scale-105 transition-all shadow-lg"
                                    >
                                        APPROVE REGISTRATION
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminRegistrations;
