#!/bin/bash
# Deployment script for CVC Web Solutions
# This script runs on the production server

set -e  # Exit on error

echo "🚀 Starting deployment process..."

# Navigate to project directory
cd /home/ploi/containers/cvcwebsolutionscom

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin master

# Check if .env.production exists
if [ ! -f .env.production ]; then
  echo "⚙️  Creating .env.production from example..."
  cp .env.production.example .env.production
  echo "⚠️  WARNING: Please update .env.production with real credentials!"
  exit 1
fi

# Create necessary directories if they don't exist
echo "📁 Ensuring data directories exist..."
mkdir -p data
mkdir -p public/media
mkdir -p public/screenshots

# Backup database before deployment
if [ -f data/payload.db ]; then
  BACKUP_FILE="data/payload.db.backup.$(date +%Y%m%d_%H%M%S)"
  echo "💾 Backing up database to $BACKUP_FILE..."
  cp data/payload.db "$BACKUP_FILE"

  # Keep only last 5 backups
  ls -t data/payload.db.backup.* 2>/dev/null | tail -n +6 | xargs -r rm
fi

# Stop existing containers (but keep volumes!)
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Build new image
echo "🔨 Building new Docker image..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Start containers
echo "🚀 Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for container to be healthy
echo "⏳ Waiting for application to start..."
sleep 10

# Check if container is running
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
  echo "✅ Deployment successful!"

  # Show running containers
  echo ""
  echo "📊 Container status:"
  docker-compose -f docker-compose.prod.yml ps

  # Show recent logs
  echo ""
  echo "📋 Recent logs:"
  docker-compose -f docker-compose.prod.yml logs --tail=30

  # Clean up old images
  echo ""
  echo "🧹 Cleaning up old Docker images..."
  docker image prune -f

  echo ""
  echo "🎉 Deployment complete! Site is live at https://cvcwebsolutions.com"
else
  echo "❌ Deployment failed! Container is not running."
  echo "📋 Logs:"
  docker-compose -f docker-compose.prod.yml logs
  exit 1
fi
