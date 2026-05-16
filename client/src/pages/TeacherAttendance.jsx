import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Check, X, Clock, Calendar } from 'lucide-react';

const TeacherAttendance = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchClasses = async () => {
            const res = await axios.get('http://localhost:5000/api/teacher/classes', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setClasses(res.data);
        };
        fetchClasses();
    }, []);

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        const cls = classes.find(c => c._id === classId);
        setStudents(cls?.students || []);
        // Initialize attendance with 'Present'
        const initial = {};
        cls?.students.forEach(s => initial[s._id] = 'Present');
        setAttendance(initial);
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance({ ...attendance, [studentId]: status });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const attendanceData = Object.keys(attendance).map(sId => ({
                studentId: sId,
                status: attendance[sId]
            }));
            await axios.post('http://localhost:5000/api/teacher/attendance', {
                classId: selectedClass,
                attendanceData,
                date
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            setMessage('Attendance marked successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Error marking attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Mark Attendance</h1>
            
            <div className="grid grid-cols-2 gap-4 glass p-6 rounded-2xl">
                <div>
                    <label className="text-sm text-slate-400 block mb-2">Select Class</label>
                    <select 
                        onChange={handleClassChange}
                        className="w-full glass-input bg-transparent text-white"
                    >
                        <option value="" className="bg-slate-900">Choose Class</option>
                        {classes.map(c => (
                            <option key={c._id} value={c._id} className="bg-slate-900">{c.name} - {c.section}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm text-slate-400 block mb-2">Date</label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full glass-input bg-transparent text-white"
                    />
                </div>
            </div>

            {selectedClass && (
                <div className="glass rounded-2xl overflow-hidden border border-white/10">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300">Student Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-slate-300 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.map(student => (
                                <tr key={student._id} className="hover:bg-white/[0.02]">
                                    <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-4">
                                            {['Present', 'Absent', 'Late'].map(status => (
                                                <button
                                                    key={status}
                                                    onClick={() => handleStatusChange(student._id, status)}
                                                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                                        attendance[student._id] === status
                                                        ? status === 'Present' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50'
                                                        : status === 'Absent' ? 'bg-red-500/20 text-red-500 border-red-500/50'
                                                        : 'bg-orange-500/20 text-orange-500 border-orange-500/50'
                                                        : 'bg-white/5 text-slate-500 border-white/10'
                                                    }`}
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="p-6 bg-white/5 border-t border-white/10 flex justify-between items-center">
                        <p className="text-sm text-emerald-500">{message}</p>
                        <button 
                            onClick={handleSubmit}
                            disabled={loading}
                            className="btn-primary px-8"
                        >
                            {loading ? 'Saving...' : 'Submit Attendance'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherAttendance;
