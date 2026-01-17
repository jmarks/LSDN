import { Router, Request, Response } from 'express';
import dataSource from '../config/database';
import { Message } from '../entities/Message';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const messageRepository = dataSource.getRepository(Message);

/**
 * @route   GET /api/messages/conversations
 * @desc    Get user's conversations
 * @access  Private
 */
router.get('/conversations', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED',
      });
    }

    // For now, return dummy conversations data
    const dummyConversations = [
      {
        id: '1',
        name: 'Jane Doe',
        avatar: 'JD',
        lastMessage: 'Hey! How are you?',
        lastMessageTime: '2 hours ago',
        unreadCount: 1,
      },
      {
        id: '2',
        name: 'Sarah Smith',
        avatar: 'SS',
        lastMessage: 'That sounds amazing!',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
      },
    ];

    return res.json({
      success: true,
      data: dummyConversations,
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to fetch conversations',
      error: err.code,
    });
  }
});

/**
 * @route   GET /api/messages/conversations/:id
 * @desc    Get conversation messages
 * @access  Private
 */
router.get('/conversations/:id', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED',
      });
    }

    const { id } = req.params;

    // For now, return dummy messages data
    const dummyMessages = [
      {
        id: '1',
        senderId: '1',
        receiverId: req.user.id,
        content: 'Hey! How are you?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        senderId: req.user.id,
        receiverId: '1',
        content: 'I\'m doing great! How about you?',
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return res.json({
      success: true,
      data: dummyMessages,
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to fetch messages',
      error: err.code,
    });
  }
});

/**
 * @route   POST /api/messages/conversations/:id
 * @desc    Send a message
 * @access  Private
 */
router.post('/conversations/:id', authMiddleware(), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED',
      });
    }

    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
        error: 'MISSING_MESSAGE_CONTENT',
      });
    }

    // For now, return dummy message
    const dummyMessage = {
      id: Date.now().toString(),
      senderId: req.user.id,
      receiverId: id,
      content,
      timestamp: new Date().toISOString(),
    };

    return res.json({
      success: true,
      message: 'Message sent successfully',
      data: dummyMessage,
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Failed to send message',
      error: err.code,
    });
  }
});

export default router;
