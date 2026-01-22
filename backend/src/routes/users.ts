import { Router, Request, Response } from 'express';
import { userService } from '../services/userService';
import { authMiddleware } from '../middleware/auth';
import { validateProfileUpdate } from '../middleware/validation';
import discoverRoutes from './users/discover';

const router = Router();

// Discover users route
router.use('/discover', discoverRoutes);

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    const userId = req.user.id;
    const user = await userService.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    return res.json({
      success: true,
      data: {
        user: user.sanitize()
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to get user profile',
      error: err.code
    });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware(), (req, res, next) => {
  console.log('=== Profile Update Request ===');
  console.log('Body:', req.body);
  console.log('Body keys:', Object.keys(req.body));
  next();
}, validateProfileUpdate, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    const updateData = req.body;
    const userId = req.user.id;
    const user = await userService.updateProfile(userId, updateData);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.sanitize()
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to update profile',
      error: err.code
    });
  }
});

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const stats = await userService.getUserStats(req.user.id);

    return res.json({
      success: true,
      data: {
        stats
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to get user stats',
      error: err.code
    });
  }
});

/**
 * @route   GET /api/users/packages
 * @desc    Get user packages
 * @access  Private
 */
router.get('/packages', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const packages = await userService.getUserPackages(req.user.id);

    return res.json({
      success: true,
      data: {
        packages
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to get user packages',
      error: err.code
    });
  }
});

/**
 * @route   GET /api/users/bookings
 * @desc    Get user bookings
 * @access  Private
 */
router.get('/bookings', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const bookings = await userService.getUserBookings(req.user.id);

    return res.json({
      success: true,
      data: {
        bookings
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to get user bookings',
      error: err.code
    });
  }
});

/**
 * @route   GET /api/users/messages
 * @desc    Get user messages
 * @access  Private
 */
router.get('/messages', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const limit = parseInt(req.query.limit as string) || 50;
    const messages = await userService.getUserMessages(req.user.id, limit);

    return res.json({
      success: true,
      data: {
        messages
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to get user messages',
      error: err.code
    });
  }
});

/**
 * @route   GET /api/users/matching-requests
 * @desc    Get user matching requests
 * @access  Private
 */
router.get('/matching-requests', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const matchingRequests = await userService.getUserMatchingRequests(req.user.id);

    return res.json({
      success: true,
      data: {
        matchingRequests
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to get user matching requests',
      error: err.code
    });
  }
});

/**
 * @route   GET /api/users/search
 * @desc    Search users
 * @access  Private
 */
router.get('/search', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 20;

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long',
        error: 'INVALID_QUERY'
      });
    }

    const users = await userService.searchUsers(query, limit);

    return res.json({
      success: true,
      data: {
        users
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to search users',
      error: err.code
    });
  }
});

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const result = await userService.delete(req.user.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    return res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to delete account',
      error: err.code
    });
  }
});

export default router;