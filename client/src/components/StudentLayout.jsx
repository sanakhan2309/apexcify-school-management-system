import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, User } from 'lucide-react';

const StudentLayout = () => {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen bg-slate-950">
            <StudentSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-8 z-10">
                    <div className="text-white font-medium">Learning Portal | {user?.name}</div>
                    <div className="flex items-center gap-6">
                        <Bell className="w-5 h-5 text-slate-400" />
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                            <User className="text-white w-6 h-6" />
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
