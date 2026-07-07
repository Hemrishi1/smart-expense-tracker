import express from 'express';
import { getAllUsers, deleteUser, getSystemStats } from '../controllers/admin.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

// Apply protect and admin middleware to all routes in this file
router.use(protect, admin);

router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/stats').get(getSystemStats);

export default router;
