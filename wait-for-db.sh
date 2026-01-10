#!/bin/sh

# wait-for-db.sh - Wait for PostgreSQL to be fully ready and initialized

echo "Waiting for PostgreSQL to become available and fully initialized..."

# Database connection parameters
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${POSTGRES_USER:-lsdn_user}"
DB_PASSWORD="${POSTGRES_PASSWORD:-lsdn_password}"
DB_NAME="${POSTGRES_DB:-lsdn_db}"
DB_ADMIN_USER="${POSTGRES_ADMIN_USER:-postgres}"
DB_ADMIN_PASSWORD="${POSTGRES_ADMIN_PASSWORD:-${POSTGRES_PASSWORD:-lsdn_password}}"

echo "Debug: DB_HOST=$DB_HOST, DB_PORT=$DB_PORT, DB_USER=$DB_USER, DB_NAME=$DB_NAME"

# Maximum number of attempts
MAX_ATTEMPTS=60
ATTEMPT=0

# Wait for PostgreSQL to be ready
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    ATTEMPT=$((ATTEMPT + 1))
    echo "Attempt $ATTEMPT/$MAX_ATTEMPTS: Checking if PostgreSQL is ready..."
    
    # First, try to connect directly to the application database with the application user
    # This is the most straightforward test of whether the database is ready
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT current_database()" >/dev/null 2>&1; then
        echo "PostgreSQL database $DB_NAME is fully initialized and ready!"
        exit 0
    fi
    
    # If that fails, try to connect to the default postgres database to check if PostgreSQL is running
    # Try with admin user first, then fall back to application user
    if PGPASSWORD="$DB_ADMIN_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_ADMIN_USER" -d "postgres" -c "SELECT 1" >/dev/null 2>&1; then
        echo "PostgreSQL server is running!"
        
        # Check if our specific database exists using admin user
        if PGPASSWORD="$DB_ADMIN_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_ADMIN_USER" -d "postgres" -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" | grep -q 1; then
            echo "Database $DB_NAME exists, but user $DB_USER cannot connect yet. Waiting for permissions..."
        else
            echo "Database $DB_NAME does not exist yet. Waiting for initialization..."
        fi
    elif PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "postgres" -c "SELECT 1" >/dev/null 2>&1; then
        echo "PostgreSQL server is running (connected as application user)!"
        
        # Check if our specific database exists using application user
        if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "postgres" -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" | grep -q 1; then
            echo "Database $DB_NAME exists, but user $DB_USER cannot connect to it yet. Waiting for permissions..."
        else
            echo "Database $DB_NAME does not exist yet. Waiting for initialization..."
        fi
    else
        echo "PostgreSQL server is not ready yet..."
    fi
    
    # Wait before next attempt
    sleep 2
done

echo "Error: PostgreSQL did not become ready after $MAX_ATTEMPTS attempts"
echo "Last error details:"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" 2>&1 || true
exit 1