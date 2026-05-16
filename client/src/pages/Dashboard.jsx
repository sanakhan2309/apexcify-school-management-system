import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, User, Shield, GraduationCap, Users, BookOpen } from 'lucide-react';

const Dashboard = ({ role }) => {
    const { user, logout } = useAuth();
    
    const displayRole = role || user?.role || 'User';

    const getRoleIcon = () => {
        switch (displayRole) {
            case 'Admin': return <Shield className="w-12 h-12 text-purple-500" />;
            case 'Teacher': return <BookOpen className="w-12 h-12 text-blue-500" />;
            case 'Student': return <GraduationCap className="w-12 h-12 text-emerald-500" />;
            case 'Parent': return <Users className="w-12 h-12 text-orange-500" />;
            default: return <User className="w-12 h-12 text-slate-500" />;
        }
    };

    const getWelcomeMessage = () => {
        switch (displayRole) {
            case 'Admin': return "System Control Center";
            case 'Teacher': return "Classroom Management";
            case 'Student': return "Learning Portal";
            case 'Parent': return "Child's Progress Tracking";
            default: return "Dashboard";
        }
    };

    return (
        <div className="min-h-screen p-8 bg-slate-950">
            <nav className="max-w-7xl mx-auto flex justify-between items-center mb-12 glass p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                        <Shield className="text-blue-500 w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">EduFlow</span>
                </div>
                <button 
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </nav>

            <main className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card mb-8"
                >
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                            {getRoleIcon()}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">Hello, {user?.name}</h1>
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">
                                    {displayRole}
                                </span>
                                <p className="text-slate-400">{getWelcomeMessage()}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card hover:bg-white/[0.07] transition-colors cursor-pointer"
                        >
                            <h3 className="text-xl font-semibold mb-2">Recent Activity {i}</h3>
                            <p className="text-slate-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
