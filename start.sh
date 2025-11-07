#!/bin/bash

echo "🐺 Starting Husky Puppy Trainer..."
echo ""
echo "Starting backend server on port 3001..."
echo "Starting frontend on port 5173..."
echo ""
echo "Access the app at:"
echo "  - Local: http://localhost:5173"
echo "  - Network: http://$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}'):5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm run dev:all
