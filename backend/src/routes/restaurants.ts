import { Router, Request, Response } from 'express';
import dataSource from '../config/database';
import { Restaurant } from '../entities/Restaurant';
import { authMiddleware } from '../middleware/auth';
import { Between } from 'typeorm';

const router = Router();
const restaurantRepository = dataSource.getRepository(Restaurant);

/**
 * @route   GET /api/restaurants
 * @desc    Get all approved restaurants
 * @access  Private
 */
router.get('/', authMiddleware(), async (req: Request, res: Response) => {
    try {
        const restaurants = await restaurantRepository.find({
            where: { partnerStatus: 'approved' },
            relations: ['packages'],
            order: { name: 'ASC' }
        });

        return res.json({
            success: true,
            data: restaurants
        });
    } catch (error: unknown) {
        const err = error as Error;
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to fetch restaurants'
        });
    }
});

/**
 * @route   GET /api/restaurants/nearby
 * @desc    Find restaurants near coordinates
 * @access  Private
 */
router.get('/nearby', authMiddleware(), async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, radius = 25 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
        }

        const lat = parseFloat(latitude as string);
        const lon = parseFloat(longitude as string);
        const radMeters = parseFloat(radius as string) * 1609.34; // Miles to meters

        // Using raw SQL for PostGIS distance query via TypeORM
        const restaurants = await restaurantRepository
            .createQueryBuilder('restaurant')
            .where('ST_DWithin(restaurant.location, ST_SetSRID(ST_Point(:lon, :lat), 4326), :rad)', {
                lon,
                lat,
                rad: radMeters
            })
            .andWhere('restaurant.partnerStatus = :status', { status: 'approved' })
            .leftJoinAndSelect('restaurant.packages', 'package')
            .getMany();

        return res.json({
            success: true,
            data: restaurants
        });
    } catch (error: unknown) {
        const err = error as Error;
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to find nearby restaurants'
        });
    }
});

/**
 * @route   GET /api/restaurants/:id
 * @desc    Get restaurant by ID
 * @access  Private
 */
router.get('/:id', authMiddleware(), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const restaurant = await restaurantRepository.findOne({
            where: { id },
            relations: ['packages', 'availabilitySlots']
        });

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        return res.json({
            success: true,
            data: restaurant
        });
    } catch (error: unknown) {
        const err = error as Error;
        return res.status(500).json({
            success: false,
            message: err.message || 'Failed to fetch restaurant'
        });
    }
});

export default router;
