#!/bin/bash

echo "🧪 Testing Husky Puppy Trainer Deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test Backend Health
echo "1️⃣  Testing Backend Health..."
HEALTH=$(curl -s https://husky-puppy-trainer-production.up.railway.app/api/health)
if echo "$HEALTH" | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend health check PASSED${NC}"
    echo "   Response: $HEALTH"
else
    echo -e "${RED}❌ Backend health check FAILED${NC}"
    echo "   Response: $HEALTH"
fi
echo ""

# Test Backend Sync Endpoint
echo "2️⃣  Testing Backend Sync Endpoint..."
SYNC=$(curl -s https://husky-puppy-trainer-production.up.railway.app/api/sync)
if echo "$SYNC" | grep -q "trainingTasks"; then
    echo -e "${GREEN}✅ Sync endpoint PASSED${NC}"
    echo "   Response: $(echo $SYNC | head -c 100)..."
else
    echo -e "${RED}❌ Sync endpoint FAILED${NC}"
    echo "   Response: $SYNC"
fi
echo ""

# Test Frontend
echo "3️⃣  Testing Frontend..."
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" https://thakkarr95.github.io/husky-puppy-trainer/)
if [ "$FRONTEND" = "200" ]; then
    echo -e "${GREEN}✅ Frontend PASSED (HTTP 200)${NC}"
else
    echo -e "${RED}❌ Frontend FAILED (HTTP $FRONTEND)${NC}"
fi
echo ""

# Test CORS
echo "4️⃣  Testing CORS (Cross-Origin)..."
CORS=$(curl -s -H "Origin: https://thakkarr95.github.io" -H "Access-Control-Request-Method: GET" -X OPTIONS https://husky-puppy-trainer-production.up.railway.app/api/health -I | grep -i "access-control")
if [ ! -z "$CORS" ]; then
    echo -e "${GREEN}✅ CORS headers present${NC}"
    echo "   $CORS"
else
    echo -e "${YELLOW}⚠️  CORS headers not found (might still work)${NC}"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 DEPLOYMENT STATUS SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🌐 Frontend URL: https://thakkarr95.github.io/husky-puppy-trainer/"
echo "🔌 Backend API:  https://husky-puppy-trainer-production.up.railway.app"
echo ""
echo "✨ Next Steps:"
echo "   1. Open the frontend URL in your browser"
echo "   2. Check if 'Offline Mode' banner is gone"
echo "   3. Try logging a potty break or food entry"
echo "   4. Verify data syncs across devices"
echo ""
echo "📱 Mobile Access:"
echo "   Open the URL on your phone and add to home screen!"
echo ""
