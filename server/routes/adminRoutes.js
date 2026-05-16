import express from 'express';
import { 
    getAllUsers, deleteUser, updateUser, createClass, getAllClasses, updateClass, deleteClass, updateClassStudents,
    assignStudentToClass, assignChildrenToParent,
    createSubject, getAllSubjects, updateSubject, deleteSubject, createFeeInvoice, getAllFees,
    createTimetableEntry, getTimetableByClass, getDashboardStats 
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes here are protected and only for Admin
router.use(protect);

// Routes accessible by both Admin and Teacher
router.get('/subjects', authorize('Admin', 'Teacher'), getAllSubjects);
router.get('/users', authorize('Admin', 'Teacher'), getAllUsers);

// Routes only for Admin
router.use(authorize('Admin'));

router.get('/stats', getDashboardStats);

router.delete('/users/:id', deleteUser);
router.put('/users/:id', updateUser);
router.post('/users/assign-class', assignStudentToClass);
router.post('/users/assign-children', assignChildrenToParent);

router.post('/classes', createClass);
router.get('/classes', getAllClasses);
router.put('/classes/:id', updateClass);
router.delete('/classes/:id', deleteClass);
router.put('/classes/:id/students', updateClassStudents);

router.post('/subjects', createSubject);
router.put('/subjects/:id', updateSubject);
router.delete('/subjects/:id', deleteSubject);

router.post('/fees', createFeeInvoice);
router.get('/fees', getAllFees);

router.post('/timetable', createTimetableEntry);
router.get('/timetable/:classId', getTimetableByClass);

export default router;
