import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, Users, X, Mail, Shield } from 'lucide-react';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchTeachers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTeachers(res.data.filter(u => u.role === 'Teacher'));
        } catch (err) {
            console.error('Failed to fetch teachers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const filteredTeachers = teachers.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Teacher Management</h1>
                    <p className="text-slate-400 mt-1">Manage and view all faculty members.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-500">Loading teachers...</div>
                ) : filteredTeachers.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500">No teachers found.</div>
                ) : (
                    filteredTeachers.map((teacher, i) => (
                        <motion.div
                            key={teacher._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-6 flex flex-col items-center text-center group relative"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-10 h-10 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">{teacher.name}</h3>
                            <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                <Mail className="w-3 h-3" />
                                {teacher.email}
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
                                    Teacher
                                </span>
                            </div>
                            
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-all">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherManagement;
