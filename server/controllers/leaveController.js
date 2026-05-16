import LeaveApplication from '../models/LeaveApplication.js';
import User from '../models/User.js';

export const applyLeave = async (req, res) => {
    try {
        const { startDate, endDate, reason } = req.body;
        const leave = await LeaveApplication.create({
            user: req.user._id,
            role: req.user.role,
            startDate,
            endDate,
            reason
        });
        res.status(201).json(leave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getMyLeaves = async (req, res) => {
    try {
        const leaves = await LeaveApplication.find({ user: req.user._id });
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await LeaveApplication.find().populate('user', 'name role email');
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const leave = await LeaveApplication.findByIdAndUpdate(
            req.params.id,
            { status, reviewedBy: req.user._id },
            { new: true }
        );
        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
