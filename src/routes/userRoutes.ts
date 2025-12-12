import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get all users
router.get('/', authenticate, getAllUsers);

// Get user by ID
router.get('/:id', authenticate, getUserById);

// Create new user (admin only)
router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  createUser
);

// Update user
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional().notEmpty(),
    body('email').optional().isEmail(),
    body('phone').optional(),
    body('role').optional().isIn(['client', 'admin']),
  ],
  updateUser
);

// Delete user
router.delete('/:id', authenticate, deleteUser);

export default router;
