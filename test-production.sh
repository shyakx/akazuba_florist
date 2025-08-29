#!/bin/bash

# Production Testing Script
echo "🧪 Testing Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local method="${3:-GET}"
    local expected_status="${4:-200}"
    
    echo -n "Testing $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$url")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL (Status: $response, Expected: $expected_status)${NC}"
        ((FAILED++))
    fi
}

# Function to test CORS
test_cors() {
    local origin="$1"
    local expected="$2"
    
    echo -n "Testing CORS for $origin... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS \
        -H "Origin: $origin" \
        -H "Access-Control-Request-Method: POST" \
        "https://akazuba-backend-api.onrender.com/api/v1/auth/login")
    
    if [ "$response" = "$expected" ]; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL (Status: $response, Expected: $expected)${NC}"
        ((FAILED++))
    fi
}

echo "🔍 Testing Backend Health..."
test_endpoint "Backend Health" "https://akazuba-backend-api.onrender.com/health"

echo "🔍 Testing API Endpoints..."
test_endpoint "Products API" "https://akazuba-backend-api.onrender.com/api/v1/products"
test_endpoint "Categories API" "https://akazuba-backend-api.onrender.com/api/v1/categories"

echo "🔍 Testing CORS Configuration..."
# Test production origin (should pass)
test_cors "https://online-shopping-by-diane.vercel.app" "204"
# Test localhost origin (should fail in production)
test_cors "http://localhost:3000" "403"

echo "🔍 Testing Frontend..."
test_endpoint "Frontend Homepage" "https://online-shopping-by-diane.vercel.app"
test_endpoint "Frontend Products" "https://online-shopping-by-diane.vercel.app/products"

echo "🔍 Testing Security Headers..."
echo -n "Testing Security Headers... "
headers=$(curl -s -I "https://akazuba-backend-api.onrender.com/health" | grep -E "(X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Strict-Transport-Security)")

if [ ! -z "$headers" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL (No security headers found)${NC}"
    ((FAILED++))
fi

echo "🔍 Testing Database Connection..."
echo -n "Testing Database Connection... "
db_test=$(curl -s "https://akazuba-backend-api.onrender.com/health" | grep -o '"database":"connected"')

if [ ! -z "$db_test" ]; then
    echo -e "${GREEN}✅ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}❌ FAIL (Database not connected)${NC}"
    ((FAILED++))
fi

echo ""
echo "📊 Test Results Summary:"
echo "========================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo "========================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Production deployment is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please check the deployment.${NC}"
    exit 1
fi
