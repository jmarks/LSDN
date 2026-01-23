import { Router } from 'express';
import { cartService } from '../services/cartService';
import { authenticate } from '../middleware/auth';
import { logger } from '../utils/logger';

const router = Router();

// Get user's cart
router.get('/', authenticate, async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const cart = await cartService.getCart(userId);
        return res.json({ success: true, data: { cart } });
    } catch (error) {
        return next(error);
    }
});

// Add package to cart (replaces existing as per requirements)
router.post('/', authenticate, async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const { packageId } = req.body;

        if (!packageId) {
            return res.status(400).json({ success: false, error: 'packageId is required' });
        }

        const cart = await cartService.addToCart(userId, packageId);
        return res.json({ success: true, message: 'Package added to cart', data: { cart } });
    } catch (error) {
        return next(error);
    }
});

// Clear cart
router.delete('/', authenticate, async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        await cartService.clearCart(userId);
        return res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        return next(error);
    }
});

export default router;
