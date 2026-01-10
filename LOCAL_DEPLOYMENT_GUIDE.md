# 🏠 Local Development Guide

This guide will help you run the Local Singles Date Night prototype locally on your machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js 18+** - [Download from Node.js website](https://nodejs.org/)
- **Docker** - [Download from Docker website](https://www.docker.com/products/docker-desktop)
- **Docker Compose** - Included with Docker Desktop

## Quick Start (Recommended)

### Option 1: One-Click Setup with Docker

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd lsdn
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Access your applications**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Partner Portal: http://localhost:3002

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd lsdn
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   
   # Partner Portal
   cd ../partner-portal
   npm install
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npm run migrate
   ```

6. **Start development servers**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   cd frontend
   npm run dev
   
   # Terminal 3: Partner Portal
   cd partner-portal
   npm run dev
   ```

## Service URLs

Once everything is running, you can access:

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Partner Portal**: http://localhost:3002
- **API Documentation**: http://localhost:3001/api/health

## Environment Configuration

The `.env` file contains all the configuration variables. For local development, you can use the default values in `.env.example`, but you'll want to update these for production:

### Required for Local Development
```bash
# Database (Docker will handle this)
DATABASE_URL="postgresql://lsdn_user:lsdn_password@localhost:5432/lsdn"

# Cache (Docker will handle this)
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-jwt-secret-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Application
PORT=3001
FRONTEND_URL="http://localhost:5173"
PARTNER_URL="http://localhost:3002"
```

### Optional (For Full Functionality)
```bash
# Email (for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

## Docker Services

The `docker-compose.yml` file starts these services:

- **PostgreSQL Database** - Port 5432
- **Redis Cache** - Port 6379
- **Backend API** - Port 3001
- **Frontend App** - Port 3000
- **Partner Portal** - Port 3002
- **Nginx Reverse Proxy** - Port 80/443

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Partner Portal Development
```bash
cd partner-portal
npm run dev  # Starts Vite dev server
```

## Database Management

### View Database
```bash
# Connect to PostgreSQL
docker exec -it lsdn-postgres psql -U lsdn_user -d lsdn

# Or use a GUI tool like pgAdmin
# Connection: localhost:5432, Database: lsdn
```

### Run Migrations
```bash
cd backend
npm run migrate
```

### Seed Sample Data
```bash
cd backend
npm run seed
```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Check what's using the port
lsof -i :3000
# Kill the process if needed
kill -9 <PID>
```

**Docker services not starting:**
```bash
# Check Docker status
docker ps
# Restart services
docker-compose restart
```

**Database connection errors:**
```bash
# Check if database is ready
docker-compose logs postgres
# Wait a moment and try again
```

**Missing dependencies:**
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### Reset Everything
```bash
# Stop and remove all containers
docker-compose down

# Remove volumes (this will delete your data)
docker-compose down -v

# Start fresh
docker-compose up -d

# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../partner-portal && npm install

# Run migrations
cd backend && npm run migrate
```

## API Testing

### Test Endpoints
```bash
# Health check
curl http://localhost:3001/api/health

# Test authentication
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Use Postman
Import the API collection from `docs/postman-collection.json` for easy testing.

## Frontend Development Tips

### Hot Reload
- Frontend changes are automatically reflected in the browser
- Backend changes restart the server automatically with nodemon

### Browser Dev Tools
- Open http://localhost:5173
- Use browser dev tools to inspect API calls
- Check console for any errors

## Production Build

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build

# Partner Portal
cd partner-portal
npm run build
```

### Run Production Build
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

## Getting Help

If you encounter issues:

1. **Check the logs:**
   ```bash
   docker-compose logs
   ```

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **Review the documentation:**
   - [Main README](README.md)
   - [Deployment Guide](docs/DEPLOYMENT.md)
   - [System Architecture](plans/system-architecture.md)

4. **Common solutions:**
   - Ensure Docker is running
   - Check that ports 3000-3002 are available
   - Verify Node.js version is 18+
   - Make sure you've run `npm install` in each service directory

## Next Steps

Once you have the local environment running:

1. **Explore the frontend** at http://localhost:5173
2. **Test the API** at http://localhost:3001
3. **Try the partner portal** at http://localhost:3002
4. **Add sample data** by running seed scripts
5. **Start customizing** the application for your needs

Happy coding! 🚀