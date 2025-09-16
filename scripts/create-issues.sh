#!/bin/bash

# Issue Creation Helper Script
# This script helps create GitHub issues from the pre-defined issues list

echo "🚀 DSA Quiz Master - Issue Creation Helper"
echo "=========================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "📥 Install it from: https://cli.github.com/"
    echo "🔑 Then authenticate with: gh auth login"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "🔑 Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is ready!"
echo ""

# Function to create an issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    local milestone="$4"
    
    echo "📝 Creating issue: $title"
    
    # Create the issue
    if [ -n "$milestone" ]; then
        gh issue create --title "$title" --body "$body" --label "$labels" --milestone "$milestone"
    else
        gh issue create --title "$title" --body "$body" --label "$labels"
    fi
    
    if [ $? -eq 0 ]; then
        echo "✅ Issue created successfully!"
    else
        echo "❌ Failed to create issue."
    fi
    echo ""
}

# Menu for issue creation
echo "📋 Available actions:"
echo "1. Create all Performance Optimization issues (4 issues)"
echo "2. Create all Testing & QA issues (8 issues)"
echo "3. Create all Documentation issues (8 issues)"
echo "4. Create all Security issues (4 issues)"
echo "5. Create single issue (interactive)"
echo "6. List all available issue templates"
echo "0. Exit"
echo ""

read -p "Choose an option (0-6): " choice

case $choice in
    1)
        echo "🚀 Creating Performance Optimization issues..."
        
        create_issue "[PERF] Implement Code Splitting and Lazy Loading" \
        "## Description
Implement code splitting and lazy loading to improve initial bundle load time and overall application performance.

## Acceptance Criteria
- [ ] Implement route-based code splitting
- [ ] Add lazy loading for quiz modules  
- [ ] Split vendor dependencies into separate chunks
- [ ] Reduce initial bundle size by at least 40%
- [ ] Maintain functionality across all routes

## Implementation Notes
- Use React.lazy() and Suspense for component-level splitting
- Configure Vite's rollupOptions for manual chunks
- Add loading states for lazy-loaded components
- Test performance improvements with Lighthouse" \
        "enhancement,performance,priority: high" \
        "Phase 2"
        
        create_issue "[PERF] Optimize Bundle Size" \
        "## Description
Analyze and optimize the current bundle size to improve load times and user experience.

## Acceptance Criteria
- [ ] Analyze current bundle composition with webpack-bundle-analyzer
- [ ] Remove unused dependencies and dead code
- [ ] Implement tree shaking for better optimization
- [ ] Reduce bundle size to under 500KB gzipped
- [ ] Document optimization strategies

## Implementation Notes
- Use \`npm run build\` with bundle analysis
- Review all imported libraries for usage
- Consider replacing heavy libraries with lighter alternatives
- Use dynamic imports for non-critical features" \
        "enhancement,performance,bundle-size,priority: high" \
        "Phase 2"
        
        create_issue "[PERF] Add Service Worker for Offline Functionality" \
        "## Description
Implement a service worker to enable offline functionality and improve user experience when network connectivity is poor.

## Acceptance Criteria
- [ ] Create service worker for caching static assets
- [ ] Implement offline quiz functionality
- [ ] Add offline indicator in UI
- [ ] Cache quiz data and user progress locally
- [ ] Handle online/offline synchronization

## Implementation Notes
- Use Workbox for service worker management
- Cache critical assets and API responses
- Implement background sync for user progress
- Add offline notifications and UI states" \
        "enhancement,offline,PWA,priority: medium" \
        "Phase 2"
        
        create_issue "[PERF] Implement Advanced Caching Strategies" \
        "## Description
Implement sophisticated caching strategies to improve application performance and reduce server load.

## Acceptance Criteria
- [ ] Implement browser caching for static assets
- [ ] Add memory caching for frequently accessed data
- [ ] Implement cache invalidation strategies
- [ ] Add cache warming for critical data
- [ ] Monitor cache hit rates

## Implementation Notes
- Use IndexedDB for local data caching
- Implement cache versioning and expiration
- Add cache management utilities
- Consider using React Query for server state caching" \
        "enhancement,performance,caching,priority: medium" \
        "Phase 2"
        
        echo "✅ Performance Optimization issues created!"
        ;;
    2)
        echo "🧪 Creating Testing & QA issues..."
        
        create_issue "[TEST] Implement Comprehensive Unit Testing" \
        "## Description
Create a comprehensive unit testing suite for all React components and utility functions.

## Acceptance Criteria
- [ ] Set up Jest and React Testing Library
- [ ] Write unit tests for all major components
- [ ] Achieve 80%+ code coverage
- [ ] Test all utility functions and hooks
- [ ] Add continuous testing in CI/CD pipeline

## Implementation Notes
- Focus on testing user interactions and edge cases
- Mock external dependencies and APIs
- Test accessibility and error boundaries
- Add snapshot testing for UI components" \
        "testing,unit-tests,quality,priority: high" \
        "Phase 2"
        
        # Continue with other testing issues...
        echo "ℹ️  This is a demo - implement remaining testing issues similarly"
        ;;
    5)
        echo "📝 Interactive issue creation"
        read -p "Enter issue title: " title
        read -p "Enter labels (comma-separated): " labels
        read -p "Enter milestone (optional): " milestone
        echo "Enter issue body (press Ctrl+D when done):"
        body=$(cat)
        
        create_issue "$title" "$body" "$labels" "$milestone"
        ;;
    6)
        echo "📋 Available issue templates:"
        echo "- feature_request.md - New features and enhancements"
        echo "- bug_report.md - Bug fixes and error corrections"
        echo "- documentation.md - Documentation updates"
        echo "- testing.md - Testing-related issues"
        echo "- performance.md - Performance optimizations"
        echo "- security.md - Security improvements"
        echo ""
        echo "📖 See docs/github-issues-list.md for 32 pre-defined issues"
        ;;
    0)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please choose 0-6."
        ;;
esac