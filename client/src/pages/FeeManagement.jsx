import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, CreditCard, X, User, DollarSign, Calendar, Download } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const FeeManagement = () => {
    const [fees, setFees] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        dueDate: '',
        description: ''
    });
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchData = async () => {
        try {
            const [feesRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/fees', { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${user.token}` } })
            ]);
            setFees(feesRes.data);
            setStudents(usersRes.data.filter(u => u.role === 'Student'));
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/admin/fees', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setIsModalOpen(false);
            setFormData({ studentId: '', amount: '', dueDate: '', description: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate invoice');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Fee Management</h1>
                    <p className="text-slate-400 mt-1">Generate invoices and track student payments.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 px-6"
                >
                    <Plus className="w-5 h-5" />
                    Generate Invoice
                </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Invoice #</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Due Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Loading invoices...</td></tr>
                        ) : fees.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">No invoices found.</td></tr>
                        ) : (
                            fees.map((fee) => (
                                <tr key={fee._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 font-mono text-sm text-blue-400">{fee.invoiceNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{fee.student?.name}</span>
                                            <span className="text-slate-500 text-xs">{fee.student?.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-bold">${fee.amount}</td>
                                    <td className="px-6 py-4 text-slate-400">{new Date(fee.dueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                            fee.status === 'Paid' 
                                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                            : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                        }`}>
                                            {fee.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => generateInvoicePDF(fee)}
                                            className="p-2 hover:bg-blue-500/10 rounded-lg text-slate-400 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100"
                                            title="Download PDF"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md glass-card p-8 border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Generate Invoice</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Select Student</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.studentId}
                                            onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                                            className="w-full px-4 py-2.5 glass-input text-white appearance-none bg-transparent"
                                            required
                                        >
                                            <option value="" className="bg-slate-900">Choose a student</option>
                                            {students.map(s => (
                                                <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Amount ($)</label>
                                    <div className="relative">
                                        <input 
                                            type="number"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                                            className="w-full px-4 py-2.5 glass-input text-white"
                                            placeholder="500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Due Date</label>
                                    <div className="relative">
                                        <input 
                                            type="date"
                                            value={formData.dueDate}
                                            onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                            className="w-full px-4 py-2.5 glass-input text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn-primary py-3.5 text-lg mt-4 shadow-lg shadow-blue-500/20">
                                    Generate Invoice
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FeeManagement;
