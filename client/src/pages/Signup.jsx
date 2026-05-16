import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, ShieldCheck } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const user = await signup(formData);
            const roleRoutes = {
                Admin: '/admin',
                Teacher: '/teacher',
                Student: '/student',
                Parent: '/parent'
            };
            navigate(roleRoutes[user.role] || '/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-card"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-emerald-600/20 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/30">
                        <UserPlus className="text-emerald-500 w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Create Account</h2>
                    <p className="text-slate-400 mt-2">Join our school community</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="relative">
                        <input 
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 glass-input text-white"
                            placeholder="Full Name"
                            required
                        />
                    </div>

                    <div className="relative">
                        <input 
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 glass-input text-white"
                            placeholder="Email Address"
                            required
                        />
                    </div>

                    <div className="relative">
                        <input 
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 glass-input text-white"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <div className="relative">
                        <select 
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-3 glass-input text-white appearance-none bg-transparent"
                        >
                            <option value="Student" className="bg-slate-900 text-white">Student Role</option>
                            <option value="Teacher" className="bg-slate-900 text-white">Teacher Role</option>
                            <option value="Parent" className="bg-slate-900 text-white">Parent Role</option>
                            <option value="Admin" className="bg-slate-900 text-white">Admin Role</option>
                        </select>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 text-lg mt-4 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-slate-400">
                    Already have an account? {' '}
                    <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
