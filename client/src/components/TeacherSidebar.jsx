import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, CheckSquare, FileText, 
    BookOpen, LogOut, GraduationCap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TeacherSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/teacher' },
        { icon: CheckSquare, label: 'Attendance', path: '/teacher/attendance' },
        { icon: FileText, label: 'Materials', path: '/teacher/materials' },
        { icon: BookOpen, label: 'Exams', path: '/teacher/exams' },
        { icon: CheckSquare, label: 'Leaves', path: '/teacher/leaves' },
    ];

    return (
        <aside className="w-64 min-h-screen glass border-r border-white/10 flex flex-col p-4 relative z-50 pointer-events-auto">
            <div className="flex items-center gap-3 px-2 mb-10 mt-2">
                <div className="p-2 bg-emerald-600 rounded-lg">
                    <GraduationCap className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">Teacher Portal</span>
            </div>

            <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative z-10 ${
                                isActive 
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
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

export default TeacherSidebar;
