#!/bin/bash

# Custom entrypoint for PostgreSQL initialization
# This script wraps the standard PostgreSQL entrypoint with our initialization logic

echo "🚀 Starting custom PostgreSQL initialization..."

# Set default environment variables if not provided
: ${POSTGRES_DB:=lsdn_db}
: ${POSTGRES_USER:=lsdn_user}
: ${POSTGRES_PASSWORD:=lsdn_password}

# Export variables for the wrapper script
export DB_HOST="localhost"
export DB_PORT="5432"
export POSTGRES_USER="$POSTGRES_USER"
export POSTGRES_PASSWORD="$POSTGRES_PASSWORD"
export POSTGRES_DB="$POSTGRES_DB"

# First, start PostgreSQL in the background using the standard entrypoint
/usr/local/bin/docker-entrypoint.sh postgres &

# Store the PID
POSTGRES_PID=$!

# Wait a moment for PostgreSQL to start
echo "⏳ Waiting for PostgreSQL to start..."
sleep 5

# Now run our initialization wrapper
if [ -f "/docker-entrypoint-initdb.d/init-db-wrapper.sh" ]; then
    echo "📜 Running database initialization wrapper..."
    /docker-entrypoint-initdb.d/init-db-wrapper.sh
    
    if [ $? -eq 0 ]; then
        echo "✅ Database initialization completed successfully"
    else
        echo "❌ Database initialization failed"
        kill $POSTGRES_PID
        exit 1
    fi
else
    echo "⚠️  No initialization wrapper found, using standard initialization"
fi

# Wait for the PostgreSQL process to finish
wait $POSTGRES_PID