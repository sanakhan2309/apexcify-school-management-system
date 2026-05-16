import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileEdit, CheckCircle, XCircle, Clock, Plus, X } from 'lucide-react';

const LeaveApplication = () => {
    const [leaves, setLeaves] = useState([]);
    const [allLeaves, setAllLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));
    const isAdminOrTeacher = user.role === 'Admin' || user.role === 'Teacher';

    const fetchLeaves = async () => {
        try {
            const endpoint = isAdminOrTeacher ? 'http://localhost:5000/api/leaves/all' : 'http://localhost:5000/api/leaves/my-leaves';
            const res = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            if (isAdminOrTeacher) setAllLeaves(res.data);
            else setLeaves(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/leaves/apply', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setIsModalOpen(false);
            setFormData({ startDate: '', endDate: '', reason: '' });
            fetchLeaves();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply for leave');
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/leaves/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchLeaves();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Leave Applications</h1>
                    <p className="text-slate-400 mt-1">
                        {isAdminOrTeacher ? 'Review and manage leave requests.' : 'Apply for and track your leave requests.'}
                    </p>
                </div>
                {!isAdminOrTeacher && (
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary flex items-center gap-2 px-6"
                    >
                        <Plus className="w-5 h-5" />
                        Apply for Leave
                    </button>
                )}
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            {isAdminOrTeacher && <th className="px-6 py-4 text-sm font-semibold text-slate-300">User</th>}
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Period</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Reason</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-center">Status</th>
                            {isAdminOrTeacher && <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {(isAdminOrTeacher ? allLeaves : leaves).map((leave) => (
                            <tr key={leave._id} className="hover:bg-white/[0.02]">
                                {isAdminOrTeacher && (
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{leave.user?.name}</p>
                                        <p className="text-slate-500 text-xs">{leave.user?.role}</p>
                                    </td>
                                )}
                                <td className="px-6 py-4 text-slate-400 text-sm">
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-slate-300 text-sm max-w-xs truncate">{leave.reason}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                </td>
                                {isAdminOrTeacher && (
                                    <td className="px-6 py-4 text-right">
                                        {leave.status === 'Pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                                                    className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500/20 transition-all"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                                                    className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-slate-600 text-xs">Processed</span>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md glass-card p-8 border border-white/20">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Apply for Leave</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">Start Date</label>
                                        <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2.5 glass-input text-white text-sm" required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-slate-400 ml-1">End Date</label>
                                        <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2.5 glass-input text-white text-sm" required />
                                    </div>
                                </div>
                                <textarea placeholder="Reason for leave..." className="w-full px-4 py-2.5 glass-input text-white min-h-[120px]" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} required />
                                <button type="submit" className="w-full btn-primary py-3.5 text-lg mt-4 shadow-lg shadow-blue-500/20">Submit Application</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LeaveApplication;
