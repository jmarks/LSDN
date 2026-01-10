# Local Singles Date Night - Technical Specification & Architecture Plan

**Version:** 1.0  
**Date:** January 6, 2025  
**Author:** Kilo Code  
**Status:** Draft

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture](#2-system-architecture)
3. [Database Schema Design](#3-database-schema-design)
4. [API Specifications](#4-api-specifications)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [Security & Compliance](#7-security--compliance)
8. [Third-Party Integrations](#8-third-party-integrations)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Deployment & Infrastructure](#10-deployment--infrastructure)
11. [Monitoring & Observability](#11-monitoring--observability)
12. [Testing Strategy](#12-testing-strategy)

---

## 1. Executive Summary

This document provides a comprehensive technical specification for the Local Singles Date Night application, a two-sided marketplace connecting singles with local restaurants for pre-paid dinner packages. The system implements an availability-first matching algorithm with robust safety features, payment processing, and partner management capabilities.

### Key Technical Highlights

- **Microservices Architecture**: Modular backend services for scalability
- **React Frontend**: Modern SPA with TypeScript and component-based architecture
- **PostgreSQL Database**: Relational database with proper indexing and constraints
- **Redis Caching**: Session management and real-time features
- **Stripe Integration**: Secure payment processing with subscription management
- **Cloudinary Integration**: Image processing and storage
- **SendGrid Integration**: Email notifications and communication
- **Docker & Docker Compose**: Containerized development and deployment
- **JWT Authentication**: Secure token-based authentication system

---

## 2. System Architecture

### 2.1 High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React SPA] --> B[Mobile App]
        A --> C[Partner Portal]
    end
    
    subgraph "API Gateway Layer"
        D[API Gateway] --> E[Load Balancer]
    end
    
    subgraph "Backend Services"
        F[Auth Service] --> G[User Service]
        H[Matching Service] --> I[Booking Service]
        J[Payment Service] --> K[Restaurant Service]
        L[Notification Service] --> M[Messaging Service]
    end
    
    subgraph "Data Layer"
        N[PostgreSQL Database]
        O[Redis Cache]
        P[Elasticsearch]
    end
    
    subgraph "External Services"
        Q[Stripe API]
        R[Cloudinary API]
        S[SendGrid API]
        T[Google Maps API]
    end
    
    A --> D
    B --> D
    C --> D
    E --> F
    E --> G
    E --> H
    E --> I
    E --> J
    E --> K
    E --> L
    E --> M
    F --> N
    G --> N
    H --> N
    I --> N
    J --> N
    K --> N
    L --> N
    M --> N
    F --> O
    H --> O
    L --> O
    H --> P
    J --> Q
    G --> R
    L --> S
    G --> T
```

### 2.2 Technology Stack

#### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Styling**: Tailwind CSS with DaisyUI components
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **Build Tool**: Vite
- **Testing**: Jest + React Testing Library

#### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with custom middleware
- **Database**: PostgreSQL 14+
- **ORM**: TypeORM with migrations
- **Caching**: Redis 6+
- **Search**: Elasticsearch 7+
- **Message Queue**: Redis Queue (BullMQ)
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod schemas
- **Testing**: Jest with Supertest

#### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Docker Compose for development, Kubernetes for production
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston with structured logging
- **CI/CD**: GitHub Actions
- **Deployment**: Render.com (primary), AWS as alternative

#### Third-Party Services
- **Payments**: Stripe
- **Image Processing**: Cloudinary
- **Email**: SendGrid
- **Maps**: Google Maps API
- **SMS**: Twilio (optional for 2FA)

---

## 3. Database Schema Design

### 3.1 Core Entities

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    bio TEXT CHECK (length(bio) <= 150),
    profile_photo_url VARCHAR(500),
    profile_photos JSONB, -- Array of photo URLs, max 5
    location POINT, -- PostGIS point for geospatial queries
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    zip_code VARCHAR(20),
    radius_preference INTEGER DEFAULT 10, -- miles
    age_range_min INTEGER DEFAULT 25,
    age_range_max INTEGER DEFAULT 45,
    interests JSONB, -- Array of interest IDs
    languages JSONB, -- Array of language codes
    dietary_restrictions JSONB, -- Array of dietary restriction codes
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_users_location ON users USING GIST(location);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_status ON users(verification_status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### Restaurants Table
```sql
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    location POINT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website_url VARCHAR(500),
    cuisine_type VARCHAR(100),
    price_range VARCHAR(20), -- '$', '$$', '$$$', '$$$$'
    capacity INTEGER,
    partner_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_restaurants_location ON restaurants USING GIST(location);
CREATE INDEX idx_restaurants_partner_status ON restaurants(partner_status);
```

#### Packages Table
```sql
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    service_fee_percentage DECIMAL(5,2) DEFAULT 100.00,
    experience_type VARCHAR(50) NOT NULL, -- dinner, dessert_walk, activity_drink
    duration_minutes INTEGER NOT NULL,
    max_participants INTEGER DEFAULT 2,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_packages_restaurant_id ON packages(restaurant_id);
CREATE INDEX idx_packages_experience_type ON packages(experience_type);
```

#### User Packages Table
```sql
CREATE TABLE user_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    package_id UUID REFERENCES packages(id),
    quantity INTEGER NOT NULL,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    remaining_units INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, expired, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_packages_user_id ON user_packages(user_id);
CREATE INDEX idx_user_packages_package_id ON user_packages(package_id);
CREATE INDEX idx_user_packages_status ON user_packages(status);
```

#### Availability Slots Table
```sql
CREATE TABLE availability_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    package_id UUID REFERENCES packages(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    capacity INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    is_blackout BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_availability_slots_restaurant_id ON availability_slots(restaurant_id);
CREATE INDEX idx_availability_slots_package_id ON availability_slots(package_id);
CREATE INDEX idx_availability_slots_start_time ON availability_slots(start_time);
CREATE INDEX idx_availability_slots_end_time ON availability_slots(end_time);
```

#### Bookings Table
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_a_id UUID REFERENCES users(id),
    user_b_id UUID REFERENCES users(id),
    restaurant_id UUID REFERENCES restaurants(id),
    package_id UUID REFERENCES packages(id),
    slot_id UUID REFERENCES availability_slots(id),
    booking_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL, -- pending, confirmed, completed, cancelled, no_show
    voucher_code VARCHAR(50) UNIQUE,
    qr_code_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_a_id ON bookings(user_a_id);
CREATE INDEX idx_bookings_user_b_id ON bookings(user_b_id);
CREATE INDEX idx_bookings_restaurant_id ON bookings(restaurant_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_voucher_code ON bookings(voucher_code);
```

#### Matching Requests Table
```sql
CREATE TABLE matching_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    preferred_time_start TIMESTAMP WITH TIME ZONE NOT NULL,
    preferred_time_end TIMESTAMP WITH TIME ZONE NOT NULL,
    experience_types JSONB, -- Array of experience types
    max_distance INTEGER, -- miles
    status VARCHAR(20) DEFAULT 'pending', -- pending, matched, expired
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_matching_requests_user_id ON matching_requests(user_id);
CREATE INDEX idx_matching_requests_status ON matching_requests(status);
CREATE INDEX idx_matching_requests_expires_at ON matching_requests(expires_at);
```

#### Messages Table
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    booking_id UUID REFERENCES bookings(id),
    message_text TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, system
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### 3.2 Database Relationships

```mermaid
erDiagram
    users ||--o{ user_packages : "owns"
    users ||--o{ bookings : "creates"
    users ||--o{ matching_requests : "submits"
    users ||--o{ messages : "sends"
    users ||--o{ messages : "receives"
    
    restaurants ||--o{ packages : "offers"
    restaurants ||--o{ availability_slots : "has"
    restaurants ||--o{ bookings : "hosts"
    
    packages ||--o{ user_packages : "included_in"
    packages ||--o{ availability_slots : "available_in"
    packages ||--o{ bookings : "used_in"
    
    availability_slots ||--o{ bookings : "booked_in"
    
    bookings ||--o{ messages : "contains"
    
    users {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        date date_of_birth
        string gender
        text bio
        string profile_photo_url
        jsonb profile_photos
        point location
        string city
        string state
        string country
        string zip_code
        integer radius_preference
        integer age_range_min
        integer age_range_max
        jsonb interests
        jsonb languages
        jsonb dietary_restrictions
        timestamp verified_at
        string verification_status
        timestamp created_at
        timestamp updated_at
        timestamp last_login_at
        boolean is_active
        timestamp deleted_at
    }
    
    restaurants {
        uuid id PK
        string name
        text description
        string address_line1
        string address_line2
        string city
        string state
        string country
        string zip_code
        point location
        string phone
        string email
        string website_url
        string cuisine_type
        string price_range
        integer capacity
        string partner_status
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
    }
    
    packages {
        uuid id PK
        uuid restaurant_id FK
        string name
        text description
        decimal price
        decimal service_fee_percentage
        string experience_type
        integer duration_minutes
        integer max_participants
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    user_packages {
        uuid id PK
        uuid user_id FK
        uuid package_id FK
        integer quantity
        timestamp purchased_at
        timestamp expires_at
        integer remaining_units
        string status
        timestamp created_at
    }
    
    availability_slots {
        uuid id PK
        uuid restaurant_id FK
        uuid package_id FK
        timestamp start_time
        timestamp end_time
        integer capacity
        boolean is_available
        boolean is_blackout
        timestamp created_at
        timestamp updated_at
    }
    
    bookings {
        uuid id PK
        uuid user_a_id FK
        uuid user_b_id FK
        uuid restaurant_id FK
        uuid package_id FK
        uuid slot_id FK
        timestamp booking_time
        string status
        string voucher_code UK
        string qr_code_url
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    matching_requests {
        uuid id PK
        uuid user_id FK
        timestamp preferred_time_start
        timestamp preferred_time_end
        jsonb experience_types
        integer max_distance
        string status
        timestamp expires_at
        timestamp created_at
    }
    
    messages {
        uuid id PK
        uuid sender_id FK
        uuid receiver_id FK
        uuid booking_id FK
        text message_text
        string message_type
        boolean is_read
        timestamp read_at
        timestamp created_at
    }
```

---

## 4. API Specifications

### 4.1 Authentication Endpoints

#### POST /api/auth/register
Register a new user
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  location: {
    latitude: number;
    longitude: number;
  };
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

#### POST /api/auth/login
Login user
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

#### POST /api/auth/refresh
Refresh access token
```typescript
interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}
```

#### POST /api/auth/logout
Logout user
```typescript
interface LogoutRequest {
  refreshToken: string;
}

interface LogoutResponse {
  message: string;
}
```

### 4.2 User Management Endpoints

#### GET /api/users/profile
Get user profile
```typescript
interface GetUserProfileResponse {
  user: User;
  packages: UserPackage[];
  bookings: Booking[];
}
```

#### PUT /api/users/profile
Update user profile
```typescript
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  interests?: string[];
  languages?: string[];
  dietaryRestrictions?: string[];
  radiusPreference?: number;
  ageRangeMin?: number;
  ageRangeMax?: number;
  profilePhotos?: string[]; // URLs
}

interface UpdateProfileResponse {
  user: User;
}
```

#### POST /api/users/verify
Submit verification documents
```typescript
interface VerifyRequest {
  documentType: 'passport' | 'drivers_license' | 'id_card';
  documentFrontUrl: string;
  documentBackUrl: string;
  selfieUrl: string;
}

interface VerifyResponse {
  message: string;
  verificationStatus: string;
}
```

### 4.3 Restaurant & Package Endpoints

#### GET /api/restaurants
Get restaurants with filtering
```typescript
interface GetRestaurantsRequest {
  location?: {
    latitude: number;
    longitude: number;
  };
  radius?: number; // miles
  cuisineType?: string;
  priceRange?: string;
  experienceType?: string;
  page?: number;
  limit?: number;
}

interface GetRestaurantsResponse {
  restaurants: Restaurant[];
  total: number;
  page: number;
  limit: number;
}
```

#### GET /api/restaurants/:id/packages
Get restaurant packages
```typescript
interface GetRestaurantPackagesResponse {
  packages: Package[];
  availability: AvailabilitySlot[];
}
```

### 4.4 Booking & Matching Endpoints

#### POST /api/bookings/match
Submit matching request
```typescript
interface MatchRequest {
  preferredTimeStart: string; // ISO timestamp
  preferredTimeEnd: string; // ISO timestamp
  experienceTypes: string[];
  maxDistance: number; // miles
  durationHours?: number;
}

interface MatchResponse {
  requestId: string;
  candidates: Candidate[];
  expiresAt: string;
}
```

#### POST /api/bookings/:id/accept
Accept booking invitation
```typescript
interface AcceptBookingRequest {
  bookingId: string;
}

interface AcceptBookingResponse {
  booking: Booking;
  voucher: {
    code: string;
    qrCodeUrl: string;
    expiresAt: string;
  };
}
```

#### GET /api/bookings/upcoming
Get upcoming bookings
```typescript
interface GetUpcomingBookingsResponse {
  bookings: Booking[];
}
```

### 4.5 Messaging Endpoints

#### GET /api/messages/conversations
Get user conversations
```typescript
interface GetConversationsResponse {
  conversations: Conversation[];
}
```

#### POST /api/messages/send
Send message
```typescript
interface SendMessageRequest {
  receiverId: string;
  bookingId: string;
  messageText: string;
  messageType?: 'text' | 'image';
}

interface SendMessageResponse {
  message: Message;
}
```

### 4.6 Payment Endpoints

#### POST /api/payments/packages
Purchase package
```typescript
interface PurchasePackageRequest {
  packageId: string;
  quantity: number;
  paymentMethodId: string; // Stripe payment method
}

interface PurchasePackageResponse {
  transaction: Transaction;
  userPackages: UserPackage[];
  receiptUrl: string;
}
```

#### GET /api/payments/history
Get payment history
```typescript
interface GetPaymentHistoryResponse {
  transactions: Transaction[];
  balance: {
    totalSpent: number;
    totalRefunded: number;
    currentBalance: number;
  };
}
```

---

## 5. Frontend Architecture

### 5.1 Component Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── VerificationForm.tsx
│   ├── user/
│   │   ├── ProfileCard.tsx
│   │   ├── EditProfileForm.tsx
│   │   └── PreferencesForm.tsx
│   ├── restaurant/
│   │   ├── RestaurantCard.tsx
│   │   ├── RestaurantDetail.tsx
│   │   └── MenuList.tsx
│   ├── booking/
│   │   ├── MatchingForm.tsx
│   │   ├── CandidateList.tsx
│   │   ├── BookingConfirmation.tsx
│   │   └── VoucherDisplay.tsx
│   ├── messaging/
│   │   ├── ConversationList.tsx
│   │   ├── MessageThread.tsx
│   │   └── MessageInput.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   └── common/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── pages/
│   ├── Home.tsx
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   ├── Dashboard.tsx
│   ├── Restaurants.tsx
│   ├── Bookings.tsx
│   ├── Messages.tsx
│   ├── Profile.tsx
│   └── PartnerPortal/
│       ├── Dashboard.tsx
│       ├── MenuManagement.tsx
│       └── Analytics.tsx
├── services/
│   ├── api.ts
│   ├── auth.ts
│   ├── user.ts
│   ├── restaurant.ts
│   ├── booking.ts
│   ├── messaging.ts
│   └── payment.ts
├── store/
│   ├── store.ts
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── userSlice.ts
│   │   ├── bookingSlice.ts
│   │   ├── restaurantSlice.ts
│   │   └── uiSlice.ts
│   └── middleware/
│       ├── authMiddleware.ts
│       └── errorMiddleware.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useUser.ts
│   ├── useBooking.ts
│   └── useRestaurant.ts
├── utils/
│   ├── validation.ts
│   ├── formatters.ts
│   ├── constants.ts
│   └── helpers.ts
└── types/
    ├── auth.ts
    ├── user.ts
    ├── restaurant.ts
    ├── booking.ts
    ├── messaging.ts
    └── payment.ts
```

### 5.2 State Management

#### Redux Store Structure
```typescript
interface RootState {
  auth: {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  };
  user: {
    profile: User | null;
    packages: UserPackage[];
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;
  };
  booking: {
    matchingRequest: MatchingRequest | null;
    candidates: Candidate[];
    upcomingBookings: Booking[];
    isLoading: boolean;
    error: string | null;
  };
  restaurant: {
    restaurants: Restaurant[];
    selectedRestaurant: Restaurant | null;
    packages: Package[];
    availability: AvailabilitySlot[];
    isLoading: boolean;
    error: string | null;
  };
  messaging: {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
  };
  ui: {
    sidebarOpen: boolean;
    modal: {
      isOpen: boolean;
      type: string | null;
      data: any;
    };
    toast: {
      message: string;
      type: 'success' | 'error' | 'warning' | 'info';
      isVisible: boolean;
    };
  };
}
```

### 5.3 Routing Structure

```typescript
const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'dashboard', element: <Dashboard />, protected: true },
      { path: 'restaurants', element: <Restaurants /> },
      { path: 'restaurants/:id', element: <RestaurantDetail /> },
      { path: 'bookings', element: <Bookings />, protected: true },
      { path: 'messages', element: <Messages />, protected: true },
      { path: 'profile', element: <Profile />, protected: true },
      { path: 'partner-portal', element: <PartnerPortal />, protected: true, roles: ['partner'] },
    ]
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verify', element: <Verification /> },
    ]
  }
];
```

---

## 6. Backend Architecture

### 6.1 Service Structure

```
src/
├── services/
│   ├── AuthService.ts
│   ├── UserService.ts
│   ├── RestaurantService.ts
│   ├── PackageService.ts
│   ├── BookingService.ts
│   ├── MatchingService.ts
│   ├── PaymentService.ts
│   ├── NotificationService.ts
│   ├── MessagingService.ts
│   └── VerificationService.ts
├── controllers/
│   ├── AuthController.ts
│   ├── UserController.ts
│   ├── RestaurantController.ts
│   ├── BookingController.ts
│   ├── PaymentController.ts
│   └── NotificationController.ts
├── middleware/
│   ├── auth.ts
│   ├── validation.ts
│   ├── error.ts
│   ├── rateLimit.ts
│   └── logging.ts
├── models/
│   ├── User.ts
│   ├── Restaurant.ts
│   ├── Package.ts
│   ├── Booking.ts
│   ├── MatchingRequest.ts
│   └── Message.ts
├── utils/
│   ├── database.ts
│   ├── redis.ts
│   ├── jwt.ts
│   ├── validation.ts
│   ├── hashing.ts
│   └── helpers.ts
├── config/
│   ├── database.ts
│   ├── redis.ts
│   ├── jwt.ts
│   ├── stripe.ts
│   ├── cloudinary.ts
│   └── sendgrid.ts
└── jobs/
    ├── matchingJob.ts
    ├── notificationJob.ts
    └── cleanupJob.ts
```

### 6.2 Service Layer Architecture

#### Authentication Service
```typescript
class AuthService {
  async register(userData: RegisterData): Promise<AuthResponse> {
    // 1. Validate input
    // 2. Check email uniqueness
    // 3. Hash password
    // 4. Create user
    // 5. Generate tokens
    // 6. Send welcome email
    // 7. Return auth response
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // 1. Validate credentials
    // 2. Find user by email
    // 3. Verify password
    // 4. Generate tokens
    // 5. Update last login
    // 6. Return auth response
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    // 1. Verify refresh token
    // 2. Generate new access token
    // 3. Return tokens
  }

  async logout(refreshToken: string): Promise<void> {
    // 1. Add token to blacklist
    // 2. Clean up session
  }
}
```

#### Matching Service
```typescript
class MatchingService {
  async findMatches(request: MatchingRequest): Promise<Candidate[]> {
    // 1. Validate request
    // 2. Find compatible users in radius
    // 3. Filter by availability
    // 4. Filter by preferences
    // 5. Apply matching algorithm
    // 6. Return ranked candidates
  }

  async createBooking(userAId: string, userBId: string, slotId: string): Promise<Booking> {
    // 1. Validate availability
    // 2. Create booking record
    // 3. Generate voucher
    // 4. Send notifications
    // 5. Return booking
  }

  async calculateMatchScore(userA: User, userB: User, slot: AvailabilitySlot): number {
    // 1. Calculate compatibility score
    // 2. Apply distance penalty
    // 3. Apply time preference weight
    // 4. Return final score
  }
}
```

### 6.3 Database Layer

#### Repository Pattern
```typescript
abstract class BaseRepository<T> {
  protected model: EntityTarget<T>;
  
  async findById(id: string): Promise<T | null> {
    return await this.model.findOne({ where: { id } });
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.model.create(data);
    return await this.model.save(entity);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    await this.model.update(id, data);
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.delete(id);
    return result.affected > 0;
  }
}

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.model.findOne({ where: { email } });
  }

  async findNearbyUsers(location: Point, radius: number): Promise<User[]> {
    // Use PostGIS for geospatial queries
    return await this.model
      .createQueryBuilder('user')
      .where('ST_DWithin(user.location, ST_Point(:lat, :lng), :radius)', {
        lat: location.latitude,
        lng: location.longitude,
        radius: radius * 1609.34 // Convert miles to meters
      })
      .getMany();
  }
}
```

---

## 7. Security & Compliance

### 7.1 Authentication & Authorization

#### JWT Implementation
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

class JWTService {
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = '7d';

  generateTokens(user: User): TokenPair {
    const payload = {
      userId: user.id,
      email: user.email,
      roles: user.roles,
      permissions: user.permissions
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: this.accessTokenExpiry
    });

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: this.refreshTokenExpiry }
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
  }

  verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET) as { userId: string };
  }
}
```

#### Role-Based Access Control
```typescript
enum UserRole {
  USER = 'user',
  PARTNER = 'partner',
  ADMIN = 'admin'
}

enum Permission {
  READ_PROFILE = 'read:profile',
  UPDATE_PROFILE = 'update:profile',
  BOOK_RESTAURANT = 'book:restaurant',
  MANAGE_MENU = 'manage:menu',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_USERS = 'manage:users'
}

const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.READ_PROFILE,
    Permission.UPDATE_PROFILE,
    Permission.BOOK_RESTAURANT
  ],
  [UserRole.PARTNER]: [
    Permission.READ_PROFILE,
    Permission.MANAGE_MENU,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.ADMIN]: Object.values(Permission)
};

function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return rolePermissions[userRole].includes(permission);
}
```

### 7.2 Data Protection

#### Encryption Strategy
```typescript
class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

  encrypt(text: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('lsdn', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  decrypt(encryptedData: EncryptedData): string {
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from('lsdn', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

#### Data Retention Policy
```typescript
class DataRetentionService {
  async cleanupExpiredData(): Promise<void> {
    const now = new Date();
    
    // Delete expired matching requests
    await MatchingRequest.delete({
      expiresAt: LessThan(now)
    });

    // Delete old messages (keep for 2 years)
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
    await Message.delete({
      createdAt: LessThan(twoYearsAgo)
    });

    // Archive old bookings (keep for 7 years for tax purposes)
    const sevenYearsAgo = new Date(now.getFullYear() - 7, now.getMonth(), now.getDate());
    await Booking.update(
      { createdAt: LessThan(sevenYearsAgo) },
      { status: 'archived' }
    );
  }

  async anonymizeUserData(userId: string): Promise<void> {
    await User.update(userId, {
      email: `deleted_${Date.now()}@anonymized.com`,
      firstName: 'Deleted',
      lastName: 'User',
      bio: null,
      profilePhotoUrl: null,
      profilePhotos: null,
      location: null,
      deletedAt: new Date()
    });
  }
}
```

### 7.3 Compliance Requirements

#### GDPR Compliance
- **Right to Access**: Users can download their data
- **Right to Erasure**: Users can delete their account and data
- **Data Portability**: Export data in standard formats
- **Consent Management**: Track and manage user consents
- **Data Protection Impact Assessment**: Document high-risk processing

#### PCI DSS Compliance (for payments)
- **Tokenization**: Never store credit card data
- **Encryption**: All payment data encrypted in transit and at rest
- **Access Control**: Strict access controls for payment systems
- **Logging**: Comprehensive audit trails for payment operations
- **Regular Scanning**: Vulnerability scans and penetration testing

#### SOC 2 Compliance
- **Security**: Access controls, encryption, monitoring
- **Availability**: Uptime monitoring, disaster recovery
- **Processing Integrity**: Data validation, error handling
- **Confidentiality**: Data encryption, access controls
- **Privacy**: Data protection, user rights

---

## 8. Third-Party Integrations

### 8.1 Stripe Integration

#### Payment Service Implementation
```typescript
class StripePaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
  }

  async createPaymentIntent(amount: number, currency: string, description: string): Promise<PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      automatic_payment_methods: { enabled: true }
    });
  }

  async createCustomer(user: User): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: { userId: user.id }
    });
    return customer.id;
  }

  async createSubscription(customerId: string, priceId: string): Promise<Subscription> {
    return await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent']
    });
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as PaymentIntent);
        break;
      case 'charge.refunded':
        await this.handleRefund(event.data.object as Charge);
        break;
      // Handle other webhook events
    }
  }
}
```

### 8.2 Cloudinary Integration

#### Image Processing Service
```typescript
class CloudinaryService {
  private cloudinary: any;

  constructor() {
    this.cloudinary = cloudinary.v2;
    this.cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }

  async uploadImage(file: Buffer, options: UploadOptions = {}): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'lsdn/users',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto:good' }
          ],
          moderation: 'manual',
          ...options
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(file);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    await this.cloudinary.uploader.destroy(publicId);
  }

  async moderateImage(publicId: string): Promise<ModerationResult> {
    return await this.cloudinary.api.update(publicId, {
      moderation_status: 'approved'
    });
  }
}
```

### 8.3 SendGrid Integration

#### Notification Service
```typescript
class SendGridNotificationService {
  private sgMail: any;

  constructor() {
    this.sgMail = require('@sendgrid/mail');
    this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendEmail(templateId: string, to: string, data: any): Promise<void> {
    const msg = {
      to,
      from: {
        email: process.env.FROM_EMAIL,
        name: 'Local Singles Date Night'
      },
      templateId,
      dynamic_template_data: data
    };

    await this.sgMail.send(msg);
  }

  async sendBookingConfirmation(booking: Booking, user: User): Promise<void> {
    await this.sendEmail('d-booking-confirmation', user.email, {
      userName: user.firstName,
      restaurantName: booking.restaurant.name,
      bookingTime: booking.bookingTime,
      voucherCode: booking.voucherCode,
      qrCodeUrl: booking.qrCodeUrl
    });
  }

  async sendMatchNotification(user: User, candidate: Candidate): Promise<void> {
    await this.sendEmail('d-match-found', user.email, {
      userName: user.firstName,
      candidateName: candidate.name,
      restaurantName: candidate.restaurantName,
      bookingTime: candidate.bookingTime
    });
  }
}
```

### 8.4 Google Maps Integration

#### Location Service
```typescript
class GoogleMapsService {
  private client: any;

  constructor() {
    this.client = new googlemaps.Client({
      key: process.env.GOOGLE_MAPS_API_KEY
    });
  }

  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    const response = await this.client.placeDetails({
      place_id: placeId
    });
    return response.json.result;
  }

  async getDirections(origin: Location, destination: Location): Promise<Directions> {
    const response = await this.client.directions({
      origin: `${origin.latitude},${origin.longitude}`,
      destination: `${destination.latitude},${destination.longitude}`,
      mode: 'driving'
    });
    return response.json.routes[0];
  }

  async searchNearbyRestaurants(location: Location, radius: number): Promise<Place[]> {
    const response = await this.client.placesNearby({
      location: `${location.latitude},${location.longitude}`,
      radius: radius * 1609.34, // Convert miles to meters
      type: 'restaurant'
    });
    return response.json.results;
  }
}
```

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

#### Week 1: Project Setup & Core Infrastructure
- [ ] Initialize project structure (backend + frontend)
- [ ] Set up Docker containers for development
- [ ] Configure database schema and migrations
- [ ] Implement basic authentication system
- [ ] Set up CI/CD pipeline with GitHub Actions

#### Week 2: User Management & Profiles
- [ ] Implement user registration and login
- [ ] Create user profile management
- [ ] Add profile photo upload with Cloudinary
- [ ] Implement email verification
- [ ] Add basic user preferences system

#### Week 3: Restaurant Management
- [ ] Create restaurant CRUD operations
- [ ] Implement restaurant onboarding flow
- [ ] Add package management for restaurants
- [ ] Create availability slot management
- [ ] Implement basic search and filtering

#### Week 4: Basic Booking System
- [ ] Implement matching request system
- [ ] Create basic matching algorithm
- [ ] Implement booking creation and confirmation
- [ ] Add voucher generation and QR codes
- [ ] Create basic booking management UI

### Phase 2: Core Features (Weeks 5-8)

#### Week 5: Payment Integration
- [ ] Integrate Stripe for payment processing
- [ ] Implement package purchasing flow
- [ ] Add subscription management
- [ ] Create payment history and receipts
- [ ] Implement refund and recredit system

#### Week 6: Messaging System
- [ ] Implement real-time messaging
- [ ] Add message moderation
- [ ] Create conversation management
- [ ] Add push notifications for messages
- [ ] Implement message encryption

#### Week 7: Advanced Matching
- [ ] Enhance matching algorithm with ML
- [ ] Add preference-based filtering
- [ ] Implement distance-based matching
- [ ] Add time availability optimization
- [ ] Create matching analytics

#### Week 8: Safety & Moderation
- [ ] Implement ID verification system
- [ ] Add image moderation with AI
- [ ] Create user reporting system
- [ ] Implement safety check-ins
- [ ] Add admin moderation tools

### Phase 3: Polish & Scale (Weeks 9-12)

#### Week 9: Partner Portal
- [ ] Create comprehensive partner dashboard
- [ ] Add menu and pricing management
- [ ] Implement analytics and reporting
- [ ] Add bulk operations for partners
- [ ] Create partner communication tools

#### Week 10: Mobile Optimization
- [ ] Optimize frontend for mobile devices
- [ ] Implement responsive design
- [ ] Add mobile-specific features
- [ ] Optimize performance for mobile
- [ ] Test on various devices and browsers

#### Week 11: Performance & Monitoring
- [ ] Implement caching strategies
- [ ] Add performance monitoring
- [ ] Optimize database queries
- [ ] Implement load balancing
- [ ] Add comprehensive logging

#### Week 12: Production Deployment
- [ ] Set up production environment
- [ ] Configure monitoring and alerting
- [ ] Implement backup and disaster recovery
- [ ] Perform security audit
- [ ] Launch beta version

### Phase 4: Post-Launch (Weeks 13-16)

#### Week 13: Analytics & Insights
- [ ] Implement comprehensive analytics
- [ ] Add user behavior tracking
- [ ] Create business intelligence dashboards
- [ ] Implement A/B testing framework
- [ ] Add performance metrics

#### Week 14: Advanced Features
- [ ] Implement recommendation engine
- [ ] Add social features (reviews, ratings)
- [ ] Create loyalty and rewards system
- [ ] Add advanced search filters
- [ ] Implement group booking functionality

#### Week 15: Integration & Partnerships
- [ ] Integrate with calendar apps
- [ ] Add POS system integrations
- [ ] Implement loyalty program partnerships
- [ ] Add corporate account features
- [ ] Create API for third-party integrations

#### Week 16: Scale & Optimize
- [ ] Optimize for high traffic
- [ ] Implement microservices architecture
- [ ] Add multi-region deployment
- [ ] Optimize costs
- [ ] Prepare for Series A funding

---

## 10. Deployment & Infrastructure

### 10.1 Development Environment

#### Docker Compose Configuration
```yaml
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: lsdn_dev
      POSTGRES_USER: lsdn_user
      POSTGRES_PASSWORD: lsdn_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - lsdn_network

  # Redis
  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - lsdn_network

  # Elasticsearch
  elasticsearch:
    image: elasticsearch:7.17.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - lsdn_network

  # Backend
  backend:
    build: ./backend
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://lsdn_user:lsdn_password@postgres:5432/lsdn_dev
      - REDIS_URL=redis://redis:6379
      - ELASTICSEARCH_URL=http://elasticsearch:9200
      - JWT_SECRET=dev_jwt_secret
      - STRIPE_SECRET_KEY=sk_test_...
      - CLOUDINARY_URL=cloudinary://...
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - postgres
      - redis
      - elasticsearch
    networks:
      - lsdn_network

  # Frontend
  frontend:
    build: ./frontend
    environment:
      - REACT_APP_API_URL=http://localhost:3001
      - REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    networks:
      - lsdn_network

  # Nginx (Reverse Proxy)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - frontend
      - backend
    networks:
      - lsdn_network

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:

networks:
  lsdn_network:
    driver: bridge
```

### 10.2 Production Environment

#### Render.com Configuration
```yaml
# render.yaml
services:
  - type: web
    name: lsdn-frontend
    env: static
    buildCommand: npm run build
    publishPath: ./dist
    envVars:
      - key: REACT_APP_API_URL
        fromService:
          name: lsdn-backend
          type: web
      - key: REACT_APP_STRIPE_PUBLISHABLE_KEY
        value: pk_live_...

  - type: web
    name: lsdn-backend
    runtime: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: lsdn-prod-db
      - key: REDIS_URL
        fromService:
          name: lsdn-redis
          type: redis
      - key: ELASTICSEARCH_URL
        fromService:
          name: lsdn-elasticsearch
          type: elasticsearch
      - key: JWT_SECRET
        secret: jwt-secret
      - key: STRIPE_SECRET_KEY
        secret: stripe-secret-key
      - key: CLOUDINARY_URL
        secret: cloudinary-url
      - key: SENDGRID_API_KEY
        secret: sendgrid-api-key

databases:
  - name: lsdn-prod-db
    plan: starter

redis:
  - name: lsdn-redis
    plan: starter

elasticsearch:
  - name: lsdn-elasticsearch
    plan: starter
```

### 10.3 Monitoring & Observability

#### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'lsdn-backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'
    
  - job_name: 'lsdn-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/metrics'

rule_files:
  - "alert_rules.yml"

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

#### Grafana Dashboards
```json
{
  "dashboard": {
    "title": "LSDN Application Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Database Connections",
        "type": "stat",
        "targets": [
          {
            "expr": "pg_stat_database_numbackends",
            "legendFormat": "Active Connections"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "5xx errors"
          }
        ]
      }
    ]
  }
}
```

---

## 11. Monitoring & Observability

### 11.1 Application Metrics

#### Custom Metrics Implementation
```typescript
import { register, Counter, Histogram, Gauge } from 'prom-client';

// HTTP Request Metrics
const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Business Metrics
const userRegistrations = new Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations'
});

const bookingsCreated = new Counter({
  name: 'bookings_created_total',
  help: 'Total number of bookings created',
  labelNames: ['restaurant_id', 'experience_type']
});

const packagePurchases = new Counter({
  name: 'package_purchases_total',
  help: 'Total number of packages purchased',
  labelNames: ['package_id', 'payment_method']
});

// Database Metrics
const dbConnectionsActive = new Gauge({
  name: 'db_connections_active',
  help: 'Number of active database connections'
});

const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['query_type', 'table'],
  buckets: [0.01, 0.1, 0.5, 1, 2, 5]
});

// Middleware to collect HTTP metrics
export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestTotal.inc({
      method: req.method,
      route,
      status: res.statusCode
    });
    
    httpRequestDuration.observe(
      { method: req.method, route },
      duration
    );
  });
  
  next();
}
```

### 11.2 Logging Strategy

#### Structured Logging Implementation
```typescript
import winston from 'winston';
import { Request, Response, NextFunction } from 'express';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Request logging middleware
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id
    });
  });
  
  next();
}

// Error logging middleware
export function errorLogger(error: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('Application Error', {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
      userId: req.user?.id
    }
  });
  
  next(error);
}
```

### 11.3 Health Checks

#### Health Check Endpoints
```typescript
interface HealthCheck {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
    elasticsearch: ServiceHealth;
    stripe: ServiceHealth;
    cloudinary: ServiceHealth;
  };
  version: string;
}

interface ServiceHealth {
  status: 'up' | 'down';
  responseTime?: number;
  error?: string;
}

class HealthCheckService {
  async getHealthStatus(): Promise<HealthCheck> {
    const startTime = Date.now();
    
    const services = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkElasticsearch(),
      this.checkStripe(),
      this.checkCloudinary()
    ]);
    
    const health: HealthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: services[0].status === 'fulfilled' ? services[0].value : { status: 'down', error: services[0].reason.message },
        redis: services[1].status === 'fulfilled' ? services[1].value : { status: 'down', error: services[1].reason.message },
        elasticsearch: services[2].status === 'fulfilled' ? services[2].value : { status: 'down', error: services[2].reason.message },
        stripe: services[3].status === 'fulfilled' ? services[3].value : { status: 'down', error: services[3].reason.message },
        cloudinary: services[4].status === 'fulfilled' ? services[4].value : { status: 'down', error: services[4].reason.message }
      },
      version: process.env.APP_VERSION || '1.0.0'
    };
    
    // Determine overall status
    const hasDownServices = Object.values(health.services).some(s => s.status === 'down');
    health.status = hasDownServices ? 'unhealthy' : 'healthy';
    
    return health;
  }

  private async checkDatabase(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      await getManager().query('SELECT 1');
      return { status: 'up', responseTime: Date.now() - start };
    } catch (error) {
      return { status: 'down', error: error.message };
    }
  }

  private async checkRedis(): Promise<ServiceHealth> {
    const start = Date.now();
    try {
      await redis.ping();
      return { status: 'up', responseTime: Date.now() - start };
    } catch (error) {
      return { status: 'down', error: error.message };
    }
  }
}
```

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

```
                    E2E Tests (10%)
                   /                \
                  /   Integration    \
                 /       Tests        \
                /        (30%)         \
               /                        \
              /                          \
             /     Unit Tests (60%)       \
            /                              \
           /                                \
          /                                  \
         /                                    \
        /                                      \
       /                                        \
      /                                          \
     /                                            \
    /                                              \
   /                                                \
  /                                                  \
 /                                                    \
/                                                      \
```

### 12.2 Unit Testing

#### User Service Tests
```typescript
describe('UserService', () => {
  let userService: UserService;
  let userRepository: MockProxy<UserRepository>;
  let verificationService: MockProxy<VerificationService>;

  beforeEach(() => {
    userRepository = mock<UserRepository>();
    verificationService = mock<VerificationService>();
    userService = new UserService(userRepository, verificationService);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      };

      const expectedUser: User = {
        id: 'user-123',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        // ... other fields
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        })
      );
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      const userData: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'male'
      };

      const existingUser: User = {
        id: 'user-456',
        email: userData.email,
        // ... other fields
      };

      userRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const updateData: UpdateProfileDto = {
        firstName: 'Jane',
        bio: 'Updated bio'
      };

      const existingUser: User = {
        id: userId,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Original bio'
      };

      const updatedUser: User = {
        ...existingUser,
        firstName: updateData.firstName,
        bio: updateData.bio
      };

      userRepository.findById.mockResolvedValue(existingUser);
      userRepository.update.mockResolvedValue(updatedUser);

      // Act
      const result = await userService.updateProfile(userId, updateData);

      // Assert
      expect(result).toEqual(updatedUser);
      expect(userRepository.update).toHaveBeenCalledWith(userId, updateData);
    });
  });
});
```

### 12.3 Integration Testing

#### API Integration Tests
```typescript
describe('Booking API Integration', () => {
  let app: Express;
  let server: any;
  let db: DataSource;

  beforeAll(async () => {
    // Setup test database
    db = await createTestDatabase();
    app = createApp();
    server = app.listen(0); // Use random port
  });

  afterAll(async () => {
    await server.close();
    await db.destroy();
  });

  beforeEach(async () => {
    await db.synchronize(true); // Reset database
  });

  describe('POST /api/bookings/match', () => {
    it('should create a matching request and return candidates', async () => {
      // Arrange
      const user = await createTestUser();
      const restaurant = await createTestRestaurant();
      const package = await createTestPackage(restaurant);
      const slot = await createTestAvailabilitySlot(restaurant, package);

      const authHeader = await getAuthHeader(user.id);

      const matchRequest = {
        preferredTimeStart: '2024-01-15T18:00:00Z',
        preferredTimeEnd: '2024-01-15T21:00:00Z',
        experienceTypes: ['dinner'],
        maxDistance: 10
      };

      // Act
      const response = await request(app)
        .post('/api/bookings/match')
        .set('Authorization', authHeader)
        .send(matchRequest)
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('requestId');
      expect(response.body).toHaveProperty('candidates');
      expect(response.body.candidates).toBeInstanceOf(Array);
    });

    it('should return 401 if user is not authenticated', async () => {
      const matchRequest = {
        preferredTimeStart: '2024-01-15T18:00:00Z',
        preferredTimeEnd: '2024-01-15T21:00:00Z',
        experienceTypes: ['dinner'],
        maxDistance: 10
      };

      const response = await request(app)
        .post('/api/bookings/match')
        .send(matchRequest)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });
  });

  describe('POST /api/bookings/:id/accept', () => {
    it('should accept a booking and generate voucher', async () => {
      // Arrange
      const userA = await createTestUser();
      const userB = await createTestUser();
      const booking = await createTestBooking(userA, userB);

      const authHeader = await getAuthHeader(userB.id);

      // Act
      const response = await request(app)
        .post(`/api/bookings/${booking.id}/accept`)
        .set('Authorization', authHeader)
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('booking');
      expect(response.body).toHaveProperty('voucher');
      expect(response.body.voucher).toHaveProperty('code');
      expect(response.body.voucher).toHaveProperty('qrCodeUrl');
    });
  });
});
```

### 12.4 End-to-End Testing

#### Cypress E2E Tests
```typescript
// cypress/e2e/user-flow.cy.ts

describe('User Booking Flow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.seedDatabase(); // Seed test data
  });

  it('should allow user to complete full booking flow', () => {
    // 1. Register user
    cy.visit('/auth/register');
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="first-name-input"]').type('John');
    cy.get('[data-cy="last-name-input"]').type('Doe');
    cy.get('[data-cy="register-button"]').click();
    cy.url().should('include', '/dashboard');

    // 2. Complete profile
    cy.get('[data-cy="profile-link"]').click();
    cy.get('[data-cy="bio-input"]').type('Looking for great conversations and good food!');
    cy.get('[data-cy="save-profile-button"]').click();
    cy.get('[data-cy="profile-saved-message"]').should('be.visible');

    // 3. Browse restaurants
    cy.visit('/restaurants');
    cy.get('[data-cy="restaurant-card"]').first().click();

    // 4. View packages
    cy.get('[data-cy="package-list"]').should('be.visible');
    cy.get('[data-cy="package-card"]').first().click();

    // 5. Select time slot
    cy.get('[data-cy="availability-calendar"]').should('be.visible');
    cy.get('[data-cy="time-slot"]').first().click();

    // 6. Submit matching request
    cy.get('[data-cy="submit-match-button"]').click();
    cy.get('[data-cy="candidates-list"]').should('be.visible');

    // 7. Send invitation
    cy.get('[data-cy="candidate-card"]').first().click();
    cy.get('[data-cy="send-invite-button"]').click();
    cy.get('[data-cy="invitation-sent-message"]').should('be.visible');

    // 8. Accept invitation (as other user)
    cy.loginAs('candidate@example.com');
    cy.visit('/bookings');
    cy.get('[data-cy="pending-invitations"]').should('be.visible');
    cy.get('[data-cy="accept-invite-button"]').click();
    cy.get('[data-cy="booking-confirmed-message"]').should('be.visible');

    // 9. View voucher
    cy.get('[data-cy="view-voucher-button"]').click();
    cy.get('[data-cy="voucher-code"]').should('be.visible');
    cy.get('[data-cy="qr-code"]').should('be.visible');
  });

  it('should handle payment flow', () => {
    cy.loginAs('test@example.com');
    cy.visit('/restaurants/restaurant-123/packages/package-456');
    
    // Select package quantity
    cy.get('[data-cy="quantity-selector"]').select('3');
    
    // Proceed to checkout
    cy.get('[data-cy="checkout-button"]').click();
    
    // Fill payment form
    cy.get('[data-cy="card-number"]').type('4242424242424242');
    cy.get('[data-cy="expiry-date"]').type('12/25');
    cy.get('[data-cy="cvc"]').type('123');
    
    // Complete purchase
    cy.get('[data-cy="pay-button"]').click();
    cy.get('[data-cy="payment-success-message"]').should('be.visible');
    cy.get('[data-cy="package-purchased-message"]').should('contain', '3 dinners');
  });
});
```

### 12.5 Performance Testing

#### Load Testing with Artillery
```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up load"
    - duration: 300
      arrivalRate: 100
      name: "Sustained load"
    - duration: 60
      arrivalRate: 200
      name: "Peak load"

scenarios:
  - name: "User Registration Flow"
    weight: 20
    flow:
      - post:
          url: "/api/auth/register"
          json:
            email: "{{ $randomEmail() }}"
            password: "password123"
            firstName: "{{ $randomFirstName() }}"
            lastName: "{{ $randomLastName() }}"
            dateOfBirth: "1990-01-01"
            gender: "male"
          capture:
            - json: "$.accessToken"
              as: "accessToken"

  - name: "Restaurant Browsing"
    weight: 40
    flow:
      - get:
          url: "/api/restaurants"
          qs:
            radius: 10
            cuisineType: "italian"

  - name: "Booking Flow"
    weight: 30
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.accessToken"
              as: "accessToken"
      - post:
          url: "/api/bookings/match"
          headers:
            Authorization: "Bearer {{ accessToken }}"
          json:
            preferredTimeStart: "2024-01-15T18:00:00Z"
            preferredTimeEnd: "2024-01-15T21:00:00Z"
            experienceTypes: ["dinner"]
            maxDistance: 10

  - name: "Messaging"
    weight: 10
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.accessToken"
              as: "accessToken"
      - get:
          url: "/api/messages/conversations"
          headers:
            Authorization: "Bearer {{ accessToken }}"
      - post:
          url: "/api/messages/send"
          headers:
            Authorization: "Bearer {{ accessToken }}"
          json:
            receiverId: "user-123"
            bookingId: "booking-456"
            messageText: "Hi! Looking forward to our date tonight!"
```

---

## Conclusion

This technical specification provides a comprehensive blueprint for implementing the Local Singles Date Night application. The architecture balances scalability, security, and maintainability while supporting the unique requirements of a two-sided marketplace with prepaid dinner packages.

Key technical highlights include:

- **Microservices Architecture**: Modular backend services for independent scaling
- **Robust Security**: JWT authentication, data encryption, and comprehensive compliance
- **Real-time Features**: WebSocket-based messaging and live updates
- **Scalable Infrastructure**: Docker containers with Kubernetes orchestration
- **Comprehensive Testing**: Unit, integration, and E2E testing strategies
- **Monitoring & Observability**: Prometheus metrics and structured logging

The implementation roadmap provides a clear path from MVP to production, with each phase building upon the previous foundation. The technical choices align with industry best practices while addressing the specific needs of the dating marketplace domain.

With this specification as a guide, development teams can confidently build a production-ready application that delivers on the vision of connecting singles through local dining experiences.