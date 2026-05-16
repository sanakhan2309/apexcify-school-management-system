import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import Result from '../models/Result.js';

export const getChildrenStats = async (req, res) => {
    try {
        const parent = await User.findById(req.user._id).populate('children', 'name email');
        if (!parent || !parent.children || parent.children.length === 0) {
            return res.json([]);
        }

        const childrenStats = await Promise.all(parent.children.map(async (child) => {
            const attendance = await Attendance.find({ student: child._id });
            const fees = await Fee.find({ student: child._id });
            const results = await Result.find({ student: child._id })
                .populate({
                    path: 'exam',
                    select: 'title subject',
                    populate: { path: 'subject', select: 'name' }
                });

            const attendancePercent = attendance.length > 0 
                ? Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100)
                : 0;

            const pendingFees = fees.filter(f => f.status !== 'Paid').length;

            return {
                _id: child._id,
                name: child.name,
                email: child.email,
                attendancePercent,
                pendingFees,
                recentResults: results.slice(-3), // Last 3 results
                fees: fees.slice(-5) // Last 5 fee records
            };
        }));

        res.json(childrenStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
