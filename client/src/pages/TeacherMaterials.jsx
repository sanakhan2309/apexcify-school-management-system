import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Trash2, Book, ExternalLink, X } from 'lucide-react';

const TeacherMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classId: '',
        subjectId: '',
        fileUrl: ''
    });
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchData = async () => {
        try {
            const [classesRes, subjectsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/teacher/classes', { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get('http://localhost:5000/api/admin/subjects', { headers: { Authorization: `Bearer ${user.token}` } })
            ]);
            setClasses(classesRes.data);
            setSubjects(subjectsRes.data);
            
            // For now, fetching all materials (in real app, filter by teacher)
            const materialsRes = await axios.get('http://localhost:5000/api/student/materials', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMaterials(materialsRes.data);
        } catch (err) {
            console.error(err);
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
            await axios.post('http://localhost:5000/api/teacher/materials', {
                ...formData,
                class: formData.classId,
                subject: formData.subjectId
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            setIsModalOpen(false);
            setFormData({ title: '', description: '', classId: '', subjectId: '', fileUrl: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload material');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Course Materials</h1>
                    <p className="text-slate-400 mt-1">Upload and manage study resources for your students.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 px-6 bg-emerald-600 hover:bg-emerald-700"
                >
                    <Plus className="w-5 h-5" />
                    Upload Material
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-slate-500">Loading materials...</div>
                ) : materials.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-500">No materials uploaded yet.</div>
                ) : (
                    materials.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-6 group relative border border-white/5 hover:border-emerald-500/30 transition-all"
                        >
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                                <FileText className="text-emerald-500 w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white line-clamp-1">{item.title}</h3>
                            <p className="text-slate-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                            
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded-md bg-white/5 text-slate-400 text-[10px] uppercase font-bold border border-white/10">
                                    {item.subject?.name}
                                </span>
                                <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] uppercase font-bold border border-blue-500/20">
                                    {item.class?.name}
                                </span>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                <a 
                                    href={item.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-emerald-500 hover:text-emerald-400 text-sm font-medium flex items-center gap-1.5"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View File
                                </a>
                                <button className="text-slate-500 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
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
                                <h2 className="text-2xl font-bold text-white">Upload Material</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">{error}</div>}
                                
                                <input 
                                    type="text"
                                    placeholder="Title"
                                    className="w-full px-4 py-2.5 glass-input text-white"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                                <textarea 
                                    placeholder="Description"
                                    className="w-full px-4 py-2.5 glass-input text-white min-h-[100px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                                <select 
                                    className="w-full px-4 py-2.5 glass-input text-white bg-transparent"
                                    value={formData.classId}
                                    onChange={(e) => setFormData({...formData, classId: e.target.value})}
                                    required
                                >
                                    <option value="" className="bg-slate-900">Select Class</option>
                                    {classes.map(c => <option key={c._id} value={c._id} className="bg-slate-900">{c.name}</option>)}
                                </select>
                                <select 
                                    className="w-full px-4 py-2.5 glass-input text-white bg-transparent"
                                    value={formData.subjectId}
                                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                                    required
                                >
                                    <option value="" className="bg-slate-900">Select Subject</option>
                                    {subjects.map(s => <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>)}
                                </select>
                                <input 
                                    type="url"
                                    placeholder="File URL (e.g. Google Drive/Dropbox)"
                                    className="w-full px-4 py-2.5 glass-input text-white"
                                    value={formData.fileUrl}
                                    onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                                    required
                                />
                                <button type="submit" className="w-full btn-primary py-3.5 text-lg mt-4 bg-emerald-600 hover:bg-emerald-700">
                                    Upload Now
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherMaterials;
