import express from 'express';
const router = express.Router();

import { getAllUsers, updateUser, deleteUser } from '../controllers/user.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';

// Get all users → Admin only
router.get('/', authenticate, authorize('admin'), getAllUsers);

// Update user → Admin only
router.put('/:id', authenticate, authorize('admin'), updateUser);

// Delete user → Admin only
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;