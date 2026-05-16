import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, CheckCircle2, AlertCircle, Play, X } from 'lucide-react';

const StudentExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeExam, setActiveExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    const fetchExams = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/student/exams', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setExams(res.data);
        } catch (err) {
            console.error('Error fetching exams:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const startExam = (exam) => {
        setActiveExam(exam);
        setAnswers({});
        setResult(null);
    };

    const handleOptionSelect = (questionIndex, optionIndex) => {
        setAnswers({ ...answers, [questionIndex]: optionIndex });
    };

    const submitExam = async () => {
        setSubmitting(true);
        try {
            const res = await axios.post('http://localhost:5000/api/student/exams/submit', {
                examId: activeExam._id,
                answers: Object.values(answers)
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            setResult(res.data);
            fetchExams();
        } catch (err) {
            console.error('Error submitting exam:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500">Loading exams...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Online Examinations</h1>
            <p className="text-slate-400">Attempt scheduled exams and view your performance.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.length === 0 ? (
                    <div className="col-span-full glass-card p-20 text-center border-2 border-dashed border-white/5">
                        <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">No Exams Available</h2>
                        <p className="text-slate-500 max-w-md mx-auto">There are no scheduled exams for your class at the moment. Keep studying!</p>
                    </div>
                ) : (
                    exams.map((exam) => (
                        <motion.div 
                            key={exam._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`glass-card p-6 border transition-all flex flex-col justify-between ${
                                 exam.isCompleted ? 'border-emerald-500/30' : 'border-white/5 hover:border-blue-500/30'
                             }`}
                         >
                             <div>
                                 <div className="flex justify-between items-start mb-4">
                                     <div className={`p-3 rounded-xl ${exam.isCompleted ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
                                         <BookOpen className={`w-6 h-6 ${exam.isCompleted ? 'text-emerald-500' : 'text-blue-500'}`} />
                                     </div>
                                     <div className="flex flex-col items-end gap-2">
                                         <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold bg-white/5 px-2 py-1 rounded-full">
                                             <Clock className="w-3 h-3" />
                                             {exam.duration} MINS
                                         </div>
                                         {exam.isCompleted && (
                                             <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-md uppercase">
                                                 Completed
                                             </span>
                                         )}
                                     </div>
                                 </div>
                                 <h3 className="text-xl font-bold text-white mb-1">{exam.title}</h3>
                                 <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{exam.subject?.name}</p>
                             </div>
                             
                             {exam.isCompleted ? (
                                 <div className="mt-6 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-center">
                                     <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Your Score</p>
                                     <p className="text-2xl font-black text-white mt-1">
                                         {exam.score} <span className="text-sm text-slate-500">/ {exam.totalMarks}</span>
                                     </p>
                                 </div>
                             ) : (
                                 <button 
                                     onClick={() => startExam(exam)}
                                     className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                                 >
                                     <Play className="w-4 h-4 fill-current" />
                                     Start Exam
                                 </button>
                             )}
                         </motion.div>
                    ))
                )}
            </div>

            {/* Exam Modal */}
            <AnimatePresence>
                {activeExam && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            className="relative w-full max-w-3xl glass-card p-8 border border-white/20 max-h-[90vh] overflow-y-auto"
                        >
                            {!result ? (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{activeExam.title}</h2>
                                            <p className="text-slate-400 text-sm">{activeExam.subject?.name}</p>
                                        </div>
                                        <button onClick={() => setActiveExam(null)} className="text-slate-500 hover:text-white transition-colors">
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="space-y-8">
                                        {activeExam.questions.map((q, qIdx) => (
                                            <div key={qIdx} className="space-y-4">
                                                <h3 className="text-lg font-medium text-white">
                                                    <span className="text-blue-500 mr-2 font-bold">{qIdx + 1}.</span>
                                                    {q.questionText}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {q.options.map((opt, oIdx) => (
                                                        <button
                                                            key={oIdx}
                                                            onClick={() => handleOptionSelect(qIdx, oIdx)}
                                                            className={`p-4 rounded-xl border text-left transition-all ${
                                                                answers[qIdx] === oIdx 
                                                                ? 'bg-blue-600/20 border-blue-500 text-white' 
                                                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                                            }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-white/10 flex justify-end">
                                        <button 
                                            onClick={submitExam}
                                            disabled={submitting || Object.keys(answers).length < activeExam.questions.length}
                                            className="btn-primary px-10 py-3 text-lg disabled:opacity-50"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Exam'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-10 space-y-6">
                                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                                        <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-white">Exam Completed!</h2>
                                        <p className="text-slate-400 mt-2">Your responses have been recorded.</p>
                                    </div>
                                    <div className="max-w-xs mx-auto p-6 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-slate-500 text-sm uppercase font-bold tracking-widest">Final Score</p>
                                        <h3 className="text-5xl font-black text-white mt-2">
                                            {result.score} <span className="text-2xl text-slate-500">/ {result.totalMarks}</span>
                                        </h3>
                                    </div>
                                    <button 
                                        onClick={() => setActiveExam(null)}
                                        className="btn-primary px-10 py-3"
                                    >
                                        Back to Dashboard
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentExams;
