import { Router, Request, Response } from 'express';
import dataSource from '../config/database';
import { Package } from '../entities/Package';
import { UserPackage } from '../entities/UserPackage';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const packageRepository = dataSource.getRepository(Package);
const userPackageRepository = dataSource.getRepository(UserPackage);

/**
 * @route   GET /api/packages
 * @desc    Get all available packages
 * @access  Private
 */
router.get('/', authMiddleware(), async (req: Request, res: Response) => {
  try {
    const packages = await packageRepository.find({
      order: { price: 'ASC' },
      relations: ['restaurant']
    });

    return res.json({
      success: true,
      data: {
        packages,
      },
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to fetch packages',
      error: err.code,
    });
  }
});

/**
 * @route   GET /api/packages/:id
 * @desc    Get package by ID
 * @access  Public
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const pkg = await packageRepository.findOne({
      where: { id },
      relations: ['restaurant']
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
        error: 'PACKAGE_NOT_FOUND',
      });
    }

    return res.json({
      success: true,
      data: {
        package: pkg,
      },
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to fetch package',
      error: err.code,
    });
  }
});

/**
 * @route   POST /api/packages/:id/purchase
 * @desc    Purchase a package
 * @access  Private
 */
router.post('/:id/purchase', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED',
      });
    }

    const { id } = req.params;
    const pkg = await packageRepository.findOne({
      where: { id },
      relations: ['restaurant']
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Package not found',
        error: 'PACKAGE_NOT_FOUND',
      });
    }

    // Check if user already has this package
    const existingUserPackage = await userPackageRepository.findOne({
      where: {
        userId: req.user.id,
        packageId: id,
      },
    });

    if (existingUserPackage) {
      return res.status(400).json({
        success: false,
        message: 'Package already purchased',
        error: 'PACKAGE_ALREADY_PURCHASED',
      });
    }

    // Create user package record
    const userPackage = userPackageRepository.create({
      userId: req.user.id,
      packageId: id,
      datesPurchased: pkg.datesCount,
      datesUsed: 0,
      purchaseDate: new Date(),
      status: 'active',
    });

    await userPackageRepository.save(userPackage);

    return res.json({
      success: true,
      message: 'Package purchased successfully',
      data: {
        userPackage,
      },
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to purchase package',
      error: err.code,
    });
  }
});

export default router;
