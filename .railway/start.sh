#!/bin/bash

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-3000}

# Run database migrations if needed
# npm run migrate

# Start Next.js application
npm run start:railway

# Keep container alive
while true; do
  sleep 1000
done
