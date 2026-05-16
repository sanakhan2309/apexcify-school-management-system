import { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { 
    Users, GraduationCap, BookOpen, CreditCard, 
    ArrowUpRight, ArrowDownRight, TrendingUp 
} from 'lucide-react';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        classes: 0,
        pendingFees: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to fetch stats', err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Students', value: stats.students, icon: GraduationCap, color: 'blue', trend: '+12%' },
        { label: 'Active Teachers', value: stats.teachers, icon: Users, color: 'emerald', trend: '+4%' },
        { label: 'Total Classes', value: stats.classes, icon: BookOpen, color: 'purple', trend: '0%' },
        { label: 'Pending Fees', value: stats.pendingFees, icon: CreditCard, color: 'orange', trend: '-2%' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400 mt-1">Welcome back, here's what's happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 flex flex-col gap-4 group hover:bg-white/[0.08] transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-2xl bg-${card.color}-500/10 border border-${card.color}-500/20`}>
                                <card.icon className={`w-6 h-6 text-${card.color}-500`} />
                            </div>
                            <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                                card.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                            }`}>
                                {card.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {card.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-medium">{card.label}</p>
                            <h3 className="text-3xl font-bold text-white mt-1">{card.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 h-96 flex flex-col">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="text-blue-500 w-5 h-5" />
                            Enrollment Trends
                        </h2>
                        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-400 outline-none">
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-slate-500 text-sm">Interactive Chart Component Goes Here</p>
                    </div>
                </div>

                <div className="glass-card p-8 h-96 flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-8">Recent Activities</h2>
                    <div className="flex-1 space-y-6 overflow-y-auto pr-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                    <Users className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">New Student Registered</p>
                                    <p className="text-slate-500 text-xs mt-1">Aiman Khan joined Grade 10-A</p>
                                    <p className="text-slate-600 text-[10px] mt-2 font-mono">2 HOURS AGO</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
