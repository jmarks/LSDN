import { Router } from 'express';
import { interestTagService } from '../services/interestTagService';
import { authenticate } from '../middleware/auth';

const router = Router();

// Get all tags
router.get('/', async (req, res, next) => {
    try {
        const tags = await interestTagService.getAllTags();
        return res.json({ success: true, data: { tags } });
    } catch (error) {
        return next(error);
    }
});

// Search tags
router.get('/search', async (req, res, next) => {
    try {
        const { q } = req.query;
        const tags = await interestTagService.searchTags(q as string || '');
        return res.json({ success: true, data: { tags } });
    } catch (error) {
        return next(error);
    }
});

// Create new tag (protected)
router.post('/', authenticate, async (req, res, next) => {
    try {
        const userId = (req as any).user.id;
        const { name } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Tag name is required' });
        }

        // Custom logic for 2-word limit
        const words = name.trim().split(/\s+/);
        if (words.length > 2) {
            return res.status(400).json({ success: false, error: 'Tag name must be at most 2 words' });
        }

        const tag = await interestTagService.createTag(name.trim(), userId);
        return res.json({ success: true, message: 'Tag created', data: { tag } });
    } catch (error) {
        return next(error);
    }
});

export default router;
