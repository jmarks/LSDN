#!/bin/bash

# init-db-wrapper.sh - Wrapper script for database initialization
# This script ensures proper sequencing and error handling for database setup
# Can be used both as a standalone script and within Docker environments

echo "🗃️  Starting database initialization wrapper..."

# Database connection parameters
DB_HOST="${DB_HOST:-postgres}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${POSTGRES_USER:-lsdn_user}"
DB_PASSWORD="${POSTGRES_PASSWORD:-lsdn_password}"
DB_NAME="${POSTGRES_DB:-lsdn_db}"

# Determine the initialization script path based on environment
if [ -f "/docker-entrypoint-initdb.d/init-db.sql" ]; then
    INIT_SCRIPT_PATH="/docker-entrypoint-initdb.d/init-db.sql"
elif [ -f "./scripts/init-db.sql" ]; then
    INIT_SCRIPT_PATH="./scripts/init-db.sql"
else
    echo "❌ No initialization script found in standard locations"
    exit 1
fi

# Function to check if database exists
check_database_exists() {
    echo "🔍 Checking if database $DB_NAME exists..."
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "postgres" -d "postgres" -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME';" | grep -q 1; then
        echo "✅ Database $DB_NAME already exists"
        return 0
    else
        echo "❌ Database $DB_NAME does not exist"
        return 1
    fi
}

# Function to check if user exists
check_user_exists() {
    echo "🔍 Checking if user $DB_USER exists..."
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "postgres" -d "postgres" -c "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER';" | grep -q 1; then
        echo "✅ User $DB_USER already exists"
        return 0
    else
        echo "❌ User $DB_USER does not exist"
        return 1
    fi
}

# Function to run the initialization script
run_init_script() {
    echo "📜 Running database initialization script from: $INIT_SCRIPT_PATH"
    
    # Run the initialization script
    if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "postgres" -d "postgres" -f "$INIT_SCRIPT_PATH"; then
        echo "✅ Database initialization completed successfully"
        return 0
    else
        echo "❌ Database initialization failed"
        return 1
    fi
}

# Function to wait for PostgreSQL
wait_for_postgres() {
    echo "⏳ Waiting for PostgreSQL to become available..."
    MAX_ATTEMPTS=30
    ATTEMPT=0
    
    while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
        ATTEMPT=$((ATTEMPT + 1))
        echo "🔄 Attempt $ATTEMPT/$MAX_ATTEMPTS: Checking PostgreSQL availability..."
        
        # Try to connect to PostgreSQL
        if PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "postgres" -d "postgres" -c "SELECT 1;" >/dev/null 2>&1; then
            echo "✅ PostgreSQL is ready!"
            return 0
        fi
        
        if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
            echo "❌ PostgreSQL did not become ready after $MAX_ATTEMPTS attempts"
            return 1
        fi
        
        sleep 2
    done
}

# Main execution
main() {
    echo "🚀 Starting database initialization process..."
    
    # Wait for PostgreSQL to be ready (skip if running inside container with local host)
    if [ "$DB_HOST" != "localhost" ] && [ "$DB_HOST" != "127.0.0.1" ]; then
        if ! wait_for_postgres; then
            exit 1
        fi
    fi
    
    # Check if database and user already exist
    if check_database_exists && check_user_exists; then
        echo "📋 Database and user already exist, skipping initialization"
        exit 0
    fi
    
    # Run the initialization script
    if run_init_script; then
        echo "🎉 Database initialization completed successfully!"
        exit 0
    else
        echo "❌ Database initialization failed"
        exit 1
    fi
}

# Execute main function with error handling
main "$@"
exit $?