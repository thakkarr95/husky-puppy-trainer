#!/bin/bash

echo "🚀 Deploying Husky Puppy Trainer to Production..."
echo ""

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "⚠️  .env.production not found!"
    echo ""
    echo "Please create .env.production with your backend URL:"
    echo "  VITE_API_URL=https://your-backend-url.railway.app"
    echo ""
    echo "Copy from example:"
    echo "  cp .env.production.example .env.production"
    echo "  # Then edit .env.production with your URL"
    exit 1
fi

echo "✓ Environment configured"
echo ""
echo "Building frontend..."
npm run build

echo ""
echo "Deploying to GitHub Pages..."
npm run deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your app is live at:"
echo "  https://thakkarr95.github.io/husky-puppy-trainer"
echo ""
