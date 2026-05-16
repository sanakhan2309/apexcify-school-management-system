import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FileText, Download, BookOpen, User, Calendar } from 'lucide-react';

const StudentMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/student/materials', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setMaterials(res.data);
            } catch (err) {
                console.error('Error fetching materials:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterials();
    }, []);

    if (loading) return <div className="text-center py-20 text-slate-500">Loading course materials...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white">Course Materials</h1>
                <p className="text-slate-400 mt-1">Access study resources, notes, and assignments.</p>
            </div>

            {materials.length === 0 ? (
                <div className="glass-card p-20 text-center border-2 border-dashed border-white/5">
                    <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">No Materials Yet</h2>
                    <p className="text-slate-500 max-w-md mx-auto">Your teachers haven't uploaded any study materials for your class yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {materials.map((item) => (
                        <motion.div 
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 border border-white/5 hover:border-blue-500/30 transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl">
                                        <BookOpen className="text-blue-500 w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black bg-white/5 text-slate-500 px-2 py-1 rounded-md uppercase border border-white/10">
                                        {item.subject?.name}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{item.description}</p>
                                
                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                        <User className="w-3 h-3" />
                                        Uploaded by: {item.uploadedBy?.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                        <Calendar className="w-3 h-3" />
                                        Date: {new Date(item.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            
                            <a 
                                href={item.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white font-bold flex items-center justify-center gap-2 transition-all border border-blue-500/20"
                            >
                                <Download className="w-4 h-4" />
                                Download Material
                            </a>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentMaterials;
