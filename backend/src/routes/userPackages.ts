import { Router } from 'express';
import { packageService } from '../services/packageService';
import { cartService } from '../services/cartService';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get user's purchased packages
router.get('/', authenticate, async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const packages = await packageService.getUserPackages(userId);
        res.json({ success: true, data: { packages } });
        return;
    } catch (error) {
        return next(error);
    }
});

// Mock purchase endpoint (converts cart to purchase)
router.post('/purchase', authenticate, async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const cart = await cartService.getCart(userId);

        if (!cart) {
            return res.status(400).json({ success: false, error: 'Shopping cart is empty' });
        }

        // Process purchase
        const userPackage = await packageService.purchasePackage(userId, cart.packageId);

        // Clear cart after successful purchase
        await cartService.clearCart(userId);

        res.json({
            success: true,
            message: 'Purchase successful (Mock Stripe integration)',
            data: { userPackage }
        });
        return;
    } catch (error) {
        return next(error);
    }
});

export default router;
