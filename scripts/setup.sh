#!/bin/bash

# Local Singles Date Night - Setup Script

echo "🚀 Setting up Local Singles Date Night..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your actual configuration values"
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p nginx/ssl
mkdir -p scripts

# Start the services
echo "🐳 Starting services with Docker Compose..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "✅ Checking service status..."
docker-compose ps

echo ""
echo "🎉 Local Singles Date Night is now running!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Partner Portal: http://localhost:3002"
echo ""
echo "🔧 Next steps:"
echo "   1. Update .env with your actual configuration"
echo "   2. Run database migrations: docker-compose exec backend npm run migrate"
echo "   3. Seed sample data: docker-compose exec backend npm run seed"
echo ""
echo "📚 For production deployment, see docs/DEPLOYMENT.md"