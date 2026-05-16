import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Download, FileText, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const StudentAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/student/attendance', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setAttendance(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present': return <CheckCircle className="text-emerald-500 w-5 h-5" />;
            case 'Absent': return <XCircle className="text-red-500 w-5 h-5" />;
            case 'Late': return <Clock className="text-orange-500 w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">My Attendance</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6">
                    <p className="text-slate-400 text-sm">Attendance Percentage</p>
                    <h2 className="text-4xl font-bold text-emerald-500 mt-2">
                        {attendance.length > 0 
                            ? Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100)
                            : 0}%
                    </h2>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Date</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Class</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-500">Loading...</td></tr>
                        ) : attendance.length === 0 ? (
                            <tr><td colSpan="3" className="px-6 py-10 text-center text-slate-500">No records found.</td></tr>
                        ) : (
                            attendance.sort((a, b) => new Date(b.date) - new Date(a.date)).map(record => (
                                <tr key={record._id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4 text-white">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-500" />
                                            {new Date(record.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">{record.class?.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(record.status)}
                                            <span className={`font-bold ${
                                                record.status === 'Present' ? 'text-emerald-500' 
                                                : record.status === 'Absent' ? 'text-red-500' 
                                                : 'text-orange-500'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentAttendance;
