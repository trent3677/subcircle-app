#!/bin/bash

# Production startup script optimized for autoscale deployment
# Skips build step since deployment should use pre-built assets

# Use PORT environment variable or default to 8080 for autoscale deployment
PORT=${PORT:-8080}

echo "🚀 Starting Express server in production mode..."
echo "📱 Frontend: http://0.0.0.0:$PORT"
echo "🛠️  API: http://0.0.0.0:$PORT/api"
echo "🔗 Health check: http://0.0.0.0:$PORT/health"
echo ""

# Set production environment
export NODE_ENV=production

# Start server directly without building (deployment should have pre-built assets)
tsx server/index.ts