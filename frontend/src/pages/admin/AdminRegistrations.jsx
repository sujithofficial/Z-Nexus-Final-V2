import React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { registrationService, getImageUrl } from '../../services/api';
import { Check, X, Eye, Clock, AlertCircle, Phone, Mail, Award, Download } from 'lucide-react';
import Loading from '../../components/common/Loading';
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
        let isMounted = true;
        const loadInitialData = async () => {
            try {
                const { data } = await registrationService.getAll();
                if (isMounted) setRegistrations(data);
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadInitialData();
        return () => { isMounted = false; };
    }, []);

    const fetchRegistrations = async () => {
        try {
            const { data } = await registrationService.getAll();
            setRegistrations(data);
        } catch (error) {
            console.error(error);
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

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen py-16 md:py-24 container mx-auto px-4 md:px-6 overflow-x-hidden overflow-y-auto">
            <div className="mb-10 md:mb-12 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-black text-white red-gradient-animate uppercase">EVENT REGISTRATIONS</h1>
                <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-[10px] mt-4">{filteredRegistrations.length} TOTAL ENTRIES</p>
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
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-black font-black rounded-xl hover:scale-105 transition-all shadow-2xl whitespace-nowrap text-[10px] tracking-widest uppercase"
                >
                    <Download size={20} /> <span className="hidden lg:inline">EXPORT EXCEL</span>
                </button>
            </div>

            <div className="overflow-x-auto sticker-card p-0 border-none rounded-2xl">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">PARTICIPANT / EVENT</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">COLLEGE</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300">PAYMENT STATUS</th>
                            <th className="p-6 font-black uppercase text-[10px] tracking-[0.3em] text-gray-300 text-center">ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredRegistrations.map((reg) => (
                            <tr key={reg._id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6">
                                    <div className="font-bold text-lg uppercase tracking-tight">{reg.name}</div>
                                    <div className="text-[10px] text-gray-300 font-black tracking-widest uppercase">{reg.eventId?.title}</div>
                                </td>
                                <td className="p-6">
                                    <div className="text-sm font-semibold">{reg.college}</div>
                                    <div className="text-xs text-gray-300">{reg.department} - Year {reg.year}</div>
                                </td>
                                <td className="p-6">
                                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${reg.paymentStatus === 'Approved' ? 'text-white' :
                                        reg.paymentStatus === 'Rejected' ? 'text-white/40' :
                                            'text-white/60 animate-pulse'
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedReg(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-md"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="sticker-card w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-black p-0 border-none relative flex flex-col md:flex-row shadow-[0_40px_100px_rgba(255,255,255,0.05)]"
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
                                        src={getImageUrl(selectedReg.paymentScreenshot)}
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
                                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-1 red-gradient-animate">{selectedReg.name}</h2>
                                    <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-[9px] italic">Registration Details</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 text-sm">
                                    <div className="space-y-1">
                                        <p className="font-black text-white/80 tracking-tight">{selectedReg.eventId?.title}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest">TEAM TYPE</p>
                                        <p className="font-bold">{selectedReg.teamName ? 'TEAM' : 'INDIVIDUAL'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-black text-gray-300 tracking-widest">{selectedReg.upiId}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest">STATUS</p>
                                        <p className="font-bold">{selectedReg.paymentStatus}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest">CONTACT INFO</p>
                                    <div className="flex gap-4">
                                        <a href={`tel:${selectedReg.phone}`} className="flex-1 flex items-center justify-center gap-2 p-4 bg-white/5 rounded-xl text-[10px] font-black tracking-widest border border-white/5 uppercase hover:bg-white/10 transition-colors">
                                            <Phone size={14} className="opacity-75" /> {selectedReg.phone}
                                        </a>
                                        <a href={`mailto:${selectedReg.email}`} className="flex-1 flex items-center justify-center gap-2 p-4 bg-white/5 rounded-xl text-[10px] font-black tracking-widest border border-white/5 uppercase hover:bg-white/10 transition-colors">
                                            <Mail size={14} className="opacity-75" /> EMAIL
                                        </a>
                                    </div>
                                </div>

                                {selectedReg.teamName && (
                                    <div className="space-y-4">
                                        <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest">TEAM MEMBERS ({selectedReg.teamMembers.length + 1})</p>
                                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="p-4 bg-white/10 border border-white/5 rounded-xl text-[10px] font-black tracking-widest uppercase">
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

                                <div className="pt-8 mt-auto border-t border-white/5 flex gap-4">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedReg._id, 'Rejected')}
                                        className="flex-1 py-5 bg-white/5 text-gray-300 rounded-2xl font-black border border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all text-[10px] tracking-widest uppercase"
                                    >
                                        REJECT REGISTRATION
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedReg._id, 'Approved')}
                                        className="flex-1 py-5 bg-white text-black rounded-2xl font-black hover:scale-[1.03] active:scale-[0.97] transition-all shadow-2xl text-[10px] tracking-widest uppercase"
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
