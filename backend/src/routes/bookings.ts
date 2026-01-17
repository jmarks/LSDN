import { Router, Request, Response } from 'express';
import dataSource from '../config/database';
import { Booking } from '../entities/Booking';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const bookingRepository = dataSource.getRepository(Booking);

/**
 * @route   GET /api/bookings
 * @desc    Get user's bookings
 * @access  Private
 */
router.get('/', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED',
      });
    }

    // For now, return dummy bookings data
    const dummyBookings = [
      {
        id: '1',
        packageName: 'Romantic Dinner for Two',
        restaurantName: 'The Golden Spoon',
        date: '2024-01-20',
        time: '19:30',
        status: 'confirmed',
      },
      {
        id: '2',
        packageName: 'Coffee & Conversation',
        restaurantName: 'Bean There Coffee Shop',
        date: '2024-01-25',
        time: '14:00',
        status: 'pending',
      },
    ];

    return res.json({
      success: true,
      data: dummyBookings,
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to fetch bookings',
      error: err.code,
    });
  }
});

/**
 * @route   PUT /api/bookings/:id/cancel
 * @desc    Cancel a booking
 * @access  Private
 */
router.put('/:id/cancel', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED',
      });
    }

    const { id } = req.params;

    // For now, just return success message
    return res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to cancel booking',
      error: err.code,
    });
  }
});

export default router;
