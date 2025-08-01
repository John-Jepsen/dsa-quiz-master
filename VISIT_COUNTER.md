# Visit Counter Implementation

This document describes the persistent page visit counter implementation for the DSA Quiz Master React Native Web app.

## Overview

The visit counter tracks page visits by storing the count in a `count.json` file in the repository and incrementing it via a Vercel serverless function that uses the GitHub REST API.

## Components

### 1. count.json
Initial file containing the visit count:
```json
{ "visits": 0 }
```

### 2. api/increment.js
Serverless function that:
- Reads the current count from `count.json` via GitHub API
- Increments the count
- Commits the updated count back to the repository
- Handles rate limits and merge conflicts
- Uses `GITHUB_TOKEN` environment variable

### 3. useVisitCounter.ts
React hook that:
- Fetches `/api/increment` on page load
- Prevents multiple increments per page load session
- Handles development mode with mock data
- Provides loading and error states

### 4. VisitCounter.tsx
Component that displays the visit count in the bottom-right corner with appropriate loading and error handling.

## Deployment Requirements

### Vercel Configuration
The `vercel.json` file configures:
- Serverless functions for the `/api` directory
- Proper routing for the React app

### Environment Variables
Vercel must have access to:
- `GITHUB_TOKEN`: GitHub personal access token with `repo` scope

### GitHub Repository Settings
The repository needs:
- Actions enabled (for the GitHub token to work)
- The deploying account must have write access to the repository

## Features

- ✅ No third-party services
- ✅ Persistent storage in repository
- ✅ Single increment per page load
- ✅ Error handling for rate limits
- ✅ Conflict resolution for concurrent updates
- ✅ Development mode support
- ✅ Loading states and graceful fallbacks

## Usage

The visit counter automatically increments when users visit the application and displays the total count in the bottom-right corner of the interface.