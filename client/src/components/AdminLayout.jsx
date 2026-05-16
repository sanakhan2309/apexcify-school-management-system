import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User } from 'lucide-react';

const AdminLayout = () => {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 glass border-b border-white/10 flex items-center justify-between px-8 z-10">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input 
                            type="text" 
                            placeholder="Search anything..." 
                            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-slate-400 hover:text-white transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950"></span>
                        </button>
                        
                        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-white">{user?.name}</p>
                                <p className="text-xs text-slate-500">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-white/10">
                                <User className="text-white w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-950/50 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
