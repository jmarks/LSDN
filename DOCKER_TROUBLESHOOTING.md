# Docker Troubleshooting Guide

## PostgreSQL Version Compatibility Issue

**Error**: `database files are incompatible with server. The data directory was initialized by PostgreSQL version 15, which is not compatible with this version 14.9`

**Root Cause**: The PostgreSQL data volume was created with a different version than what's specified in the docker-compose.yml file.

## Solution

### Step 1: Stop and Remove Existing Containers
```bash
# Stop all running containers
docker-compose down

# Remove all containers, networks, and volumes
docker-compose down -v
```

### Step 2: Clean Up Docker System (Optional but Recommended)
```bash
# Remove unused Docker resources
docker system prune -f

# Remove all volumes (be careful - this removes ALL volumes)
docker volume prune -f
```

### Step 3: Start Fresh with Correct PostgreSQL Version
```bash
# Start all services fresh
docker-compose up --build
```

## Alternative: Keep Existing Data

If you want to preserve existing data, you can:

### Option 1: Use PostgreSQL 15 Image
The docker-compose.yml has been updated to use `postgis/postgis:15-3.4` which should be compatible.

### Option 2: Backup and Restore
```bash
# 1. Start with PostgreSQL 15
docker-compose up postgres

# 2. Create backup of existing data (if any)
docker-compose exec postgres pg_dump -U lsdn_user lsdn_db > backup.sql

# 3. Stop and remove old volume
docker-compose down -v

# 4. Start fresh
docker-compose up --build

# 5. Restore data
docker-compose exec postgres psql -U lsdn_user -d lsdn_db < backup.sql
```

## Redis Memory Warning

**Warning**: `WARNING Memory overcommit must be enabled!`

This is just a warning and won't prevent Redis from working, but you can fix it:

### Option 1: System-level fix (requires sudo)
```bash
# Enable memory overcommit
sudo sysctl vm.overcommit_memory=1

# Make it permanent
echo 'vm.overcommit_memory = 1' | sudo tee -a /etc/sysctl.conf
```

### Option 2: Docker-level fix
Add this to the Redis service in docker-compose.yml:
```yaml
redis:
  image: redis:7-alpine
  sysctls:
    - net.core.somaxconn=1000
  # ... rest of config
```

## Complete Reset Script

Create a script to completely reset your Docker environment:

```bash
#!/bin/bash
# reset-docker.sh

echo "Stopping all containers..."
docker-compose down

echo "Removing all volumes..."
docker-compose down -v

echo "Removing unused Docker resources..."
docker system prune -f

echo "Starting fresh..."
docker-compose up --build

echo "Done! Your application should now be running."
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3000"
```

Make it executable and run:
```bash
chmod +x reset-docker.sh
./reset-docker.sh
```

## Verification Steps

After fixing the issue:

1. **Check all services are running**:
   ```bash
   docker-compose ps
   ```

2. **Check PostgreSQL health**:
   ```bash
   docker-compose logs postgres
   ```

3. **Test database connection**:
   ```bash
   docker-compose exec postgres pg_isready -U lsdn_user
   ```

4. **Run migrations**:
   ```bash
   docker-compose exec backend node dist/scripts/migrate.js
   ```

5. **Access applications**:
   - Frontend: http://localhost:5173
   - Backend health check: http://localhost:3000/health

## Prevention

To avoid this issue in the future:

1. **Always use the same PostgreSQL version** in your docker-compose.yml
2. **Document your database schema** changes in migrations
3. **Use consistent image tags** (avoid `latest` tags)
4. **Backup important data** before making changes

## Getting Help

If you continue to have issues:

1. Check Docker logs: `docker-compose logs`
2. Verify Docker is running: `docker ps`
3. Check available disk space: `df -h`
4. Ensure ports 5432, 6379, 3000, 5173 are available