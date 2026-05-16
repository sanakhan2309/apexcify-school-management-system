import express from 'express';
import { 
    markAttendance, getTeacherClasses, uploadMaterial, 
    createExam, getTeacherExams, getTeacherResults 
} from '../controllers/teacherController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Teacher'));

router.get('/classes', getTeacherClasses);
router.post('/attendance', markAttendance);
router.post('/materials', uploadMaterial);
router.post('/exams', createExam);
router.get('/exams', getTeacherExams);
router.get('/exams/:examId/results', getTeacherResults);

export default router;
