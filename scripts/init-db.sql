-- Database initialization script for Local Singles Date Night
-- This script creates the database and user if they don't exist

-- Create user if it doesn't exist (this must be done in the default postgres database)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'lsdn_user') THEN
        CREATE USER lsdn_user WITH PASSWORD 'lsdn_password';
        RAISE NOTICE 'User lsdn_user created successfully';
    ELSE
        RAISE NOTICE 'User lsdn_user already exists';
    END IF;
END $$;

-- Create database if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'lsdn_db') THEN
        CREATE DATABASE lsdn_db WITH OWNER lsdn_user;
        RAISE NOTICE 'Database lsdn_db created successfully';
    ELSE
        RAISE NOTICE 'Database lsdn_db already exists';
    END IF;
END $$;

-- Grant privileges to the user on the database
GRANT ALL PRIVILEGES ON DATABASE lsdn_db TO lsdn_user;

-- Connect to the lsdn_db database to grant schema privileges
-- We need to use the \c command to switch database context
\c lsdn_db

-- Grant all privileges on the public schema to the user
GRANT ALL PRIVILEGES ON SCHEMA public TO lsdn_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lsdn_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lsdn_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO lsdn_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO lsdn_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO lsdn_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO lsdn_user;