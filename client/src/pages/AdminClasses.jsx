import { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, GraduationCap, X, Users, Check } from 'lucide-react';

const AdminClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', section: '', teacher: '' });
    const [teachers, setTeachers] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            const [classesRes, usersRes] = await Promise.all([
                api.get('/admin/classes'),
                api.get('/admin/users')
            ]);
            setClasses(classesRes.data);
            setTeachers(usersRes.data.filter(u => u.role === 'Teacher'));
            setAllStudents(usersRes.data.filter(u => u.role === 'Student'));
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
            if (editMode) {
                await api.put(`/admin/classes/${selectedClass._id}`, formData);
            } else {
                await api.post('/admin/classes', formData);
            }
            setIsModalOpen(false);
            setFormData({ name: '', section: '', teacher: '' });
            setEditMode(false);
            setSelectedClass(null);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${editMode ? 'update' : 'create'} class`);
        }
    };

    const handleEdit = (cls) => {
        setSelectedClass(cls);
        setFormData({
            name: cls.name,
            section: cls.section,
            teacher: cls.teacher?._id || ''
        });
        setEditMode(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            try {
                await api.delete(`/admin/classes/${id}`);
                fetchData();
            } catch (err) {
                console.error('Failed to delete class', err);
            }
        }
    };

    const handleOpenAssignModal = (cls) => {
        setSelectedClass(cls);
        setSelectedStudents(cls.students?.map(s => s._id) || []);
        setIsAssignModalOpen(true);
    };

    const toggleStudentSelection = (studentId) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
            setSelectedStudents([...selectedStudents, studentId]);
        }
    };

    const handleAssignStudents = async () => {
        try {
            await axios.put(`http://localhost:5000/api/admin/classes/${selectedClass._id}/students`, {
                students: selectedStudents
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setIsAssignModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Failed to assign students', err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Class Management</h1>
                    <p className="text-slate-400 mt-1">Manage and organize your school's classes.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 px-6"
                >
                    <Plus className="w-5 h-5" />
                    Add New Class
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex gap-4 items-center glass p-4 rounded-2xl">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder="Search classes..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
            </div>

            {/* Classes Table */}
            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Class Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Section</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Students</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">Loading classes...</td></tr>
                        ) : classes.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">No classes found. Add one to get started!</td></tr>
                        ) : (
                            classes.map((cls) => (
                                <tr key={cls._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                                <GraduationCap className="text-blue-500 w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-white">{cls.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 font-medium">{cls.section}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleOpenAssignModal(cls)}
                                            className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                                        >
                                            <Users className="w-3 h-3" />
                                            {cls.students?.length || 0} Students
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEdit(cls)}
                                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cls._id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-all"
                                            >
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

            {/* Create Class Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md glass-card p-8 border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Create New Class</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Class Name</label>
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-3 glass-input text-white"
                                        placeholder="e.g. Grade 10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Section</label>
                                    <input 
                                        type="text"
                                        value={formData.section}
                                        onChange={(e) => setFormData({...formData, section: e.target.value})}
                                        className="w-full px-4 py-3 glass-input text-white"
                                        placeholder="e.g. A"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Assign Class Teacher</label>
                                    <select 
                                        value={formData.teacher}
                                        onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                                        className="w-full px-4 py-3 glass-input text-white bg-transparent"
                                    >
                                        <option value="" className="bg-slate-900">Choose Teacher</option>
                                        {teachers.map(t => (
                                            <option key={t._id} value={t._id} className="bg-slate-900">{t.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <button type="submit" className="w-full btn-primary py-3.5 text-lg mt-4 shadow-lg shadow-blue-500/20">
                                    Create Class
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Assign Students Modal */}
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
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl glass-card p-8 border border-white/20 flex flex-col max-h-[80vh]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Assign Students</h2>
                                    <p className="text-slate-400 text-sm mt-1">{selectedClass?.name} - {selectedClass?.section}</p>
                                </div>
                                <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6">
                                {allStudents.length === 0 ? (
                                    <p className="text-center text-slate-500 py-10">No students found.</p>
                                ) : (
                                    allStudents.map(student => (
                                        <div 
                                            key={student._id}
                                            onClick={() => toggleStudentSelection(student._id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                selectedStudents.includes(student._id)
                                                ? 'bg-blue-600/20 border-blue-500/50'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{student.name}</p>
                                                    <p className="text-slate-500 text-xs">{student.email}</p>
                                                </div>
                                            </div>
                                            {selectedStudents.includes(student._id) && (
                                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <Check className="text-white w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                <p className="text-slate-400 text-sm">
                                    <span className="text-white font-bold">{selectedStudents.length}</span> students selected
                                </p>
                                <button 
                                    onClick={handleAssignStudents}
                                    className="btn-primary px-8 py-2.5"
                                >
                                    Save Assignments
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminClasses;

