import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Trash2, Edit2, X, User } from 'lucide-react';

const AdminSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '', teacher: '' });
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchData = async () => {
        try {
            const [subjectsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/subjects', {
                    headers: { Authorization: `Bearer ${user.token}` }
                }),
                axios.get('http://localhost:5000/api/admin/users', {
                    headers: { Authorization: `Bearer ${user.token}` }
                })
            ]);
            setSubjects(subjectsRes.data);
            setTeachers(usersRes.data.filter(u => u.role === 'Teacher'));
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
            await axios.post('http://localhost:5000/api/admin/subjects', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setIsModalOpen(false);
            setFormData({ name: '', code: '', teacher: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create subject');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Subject Management</h1>
                    <p className="text-slate-400 mt-1">Manage curriculum and assign subjects to teachers.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 px-6"
                >
                    <Plus className="w-5 h-5" />
                    Add New Subject
                </button>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Subject Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Assigned Teacher</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">Loading subjects...</td></tr>
                        ) : subjects.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">No subjects found.</td></tr>
                        ) : (
                            subjects.map((subj) => (
                                <tr key={subj._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                                <BookOpen className="text-purple-500 w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-white">{subj.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 font-mono text-sm">{subj.code}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                                                <User className="w-3 h-3 text-slate-400" />
                                            </div>
                                            <span className="text-slate-300 text-sm">{subj.teacher?.name || 'Unassigned'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md glass-card p-8 border border-white/20">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Add New Subject</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
                                
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Subject Name</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 glass-input text-white" placeholder="e.g. Mathematics" required />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Subject Code</label>
                                    <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full px-4 py-2.5 glass-input text-white" placeholder="e.g. MATH101" required />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Assign Teacher</label>
                                    <select value={formData.teacher} onChange={(e) => setFormData({...formData, teacher: e.target.value})} className="w-full px-4 py-2.5 glass-input text-white bg-transparent">
                                        <option value="" className="bg-slate-900">Choose Teacher (Optional)</option>
                                        {teachers.map(t => <option key={t._id} value={t._id} className="bg-slate-900">{t.name}</option>)}
                                    </select>
                                </div>

                                <button type="submit" className="w-full btn-primary py-3.5 text-lg mt-4">Create Subject</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminSubjects;
