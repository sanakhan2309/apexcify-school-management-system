import Attendance from '../models/Attendance.js';
import Material from '../models/Material.js';
import Exam from '../models/Exam.js';
import Result from '../models/Result.js';
import Timetable from '../models/Timetable.js';
import Class from '../models/Class.js';
import { sendEmail } from '../utils/emailService.js';

export const getStudentClass = async (req, res) => {
    try {
        const studentClass = await Class.findOne({ students: req.user._id })
            .populate('teacher', 'name email')
            .populate('subjects', 'name code');
        res.json(studentClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ student: req.user._id })
            .populate('class', 'name section');
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentMaterials = async (req, res) => {
    try {
        // Find class student is enrolled in
        const studentClass = await Class.findOne({ students: req.user._id });
        if (!studentClass) return res.json([]);

        const materials = await Material.find({ class: studentClass._id })
            .populate('subject', 'name')
            .populate('uploadedBy', 'name');
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentTimetable = async (req, res) => {
    try {
        const studentClass = await Class.findOne({ students: req.user._id });
        if (!studentClass) return res.json([]);

        const timetable = await Timetable.find({ class: studentClass._id })
            .populate('subject teacher', 'name');
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAvailableExams = async (req, res) => {
    try {
        const studentClass = await Class.findOne({ students: req.user._id });
        if (!studentClass) return res.json([]);

        const exams = await Exam.find({ class: studentClass._id }).populate('subject', 'name');
        
        // Fetch results for this student to mark which exams are completed
        const results = await Result.find({ student: req.user._id });

        const examsWithStatus = exams.map(exam => {
            const result = results.find(r => r.exam.toString() === exam._id.toString());
            return {
                ...exam._doc,
                isCompleted: !!result,
                score: result ? result.score : null,
                totalMarks: result ? result.totalMarks : exam.questions.length
            };
        });

        res.json(examsWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitExam = async (req, res) => {
    try {
        const { examId, answers } = req.body;
        const exam = await Exam.findById(examId);
        
        let score = 0;
        const processedAnswers = exam.questions.map((q, idx) => {
            const isCorrect = q.correctAnswer === answers[idx];
            if (isCorrect) score++;
            return {
                questionIndex: idx,
                selectedOption: answers[idx],
                isCorrect
            };
        });

        const result = await Result.create({
            exam: examId,
            student: req.user._id,
            score,
            totalMarks: exam.questions.length,
            answers: processedAnswers
        });

        // Send email notification to student
        if (req.user.email) {
            await sendEmail(
                req.user.email,
                `Exam Result Announced: ${exam.title}`,
                `Hello ${req.user.name}, your result for the exam ${exam.title} is out. You scored ${score}/${exam.questions.length}.`,
                `<h1>Exam Result Announced</h1><p>Hello ${req.user.name},</p><p>Your result for the exam <b>${exam.title}</b> has been announced.</p><p><b>Score:</b> ${score} / ${exam.questions.length}</p><p>Check your portal for details.</p>`
            );
        }

        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
