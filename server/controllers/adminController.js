import User from '../models/User.js';
import Class from '../models/Class.js';
import Subject from '../models/Subject.js';
import Fee from '../models/Fee.js';
import Timetable from '../models/Timetable.js';
import { sendEmail } from '../utils/emailService.js';
import { generateInvoicePDFBuffer } from '../utils/pdfGeneratorBackend.js';

// --- User Management ---
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').lean();
        
        // Fetch all classes to map students to their classes
        const classes = await Class.find().select('name section students');
        
        const usersWithClass = users.map(user => {
            if (user.role === 'Student') {
                const studentClass = classes.find(c => 
                    c.students.some(sId => sId.toString() === user._id.toString())
                );
                return {
                    ...user,
                    classInfo: studentClass ? { _id: studentClass._id, name: studentClass.name, section: studentClass.section } : null
                };
            }
            return user;
        });

        res.json(usersWithClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignStudentToClass = async (req, res) => {
    try {
        const { studentId, classId } = req.body;

        // 1. Remove student from all other classes
        await Class.updateMany(
            { students: studentId },
            { $pull: { students: studentId } }
        );

        // 2. Add student to the new class (if classId is provided)
        if (classId) {
            await Class.findByIdAndUpdate(
                classId,
                { $addToSet: { students: studentId } }
            );
        }

        res.json({ message: 'Student class updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const assignChildrenToParent = async (req, res) => {
    try {
        const { parentId, childrenIds } = req.body;
        const updatedParent = await User.findByIdAndUpdate(
            parentId,
            { children: childrenIds },
            { new: true }
        ).populate('children', 'name email');
        res.json(updatedParent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- Class Management ---
export const createClass = async (req, res) => {
    try {
        const newClass = await Class.create(req.body);
        res.status(201).json(newClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find()
            .populate('teacher', 'name email')
            .populate('subjects', 'name code')
            .populate('students', 'name email');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClass = async (req, res) => {
    try {
        const updatedClass = await Class.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('teacher', 'name email');
        res.json(updatedClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteClass = async (req, res) => {
    try {
        await Class.findByIdAndDelete(req.params.id);
        res.json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClassStudents = async (req, res) => {
    try {
        const { students } = req.body;
        const updatedClass = await Class.findByIdAndUpdate(
            req.params.id,
            { students },
            { new: true }
        ).populate('students', 'name email');
        res.json(updatedClass);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// --- Subject Management ---
export const createSubject = async (req, res) => {
    try {
        const newSubject = await Subject.create(req.body);
        res.status(201).json(newSubject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('teacher', 'name email');
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSubject = async (req, res) => {
    try {
        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('teacher', 'name email');
        res.json(updatedSubject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Fee Management ---
export const createFeeInvoice = async (req, res) => {
    try {
        const { studentId, amount, dueDate, description } = req.body;
        const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        const fee = await Fee.create({
            student: studentId,
            amount,
            dueDate,
            description,
            invoiceNumber,
            status: 'Unpaid'
        });

        // Fetch student email
        const student = await User.findById(studentId);
        if (student && student.email) {
            // Generate PDF Buffer for attachment
            const pdfBuffer = await generateInvoicePDFBuffer(fee, student);

            await sendEmail(
                student.email,
                'New Fee Invoice Generated',
                `Hello ${student.name}, a new fee invoice (${invoiceNumber}) for amount $${amount} has been generated. Due date: ${new Date(dueDate).toLocaleDateString()}.`,
                `<h1>Fee Invoice Generated</h1><p>Hello ${student.name},</p><p>A new fee invoice <b>${invoiceNumber}</b> for amount <b>$${amount}</b> has been generated.</p><p>Due date: ${new Date(dueDate).toLocaleDateString()}</p><p>Please pay before the due date.</p><p>Find the attached invoice for details.</p>`,
                [
                    {
                        filename: `Invoice_${invoiceNumber}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf'
                    }
                ]
            );
        }
        
        res.status(201).json(fee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find().populate('student', 'name email');
        res.json(fees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Timetable Management ---
export const createTimetableEntry = async (req, res) => {
    try {
        const entry = await Timetable.create(req.body);
        res.status(201).json(entry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getTimetableByClass = async (req, res) => {
    try {
        const timetable = await Timetable.find({ class: req.params.classId })
            .populate('subject teacher', 'name');
        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- Dashboard Stats ---
export const getDashboardStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'Student' });
        const teacherCount = await User.countDocuments({ role: 'Teacher' });
        const classCount = await Class.countDocuments();
        const pendingFees = await Fee.countDocuments({ status: 'Unpaid' });
        
        res.json({
            students: studentCount,
            teachers: teacherCount,
            classes: classCount,
            pendingFees
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
