import { Router, Request, Response } from 'express';
import dataSource from '../config/database';
import { User } from '../entities/User';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const userRepository = dataSource.getRepository(User);

/**
 * @route   GET /api/matches
 * @desc    Get user's matches
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

    // For now, return dummy matches data
    const dummyMatches = [
      {
        id: '1',
        name: 'Jane Doe',
        age: 28,
        location: 'Los Angeles, CA',
        bio: 'Food lover and travel enthusiast looking for someone to explore new cuisines with.',
        lastMessage: 'Hey! How are you?',
        lastMessageTime: '2 hours ago',
      },
      {
        id: '2',
        name: 'Sarah Smith',
        age: 32,
        location: 'San Francisco, CA',
        bio: 'Coffee addict and book worm searching for meaningful connections.',
        lastMessage: 'That sounds amazing!',
        lastMessageTime: 'Yesterday',
      },
    ];

    return res.json({
      success: true,
      data: dummyMatches,
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to fetch matches',
      error: err.code,
    });
  }
});

/**
 * @route   POST /api/matches/interest
 * @desc    Express interest in a user
 * @access  Private
 */
router.post('/interest', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED',
      });
    }

    const { targetUserId, interested } = req.body;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required',
        error: 'MISSING_TARGET_USER_ID',
      });
    }

    if (req.user.id === targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot express interest in yourself',
        error: 'CANNOT_MATCH_SELF',
      });
    }

    return res.json({
      success: true,
      message: interested ? 'Interest expressed successfully' : 'Interest removed successfully',
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to express interest',
      error: err.code,
    });
  }
});

export default router;
