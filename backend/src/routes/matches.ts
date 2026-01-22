import { Router, Request, Response } from 'express';
import dataSource from '../config/database';
import { User } from '../entities/User';
import { authMiddleware } from '../middleware/auth';
import { MatchingRequest } from '../entities/MatchingRequest';
import { Point } from 'geojson';

const router = Router();
const userRepository = dataSource.getRepository(User);
const matchingRequestRepository = dataSource.getRepository(MatchingRequest);

/**
 * @route   GET /api/matches
 * @desc    Get user's potential matches based on proximity and preferences
 * @access  Private
 */
router.get('/', authMiddleware(), async (req: Request, res: Response) => {
  try {
    const currentUser = req.user as User;
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED',
      });
    }

    // Get current user's location and radius preference
    const { coordinates } = currentUser.location;
    const [lon, lat] = coordinates;
    const radiusMeters = currentUser.radiusPreference * 1609.34;

    // Build real PostGIS matching query
    // Filters: 
    // 1. Within radius
    // 2. Not self
    // 3. Age range (if possible)
    // 4. Partner status? (maybe users have a setting)

    const potentialMatches = await userRepository
      .createQueryBuilder('user')
      .where('ST_DWithin(user.location, ST_SetSRID(ST_Point(:lon, :lat), 4326), :rad)', {
        lon,
        lat,
        rad: radiusMeters
      })
      .andWhere('user.id != :currentUserId', { currentUserId: currentUser.id })
      // Adding age filter from preferences
      .andWhere('user.dateOfBirth <= :ageMaxDate', {
        ageMaxDate: new Date(new Date().setFullYear(new Date().getFullYear() - (currentUser.ageRangeMin || 18)))
      })
      .andWhere('user.dateOfBirth >= :ageMinDate', {
        ageMinDate: new Date(new Date().setFullYear(new Date().getFullYear() - (currentUser.ageRangeMax || 99)))
      })
      .take(20)
      .getMany();

    // Map to the format frontend expects
    const formattedMatches = potentialMatches.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      age: user.age,
      location: `${user.city}, ${user.state}`,
      bio: user.bio,
      distance: (user as any).distance ? parseFloat(((user as any).distance / 1609.34).toFixed(1)) : null,
      interests: user.interests,
      matchScore: Math.floor(Math.random() * 20) + 80, // placeholder algorithm
      profilePhotoUrl: user.profilePhotoUrl
    }));

    return res.json({
      success: true,
      data: formattedMatches,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch matches'
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
    const currentUser = req.user as User;
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { targetUserId, interested } = req.body;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        message: 'Target user ID is required'
      });
    }

    // In a full implementation, we'd store this in a Matches or Interests table
    // For the demo, we'll suggest a "Match Request" which is already an entity

    return res.json({
      success: true,
      message: interested ? 'Interest expressed successfully' : 'Interest removed successfully',
      data: { targetUserId, interested }
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to express interest'
    });
  }
});

export default router;
