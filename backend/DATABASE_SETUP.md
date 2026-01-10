# Database Setup Guide

This guide explains how to set up the Local Singles Date Night database using the provided schema and migration files.

## Prerequisites

- PostgreSQL installed and running
- Node.js and npm installed
- TypeORM dependencies installed (see package.json)

## Environment Configuration

Create a `.env` file in the backend root directory with the following variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=lsdn_user
DB_PASSWORD=lsdn_password
DB_NAME=lsdn_dev

# Application Configuration
NODE_ENV=development
```

## Database Setup Steps

### 1. Create Database

Connect to PostgreSQL and create the database:

```sql
CREATE DATABASE lsdn_dev;
CREATE USER lsdn_user WITH PASSWORD 'lsdn_password';
GRANT ALL PRIVILEGES ON DATABASE lsdn_dev TO lsdn_user;
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Run Migrations

```bash
# Build the project
npm run build

# Run migrations
npm run migrate
```

### 4. Seed Database (Optional)

```bash
npm run seed
```

## Database Schema Overview

The database consists of the following main entities:

### Core Entities

1. **Users** - User profiles and authentication data
2. **Restaurants** - Restaurant information and partner status
3. **Packages** - Restaurant packages and pricing
4. **Availability Slots** - Time slots for bookings
5. **Bookings** - User bookings and reservations
6. **User Packages** - User package purchases
7. **Messages** - User messaging system
8. **Matching Requests** - User matching preferences

### Key Relationships

- Users can have multiple packages (User Packages)
- Restaurants have multiple packages
- Packages have multiple availability slots
- Users can make bookings for availability slots
- Messages are associated with bookings or users
- Matching requests are created by users

## Database Features

### Geospatial Support

The database uses PostgreSQL's PostGIS extension for location-based queries:

- Users and restaurants have `location` fields (Point type)
- Spatial indexes for efficient distance calculations
- Location-based matching and search

### JSON Storage

Several fields use JSONB for flexible data storage:

- User interests, languages, dietary restrictions
- Package menu items
- Message content and metadata

### Time-based Operations

- Availability slots with start/end times
- Booking time management
- Expiration tracking for packages and requests

## Migration Management

### Creating New Migrations

```bash
# Generate a new migration
npx typeorm migration:generate -d src/config/database.ts src/migrations/NewMigrationName

# Run migrations
npm run migrate

# Revert last migration
npx typeorm migration:revert -d src/config/database.ts
```

### Migration Naming Convention

Use timestamp-based naming for migrations:
- Format: `YYYYMMDDHHMMSS-Description.ts`
- Example: `20240106120000-AddUserPreferences.ts`

## Development Workflow

### Local Development

1. Start PostgreSQL
2. Run migrations: `npm run migrate`
3. Seed data (optional): `npm run seed`
4. Start application: `npm run dev`

### Production Deployment

1. Set `NODE_ENV=production` in environment
2. Run migrations on production database
3. Monitor migration logs for errors
4. Verify data integrity

## Troubleshooting

### Common Issues

1. **Migration Failures**
   - Check database connection
   - Verify migration file syntax
   - Ensure proper foreign key constraints

2. **TypeORM Errors**
   - Verify entity definitions
   - Check database configuration
   - Ensure proper imports

3. **PostgreSQL Issues**
   - Verify PostgreSQL is running
   - Check user permissions
   - Ensure PostGIS extension is available

### Debug Commands

```bash
# Check database connection
psql -h localhost -U lsdn_user -d lsdn_dev

# List tables
\dt

# Check migration status
SELECT * FROM migrations;

# View recent migrations
SELECT * FROM migrations ORDER BY id DESC LIMIT 10;
```

## Performance Considerations

### Indexes

The migration creates several important indexes:

- Spatial indexes on location fields
- Foreign key indexes for relationships
- Unique indexes for email and voucher codes
- Status-based indexes for filtering

### Query Optimization

- Use spatial queries for location-based searches
- Leverage JSONB operators for flexible filtering
- Implement proper pagination for large datasets
- Consider read replicas for high-traffic scenarios

## Backup and Recovery

### Regular Backups

```bash
# Backup database
pg_dump -h localhost -U lsdn_user lsdn_dev > lsdn_backup.sql

# Restore database
psql -h localhost -U lsdn_user -d lsdn_dev < lsdn_backup.sql
```

### Migration Rollback

```bash
# Revert to specific migration
npx typeorm migration:revert -d src/config/database.ts

# Check current migration status
SELECT * FROM migrations ORDER BY id DESC;
```

This setup provides a solid foundation for the Local Singles Date Night application with proper data modeling, relationships, and performance optimizations.