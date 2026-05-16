import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CreditCard, Download, GraduationCap, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const ParentFees = () => {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/parent/children-stats', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setChildren(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center py-20 text-slate-500">Loading fee data...</div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white">Fee Payments</h1>
                <p className="text-slate-400 mt-1">Manage and track your children's school fees.</p>
            </div>

            {children.map((child, idx) => (
                <motion.div 
                    key={child._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-8 space-y-8"
                >
                    <div className="flex justify-between items-center border-b border-white/10 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center">
                                <GraduationCap className="text-orange-500 w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">{child.name}'s Fees</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Pending Invoices</p>
                            <p className="text-2xl font-bold text-orange-500">{child.pendingFees}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-blue-500" />
                            Invoice History
                        </h3>
                        <div className="glass rounded-2xl overflow-hidden border border-white/10">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-300">Invoice #</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-300">Amount</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-300">Due Date</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {child.fees.length === 0 ? (
                                        <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500 italic">No fee records found.</td></tr>
                                    ) : (
                                        child.fees.map((fee) => (
                                            <tr key={fee._id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4 font-mono text-sm text-blue-400">{fee.invoiceNumber}</td>
                                                <td className="px-6 py-4 text-white font-bold">${fee.amount}</td>
                                                <td className="px-6 py-4 text-slate-400 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        {new Date(fee.dueDate).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 w-fit ${
                                                        fee.status === 'Paid' 
                                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                                                        : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                                    }`}>
                                                        {fee.status === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                        {fee.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => generateInvoicePDF(fee)}
                                                        className="p-2 hover:bg-blue-500/10 rounded-lg text-slate-400 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Download Invoice"
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
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ParentFees;
