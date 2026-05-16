import express from 'express';
import { 
    getStudentAttendance, getStudentMaterials, 
    getStudentTimetable, getAvailableExams, submitExam,
    getStudentClass 
} from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Student'));

router.get('/my-class', getStudentClass);
router.get('/attendance', getStudentAttendance);
router.get('/materials', getStudentMaterials);
router.get('/timetable', getStudentTimetable);
router.get('/exams', getAvailableExams);
router.post('/exams/submit', submitExam);

export default router;
