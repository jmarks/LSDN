# Final Troubleshooting Guide

## Issues Resolved

### 1. Database Connection Error ✅ FIXED
**Error**: `database "lsdn_user" does not exist`

**Root Cause**: The backend was trying to connect to a database named "lsdn_user" instead of "lsdn_db"

**Solution**: Fixed the DATABASE_URL environment variable in docker-compose.yml:
```yaml
# Before (incorrect)
- DATABASE_URL=postgresql://${POSTGRES_USER:-lsdn_user}:${POSTGRES_PASSWORD:-lsdn_password}@postgres:5432/${POSTGRES_DB:-lsdn_db}

# After (correct)
- DATABASE_URL=postgresql://lsdn_user:lsdn_password@postgres:5432/lsdn_db
```

### 2. Port Conflict ✅ FIXED
**Issue**: Frontend and backend both trying to use port 3000

**Solution**: Updated docker-compose.yml to use different ports:
```yaml
# Backend
ports:
  - "3001:3000"  # Changed from "3000:3000"

# Frontend
ports:
  - "5173:5173"  # Correct port

# Frontend API URL
environment:
  - VITE_API_URL=http://backend:3000/api  # Changed from localhost:3000
```

## Current Application Ports

- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:5173
- **Backend Health Check**: http://localhost:3001/health
- **PostgreSQL**: localhost:5432 (internal: postgres:5432)
- **Redis**: localhost:6379 (internal: redis:6379)

## Steps to Get Running

### 1. Clean Up and Restart
```bash
# Stop all containers
docker-compose down -v

# Clean up Docker system
docker system prune -f

# Start fresh
docker-compose up --build
```

### 2. Verify Services
```bash
# Check all services are running
docker-compose ps

# Expected output:
# Name                     Command                  State           Ports
# -----------------------------------------------------------------------------
# lsdn-backend-1    sh -c npm install && npm ...   Up      0.0.0.0:3001->3000/tcp
# lsdn-frontend-1   sh -c npm install && npm ...   Up      0.0.0.0:5173->5173/tcp
# lsdn-postgres-1   docker-entrypoint.sh postgres  Up      0.0.0.0:5432->5432/tcp
# lsdn-redis-1      docker-entrypoint.sh redis ... Up      0.0.0.0:6379->6379/tcp
```

### 3. Run Database Migrations
```bash
# Build the backend
docker-compose exec backend npm run build

# Run migrations
docker-compose exec backend node dist/scripts/migrate.js

# Optional: Seed with sample data
docker-compose exec backend node dist/scripts/seed.js
```

### 4. Test the Application
- **Frontend**: http://localhost:5173
- **Backend Health**: http://localhost:3001/health
- **API Documentation**: http://localhost:3001/api-docs (when implemented)

## Common Issues and Solutions

### Issue: Database still not accessible
**Solution**: Ensure the .env file has correct PostgreSQL credentials:
```bash
POSTGRES_DB=lsdn_db
POSTGRES_USER=lsdn_user
POSTGRES_PASSWORD=your_password
```

### Issue: Frontend can't connect to backend
**Solution**: The frontend should connect to `http://backend:3000/api` internally, which maps to `http://localhost:3001/api` externally.

### Issue: TypeORM compilation errors
**Solution**: Ensure all dependencies are installed:
```bash
cd backend
npm install
```

### Issue: Redis connection errors
**Solution**: Redis should be accessible at `redis:6379` internally and `localhost:6379` externally.

## Verification Commands

### Check Database Connection
```bash
docker-compose exec postgres pg_isready -U lsdn_user -d lsdn_db
# Should return: lsdn_db:5432 - accepting connections
```

### Check Redis Connection
```bash
docker-compose exec redis redis-cli ping
# Should return: PONG
```

### Check Backend Health
```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"...","uptime":...}
```

### Check Frontend
```bash
curl http://localhost:5173
# Should return HTML content
```

## Next Steps

1. **Install Dependencies**: Run `npm install` in both backend and frontend directories
2. **Configure Environment**: Set up .env files with proper values
3. **Run Migrations**: Execute database migrations
4. **Test Endpoints**: Verify API endpoints work correctly
5. **Frontend Development**: Complete React component implementation

## Files Modified

1. ✅ `docker-compose.yml` - Fixed port conflicts and database URL
2. ✅ `backend/src/config/database.ts` - Fixed environment variables
3. ✅ All backend service files - Fixed TypeORM and JWT issues

The application should now start without the database connection errors and port conflicts.