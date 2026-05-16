import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BarChart, GraduationCap, TrendingUp, Calendar, Award } from 'lucide-react';

const ParentPerformance = () => {
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

    if (loading) return <div className="text-center py-20 text-slate-500">Loading performance data...</div>;

    return (
        <div className="space-y-10">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white">Children Performance</h1>
                <p className="text-slate-400 mt-1">Detailed academic and attendance tracking.</p>
            </div>

            {children.map((child, idx) => (
                <motion.div 
                    key={child._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-8 space-y-8"
                >
                    <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                            <GraduationCap className="text-blue-500 w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">{child.name}'s Report</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Attendance Stats */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-emerald-500" />
                                Attendance Trend
                            </h3>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 text-center">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 mb-4">
                                    <span className="text-2xl font-bold text-white">{child.attendancePercent}%</span>
                                </div>
                                <p className="text-slate-400 text-sm">Overall Attendance</p>
                            </div>
                        </div>

                        {/* Exam Results */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Award className="w-5 h-5 text-orange-500" />
                                Academic Results
                            </h3>
                            <div className="space-y-3">
                                {child.recentResults.length === 0 ? (
                                    <div className="p-10 glass rounded-2xl text-center text-slate-500 text-sm italic">
                                        No exam results available yet.
                                    </div>
                                ) : (
                                    child.recentResults.map((res, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{res.exam?.title}</p>
                                                    <p className="text-slate-500 text-xs">{res.exam?.subject?.name} • {new Date(res.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-emerald-500">{res.score}<span className="text-slate-500 text-sm font-normal"> / {res.totalMarks}</span></p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Score</p>
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

export default ParentPerformance;
