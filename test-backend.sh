#!/bin/bash

# Test script for Habit Hero Backend
# Usage: ./test-backend.sh <backend-url> <api-key>

if [ $# -ne 2 ]; then
    echo "Usage: ./test-backend.sh <backend-url> <api-key>"
    echo "Example: ./test-backend.sh https://habit-hero-backend.railway.app your_api_key_here"
    exit 1
fi

BACKEND_URL=$1
API_KEY=$2

echo "🧪 Testing Habit Hero Backend at: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s "$BACKEND_URL/health")
if echo "$HEALTH_RESPONSE" | grep -q "OK"; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    echo "Response: $HEALTH_RESPONSE"
fi
echo ""

# Test 2: Receipt Validation (with mock data)
echo "2. Testing receipt validation..."
RECEIPT_RESPONSE=$(curl -s -X POST "$BACKEND_URL/validate-receipt" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -d '{
    "receiptData": "mock_receipt_data",
    "productId": "com.vibecode.habithero.monthly",
    "transactionId": "test_transaction_123",
    "userId": "test_user_123"
  }')

if echo "$RECEIPT_RESPONSE" | grep -q "isValid"; then
    echo "✅ Receipt validation endpoint working"
    echo "Response: $RECEIPT_RESPONSE"
else
    echo "❌ Receipt validation failed"
    echo "Response: $RECEIPT_RESPONSE"
fi
echo ""

# Test 3: Subscription Status
echo "3. Testing subscription status..."
STATUS_RESPONSE=$(curl -s -X GET "$BACKEND_URL/subscription-status" \
  -H "Authorization: Bearer $API_KEY" \
  -H "X-User-ID: test_user_123")

if echo "$STATUS_RESPONSE" | grep -q "isActive"; then
    echo "✅ Subscription status endpoint working"
    echo "Response: $STATUS_RESPONSE"
else
    echo "❌ Subscription status failed"
    echo "Response: $STATUS_RESPONSE"
fi
echo ""

# Test 4: Update Subscription
echo "4. Testing update subscription..."
UPDATE_RESPONSE=$(curl -s -X POST "$BACKEND_URL/update-subscription" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $API_KEY" \
  -H "X-User-ID: test_user_123" \
  -d '{
    "productId": "com.vibecode.habithero.monthly",
    "transactionId": "test_transaction_123",
    "expiresDate": "2024-12-31T23:59:59.000Z",
    "isActive": true
  }')

if echo "$UPDATE_RESPONSE" | grep -q "success"; then
    echo "✅ Update subscription endpoint working"
    echo "Response: $UPDATE_RESPONSE"
else
    echo "❌ Update subscription failed"
    echo "Response: $UPDATE_RESPONSE"
fi
echo ""

echo "🎉 Backend testing complete!"
echo ""
echo "Next steps:"
echo "1. Update your frontend .env file with:"
echo "   EXPO_PUBLIC_BACKEND_URL=$BACKEND_URL"
echo "   EXPO_PUBLIC_API_KEY=$API_KEY"
echo ""
echo "2. Configure App Store Connect webhook:"
echo "   $BACKEND_URL/webhooks/apple"
echo ""
echo "3. Test with a real app build"



