# Local Singles Date Night - Project Structure

## Directory Structure

```
lsdn/
├── README.md                           # Main project documentation
├── docker-compose.yml                  # Development environment
├── docker-compose.prod.yml            # Production environment
├── .gitignore                         # Git ignore rules
├── .env.example                       # Environment variables template
├── backend/                           # Backend API server
│   ├── package.json                   # Backend dependencies
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── src/
│   │   ├── index.ts                   # Server entry point
│   │   ├── config/                    # Configuration files
│   │   ├── controllers/               # API controllers
│   │   ├── middleware/                # Express middleware
│   │   ├── models/                    # Database models
│   │   ├── routes/                    # API routes
│   │   ├── services/                  # Business logic
│   │   ├── utils/                     # Utility functions
│   │   └── types/                     # TypeScript type definitions
│   └── migrations/                    # Database migrations
├── frontend/                          # React frontend application
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.ts                 # Vite configuration
│   ├── tsconfig.json                  # TypeScript configuration
│   ├── index.html                     # HTML entry point
│   ├── src/
│   │   ├── main.tsx                   # React entry point
│   │   ├── App.tsx                    # Main App component
│   │   ├── components/                # Reusable components
│   │   ├── pages/                     # Page components
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── services/                  # API service functions
│   │   ├── types/                     # TypeScript type definitions
│   │   ├── utils/                     # Utility functions
│   │   ├── styles/                    # Global styles
│   │   └── assets/                    # Static assets
├── partner-portal/                    # Restaurant partner portal
│   ├── package.json                   # Partner portal dependencies
│   ├── vite.config.ts                 # Vite configuration
│   ├── src/
│   │   ├── main.tsx                   # Partner portal entry
│   │   ├── App.tsx                    # Partner portal App
│   │   ├── components/                # Partner components
│   │   ├── pages/                     # Partner pages
│   │   └── services/                  # Partner API services
├── scripts/                           # Deployment and utility scripts
│   ├── setup.sh                       # Setup script
│   ├── deploy.sh                      # Deployment script
│   └── seed-data.sql                  # Sample data
└── docs/                              # Documentation
    ├── API.md                         # API documentation
    ├── DEPLOYMENT.md                  # Deployment guide
    └── TESTING.md                     # Testing strategy
```

## Technology Choices

### Backend Technologies
- **Node.js 18+** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **pg** - PostgreSQL client
- **redis** - Redis client
- **stripe** - Payment processing
- **nodemailer** - Email sending
- **joi** - Validation library
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **morgan** - HTTP request logging

### Frontend Technologies
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - CSS framework
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Icons** - Additional icons
- **date-fns** - Date manipulation

### Development Tools
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit hooks

### Deployment Options
- **Render.com** - Easy cloud deployment
- **Railway** - Alternative cloud deployment
- **Vercel** - Frontend deployment
- **Railway** - Backend deployment

## Development Setup

### Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed
- PostgreSQL (can use Docker)

### Quick Start

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd lsdn
   cp .env.example .env
   ```

2. **Start development environment:**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ../partner-portal && npm install
   ```

4. **Run migrations:**
   ```bash
   cd backend
   npm run migrate
   ```

5. **Start development servers:**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend
   cd frontend && npm run dev
   
   # Terminal 3: Partner Portal
   cd partner-portal && npm run dev
   ```

### Environment Variables

Required environment variables (copy from `.env.example`):

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lsdn"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN="7d"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Application
PORT=3001
FRONTEND_URL="http://localhost:5173"
PARTNER_URL="http://localhost:3002"
```

## API Structure

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/forgot-password` - Password reset

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/packages` - Get user packages
- `POST /api/users/packages` - Purchase package

### Restaurant Endpoints
- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/slots` - Get available slots

### Matching & Booking Endpoints
- `POST /api/matches/commit` - Commit to time window
- `GET /api/matches/available` - Get available candidates
- `POST /api/matches/ask` - Send invitation
- `POST /api/matches/:id/respond` - Accept/decline
- `GET /api/bookings` - Get user bookings

### Partner Endpoints
- `POST /api/partners/register` - Restaurant registration
- `GET /api/partners/dashboard` - Partner dashboard
- `POST /api/partners/slots` - Manage time slots
- `POST /api/partners/vouchers/redeem` - Redeem voucher

## Database Schema

The database uses PostgreSQL with the following main tables:
- `users` - User profiles and preferences
- `restaurants` - Partner restaurant information
- `packages` - Dinner package definitions
- `user_packages` - User package purchases (wallet)
- `time_slots` - Restaurant availability
- `bookings` - Date bookings and vouchers
- `matches` - Match requests and responses

## Frontend Pages

### User Application
- **Home** - Landing page with value proposition
- **Register/Login** - Authentication pages
- **Profile** - User profile management
- **Discover** - Restaurant discovery and browsing
- **Packages** - Package purchase and management
- **Matches** - Matching interface and invitations
- **Bookings** - Booking history and management
- **Messages** - Post-booking messaging

### Partner Portal
- **Login** - Partner authentication
- **Dashboard** - Overview of bookings and performance
- **Menu Management** - Package and menu management
- **Slot Management** - Time slot configuration
- **Voucher Redemption** - QR code scanning and redemption
- **Reports** - Analytics and reporting

## Testing Strategy

### Backend Testing
- **Unit Tests** - Individual function testing with Jest
- **Integration Tests** - API endpoint testing
- **Database Tests** - Database operation testing
- **E2E Tests** - Full workflow testing

### Frontend Testing
- **Component Tests** - React component testing with React Testing Library
- **Integration Tests** - User flow testing
- **E2E Tests** - Full application testing with Playwright

### Test Scripts
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm run test:backend
npm run test:frontend
```

## Deployment

### Local Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment
1. Set up environment variables
2. Deploy to cloud platform (Render.com recommended)
3. Run database migrations
4. Configure SSL and domain
5. Set up monitoring and logging

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

This project is licensed under the MIT License.