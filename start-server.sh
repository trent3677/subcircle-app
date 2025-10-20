#!/bin/bash

# Full-stack application startup script for DEVELOPMENT
# Builds the React frontend and starts the Express server on port 5000
# Deployment uses npm start instead, which defaults to 8080

export PORT=5000

echo "🔧 Building React frontend..."
npm run build

if [ $? -eq 0 ]; then
  echo "✅ Frontend build successful!"
  echo "🚀 Starting Express server on port $PORT..."
  echo "📱 Frontend: http://0.0.0.0:$PORT"
  echo "🛠️  API: http://0.0.0.0:$PORT/api"
  echo "🔗 Health check: http://0.0.0.0:$PORT/health"
  echo ""
  tsx server/index.ts
else
  echo "❌ Frontend build failed!"
  exit 1
fi