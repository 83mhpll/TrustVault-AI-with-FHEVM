#!/bin/bash

# TrustVault AI Build Script for Vercel
echo "🚀 Building TrustVault AI..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install web dependencies
echo "🌐 Installing web dependencies..."
cd web
npm install

# Build web application
echo "🔨 Building web application..."
npm run build

echo "✅ Build completed successfully!"
