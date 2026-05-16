import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, User, Calendar, CheckCircle } from 'lucide-react';

const StudentOverview = () => {
    const [myClass, setMyClass] = useState(null);
    const [stats, setStats] = useState({
        attendance: 0,
        pendingExams: 0,
        materials: 0
    });
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [classRes, attendanceRes, examsRes, materialsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/student/my-class', { headers: { Authorization: `Bearer ${user.token}` } }),
                    axios.get('http://localhost:5000/api/student/attendance', { headers: { Authorization: `Bearer ${user.token}` } }),
                    axios.get('http://localhost:5000/api/student/exams', { headers: { Authorization: `Bearer ${user.token}` } }),
                    axios.get('http://localhost:5000/api/student/materials', { headers: { Authorization: `Bearer ${user.token}` } })
                ]);

                setMyClass(classRes.data);
                
                const attRecords = attendanceRes.data;
                const attPercent = attRecords.length > 0 
                    ? Math.round((attRecords.filter(a => a.status === 'Present').length / attRecords.length) * 100)
                    : 0;

                setStats({
                    attendance: attPercent,
                    pendingExams: examsRes.data.length,
                    materials: materialsRes.data.length
                });
            } catch (err) {
                console.error('Error fetching student dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center py-20 text-slate-500">Loading your profile...</div>;

    return (
        <div className="space-y-8">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1>
                <p className="text-slate-400 mt-1">Here's an overview of your academic progress.</p>
            </div>

            {/* Class Info Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                            <GraduationCap className="text-blue-500 w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {myClass ? `${myClass.name} - ${myClass.section}` : 'No Class Assigned'}
                            </h2>
                            <p className="text-slate-400">Current Enrolled Class</p>
                        </div>
                    </div>
                    {myClass && (
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl border border-white/10">
                            <User className="w-5 h-5 text-slate-400" />
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Class Teacher</p>
                                <p className="text-white font-medium">{myClass.teacher?.name || 'Not Assigned'}</p>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 border-l-4 border-l-emerald-500">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Attendance</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{stats.attendance}%</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Overall Present</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-blue-500">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Available Exams</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{stats.pendingExams}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Pending Tests</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-purple-500">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Materials</p>
                    <h3 className="text-3xl font-bold text-white mt-2">{stats.materials}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Study Resources</p>
                </div>
                <div className="glass-card p-6 border-l-4 border-l-orange-500">
                    <p className="text-slate-400 text-xs uppercase font-bold tracking-widest">Your Class</p>
                    <h3 className="text-xl font-bold text-white mt-2 truncate">{myClass?.name || 'N/A'}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Current Enrollment</p>
                </div>
            </div>

            {/* Subjects List */}
            {myClass && (
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        My Subjects
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {myClass.subjects.map((sub) => (
                            <div key={sub._id} className="glass p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                <p className="text-white font-bold">{sub.name}</p>
                                <p className="text-slate-500 text-xs font-mono mt-1">{sub.code}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentOverview;
