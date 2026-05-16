import express from 'express';
import { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/apply', applyLeave);
router.get('/my-leaves', getMyLeaves);

// Only Admin and Teacher can see/update all leaves
router.get('/all', authorize('Admin', 'Teacher'), getAllLeaves);
router.put('/:id/status', authorize('Admin', 'Teacher'), updateLeaveStatus);

export default router;
