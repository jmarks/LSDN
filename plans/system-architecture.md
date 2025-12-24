# Local Singles Date Night - System Architecture

## Overview
A modern, cloud-native dating platform focused on prepaid dinner packages with local restaurants. The system is designed for easy deployment and scaling.

## Technology Stack

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **TypeScript** - Type safety and better development experience
- **PostgreSQL** - Primary database (user data, bookings, packages)
- **Redis** - Caching and session management
- **JWT** - Authentication and authorization
- **Stripe** - Payment processing
- **Nodemailer** - Email notifications

### Frontend
- **React** with **TypeScript** - User interface
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Infrastructure
- **Docker** - Containerization for easy deployment
- **Docker Compose** - Local development environment
- **GitHub Actions** - CI/CD pipeline
- **Render.com** or **Railway** - Easy cloud deployment
- **Cloudinary** - Image storage and processing

## System Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Restaurant    │    │   Admin Portal  │
│   (Frontend)    │    │   Partner Portal│    │   (Management)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    Express.js API       │
                    │    (Backend Server)     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     PostgreSQL DB       │
                    │    (Primary Storage)    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │        Redis            │
                    │    (Caching/Session)    │
                    └─────────────────────────┘
                                 │
                    ┌────────────┬────────────┐
                    │            │            │
          ┌─────────▼──┐  ┌──────▼────┐  ┌───▼──────┐
          │   Stripe   │  │ Cloudinary  │  │ SendGrid │
          │  Payments  │  │  Images     │  │  Email   │
          └────────────┘  └─────────────┘  └──────────┘
```

## Database Schema

### Core Entities

#### Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio VARCHAR(150),
    location POINT, -- PostGIS for geolocation
    radius_miles INTEGER DEFAULT 10,
    age_range_min INTEGER DEFAULT 25,
    age_range_max INTEGER DEFAULT 45,
    interests TEXT[], -- Array of interest tags
    languages TEXT[], -- Array of language codes
    dietary_restrictions TEXT[], -- Array of dietary tags
    profile_photo_url VARCHAR(500),
    photos_urls TEXT[], -- Array of photo URLs (max 5)
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Restaurants/Partners
```sql
CREATE TABLE restaurants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    location POINT, -- PostGIS for geolocation
    description TEXT,
    categories TEXT[], -- Array of experience types
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    partner_status VARCHAR(20) DEFAULT 'pending', -- pending, approved, suspended
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Packages
```sql
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_cents INTEGER NOT NULL, -- Base price in cents
    service_fee_percent INTEGER DEFAULT 100, -- 100% service fee
    experience_type VARCHAR(50), -- dinner, dessert, activity
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### User Packages (Wallet)
```sql
CREATE TABLE user_packages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    package_id INTEGER REFERENCES packages(id),
    quantity INTEGER NOT NULL,
    purchased_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    remaining_units INTEGER NOT NULL
);
```

#### Time Slots
```sql
CREATE TABLE time_slots (
    id SERIAL PRIMARY KEY,
    restaurant_id INTEGER REFERENCES restaurants(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    capacity INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Bookings
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_a_id INTEGER REFERENCES users(id),
    user_b_id INTEGER REFERENCES users(id),
    restaurant_id INTEGER REFERENCES restaurants(id),
    time_slot_id INTEGER REFERENCES time_slots(id),
    package_id INTEGER REFERENCES packages(id),
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, completed, canceled
    voucher_code VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Matches
```sql
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    user_a_id INTEGER REFERENCES users(id),
    user_b_id INTEGER REFERENCES users(id),
    time_window_start TIMESTAMP,
    time_window_end TIMESTAMP,
    experience_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending', -- pending, asked, accepted, declined, expired
    created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/forgot-password` - Password reset

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/packages` - Get user packages
- `POST /api/users/packages` - Purchase package

### Restaurant Discovery
- `GET /api/restaurants` - List restaurants with filters
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/slots` - Get available time slots

### Matching & Booking
- `POST /api/matches/commit` - Commit to time window
- `GET /api/matches/available` - Get available candidates
- `POST /api/matches/ask` - Send invitation
- `POST /api/matches/:id/respond` - Accept/decline invitation
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings/:id/confirm` - Confirm booking

### Messaging
- `GET /api/messages` - Get messages for booking
- `POST /api/messages` - Send message (post-booking only)

### Partner Portal
- `POST /api/partners/register` - Restaurant registration
- `GET /api/partners/dashboard` - Partner dashboard
- `POST /api/partners/slots` - Manage time slots
- `POST /api/partners/vouchers/redeem` - Redeem voucher

## Security Considerations

1. **Authentication**: JWT with refresh tokens
2. **Authorization**: Role-based access control (user, partner, admin)
3. **Data Validation**: Input validation and sanitization
4. **Rate Limiting**: API rate limiting to prevent abuse
5. **HTTPS**: All communications encrypted
6. **Image Moderation**: AI-based content moderation
7. **Privacy**: Minimal PII collection, encrypted storage

## Deployment Strategy

### Development Environment
- Docker Compose with PostgreSQL, Redis, and API services
- Hot reloading for frontend and backend
- Seed data for testing

### Production Deployment
- Container-based deployment on Render.com or Railway
- Environment variables for configuration
- Automated database migrations
- Health checks and monitoring

### CI/CD Pipeline
- GitHub Actions for automated testing and deployment
- Linting and type checking
- Database migration scripts
- Build optimization

## Key Features Implementation

### 1. Availability-First Matching
- Time window commitment before candidate reveal
- Geofenced proximity filtering
- Experience type compatibility
- Fair exposure algorithm

### 2. Package System
- Prepaid dinner packages (1, 3, 5, 10 dinners)
- Transparent 100% service fee
- Wallet management with remaining units
- Expiration and recredit handling

### 3. Restaurant Integration
- Partner portal for menu and slot management
- QR code voucher system
- Inventory control and overbooking prevention
- Automated preparation cues

### 4. Safety Features
- ID verification and photo moderation
- Limited "Ask" functionality
- Post-booking chat only
- Safe check-in prompts

This architecture provides a solid foundation for the Local Singles Date Night prototype while ensuring it can be easily deployed and scaled.