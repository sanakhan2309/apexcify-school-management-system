import { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Edit2, GraduationCap, Mail, School, X } from 'lucide-react';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [usersRes, classesRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/classes')
            ]);
            setStudents(usersRes.data.filter(u => u.role === 'Student'));
            setClasses(classesRes.data);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAssignClass = async (classId) => {
        try {
            await api.post('/admin/users/assign-class', {
                studentId: selectedStudent._id,
                classId
            });
            setIsAssignModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Failed to assign class', err);
        }
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Student Management</h1>
                    <p className="text-slate-400 mt-1">Manage and view all registered students.</p>
                </div>
            </div>

            <div className="flex gap-4 items-center glass p-4 rounded-2xl">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Class</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">Loading students...</td></tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">No students found.</td></tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <tr key={student._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                <GraduationCap className="text-emerald-500 w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-white">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {student.classInfo ? (
                                            <div className="flex items-center gap-2">
                                                <School className="w-4 h-4 text-blue-500" />
                                                <span className="text-white font-medium">{student.classInfo.name}</span>
                                                <span className="text-slate-500 text-xs font-bold">({student.classInfo.section})</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-600 text-xs italic">Not Assigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Mail className="w-4 h-4" />
                                            {student.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => { setSelectedStudent(student); setIsAssignModalOpen(true); }}
                                                className="p-2 hover:bg-blue-500/10 rounded-lg text-slate-400 hover:text-blue-500 transition-all title='Assign Class'"
                                            >
                                                <School className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Assign Class Modal */}
            <AnimatePresence>
                {isAssignModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsAssignModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-md glass-card p-8 border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Assign Class</h2>
                                    <p className="text-slate-400 text-sm mt-1">Assign <span className="text-white font-bold">{selectedStudent?.name}</span> to a class.</p>
                                </div>
                                <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                                <button 
                                    onClick={() => handleAssignClass(null)}
                                    className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                                        !selectedStudent?.classInfo
                                        ? 'bg-red-500/10 border-red-500/50 text-red-500'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                                >
                                    <span className="font-bold uppercase tracking-widest text-xs">Remove from Class</span>
                                    <X className="w-4 h-4" />
                                </button>

                                {classes.map((cls) => (
                                    <button 
                                        key={cls._id}
                                        onClick={() => handleAssignClass(cls._id)}
                                        className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                                            selectedStudent?.classInfo?._id === cls._id
                                            ? 'bg-blue-600/20 border-blue-500/50 text-white'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-bold">{cls.name}</p>
                                            <p className="text-[10px] uppercase tracking-widest opacity-50">Section {cls.section}</p>
                                        </div>
                                        <School className="w-4 h-4 opacity-50" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentManagement;
