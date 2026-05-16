import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, BookOpen, User, Calendar } from 'lucide-react';

const StudentTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/student/timetable', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setTimetable(res.data);
            } catch (err) {
                console.error('Error fetching timetable:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTimetable();
    }, []);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    if (loading) return <div className="text-center py-20 text-slate-500">Loading timetable...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-white">Class Timetable</h1>
                <p className="text-slate-400 mt-1">Your weekly academic schedule.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {days.map((day) => {
                    const dayLectures = timetable.filter(t => t.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                    
                    return (
                        <motion.div 
                            key={day}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-6 border border-white/5"
                        >
                            <h2 className="text-xl font-bold text-blue-500 mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                {day}
                            </h2>
                            
                            <div className="space-y-4">
                                {dayLectures.length === 0 ? (
                                    <p className="text-slate-600 text-sm italic py-4">No lectures scheduled.</p>
                                ) : (
                                    dayLectures.map((lecture, idx) => (
                                        <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2 group hover:bg-white/10 transition-all">
                                            <div className="flex justify-between items-start">
                                                <p className="text-white font-bold">{lecture.subject?.name}</p>
                                                <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-full">
                                                    <Clock className="w-3 h-3" />
                                                    {lecture.startTime} - {lecture.endTime}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-xs">
                                                <User className="w-3 h-3" />
                                                {lecture.teacher?.name}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentTimetable;
