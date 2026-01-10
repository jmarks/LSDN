import { User } from '../entities/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// Authentication types
export interface AuthPayload {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// User types
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  interests?: string[];
  languages?: string[];
  dietaryRestrictions?: string[];
  radiusPreference?: number;
  ageRangeMin?: number;
  ageRangeMax?: number;
  location?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

// Matching types
export interface MatchingRequest {
  preferredTimeStart: string;
  preferredTimeEnd: string;
  experienceTypes: string[];
  maxDistance: number;
  durationHours?: number;
}

export interface Candidate {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    profilePhotoUrl?: string;
    bio?: string;
    interests: string[];
    languages: string[];
    verifiedAt?: Date;
  };
  restaurant: {
    id: string;
    name: string;
    distance: number;
  };
  package: {
    id: string;
    name: string;
    price: number;
  };
  bookingTime: string;
  matchScore: number;
  reasons: string[];
  askedAt?: Date;
  askCount: number;
  maxAsks: number;
}

// Restaurant types
export interface RestaurantData {
  name: string;
  description?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  phone?: string;
  email?: string;
  websiteUrl?: string;
  cuisineType: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  capacity: number;
}

// Package types
export interface PackageData {
  name: string;
  description?: string;
  price: number;
  serviceFeePercentage?: number;
  experienceType: 'dinner' | 'dessert_walk' | 'activity_drink';
  durationMinutes: number;
  maxParticipants?: number;
  menuItems?: MenuItemData[];
}

export interface MenuItemData {
  course: 'appetizer' | 'main' | 'dessert' | 'drink' | 'amuse_bouche';
  name: string;
  description: string;
}

// Booking types
export interface CreateBookingData {
  userAId: string;
  userBId: string;
  restaurantId: string;
  packageId: string;
  slotId: string;
  bookingTime: string;
}

export interface BookingData {
  id: string;
  userA: {
    id: string;
    firstName: string;
    lastName: string;
  };
  userB: {
    id: string;
    firstName: string;
    lastName: string;
  };
  restaurant: {
    id: string;
    name: string;
    address: string;
  };
  package: {
    id: string;
    name: string;
    experienceType: string;
  };
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  voucherCode: string;
  qrCodeUrl: string;
  createdAt: string;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AppError';
  }
}

// Database types
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterOptions {
  search?: string;
  status?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

// Email types
export interface EmailData {
  to: string;
  subject: string;
  templateId?: string;
  dynamicData?: any;
  html?: string;
  text?: string;
}

// File upload types
export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  size: number;
}

export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}