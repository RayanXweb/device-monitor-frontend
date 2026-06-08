#!/bin/bash

# ============================================
# DEPLOY TO RAILWAY SCRIPT
# ============================================

echo "🚀 Deploying to Railway..."

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo -e "${GREEN}Logging into Railway...${NC}"
railway login

# Link to existing project or create new
echo -e "${GREEN}Linking to Railway project...${NC}"
railway link

# Set environment variables
echo -e "${GREEN}Setting environment variables...${NC}"
railway variables set NODE_ENV=production
railway variables set NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api/v1
railway variables set NEXT_PUBLIC_WS_URL=wss://your-backend.up.railway.app
railway variables set NEXTAUTH_SECRET=$(openssl rand -base64 32)
railway variables set NEXTAUTH_URL=https://your-frontend.up.railway.app

# Deploy to Railway
echo -e "${GREEN}Deploying to Railway...${NC}"
railway up

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Your app is live at: https://your-frontend.up.railway.app${NC}"
    
    # Open the deployed URL
    railway open
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi
