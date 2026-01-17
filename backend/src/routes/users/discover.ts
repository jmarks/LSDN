import { Router, Request, Response } from 'express';
import dataSource from '../../config/database';
import { User } from '../../entities/User';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const userRepository = dataSource.getRepository(User);

/**
 * @route   GET /api/users/discover
 * @desc    Discover new users for matching
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

    // For now, return dummy users data
    const dummyUsers = [
      {
        id: '1',
        name: 'Jane Doe',
        age: 28,
        location: 'Los Angeles, CA',
        bio: 'Food lover and travel enthusiast looking for someone to explore new cuisines with.',
      },
      {
        id: '2',
        name: 'Sarah Smith',
        age: 32,
        location: 'San Francisco, CA',
        bio: 'Coffee addict and book worm searching for meaningful connections.',
      },
      {
        id: '3',
        name: 'Emily Johnson',
        age: 26,
        location: 'New York, NY',
        bio: 'Artist and nature lover seeking a partner for adventures.',
      },
    ];

    return res.json({
      success: true,
      data: dummyUsers,
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to fetch users',
      error: err.code,
    });
  }
});

export default router;
