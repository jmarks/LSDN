# Local Singles Date Night - API Specification

**Version:** 1.0  
**Date:** January 6, 2025  
**Format:** OpenAPI 3.0 Compatible  
**Status:** Draft

## Table of Contents

1. [API Overview](#1-api-overview)
2. [Authentication](#2-authentication)
3. [User Management](#3-user-management)
4. [Restaurant & Packages](#4-restaurant--packages)
5. [Booking & Matching](#5-booking--matching)
6. [Messaging](#6-messaging)
7. [Payments](#7-payments)
8. [Partner Portal](#8-partner-portal)
9. [Error Handling](#9-error-handling)
10. [Rate Limiting](#10-rate-limiting)

---

## 1. API Overview

### Base URL
- **Development:** `https://api-dev.lsdn.com`
- **Production:** `https://api.lsdn.com`

### API Versioning
All endpoints are versioned using the path prefix `/api/v1/`

### Content Types
- **Request:** `application/json`
- **Response:** `application/json`

### Response Format
All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
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
```

### Common Headers
- `Authorization: Bearer <token>` - Required for authenticated endpoints
- `Content-Type: application/json`
- `X-Request-ID: <uuid>` - Optional, for request tracing

---

## 2. Authentication

### 2.1 Register User
```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "zipCode": "94102"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "gender": "male",
      "location": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "city": "San Francisco",
      "state": "CA",
      "country": "USA",
      "zipCode": "94102",
      "verifiedAt": null,
      "verificationStatus": "pending",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": null
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req-123",
    "version": "1.0.0"
  }
}
```

### 2.2 Login User
```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "verifiedAt": "2024-01-01T00:00:00Z",
      "verificationStatus": "verified"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.3 Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.4 Logout User
```http
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

### 2.5 Verify Email
```http
POST /api/v1/auth/verify-email
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "verification-token-from-email"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Email verified successfully"
  }
}
```

---

## 3. User Management

### 3.1 Get User Profile
```http
GET /api/v1/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "gender": "male",
      "bio": "Looking for great conversations and good food!",
      "profilePhotoUrl": "https://cdn.cloudinary.com/lsdn/image/upload/v1234567890/users/profiles/user-123.jpg",
      "profilePhotos": [
        "https://cdn.cloudinary.com/lsdn/image/upload/v1234567890/users/photos/photo1.jpg",
        "https://cdn.cloudinary.com/lsdn/image/upload/v1234567890/users/photos/photo2.jpg"
      ],
      "location": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "city": "San Francisco",
      "state": "CA",
      "country": "USA",
      "zipCode": "94102",
      "radiusPreference": 10,
      "ageRangeMin": 25,
      "ageRangeMax": 45,
      "interests": ["hiking", "cooking", "travel"],
      "languages": ["en", "es"],
      "dietaryRestrictions": ["vegetarian"],
      "verifiedAt": "2024-01-01T00:00:00Z",
      "verificationStatus": "verified",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-01T00:00:00Z"
    },
    "packages": [
      {
        "id": "user-package-123",
        "package": {
          "id": "package-456",
          "name": "First Date Dinner",
          "description": "3-course dinner for two",
          "price": 50.00,
          "serviceFeePercentage": 100.00,
          "experienceType": "dinner",
          "durationMinutes": 120
        },
        "quantity": 3,
        "purchasedAt": "2024-01-01T00:00:00Z",
        "expiresAt": "2024-12-31T23:59:59Z",
        "remainingUnits": 2,
        "status": "active"
      }
    ],
    "bookings": [
      {
        "id": "booking-789",
        "userA": {
          "id": "user-123",
          "firstName": "John",
          "lastName": "Doe"
        },
        "userB": {
          "id": "user-456",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "restaurant": {
          "id": "restaurant-789",
          "name": "Bistro Luna",
          "address": "123 Main St, San Francisco, CA 94102"
        },
        "package": {
          "id": "package-456",
          "name": "First Date Dinner"
        },
        "bookingTime": "2024-01-15T19:00:00Z",
        "status": "confirmed",
        "voucherCode": "LSDN-ABC123",
        "qrCodeUrl": "https://cdn.cloudinary.com/lsdn/vouchers/qr-abc123.png"
      }
    ]
  }
}
```

### 3.2 Update User Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio text",
  "interests": ["hiking", "cooking", "travel", "photography"],
  "languages": ["en", "es", "fr"],
  "dietaryRestrictions": ["vegetarian", "gluten-free"],
  "radiusPreference": 15,
  "ageRangeMin": 25,
  "ageRangeMax": 50,
  "profilePhotos": [
    "https://cdn.cloudinary.com/lsdn/image/upload/v1234567890/users/photos/photo1.jpg"
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Updated bio text",
      "interests": ["hiking", "cooking", "travel", "photography"],
      "languages": ["en", "es", "fr"],
      "dietaryRestrictions": ["vegetarian", "gluten-free"],
      "radiusPreference": 15,
      "ageRangeMin": 25,
      "ageRangeMax": 50,
      "profilePhotos": [
        "https://cdn.cloudinary.com/lsdn/image/upload/v1234567890/users/photos/photo1.jpg"
      ],
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### 3.3 Upload Profile Photo
```http
POST /api/v1/users/profile/photos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Form Data:**
- `photo`: File (max 5MB, JPEG/PNG)
- `isProfilePhoto`: boolean (optional, defaults to false)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "photoUrl": "https://cdn.cloudinary.com/lsdn/image/upload/v1234567890/users/photos/photo1.jpg",
    "message": "Photo uploaded successfully"
  }
}
```

### 3.4 Submit Verification
```http
POST /api/v1/users/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "documentType": "passport",
  "documentFrontUrl": "https://cdn.cloudinary.com/lsdn/docs/doc-front.jpg",
  "documentBackUrl": "https://cdn.cloudinary.com/lsdn/docs/doc-back.jpg",
  "selfieUrl": "https://cdn.cloudinary.com/lsdn/docs/selfie.jpg"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Verification submitted successfully",
    "verificationStatus": "pending"
  }
}
```

### 3.5 Delete Account
```http
DELETE /api/v1/users/account
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "no_longer_needed",
  "feedback": "App was great but I found someone!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Account deletion initiated. You will receive confirmation email."
  }
}
```

---

## 4. Restaurant & Packages

### 4.1 Get Restaurants
```http
GET /api/v1/restaurants?location=37.7749,-122.4194&radius=10&cuisineType=italian&experienceType=dinner&page=1&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `location`: string (required) - "latitude,longitude"
- `radius`: number (optional, default: 10) - miles
- `cuisineType`: string (optional) - filter by cuisine
- `experienceType`: string (optional) - dinner, dessert_walk, activity_drink
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "restaurant-123",
        "name": "Bistro Luna",
        "description": "Romantic Italian restaurant with private booths",
        "address": {
          "line1": "123 Main St",
          "line2": "Suite 100",
          "city": "San Francisco",
          "state": "CA",
          "country": "USA",
          "zipCode": "94102"
        },
        "location": {
          "latitude": 37.7749,
          "longitude": -122.4194
        },
        "phone": "+1-415-555-1234",
        "email": "info@bistroluna.com",
        "websiteUrl": "https://bistroluna.com",
        "cuisineType": "italian",
        "priceRange": "$$",
        "capacity": 50,
        "partnerStatus": "approved",
        "distance": 2.1,
        "rating": 4.8,
        "packages": [
          {
            "id": "package-456",
            "name": "First Date Dinner",
            "description": "3-course dinner for two",
            "price": 50.00,
            "serviceFeePercentage": 100.00,
            "experienceType": "dinner",
            "durationMinutes": 120,
            "maxParticipants": 2,
            "isActive": true
          }
        ],
        "availability": [
          {
            "id": "slot-789",
            "startTime": "2024-01-15T18:00:00Z",
            "endTime": "2024-01-15T21:00:00Z",
            "capacity": 10,
            "isAvailable": true,
            "isBlackout": false
          }
        ]
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 20,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 4.2 Get Restaurant Details
```http
GET /api/v1/restaurants/{restaurantId}
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "restaurant": {
      "id": "restaurant-123",
      "name": "Bistro Luna",
      "description": "Romantic Italian restaurant with private booths",
      "address": {
        "line1": "123 Main St",
        "line2": "Suite 100",
        "city": "San Francisco",
        "state": "CA",
        "country": "USA",
        "zipCode": "94102"
      },
      "location": {
        "latitude": 37.7749,
        "longitude": -122.4194
      },
      "phone": "+1-415-555-1234",
      "email": "info@bistroluna.com",
      "websiteUrl": "https://bistroluna.com",
      "cuisineType": "italian",
      "priceRange": "$$",
      "capacity": 50,
      "partnerStatus": "approved",
      "rating": 4.8,
      "reviewsCount": 127,
      "createdAt": "2024-01-01T00:00:00Z",
      "packages": [
        {
          "id": "package-456",
          "name": "First Date Dinner",
          "description": "3-course dinner for two",
          "price": 50.00,
          "serviceFeePercentage": 100.00,
          "experienceType": "dinner",
          "durationMinutes": 120,
          "maxParticipants": 2,
          "isActive": true,
          "createdAt": "2024-01-01T00:00:00Z"
        }
      ],
      "availability": [
        {
          "id": "slot-789",
          "packageId": "package-456",
          "startTime": "2024-01-15T18:00:00Z",
          "endTime": "2024-01-15T21:00:00Z",
          "capacity": 10,
          "availableCount": 8,
          "isAvailable": true,
          "isBlackout": false,
          "createdAt": "2024-01-01T00:00:00Z"
        }
      ],
      "photos": [
        "https://cdn.cloudinary.com/lsdn/restaurants/photos/photo1.jpg",
        "https://cdn.cloudinary.com/lsdn/restaurants/photos/photo2.jpg"
      ]
    }
  }
}
```

### 4.3 Get Restaurant Packages
```http
GET /api/v1/restaurants/{restaurantId}/packages
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "package-456",
        "name": "First Date Dinner",
        "description": "3-course dinner for two",
        "price": 50.00,
        "serviceFeePercentage": 100.00,
        "totalPrice": 100.00,
        "experienceType": "dinner",
        "durationMinutes": 120,
        "maxParticipants": 2,
        "isActive": true,
        "menuItems": [
          {
            "course": "appetizer",
            "name": "Bruschetta",
            "description": "Toasted bread with tomato, basil, and olive oil"
          },
          {
            "course": "main",
            "name": "Spaghetti Carbonara",
            "description": "Classic pasta with egg, cheese, and pancetta"
          },
          {
            "course": "dessert",
            "name": "Tiramisu",
            "description": "Coffee-flavored Italian dessert"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "availability": [
      {
        "packageId": "package-456",
        "date": "2024-01-15",
        "timeSlots": [
          {
            "startTime": "2024-01-15T18:00:00Z",
            "endTime": "2024-01-15T21:00:00Z",
            "availableCount": 8,
            "isAvailable": true
          }
        ]
      }
    ]
  }
}
```

---

## 5. Booking & Matching

### 5.1 Submit Matching Request
```http
POST /api/v1/bookings/match
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "preferredTimeStart": "2024-01-15T18:00:00Z",
  "preferredTimeEnd": "2024-01-15T21:00:00Z",
  "experienceTypes": ["dinner"],
  "maxDistance": 10,
  "durationHours": 3
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "requestId": "match-req-123",
    "candidates": [
      {
        "id": "candidate-456",
        "user": {
          "id": "user-789",
          "firstName": "Jane",
          "lastName": "Smith",
          "age": 32,
          "profilePhotoUrl": "https://cdn.cloudinary.com/lsdn/users/profiles/user-789.jpg",
          "bio": "Foodie and travel enthusiast",
          "interests": ["cooking", "hiking", "photography"],
          "languages": ["en", "fr"],
          "verifiedAt": "2024-01-01T00:00:00Z"
        },
        "restaurant": {
          "id": "restaurant-123",
          "name": "Bistro Luna",
          "distance": 2.1
        },
        "package": {
          "id": "package-456",
          "name": "First Date Dinner",
          "price": 100.00
        },
        "bookingTime": "2024-01-15T19:00:00Z",
        "matchScore": 85,
        "reasons": [
          "Shared interest in cooking",
          "Both available Friday 7-10pm",
          "2.1 miles apart",
          "Similar age range"
        ],
        "askedAt": null,
        "askCount": 0,
        "maxAsks": 3
      }
    ],
    "expiresAt": "2024-01-15T17:00:00Z",
    "totalCandidates": 15
  }
}
```

### 5.2 Send Invitation
```http
POST /api/v1/bookings/invitations
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "candidateId": "candidate-456",
  "message": "Hi! I'd love to grab dinner with you at Bistro Luna this Friday at 7pm. Let me know if you're interested!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "invitation": {
      "id": "invitation-789",
      "senderId": "user-123",
      "receiverId": "user-789",
      "candidateId": "candidate-456",
      "status": "pending",
      "message": "Hi! I'd love to grab dinner with you at Bistro Luna this Friday at 7pm. Let me know if you're interested!",
      "expiresAt": "2024-01-15T17:00:00Z",
      "createdAt": "2024-01-14T15:00:00Z"
    },
    "remainingAsks": 2
  }
}
```

### 5.3 Accept Invitation
```http
POST /api/v1/bookings/invitations/{invitationId}/accept
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "I'd love to! See you Friday at 7pm."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-123",
      "userA": {
        "id": "user-123",
        "firstName": "John",
        "lastName": "Doe"
      },
      "userB": {
        "id": "user-789",
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "restaurant": {
        "id": "restaurant-123",
        "name": "Bistro Luna",
        "address": "123 Main St, San Francisco, CA 94102"
      },
      "package": {
        "id": "package-456",
        "name": "First Date Dinner",
        "price": 100.00
      },
      "bookingTime": "2024-01-15T19:00:00Z",
      "status": "confirmed",
      "voucherCode": "LSDN-ABC123",
      "qrCodeUrl": "https://cdn.cloudinary.com/lsdn/vouchers/qr-abc123.png",
      "createdAt": "2024-01-14T15:30:00Z"
    },
    "voucher": {
      "code": "LSDN-ABC123",
      "qrCodeUrl": "https://cdn.cloudinary.com/lsdn/vouchers/qr-abc123.png",
      "expiresAt": "2024-01-15T18:30:00Z",
      "terms": "Valid for one First Date Dinner package at Bistro Luna"
    }
  }
}
```

### 5.4 Get Upcoming Bookings
```http
GET /api/v1/bookings/upcoming?status=confirmed&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "booking-123",
        "userA": {
          "id": "user-123",
          "firstName": "John",
          "lastName": "Doe",
          "profilePhotoUrl": "https://cdn.cloudinary.com/lsdn/users/profiles/user-123.jpg"
        },
        "userB": {
          "id": "user-789",
          "firstName": "Jane",
          "lastName": "Smith",
          "profilePhotoUrl": "https://cdn.cloudinary.com/lsdn/users/profiles/user-789.jpg"
        },
        "restaurant": {
          "id": "restaurant-123",
          "name": "Bistro Luna",
          "address": "123 Main St, San Francisco, CA 94102",
          "phone": "+1-415-555-1234"
        },
        "package": {
          "id": "package-456",
          "name": "First Date Dinner",
          "experienceType": "dinner"
        },
        "bookingTime": "2024-01-15T19:00:00Z",
        "status": "confirmed",
        "voucherCode": "LSDN-ABC123",
        "qrCodeUrl": "https://cdn.cloudinary.com/lsdn/vouchers/qr-abc123.png",
        "timeUntilBooking": "2 days, 3 hours",
        "createdAt": "2024-01-14T15:30:00Z"
      }
    ]
  }
}
```

### 5.5 Cancel Booking
```http
PUT /api/v1/bookings/{bookingId}/cancel
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "schedule_conflict",
  "message": "Something came up, I'm sorry!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-123",
      "status": "cancelled",
      "cancelledAt": "2024-01-14T16:00:00Z",
      "cancelledBy": "user-123",
      "cancellationReason": "schedule_conflict"
    },
    "refund": {
      "amount": 100.00,
      "currency": "USD",
      "method": "original",
      "expectedAt": "2024-01-16T00:00:00Z",
      "transactionId": "txn-123"
    }
  }
}
```

---

## 6. Messaging

### 6.1 Get Conversations
```http
GET /api/v1/messages/conversations?limit=20&offset=0
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv-123",
        "withUser": {
          "id": "user-789",
          "firstName": "Jane",
          "lastName": "Smith",
          "profilePhotoUrl": "https://cdn.cloudinary.com/lsdn/users/profiles/user-789.jpg",
          "onlineStatus": "online"
        },
        "lastMessage": {
          "id": "msg-456",
          "senderId": "user-789",
          "messageText": "Looking forward to our date tonight!",
          "messageType": "text",
          "createdAt": "2024-01-14T18:00:00Z",
          "isRead": true
        },
        "unreadCount": 0,
        "lastActivityAt": "2024-01-14T18:00:00Z",
        "booking": {
          "id": "booking-123",
          "status": "confirmed",
          "bookingTime": "2024-01-15T19:00:00Z"
        }
      }
    ],
    "total": 5,
    "hasMore": false
  }
}
```

### 6.2 Get Messages in Conversation
```http
GET /api/v1/messages/conversations/{conversationId}/messages?limit=50&before=timestamp
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg-456",
        "sender": {
          "id": "user-789",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "receiver": {
          "id": "user-123",
          "firstName": "John",
          "lastName": "Doe"
        },
        "messageText": "Looking forward to our date tonight!",
        "messageType": "text",
        "isRead": true,
        "readAt": "2024-01-14T18:05:00Z",
        "createdAt": "2024-01-14T18:00:00Z"
      },
      {
        "id": "msg-123",
        "sender": {
          "id": "user-123",
          "firstName": "John",
          "lastName": "Doe"
        },
        "receiver": {
          "id": "user-789",
          "firstName": "Jane",
          "lastName": "Smith"
        },
        "messageText": "Me too! See you at 7pm.",
        "messageType": "text",
        "isRead": true,
        "readAt": "2024-01-14T18:01:00Z",
        "createdAt": "2024-01-14T18:00:00Z"
      }
    ],
    "hasMore": false
  }
}
```

### 6.3 Send Message
```http
POST /api/v1/messages/send
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "receiverId": "user-789",
  "bookingId": "booking-123",
  "messageText": "Hi Jane! Just confirming our dinner tonight at 7pm.",
  "messageType": "text"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg-789",
      "senderId": "user-123",
      "receiverId": "user-789",
      "bookingId": "booking-123",
      "messageText": "Hi Jane! Just confirming our dinner tonight at 7pm.",
      "messageType": "text",
      "isRead": false,
      "createdAt": "2024-01-14T19:00:00Z"
    }
  }
}
```

### 6.4 Mark Message as Read
```http
PUT /api/v1/messages/{messageId}/read
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "messageId": "msg-789",
    "readAt": "2024-01-14T19:05:00Z"
  }
}
```

---

## 7. Payments

### 7.1 Get Payment Methods
```http
GET /api/v1/payments/methods
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "paymentMethods": [
      {
        "id": "pm_123",
        "type": "card",
        "brand": "visa",
        "last4": "4242",
        "expMonth": 12,
        "expYear": 2025,
        "isDefault": true
      }
    ]
  }
}
```

### 7.2 Add Payment Method
```http
POST /api/v1/payments/methods
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentMethodId": "pm_456",
  "isDefault": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "paymentMethod": {
      "id": "pm_456",
      "type": "card",
      "brand": "mastercard",
      "last4": "5556",
      "expMonth": 6,
      "expYear": 2026,
      "isDefault": true
    }
  }
}
```

### 7.3 Purchase Package
```http
POST /api/v1/payments/packages
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "packageId": "package-456",
  "quantity": 3,
  "paymentMethodId": "pm_123",
  "savePaymentMethod": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "txn_123",
      "amount": 300.00,
      "currency": "USD",
      "status": "succeeded",
      "description": "3 x First Date Dinner packages",
      "createdAt": "2024-01-14T20:00:00Z"
    },
    "userPackages": [
      {
        "id": "user-package-789",
        "package": {
          "id": "package-456",
          "name": "First Date Dinner",
          "price": 50.00,
          "serviceFeePercentage": 100.00,
          "totalPrice": 100.00
        },
        "quantity": 3,
        "purchasedAt": "2024-01-14T20:00:00Z",
        "expiresAt": "2024-12-31T23:59:59Z",
        "remainingUnits": 3,
        "status": "active"
      }
    ],
    "receiptUrl": "https://lsdn.com/receipts/txn_123.pdf"
  }
}
```

### 7.4 Get Payment History
```http
GET /api/v1/payments/history?startDate=2024-01-01&endDate=2024-01-31&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "txn_123",
        "amount": 300.00,
        "currency": "USD",
        "type": "charge",
        "description": "3 x First Date Dinner packages",
        "status": "succeeded",
        "createdAt": "2024-01-14T20:00:00Z",
        "paymentMethod": {
          "brand": "visa",
          "last4": "4242"
        }
      },
      {
        "id": "txn_456",
        "amount": 100.00,
        "currency": "USD",
        "type": "refund",
        "description": "Refund for cancelled booking",
        "status": "succeeded",
        "createdAt": "2024-01-10T15:00:00Z",
        "paymentMethod": {
          "brand": "visa",
          "last4": "4242"
        }
      }
    ],
    "balance": {
      "totalSpent": 300.00,
      "totalRefunded": 100.00,
      "currentBalance": 200.00
    }
  }
}
```

### 7.5 Request Refund
```http
POST /api/v1/payments/refunds
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "transactionId": "txn_123",
  "amount": 100.00,
  "reason": "service_not_received",
  "description": "Booking was cancelled by restaurant"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "refund": {
      "id": "ref_123",
      "transactionId": "txn_123",
      "amount": 100.00,
      "currency": "USD",
      "status": "pending",
      "reason": "service_not_received",
      "createdAt": "2024-01-14T21:00:00Z",
      "expectedAt": "2024-01-16T00:00:00Z"
    }
  }
}
```

---

## 8. Partner Portal

### 8.1 Partner Dashboard
```http
GET /api/v1/partner/dashboard
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "restaurant": {
      "id": "restaurant-123",
      "name": "Bistro Luna",
      "status": "approved",
      "totalBookings": 45,
      "pendingBookings": 3,
      "confirmedBookings": 42,
      "revenue": {
        "total": 4500.00,
        "thisMonth": 1200.00,
        "lastMonth": 1000.00
      }
    },
    "packages": [
      {
        "id": "package-456",
        "name": "First Date Dinner",
        "totalBookings": 30,
        "revenue": 1500.00,
        "avgRating": 4.8
      }
    ],
    "availability": {
      "thisWeek": {
        "totalSlots": 50,
        "bookedSlots": 35,
        "utilizationRate": 70
      },
      "nextWeek": {
        "totalSlots": 60,
        "bookedSlots": 15,
        "utilizationRate": 25
      }
    }
  }
}
```

### 8.2 Update Restaurant Profile
```http
PUT /api/v1/partner/restaurant
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Bistro Luna",
  "description": "Updated restaurant description",
  "address": {
    "line1": "123 Main St",
    "line2": "Suite 100",
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "zipCode": "94102"
  },
  "phone": "+1-415-555-1234",
  "email": "info@bistroluna.com",
  "websiteUrl": "https://bistroluna.com",
  "cuisineType": "italian",
  "priceRange": "$$$",
  "capacity": 60
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "restaurant": {
      "id": "restaurant-123",
      "name": "Bistro Luna",
      "description": "Updated restaurant description",
      "capacity": 60,
      "updatedAt": "2024-01-14T22:00:00Z"
    }
  }
}
```

### 8.3 Manage Packages
```http
POST /api/v1/partner/packages
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Date Night Special",
  "description": "5-course tasting menu for two",
  "price": 75.00,
  "serviceFeePercentage": 100.00,
  "experienceType": "dinner",
  "durationMinutes": 180,
  "maxParticipants": 2,
  "menuItems": [
    {
      "course": "amuse_bouche",
      "name": "Chef's Amuse",
      "description": "Chef's selection of seasonal bites"
    },
    {
      "course": "appetizer",
      "name": "Oysters on the Half Shell",
      "description": "Fresh oysters with mignonette"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "package": {
      "id": "package_789",
      "name": "Date Night Special",
      "description": "5-course tasting menu for two",
      "price": 75.00,
      "serviceFeePercentage": 100.00,
      "totalPrice": 150.00,
      "experienceType": "dinner",
      "durationMinutes": 180,
      "maxParticipants": 2,
      "isActive": true,
      "createdAt": "2024-01-14T22:30:00Z"
    }
  }
}
```

### 8.4 Manage Availability
```http
POST /api/v1/partner/availability
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "packageId": "package-456",
  "slots": [
    {
      "startTime": "2024-01-20T18:00:00Z",
      "endTime": "2024-01-20T21:00:00Z",
      "capacity": 8
    },
    {
      "startTime": "2024-01-21T18:00:00Z",
      "endTime": "2024-01-21T21:00:00Z",
      "capacity": 10
    }
  ],
  "blackoutDates": [
    "2024-01-25"
  ]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "createdSlots": 2,
    "blackoutDates": 1,
    "message": "Availability updated successfully"
  }
}
```

### 8.5 Get Bookings
```http
GET /api/v1/partner/bookings?status=confirmed&date=2024-01-15&limit=20
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "booking-123",
        "userA": {
          "id": "user-123",
          "firstName": "John",
          "lastName": "Doe",
          "profilePhotoUrl": "https://cdn.cloudinary.com/lsdn/users/profiles/user-123.jpg"
        },
        "userB": {
          "id": "user-789",
          "firstName": "Jane",
          "lastName": "Smith",
          "profilePhotoUrl": "https://cdn.cloudinary.com/lsdn/users/profiles/user-789.jpg"
        },
        "package": {
          "id": "package-456",
          "name": "First Date Dinner"
        },
        "bookingTime": "2024-01-15T19:00:00Z",
        "status": "confirmed",
        "voucherCode": "LSDN-ABC123",
        "createdAt": "2024-01-14T15:30:00Z",
        "notes": "User requested window seat"
      }
    ],
    "total": 15,
    "confirmed": 12,
    "pending": 3
  }
}
```

### 8.6 Confirm Booking
```http
PUT /api/v1/partner/bookings/{bookingId}/confirm
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "notes": "Table 12 reserved for tonight"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "booking": {
      "id": "booking-123",
      "status": "confirmed",
      "confirmedAt": "2024-01-15T17:00:00Z",
      "confirmedBy": "restaurant-123",
      "notes": "Table 12 reserved for tonight"
    }
  }
}
```

---

## 9. Error Handling

### 9.1 Error Response Format
All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request data is invalid",
    "details": {
      "field": "email",
      "value": "invalid-email",
      "reason": "must be a valid email address"
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req-123",
    "version": "1.0.0"
  }
}
```

### 9.2 Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `AUTHENTICATION_ERROR` | 401 | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., duplicate email) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

### 9.3 Validation Error Examples

**Email already exists:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email address is already in use",
    "details": {
      "field": "email",
      "value": "user@example.com",
      "reason": "email must be unique"
    }
  }
}
```

**Insufficient package units:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Not enough package units available",
    "details": {
      "field": "packageId",
      "value": "package-123",
      "reason": "user has 0 remaining units"
    }
  }
}
```

**Time slot not available:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Selected time slot is not available",
    "details": {
      "field": "bookingTime",
      "value": "2024-01-15T19:00:00Z",
      "reason": "no availability for this time slot"
    }
  }
}
```

---

## 10. Rate Limiting

### 10.1 Rate Limit Headers
All responses include rate limiting information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 3600
```

### 10.2 Rate Limit Policies

| Endpoint Category | Limit | Window |
|------------------|-------|---------|
| Authentication | 10 requests | 15 minutes |
| User Profile | 60 requests | 1 hour |
| Restaurant Search | 100 requests | 1 hour |
| Booking Operations | 20 requests | 1 hour |
| Messaging | 200 messages | 1 hour |
| Partner Portal | 500 requests | 1 hour |

### 10.3 Rate Limit Exceeded Response
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetTime": "2024-01-01T01:00:00Z"
    }
  }
}
```

---

## Appendix A: Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bio: string;
  profilePhotoUrl: string;
  profilePhotos: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  city: string;
  state: string;
  country: string;
  zipCode: string;
  radiusPreference: number;
  ageRangeMin: number;
  ageRangeMax: number;
  interests: string[];
  languages: string[];
  dietaryRestrictions: string[];
  verifiedAt: string | null;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  isActive: boolean;
}
```

### Restaurant Model
```typescript
interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  email: string;
  websiteUrl: string;
  cuisineType: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  capacity: number;
  partnerStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Package Model
```typescript
interface Package {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  serviceFeePercentage: number;
  totalPrice: number;
  experienceType: 'dinner' | 'dessert_walk' | 'activity_drink';
  durationMinutes: number;
  maxParticipants: number;
  isActive: boolean;
  menuItems: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

interface MenuItem {
  course: 'appetizer' | 'main' | 'dessert' | 'drink' | 'amuse_bouche';
  name: string;
  description: string;
}
```

### Booking Model
```typescript
interface Booking {
  id: string;
  userA: UserSummary;
  userB: UserSummary;
  restaurant: RestaurantSummary;
  package: PackageSummary;
  bookingTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  voucherCode: string;
  qrCodeUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  confirmedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  cancelledBy: string | null;
  cancellationReason: string | null;
}

interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl: string;
}

interface RestaurantSummary {
  id: string;
  name: string;
  address: string;
  phone: string;
}

interface PackageSummary {
  id: string;
  name: string;
  experienceType: string;
  price: number;
}
```

This API specification provides a comprehensive guide for implementing the Local Singles Date Night application's backend services. All endpoints follow RESTful conventions and include proper error handling, authentication, and rate limiting.