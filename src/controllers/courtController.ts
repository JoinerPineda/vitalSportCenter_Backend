import { Request, Response } from 'express';
import { Court } from '../models/Court';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../middleware/auth';

export const getAllCourts = async (req: Request, res: Response) => {
  try {
    const { sport, location, page = 1, limit = 10 } = req.query;
    
    let filter: any = { isAvailable: true };
    
    if (sport) {
      filter.sport = sport;
    }
    
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const skip = (pageNum - 1) * limitNum;

    const courts = await Court.find(filter)
      .skip(skip)
      .limit(limitNum)
      .populate('admin', 'name email phone');

    const total = await Court.countDocuments(filter);

    res.status(200).json({
      courts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching courts', error: error.message });
  }
};

export const getCourtById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const court = await Court.findById(id).populate('admin', 'name email phone');

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.status(200).json({ court });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching court', error: error.message });
  }
};

export const createCourt = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, sport, location, price, description, capacity, amenities, image } = req.body;

    const court = new Court({
      name,
      sport,
      location,
      price,
      description,
      capacity,
      amenities: amenities || [],
      image,
      admin: req.userId,
      isAvailable: true,
    });

    await court.save();

    res.status(201).json({
      message: 'Court created successfully',
      court,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating court', error: error.message });
  }
};

export const updateCourt = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name, sport, location, price, description, capacity, amenities, image, isAvailable } = req.body;

    let court = await Court.findById(id);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    if (court.admin?.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this court' });
    }

    court = await Court.findByIdAndUpdate(
      id,
      {
        name,
        sport,
        location,
        price,
        description,
        capacity,
        amenities,
        image,
        isAvailable,
      },
      { new: true }
    );

    res.status(200).json({
      message: 'Court updated successfully',
      court,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating court', error: error.message });
  }
};

export const deleteCourt = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const court = await Court.findById(id);
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    if (court.admin?.toString() !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this court' });
    }

    await Court.findByIdAndDelete(id);

    res.status(200).json({ message: 'Court deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting court', error: error.message });
  }
};
