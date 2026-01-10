# Local Singles Date Night

![Local Singles Date Night](https://img.shields.io/badge/Status-Prototype-blue)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)

**Local Singles Date Night** is a dating platform that flips the traditional model on its head: instead of paying for memberships or endless boosts, users pre-purchase a **1, 3, 5, or 10-dinner package** from participating local restaurants and businesses.

## 🎯 Value Proposition

**For Singles:**
- Curated first-date experiences with local restaurants
- No endless swiping or chat fatigue
- Budget clarity with prepaid packages
- Safety features and verified profiles
- Real-world meetings with compatible matches

**For Restaurants:**
- Predictable prepaid revenue
- Demand smoothing on lower-traffic nights
- Turnkey co-marketing opportunities
- Reduced no-shows with prepaid bookings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (can use Docker)

### Local Development

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

6. **Access the applications:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Partner Portal: http://localhost:3002

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js with Express.js
- TypeScript
- PostgreSQL with PostGIS
- Redis for caching
- Stripe for payments
- Cloudinary for image processing

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for state management
- React Hook Form for forms

**Infrastructure:**
- Docker for containerization
- Docker Compose for local development
- Render.com for easy deployment
- GitHub Actions for CI/CD

### System Architecture

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

## 📖 Documentation

- [System Architecture](plans/system-architecture.md) - Detailed technical architecture
- [Project Structure](plans/project-structure.md) - Code organization and structure
- [Deployment Guide](docs/DEPLOYMENT.md) - Step-by-step deployment instructions
- [API Documentation](docs/API.md) - Complete API reference

## 🎯 Key Features

### User Experience
- **Simple Registration** - Email, basic profile, and preferences
- **Package Purchase** - Buy 1, 3, 5, or 10 dinner packages
- **Time Window Commitment** - Select availability and experience types
- **Availability-First Matching** - See only compatible, available candidates
- **Limited "Ask" Functionality** - Throttled invitations to prevent spam
- **Post-Booking Chat** - Messaging only opens after booking confirmation
- **Safety Features** - ID verification, photo moderation, safe check-ins

### Restaurant Partner Experience
- **Easy Onboarding** - Simple registration and setup
- **Menu Management** - Configure prix-fixe packages and pricing
- **Slot Management** - Set availability and capacity
- **Voucher Redemption** - QR code scanning at point of service
- **Analytics Dashboard** - Track bookings, revenue, and performance

### Admin Experience
- **User Management** - Approve, suspend, or remove users
- **Partner Management** - Approve and manage restaurant partners
- **Content Moderation** - Review and moderate user content
- **Analytics** - Monitor platform performance and metrics

## 🚀 Deployment

### Easy Deployment Options

**Render.com (Recommended):**
- One-click deployment for all services
- Free PostgreSQL and Redis
- Automatic SSL and custom domains
- [Deployment Guide](docs/DEPLOYMENT.md#option-1-rendercom-recommended-for-easy-deployment)

**Railway:**
- Simple deployment with minimal configuration
- Built-in database and cache services
- [Deployment Guide](docs/DEPLOYMENT.md#option-2-railway)

**Vercel + Railway (Alternative):**
- Frontend on Vercel, backend on Railway
- Best of both platforms
- [Deployment Guide](docs/DEPLOYMENT.md#option-3-vercel--railway-alternative)

### Production Requirements

1. **Environment Variables** - Set all required environment variables
2. **Database** - PostgreSQL with PostGIS extension
3. **Cache** - Redis instance
4. **Email** - SMTP service (SendGrid, Mailgun, or Gmail)
5. **Images** - Cloudinary account for image processing
6. **Payments** - Stripe account for payment processing

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:coverage
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run specific test suite
npm run test:e2e:frontend
npm run test:e2e:backend
```

## 🔧 Development

### Code Style
- ESLint for linting
- Prettier for formatting
- Husky for pre-commit hooks
- TypeScript for type safety

### Git Workflow
1. Create feature branch from `main`
2. Make changes with tests
3. Commit with descriptive message
4. Push to remote
5. Create pull request
6. Review and merge

### Adding New Features
1. Create database migration
2. Add API endpoints
3. Update frontend components
4. Write tests
5. Update documentation

## 📊 Metrics and Monitoring

### Key Performance Indicators
- **Completed first dates per active user per month**
- **Restaurant partner NPS**
- **GMV and take rate**
- **Sign-up to package purchase conversion**
- **Ask to accept rate**
- **Show rate and no-show rate**
- **Slot utilization per venue**

### Monitoring Setup
- Application logs
- Database performance
- API response times
- Error tracking
- User analytics

## 🛡️ Security

### Authentication
- JWT with refresh tokens
- Password hashing with bcrypt
- Email verification required

### Authorization
- Role-based access control
- API rate limiting
- Input validation and sanitization

### Data Protection
- HTTPS only
- Encrypted database connections
- Secure file uploads
- Regular security audits

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Add tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Express.js](https://expressjs.com/) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Stripe](https://stripe.com/) - Payment processing
- [Cloudinary](https://cloudinary.com/) - Image processing
- [Render.com](https://render.com/) - Easy deployment

## 📞 Support

For support and questions:
- Create an issue in this repository
- Join our community discussions
- Contact the development team

---

**Local Singles Date Night** - Making dating local, meaningful, and community-focused. ❤️