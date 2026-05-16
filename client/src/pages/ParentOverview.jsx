import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, GraduationCap, CheckCircle, Clock, CreditCard, Download } from 'lucide-react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const ParentOverview = () => {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchChildrenStats = async () => {
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
        fetchChildrenStats();
    }, []);

    if (loading) return <div className="text-center py-20 text-slate-500">Loading child data...</div>;

    if (children.length === 0) {
        return (
            <div className="glass-card p-20 text-center border-2 border-dashed border-white/5">
                <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">No Children Linked</h2>
                <p className="text-slate-500 max-w-md mx-auto">Please contact the school administration to link your children's accounts to your profile.</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {children.map((child, idx) => (
                <motion.div 
                    key={child._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                        <div className="w-12 h-12 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center">
                            <GraduationCap className="text-orange-500 w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{child.name}</h2>
                            <p className="text-slate-500 text-sm">{child.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-card p-6">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Attendance</p>
                            <h3 className="text-3xl font-bold text-emerald-500 mt-2">{child.attendancePercent}%</h3>
                        </div>
                        <div className="glass-card p-6">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Pending Fees</p>
                            <h3 className="text-3xl font-bold text-orange-500 mt-2">{child.pendingFees}</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Results */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Recent Exam Results</h3>
                            <div className="space-y-4">
                                {child.recentResults.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">No recent results found.</p>
                                ) : (
                                    child.recentResults.map((res, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium text-sm">{res.exam?.title}</span>
                                                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{res.exam?.subject?.name}</span>
                                            </div>
                                            <span className="text-emerald-500 font-bold">{res.score}/{res.totalMarks}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Fee Status */}
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Fee History</h3>
                            <div className="space-y-4">
                                {child.fees.length === 0 ? (
                                    <p className="text-slate-500 text-sm italic">No fee records found.</p>
                                ) : (
                                    child.fees.map((fee, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 group">
                                            <div className="flex flex-col">
                                                <span className="text-white text-sm font-medium">{new Date(fee.dueDate).toLocaleDateString()}</span>
                                                <span className="text-slate-500 text-[10px] font-mono">{fee.invoiceNumber}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                    fee.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'
                                                }`}>
                                                    {fee.status}
                                                </span>
                                                <button 
                                                    onClick={() => generateInvoicePDF(fee)}
                                                    className="p-1.5 hover:bg-blue-500/10 rounded-lg text-slate-500 hover:text-blue-500 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ParentOverview;
