import express from 'express';
const router = express.Router();

import { createRecord, getRecords, updateRecord, deleteRecord } from '../controllers/record.controller.js';
import authenticate from '../middleware/auth.middleware.js';
import authorize from '../middleware/role.middleware.js';

// Create → Admin only
router.post('/', authenticate, authorize('admin'), createRecord);

// Get → All roles
router.get('/', authenticate, authorize('admin', 'analyst', 'viewer'), getRecords);

// Update → Admin only
router.put('/:id', authenticate, authorize('admin'), updateRecord);

// Delete → Admin only
router.delete('/:id', authenticate, authorize('admin'), deleteRecord);

export default router;