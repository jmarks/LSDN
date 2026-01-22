import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

// Validation schemas
export const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(/^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'"|,.<>\/?]).*$/).required(),
  name: Joi.string().min(2).max(100).required(),
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  dateOfBirth: Joi.date().max('now').min('1900-01-01'),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say'),
  location: Joi.object({
    type: Joi.string().valid('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2)
  }),
  city: Joi.string().min(1).max(100),
  state: Joi.string().min(1).max(100),
  country: Joi.string().min(1).max(100),
  zipCode: Joi.string().min(1).max(20)
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const profileUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  bio: Joi.string().max(500),
  interests: Joi.array().items(Joi.string()),
  languages: Joi.array().items(Joi.string().length(2)),
  dietaryRestrictions: Joi.array().items(Joi.string()),
  relationshipGoals: Joi.array().items(Joi.string()),
  radiusPreference: Joi.number().min(1).max(100),
  ageRangeMin: Joi.number().min(18).max(100),
  ageRangeMax: Joi.number().min(18).max(100).greater(Joi.ref('ageRangeMin')),
  location: Joi.object({
    type: Joi.string().valid('Point'),
    coordinates: Joi.array().items(Joi.number()).length(2)
  }),
  age: Joi.number().min(18).max(100),
  profilePhotoUrl: Joi.string().allow(null),
  profilePicture: Joi.string().allow(null) // Keep for backward compatibility
}).unknown(false);

export const matchingRequestSchema = Joi.object({
  preferredTimeStart: Joi.date().iso().required(),
  preferredTimeEnd: Joi.date().iso().min(Joi.ref('preferredTimeStart')).required(),
  experienceTypes: Joi.array().items(Joi.string().valid('dinner', 'dessert_walk', 'activity_drink')).min(1).required(),
  maxDistance: Joi.number().min(1).max(100).required(),
  durationHours: Joi.number().min(1).max(12)
});

export const emailVerificationSchema = Joi.object({
  token: Joi.string().required()
});

export const passwordResetSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).pattern(/^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'"|,.<>\/?]).*$/).required()
});

// Validation middleware factory
export function validateSchema(schema: Joi.Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errorMessages
        }
      });
    }

    return next();
  };
}

// Specific validation middleware
export const validateRegistration = validateSchema(registrationSchema);
export const validateLogin = validateSchema(loginSchema);
export const validateProfileUpdate = validateSchema(profileUpdateSchema);
export const validateMatchingRequest = validateSchema(matchingRequestSchema);
export const validateEmailVerification = validateSchema(emailVerificationSchema);
export const validatePasswordReset = validateSchema(passwordResetSchema);

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Basic XSS prevention - remove potentially dangerous characters
  const sanitizeString = (str: string) => {
    return str.replace(/[<>\"'&]/g, '');
  };

  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      return sanitizeString(obj);
    } else if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitizeObject(req.body);
  next();
}

// Rate limiting middleware
export function createRateLimiter(maxAttempts: number, windowMs: number, message: string) {
  const attempts = new Map<string, { count: number; resetTime: number }>();
 
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip + (req.user?.id || '');
    const now = Date.now();
    const attempt = attempts.get(key);
     
    if (!attempts.has(key)) {
      attempts.set(key, { count: 0, resetTime: now + windowMs });
    }
 
    if (!attempt) {
      return next(); // Shouldn't happen, but just in case
    }
 
    if (now > attempt.resetTime) {
      attempt.count = 0;
      attempt.resetTime = now + windowMs;
    }
 
    if (attempt.count >= maxAttempts) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: message
        }
      });
    }
 
    attempt.count++;
    next();
  };
}

// Common rate limiters
export const authRateLimit = createRateLimiter(5, 15 * 60 * 1000, 'Too many authentication attempts. Please try again later.');
export const generalRateLimit = createRateLimiter(100, 15 * 60 * 1000, 'Too many requests. Please try again later.');