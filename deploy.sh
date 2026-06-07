#!/bin/bash

echo "🚀 Deploying Device Monitor Frontend to Vercel..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
if [[ $(echo "$NODE_VERSION 18.0.0" | tr " " "\n" | sort -V | head -n1) != "18.0.0" ]]; then
    echo -e "${RED}Node.js version 18+ required. Current: $NODE_VERSION${NC}"
    exit 1
fi

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm ci --production=false

# Run type checking
echo -e "${GREEN}Running type checking...${NC}"
npm run type-check

# Run linting
echo -e "${GREEN}Running linting...${NC}"
npm run lint

# Build the project
echo -e "${GREEN}Building project...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Build successful!${NC}"
else
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

# Deploy to Vercel
echo -e "${GREEN}Deploying to Vercel...${NC}"
vercel --prod

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Your app is live at: https://${VERCEL_PROJECT_NAME}.vercel.app${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi
