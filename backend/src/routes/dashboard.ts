import { Router } from 'express';
import { dashboardService } from '../services/dashboardService';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get dashboard stats
router.get('/stats', authenticate, async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const stats = await dashboardService.getDashboardStats(userId);
        res.json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
});

export default router;
