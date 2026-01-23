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
- Docker and Docker Compose
- Git

### Local Development with Docker (Recommended)

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd LSDN
   ```

2. **Start all services with Docker Compose:**
   ```bash
   docker compose up -d
   ```

   This will start:
   - PostgreSQL with PostGIS (port 5432)
   - Redis (port 6379)
   - Backend API (port 3000)
   - Frontend (port 5173)

3. **Seed the database with Santa Cruz demo data:**
   ```bash
   docker compose exec backend npm run seed
   ```

4. **Access the applications:**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3000
   - **API Health**: http://localhost:3000/health

5. **Test credentials:**
   - Email: `sc.tester@example.com`
   - Password: `Password123!`

### Viewing Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Stopping Services

```bash
# Stop all containers
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v
```

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

## 🎯 Key Features (Implemented)

### User Experience
- ✅ **Email/Password Registration** - Simple account creation
- ✅ **Profile Completion** - Name, age, bio, interests, goals (interests/goals optional)
- ✅ **Preferences Setup** - Age range, distance radius, interests
- ✅ **Discover Restaurants** - Browse local partner restaurants
- ✅ **Proximity-Based Matching** - PostGIS-powered location matching
- ✅ **Real Bookings** - Create bookings with voucher codes and QR codes
- ✅ **Voucher System** - 8-character unique codes per booking
- ✅ **QR Code Generation** - Scannable codes for restaurant validation
- ✅ **State Persistence** - Onboarding progress saved to localStorage

### Restaurant Partner Experience (Data Seeded)
- ✅ **Restaurant Profiles** - Name, description, location, cuisine type
- ✅ **Package Management** - Date night packages with pricing
- ✅ **Availability Slots** - Time-based booking slots
- ✅ **Capacity Management** - Track current bookings vs capacity
- 🚧 **Partner Portal** - Planned for future release

### Technical Features
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **PostGIS Integration** - Geo-spatial queries for proximity matching
- ✅ **Joi Validation** - Schema-based input validation
- ✅ **Docker Deployment** - Full containerization
- ✅ **TypeScript** - Type-safe backend and frontend
- ✅ **Context-Based State** - Global auth and onboarding contexts

### Features In Progress
- 🚧 **Email Verification** - Currently bypassed (auto-verified)
- 🚧 **Stripe Payments** - Integration stubbed
- 🚧 **Real-time Messaging** - Basic messaging structure in place
- 🚧 **Image Uploads** - Currently base64, plan to use Cloudinary

## 📚 Documentation

- **[Functional Specification](docs/FUNCTIONAL_SPECIFICATION.md)** - Complete feature documentation
- **[API Documentation](#)** - API endpoints and usage (see functional spec)
- **[Database Schema](#)** - Table structures and relationships (see functional spec)
- **[Deployment Guide](#deployment)** - Docker-based deployment

## 🔧 Development

### Project Structure

```
LSDN/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── entities/     # TypeORM entities
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Auth, validation, etc.
│   │   └── scripts/      # Migration and seed scripts
│   └── dist/             # Compiled TypeScript
├── frontend/             # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts (Auth, Onboarding)
│   │   ├── hooks/        # Custom React hooks
│   │   └── pages/        # Page components
│   └── dist/             # Production build
├── docker-compose.yml    # Docker services configuration
└── docs/                 # Additional documentation
```

### Environment Setup

The application uses environment variables for configuration. Key variables:

**Backend:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string  
- `JWT_SECRET` - JWT signing secret
- `FRONTEND_URL` - CORS allowed origin

**Frontend:**
- `VITE_API_URL` - Backend API URL (handled by Vite proxy)

### Testing

```bash
# Backend tests (when implemented)
cd backend
npm run test

# Manual API testing
curl http://localhost:3000/api/restaurants
```

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