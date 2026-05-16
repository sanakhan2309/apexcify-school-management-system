import express from 'express';
import { getChildrenStats } from '../controllers/parentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('Parent'));

router.get('/children-stats', getChildrenStats);

export default router;
