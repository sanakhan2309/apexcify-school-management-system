import Attendance from '../models/Attendance.js';
import Material from '../models/Material.js';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';
import Class from '../models/Class.js';
import User from '../models/User.js';

// --- Attendance ---
export const markAttendance = async (req, res) => {
    try {
        const { classId, attendanceData, date } = req.body;
        
        const attendanceRecords = await Promise.all(attendanceData.map(async (item) => {
            return await Attendance.findOneAndUpdate(
                { student: item.studentId, date: new Date(date) },
                { 
                    class: classId, 
                    student: item.studentId, 
                    date: new Date(date), 
                    status: item.status,
                    markedBy: req.user._id
                },
                { upsert: true, new: true }
            );
        }));

        res.status(201).json(attendanceRecords);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTeacherClasses = async (req, res) => {
    try {
        const classes = await Class.find({ teacher: req.user._id }).populate('students', 'name email');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Materials ---
export const uploadMaterial = async (req, res) => {
    try {
        const material = await Material.create({
            ...req.body,
            uploadedBy: req.user._id
        });
        res.status(201).json(material);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- Exams ---
export const createExam = async (req, res) => {
    try {
        const exam = await Exam.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(exam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTeacherExams = async (req, res) => {
    try {
        const exams = await Exam.find({ createdBy: req.user._id })
            .populate('subject', 'name')
            .populate('class', 'name section');
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTeacherResults = async (req, res) => {
    try {
        const results = await Result.find({ exam: req.params.examId }).populate('student', 'name');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
