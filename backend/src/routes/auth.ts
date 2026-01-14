import { Router, Request, Response } from 'express';
import { authService } from '../services/authService';
import { validateRegistration, validateLogin, validateEmailVerification, validatePasswordReset } from '../middleware/validation';
import { authMiddleware } from '../middleware/auth';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegistration, async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const result = await authService.register(userData);
     
    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification.',
      data: {
        user: result.user.sanitize(),
        token: result.token
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Registration failed',
      error: err.code
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
     
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user.sanitize(),
        token: result.token,
        refreshToken: result.refreshToken
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 401).json({
      success: false,
      message: err.message || 'Login failed',
      error: err.code
    });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT token
 * @access  Public
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: result.token,
        refreshToken: result.refreshToken
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 401).json({
      success: false,
      message: err.message || 'Token refresh failed',
      error: err.code
    });
  }
});

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', validateEmailVerification, async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    const user = await authService.verifyEmail(token);
    
    res.json({
      success: true,
      message: 'Email verified successfully',
      data: {
        user: user.sanitize()
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || 'Email verification failed',
      error: err.code
    });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    
    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Password reset request failed',
      error: err.code
    });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password
 * @access  Public
 */
router.post('/reset-password', validatePasswordReset, async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    const user = await authService.resetPassword(token, password);
    
    res.json({
      success: true,
      message: 'Password reset successful',
      data: {
        user: user.sanitize()
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || 'Password reset failed',
      error: err.code
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (invalidate token)
 * @access  Private
 */
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    const userId = req.user.id;
    await authService.logout(userId);
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Logout failed',
      error: err.code
    });
  }
});

/**
 * @route   POST /api/auth/2fa/enable
 * @desc    Enable 2FA
 * @access  Private
 */
router.post('/2fa/enable', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    const userId = req.user.id;
    const result = await authService.enable2FA(userId);
    
    res.json({
      success: true,
      message: '2FA enabled successfully',
      data: {
        qrCode: result.qrCode,
        secret: result.secret
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || '2FA enable failed',
      error: err.code
    });
  }
});

/**
 * @route   POST /api/auth/2fa/disable
 * @desc    Disable 2FA
 * @access  Private
 */
router.post('/2fa/disable', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'AUTHENTICATION_REQUIRED'
      });
    }
    const userId = req.user.id;
    const { token } = req.body;
    await authService.disable2FA(userId, token);
    
    res.json({
      success: true,
      message: '2FA disabled successfully'
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 400).json({
      success: false,
      message: err.message || '2FA disable failed',
      error: err.code
    });
  }
});

/**
 * @route   POST /api/auth/2fa/verify
 * @desc    Verify 2FA token
 * @access  Public
 */
router.post('/2fa/verify', async (req: Request, res: Response) => {
  try {
    const { email, password, totpToken } = req.body;
    const result = await authService.verify2FA(email, password, totpToken);
    
    res.json({
      success: true,
      message: '2FA verification successful',
      data: {
        user: result.user.sanitize(),
        token: result.token,
        refreshToken: result.refreshToken
      }
    });
  } catch (error: unknown) {
    const err = error as Error & { statusCode?: number; code?: string };
    res.status(err.statusCode || 401).json({
      success: false,
      message: err.message || '2FA verification failed',
      error: err.code
    });
  }
});

export default router;