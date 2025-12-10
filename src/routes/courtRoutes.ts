import express from 'express';
import { body } from 'express-validator';
import {
  getAllCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
} from '../controllers/courtController';
import { authenticate, adminOnly } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllCourts);

router.get('/:id', getCourtById);

router.post(
  '/',
  authenticate,
  adminOnly,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('sport').notEmpty().withMessage('Sport is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  createCourt
);

router.put(
  '/:id',
  authenticate,
  adminOnly,
  [
    body('name').optional().notEmpty(),
    body('price').optional().isNumeric(),
  ],
  updateCourt
);

router.delete('/:id', authenticate, adminOnly, deleteCourt);

export default router;
