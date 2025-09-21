#!/bin/bash

# Build script for Disaster Management App
echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build frontend
echo "🔨 Building frontend..."
cd Frontend
npm install
npm run build
cd ..

# Create dist directory if it doesn't exist
if [ ! -d "dist" ]; then
    echo "📁 Creating dist directory..."
    mkdir dist
fi

# Copy built files to dist
echo "📋 Copying built files..."
cp -r Frontend/dist/* dist/

echo "✅ Build completed successfully!"
echo "📂 Built files are in the dist/ directory"
