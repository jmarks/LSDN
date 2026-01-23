import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../entities/User';
import { userService } from '../services/userService';
import { AppError } from '../types';

// Authentication middleware
export const authMiddleware = (requiredRoles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Authentication required'
          }
        });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      if (!token) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Access token is required'
          }
        });
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      if (!decoded.userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Invalid token format'
          }
        });
      }

      // Get user from database
      const user = await userService.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'User not found'
          }
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Account is inactive'
          }
        });
      }

      // Skip email verification check (temporary measure)

      // Check role permissions
      if (requiredRoles.length > 0) {
        const userRole = user.role || 'user';
        const hasPermission = requiredRoles.includes(userRole);

        if (!hasPermission) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'AUTHORIZATION_ERROR',
              message: 'Insufficient permissions'
            }
          });
        }
      }

      // Attach user to request
      req.user = user;
      return next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTHENTICATION_ERROR',
            message: 'Invalid or expired token'
          }
        });
      }

      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'TOKEN_EXPIRED',
            message: 'Token has expired'
          }
        });
      }

      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Authentication failed'
        }
      });
    }
  };
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    if (decoded.userId) {
      const user = await userService.findById(decoded.userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }

    return next();
  } catch (error) {
    // For optional auth, we don't fail on invalid tokens
    return next();
  }
};

// Admin-only middleware
export const adminOnly = authMiddleware(['admin', 'super_admin']);

// Partner-only middleware
export const partnerOnly = authMiddleware(['partner', 'admin', 'super_admin']);

// Verified user middleware
export const verifiedUser = authMiddleware(['user', 'partner', 'admin', 'super_admin']);

// Check if user owns resource
export const checkOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Authentication required'
        }
      });
    }

    const resourceId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    const userId = req.user.id;
    const userRole = req.user.role;

    if (resourceId && resourceId !== userId) {
      // Check if user is admin
      if (userRole !== 'admin' && userRole !== 'super_admin') {
        return res.status(403).json({
          success: false,
          error: {
            code: 'AUTHORIZATION_ERROR',
            message: 'Access denied: You can only access your own resources'
          }
        });
      }
    }

    return next();
  };
};

// Rate limiting by user
export const userRateLimit = (maxRequests: number, windowMs: number) => {
  const userRequests = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(); // Skip rate limiting for unauthenticated users
    }

    const userId = req.user.id;
    const now = Date.now();

    if (!userRequests.has(userId)) {
      userRequests.set(userId, { count: 0, resetTime: now + windowMs });
    }

    const userRequest = userRequests.get(userId);

    if (!userRequest) {
      return next(); // Shouldn't happen, but just in case
    }

    if (now > userRequest.resetTime) {
      userRequest.count = 0;
      userRequest.resetTime = now + windowMs;
    }

    if (userRequest.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please try again later.'
        }
      });
    }

    userRequest.count++;
    next();
  };
};

// Error handling middleware
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message
      }
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Invalid token'
      }
    });
  }

  const appError = err as AppError;

  return res.status(appError.statusCode || 500).json({
    success: false,
    error: {
      code: appError.code || 'INTERNAL_ERROR',
      message: appError.message || 'An unexpected error occurred'
    }
  });
};

// Not found middleware
export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
};

export const authenticate = authMiddleware();