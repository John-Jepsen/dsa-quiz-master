#!/bin/bash

echo "🚀 Checking DSA Quiz Master deployment..."
echo ""

# Check if the site is accessible
echo "📡 Testing main page..."
if curl -s -o /dev/null -w "%{http_code}" https://john-jepsen.github.io/dsa-quiz-master/ | grep -q "200"; then
    echo "✅ Main page is accessible"
else
    echo "❌ Main page is not accessible (404 or other error)"
fi

echo ""
echo "📡 Testing assets..."
if curl -s -o /dev/null -w "%{http_code}" https://john-jepsen.github.io/dsa-quiz-master/assets/ | grep -q "200\|403"; then
    echo "✅ Assets directory exists"
else
    echo "❌ Assets directory not found"
fi

echo ""
echo "🔍 To check deployment status, visit:"
echo "https://github.com/John-Jepsen/dsa-quiz-master/actions"
echo ""
echo "🌐 Your app should be available at:"
echo "https://john-jepsen.github.io/dsa-quiz-master/"
