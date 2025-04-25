#!/bin/bash

# CyberCon Frontend Deployment Script
# This script automates the deployment process for the CyberCon frontend

echo "🚀 Starting CyberCon frontend deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file from .env.example before deploying."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build (if needed)
# echo "🔨 Building frontend..."
# npm run build

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "⚠️ PM2 not found. Installing PM2 globally..."
    npm install -g pm2
fi

# Start or restart the application with PM2
echo "🚀 Starting application with PM2..."
if pm2 list | grep -q "cybercon-frontend"; then
    pm2 restart cybercon-frontend
else
    pm2 start server.js --name "cybercon-frontend"
fi

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot (optional)
echo "⚙️ Setting up PM2 to start on system boot..."
pm2 startup

echo "✅ Deployment completed successfully!"
echo "Your CyberCon frontend is now running at http://localhost:3000"
echo ""
echo "Don't forget to configure your web server (Nginx/Apache) as a reverse proxy."
echo "For more information, check the README.md file."
