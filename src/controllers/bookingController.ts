import { Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { court, date, startTime, endTime, duration, paymentMethod, notes } = req.body;

    const existingBooking = await Booking.findOne({
      court,
      date,
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
      ],
      status: { $in: ['confirmed', 'pending'] },
    });

    if (existingBooking) {
      return res.status(409).json({ message: 'Time slot already booked' });
    }

    // Calculate total price (this would come from court price)
    const totalPrice = duration * 50000; // Example: 50000 COP per hour
    const serviceFee = Math.round(totalPrice * 0.05);

    const booking = new Booking({
      user: req.userId,
      court,
      date,
      startTime,
      endTime,
      duration,
      totalPrice,
      serviceFee,
      paymentMethod,
      notes,
      status: 'pending',
    });

    await booking.save();
    await booking.populate('user court');

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let filter: any = { user: req.userId };

    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(filter)
      .skip(skip)
      .limit(limitNum)
      .populate('user court')
      .sort({ date: -1 });

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate('user court');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.status(200).json({ booking });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();
    await booking.populate('user court');

    res.status(200).json({
      message: 'Booking status updated',
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { status, page = 1, limit = 10 } = req.query;

    let filter: any = {};

    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const bookings = await Booking.find(filter)
      .skip(skip)
      .limit(limitNum)
      .populate('user court')
      .sort({ date: -1 });

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      bookings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};
