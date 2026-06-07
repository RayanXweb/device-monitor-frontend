#!/bin/bash

echo "🚀 Deploying Device Monitor Frontend to Vercel..."

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Run linting
echo -e "${GREEN}Running linting...${NC}"
npm run lint

# Build the project
echo -e "${GREEN}Building project...${NC}"
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
else
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

# Set environment variables if not set
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo -e "${YELLOW}NEXT_PUBLIC_API_URL not set. Please enter your backend URL:${NC}"
    read API_URL
    vercel env add NEXT_PUBLIC_API_URL production <<< $API_URL
fi

if [ -z "$NEXT_PUBLIC_WS_URL" ]; then
    echo -e "${YELLOW}NEXT_PUBLIC_WS_URL not set. Please enter your WebSocket URL:${NC}"
    read WS_URL
    vercel env add NEXT_PUBLIC_WS_URL production <<< $WS_URL
fi

# Deploy to Vercel
echo -e "${GREEN}Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi
