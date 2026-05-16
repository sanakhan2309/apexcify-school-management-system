import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Calendar, X, Clock, MapPin, BookOpen, User } from 'lucide-react';

const AdminTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        class: '',
        subject: '',
        teacher: '',
        day: 'Monday',
        startTime: '',
        endTime: '',
        roomNumber: ''
    });

    const user = JSON.parse(localStorage.getItem('user'));
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const fetchData = async () => {
        try {
            const [classesRes, subjectsRes, usersRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/classes', { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get('http://localhost:5000/api/admin/subjects', { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${user.token}` } })
            ]);
            setClasses(classesRes.data);
            setSubjects(subjectsRes.data);
            setTeachers(usersRes.data.filter(u => u.role === 'Teacher'));
        } catch (err) {
            console.error('Failed to fetch data', err);
        }
    };

    const fetchTimetable = async (classId) => {
        if (!classId) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/admin/timetable/${classId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTimetable(res.data);
        } catch (err) {
            console.error('Failed to fetch timetable', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedClass) fetchTimetable(selectedClass);
    }, [selectedClass]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/admin/timetable', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setIsModalOpen(false);
            fetchTimetable(formData.class);
            setFormData({ ...formData, subject: '', startTime: '', endTime: '', roomNumber: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add entry');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Timetable Management</h1>
                    <p className="text-slate-400 mt-1">Design and manage class schedules.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 px-6"
                >
                    <Plus className="w-5 h-5" />
                    Add Entry
                </button>
            </div>

            <div className="flex gap-4 items-center glass p-4 rounded-2xl">
                <div className="relative flex-1">
                    <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-3 glass-input text-white appearance-none bg-transparent"
                    >
                        <option value="" className="bg-slate-900">Select Class to view Timetable</option>
                        {classes.map(c => (
                            <option key={c._id} value={c._id} className="bg-slate-900">{c.name} - {c.section}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedClass ? (
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                    {days.map(day => (
                        <div key={day} className="space-y-4">
                            <h3 className="text-center font-bold text-slate-400 uppercase text-xs tracking-widest">{day}</h3>
                            <div className="space-y-3">
                                {timetable.filter(t => t.day === day).length === 0 ? (
                                    <div className="h-20 glass rounded-xl border border-dashed border-white/5 flex items-center justify-center">
                                        <span className="text-[10px] text-slate-600 uppercase">No Class</span>
                                    </div>
                                ) : (
                                    timetable.filter(t => t.day === day)
                                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                                        .map((entry) => (
                                            <motion.div 
                                                key={entry._id}
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="glass p-3 rounded-xl border-l-4 border-l-blue-500 space-y-2"
                                            >
                                                <p className="text-sm font-bold text-white leading-tight">{entry.subject?.name}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                                    <Clock className="w-3 h-3" />
                                                    {entry.startTime} - {entry.endTime}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                                    <User className="w-3 h-3" />
                                                    {entry.teacher?.name}
                                                </div>
                                                {entry.roomNumber && (
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                                        <MapPin className="w-3 h-3" />
                                                        Room {entry.roomNumber}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-20 text-center border-2 border-dashed border-white/5">
                    <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">Please select a class to view or manage its timetable.</p>
                </div>
            )}

            {/* Modal */}
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
                            className="relative w-full max-w-lg glass-card p-8 border border-white/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Add Timetable Entry</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                                {error && (
                                    <div className="col-span-2 bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="space-y-1.5 col-span-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Select Class</label>
                                    <select 
                                        value={formData.class}
                                        onChange={(e) => setFormData({...formData, class: e.target.value})}
                                        className="w-full px-4 py-2.5 glass-input text-white appearance-none bg-transparent"
                                        required
                                    >
                                        <option value="" className="bg-slate-900">Choose Class</option>
                                        {classes.map(c => (
                                            <option key={c._id} value={c._id} className="bg-slate-900">{c.name} - {c.section}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Subject</label>
                                    <select 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full px-4 py-2.5 glass-input text-white appearance-none bg-transparent"
                                        required
                                    >
                                        <option value="" className="bg-slate-900">Choose Subject</option>
                                        {subjects.map(s => (
                                            <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Teacher</label>
                                    <select 
                                        value={formData.teacher}
                                        onChange={(e) => setFormData({...formData, teacher: e.target.value})}
                                        className="w-full px-4 py-2.5 glass-input text-white appearance-none bg-transparent"
                                        required
                                    >
                                        <option value="" className="bg-slate-900">Choose Teacher</option>
                                        {teachers.map(t => (
                                            <option key={t._id} value={t._id} className="bg-slate-900">{t.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Day</label>
                                    <select 
                                        value={formData.day}
                                        onChange={(e) => setFormData({...formData, day: e.target.value})}
                                        className="w-full px-4 py-2.5 glass-input text-white appearance-none bg-transparent"
                                        required
                                    >
                                        {days.map(d => <option key={d} value={d} className="bg-slate-900">{d}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Room Number</label>
                                    <input 
                                        type="text"
                                        value={formData.roomNumber}
                                        onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                                        className="w-full px-4 py-2.5 glass-input text-white"
                                        placeholder="e.g. 101"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Start Time</label>
                                    <input 
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                        className="w-full px-4 py-2.5 glass-input text-white"
                                        required
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300 ml-1">End Time</label>
                                    <input 
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                                        className="w-full px-4 py-2.5 glass-input text-white"
                                        required
                                    />
                                </div>

                                <button type="submit" className="col-span-2 btn-primary py-3.5 text-lg mt-4 shadow-lg shadow-blue-500/20">
                                    Add to Timetable
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminTimetable;
