import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Trash2, Clock, X, CheckCircle2 } from 'lucide-react';

const TeacherExams = () => {
    const [exams, setExams] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        subjectId: '',
        classId: '',
        duration: 30,
        questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchData = async () => {
        try {
            const [classesRes, subjectsRes, examsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/teacher/classes', { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get('http://localhost:5000/api/admin/subjects', { headers: { Authorization: `Bearer ${user.token}` } }),
                axios.get('http://localhost:5000/api/teacher/exams', { headers: { Authorization: `Bearer ${user.token}` } })
            ]);
            setClasses(classesRes.data);
            setSubjects(subjectsRes.data);
            setExams(examsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
        });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[index][field] = value;
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...formData.questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setFormData({ ...formData, questions: updatedQuestions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/teacher/exams', {
                ...formData,
                class: formData.classId,
                subject: formData.subjectId
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            setIsModalOpen(false);
            setFormData({
                title: '', subjectId: '', classId: '', duration: 30,
                questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Online Exams</h1>
                    <p className="text-slate-400 mt-1">Create and manage MCQ-based online examinations.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center gap-2 px-6 bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="w-5 h-5" />
                    Create Exam
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {exams.map((exam) => (
                    <motion.div 
                        key={exam._id}
                        className="glass-card p-6 flex flex-col justify-between"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                    <BookOpen className="text-blue-500 w-6 h-6" />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-bold border border-white/10">
                                    {exam.questions?.length} Questions
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{exam.title}</h3>
                            <p className="text-slate-500 text-sm mt-1">{exam.subject?.name} | {exam.class?.name}</p>
                            
                            <div className="flex items-center gap-4 mt-4 text-slate-400 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {exam.duration} mins
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5 flex gap-3">
                            <button className="flex-1 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-500 text-sm font-bold border border-blue-500/20 hover:bg-blue-500/20 transition-all">
                                View Results
                            </button>
                            <button className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Create Exam Modal */}
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
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-2xl glass-card p-8 border border-white/20 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Create New MCQ Exam</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        placeholder="Exam Title"
                                        className="col-span-2 px-4 py-2.5 glass-input text-white"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        required
                                    />
                                    <select 
                                        className="px-4 py-2.5 glass-input text-white bg-transparent"
                                        value={formData.classId}
                                        onChange={(e) => setFormData({...formData, classId: e.target.value})}
                                        required
                                    >
                                        <option value="" className="bg-slate-900">Select Class</option>
                                        {classes.map(c => <option key={c._id} value={c._id} className="bg-slate-900">{c.name}</option>)}
                                    </select>
                                    <select 
                                        className="px-4 py-2.5 glass-input text-white bg-transparent"
                                        value={formData.subjectId}
                                        onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                                        required
                                    >
                                        <option value="" className="bg-slate-900">Select Subject</option>
                                        {subjects.map(s => <option key={s._id} value={s._id} className="bg-slate-900">{s.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold text-white">Questions</h3>
                                        <button 
                                            type="button" 
                                            onClick={handleAddQuestion}
                                            className="text-sm text-blue-500 font-bold hover:underline"
                                        >
                                            + Add Question
                                        </button>
                                    </div>

                                    {formData.questions.map((q, qIndex) => (
                                        <div key={qIndex} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                                            <input 
                                                placeholder={`Question ${qIndex + 1}`}
                                                className="w-full px-4 py-2 glass-input text-white"
                                                value={q.questionText}
                                                onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                                required
                                            />
                                            <div className="grid grid-cols-2 gap-3">
                                                {q.options.map((opt, oIndex) => (
                                                    <div key={oIndex} className="flex items-center gap-2">
                                                        <input 
                                                            type="radio"
                                                            name={`correct-${qIndex}`}
                                                            checked={q.correctAnswer === oIndex}
                                                            onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                                                            className="w-4 h-4 accent-emerald-500 cursor-pointer"
                                                        />
                                                        <input 
                                                            placeholder={`Option ${oIndex + 1}`}
                                                            className={`flex-1 px-4 py-2 glass-input text-white text-sm ${
                                                                q.correctAnswer === oIndex ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : ''
                                                            }`}
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button type="submit" className="w-full btn-primary py-3.5 text-lg mt-4 shadow-lg shadow-blue-500/20">
                                    Publish Exam
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TeacherExams;
