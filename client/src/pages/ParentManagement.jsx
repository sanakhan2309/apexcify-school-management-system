import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, User, Users, X, Check, GraduationCap, Mail } from 'lucide-react';

const ParentManagement = () => {
    const [parents, setParents] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParent, setSelectedParent] = useState(null);
    const [selectedChildren, setSelectedChildren] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            const allUsers = res.data;
            setParents(allUsers.filter(u => u.role === 'Parent'));
            setStudents(allUsers.filter(u => u.role === 'Student'));
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (parent) => {
        setSelectedParent(parent);
        setSelectedChildren(parent.children || []);
        setIsModalOpen(true);
    };

    const toggleChildSelection = (childId) => {
        if (selectedChildren.includes(childId)) {
            setSelectedChildren(selectedChildren.filter(id => id !== childId));
        } else {
            setSelectedChildren([...selectedChildren, childId]);
        }
    };

    const handleSaveAssignment = async () => {
        try {
            await axios.post('http://localhost:5000/api/admin/users/assign-children', {
                parentId: selectedParent._id,
                childrenIds: selectedChildren
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error('Failed to assign children', err);
        }
    };

    const filteredParents = parents.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Parent Management</h1>
                    <p className="text-slate-400 mt-1">Manage parent accounts and link them to students.</p>
                </div>
            </div>

            <div className="flex gap-4 items-center glass p-4 rounded-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search parents by name or email..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white"
                    />
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-white/10">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Parent Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Linked Children</th>
                            <th className="px-6 py-4 text-sm font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">Loading parents...</td></tr>
                        ) : filteredParents.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">No parents found.</td></tr>
                        ) : (
                            filteredParents.map((parent) => (
                                <tr key={parent._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                                <User className="text-orange-500 w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-white">{parent.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Mail className="w-4 h-4" />
                                            {parent.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleOpenModal(parent)}
                                            className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold hover:bg-blue-500/20 transition-all flex items-center gap-2"
                                        >
                                            <Users className="w-3 h-3" />
                                            {parent.children?.length || 0} Children
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleOpenModal(parent)}
                                                className="p-2 hover:bg-blue-500/10 rounded-lg text-slate-400 hover:text-blue-500 transition-all"
                                                title="Link Children"
                                            >
                                                <Users className="w-4 h-4" />
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

            {/* Link Children Modal */}
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
                            className="relative w-full max-w-2xl glass-card p-8 border border-white/20 flex flex-col max-h-[80vh]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Link Children</h2>
                                    <p className="text-slate-400 text-sm mt-1">Select students to link to <span className="text-white font-bold">{selectedParent?.name}</span></p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 space-y-3 mb-6">
                                {students.length === 0 ? (
                                    <p className="text-center text-slate-500 py-10">No students found.</p>
                                ) : (
                                    students.map(student => (
                                        <div 
                                            key={student._id}
                                            onClick={() => toggleChildSelection(student._id)}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                                                selectedChildren.includes(student._id)
                                                ? 'bg-blue-600/20 border-blue-500/50'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold border border-white/5">
                                                    <GraduationCap className="w-5 h-5 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{student.name}</p>
                                                    <p className="text-slate-500 text-xs">{student.email}</p>
                                                </div>
                                            </div>
                                            {selectedChildren.includes(student._id) && (
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
                                    <span className="text-white font-bold">{selectedChildren.length}</span> children selected
                                </p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveAssignment}
                                        className="btn-primary px-8 py-2.5"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ParentManagement;
