import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
    LayoutDashboard, CheckSquare, FileText, 
    Calendar, LogOut, GraduationCap, School
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const [myClass, setMyClass] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/student/my-class', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setMyClass(res.data);
            } catch (err) {
                console.error('Error fetching class in sidebar:', err);
            }
        };
        fetchClass();
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/student' },
        { icon: CheckSquare, label: 'My Attendance', path: '/student/attendance' },
        { icon: FileText, label: 'Course Materials', path: '/student/materials' },
        { icon: Calendar, label: 'Timetable', path: '/student/timetable' },
        { icon: GraduationCap, label: 'Exams', path: '/student/exams' },
        { icon: FileText, label: 'Leaves', path: '/student/leaves' },
    ];

    return (
        <aside className="w-64 min-h-screen glass border-r border-white/10 flex flex-col p-4 relative z-50 pointer-events-auto">
            <div className="flex items-center gap-3 px-2 mb-8 mt-2">
                <div className="p-2 bg-indigo-600 rounded-lg">
                    <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Student Portal</span>
            </div>

            {myClass && (
                <div className="px-2 mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <School className="text-emerald-500 w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Your Class</p>
                            <p className="text-white text-sm font-bold truncate">{myClass.name}</p>
                        </div>
                    </div>
                </div>
            )}

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative z-10 ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 pointer-events-none ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                            <span className="font-medium pointer-events-none">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all w-full group"
                >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default StudentSidebar;
