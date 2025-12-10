import express from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
} from '../controllers/bookingController';
import { authenticate, adminOnly } from '../middleware/auth';

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('court').notEmpty().withMessage('Court is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  ],
  createBooking
);

router.get('/my-bookings', authenticate, getMyBookings);

router.get('/all', authenticate, adminOnly, getAllBookings);

router.get('/:id', authenticate, getBookingById);

router.patch(
  '/:id/status',
  authenticate,
  [body('status').notEmpty().withMessage('Status is required')],
  updateBookingStatus
);

router.delete('/:id', authenticate, cancelBooking);

export default router;
