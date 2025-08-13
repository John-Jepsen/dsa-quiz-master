# DSA Quiz Master - Database Documentation

## Overview

The DSA Quiz Master uses a robust IndexedDB-based database system for local data storage. This provides offline functionality and excellent performance for quiz data, user progress, and session management.

## Database Architecture

### Core Components

1. **DatabaseService** (`src/services/database.ts`)
   - Main database service with CRUD operations
   - Singleton pattern for consistent access
   - Error handling and transaction management

2. **Migration Service** (`src/services/migration.ts`)
   - Handles migration from localStorage to IndexedDB
   - Version management and data integrity

3. **Database Hooks** (`src/hooks/useDatabase.ts`)
   - React hooks for database operations
   - State management and real-time updates

4. **Database Provider** (`src/components/DatabaseProvider.tsx`)
   - React context for global database state
   - Loading states and error handling

## Database Schema

### Tables

#### userProfiles
```typescript
{
  id: string;                    // Unique user identifier
  username: string;              // Display name
  email?: string;                // Optional email
  createdAt: Date;              // Account creation date
  totalScore: number;            // Cumulative score
  completedModules: string[];    // Completed module IDs
  achievements: string[];        // Earned achievements
  stats: {
    totalQuizzesTaken: number;
    totalTimeSpent: number;
    averageScore: number;
    streakDays: number;
    lastQuizDate?: Date;
  };
}
```

#### userSessions
```typescript
{
  id: string;                    // Session identifier
  userId: string;                // Associated user
  createdAt: Date;              // Session start time
  lastActive: Date;             // Last activity timestamp
  preferences: {
    theme: 'light' | 'dark' | 'system';
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
    soundEnabled: boolean;
  };
}
```

#### quizProgress
```typescript
{
  id: string;                    // Progress record ID
  userId: string;                // Associated user
  moduleId: string;              // Quiz module
  topicId: string;               // Quiz topic
  score: number;                 // Percentage score
  totalQuestions: number;        // Total questions in quiz
  correctAnswers: number;        // Number of correct answers
  completedAt: Date;            // Completion timestamp
  timeSpent: number;            // Time in milliseconds
}
```

#### quizAttempts
```typescript
{
  id: string;                    // Attempt identifier
  userId: string;                // Associated user
  moduleId: string;              // Quiz module
  questionId: string;            // Specific question
  userAnswer: number;            // User's answer choice
  correctAnswer: number;         // Correct answer choice
  isCorrect: boolean;           // Whether answer was correct
  timeSpent: number;            // Time spent on question
  timestamp: Date;              // When attempt was made
}
```

## API Reference

### Database Service Methods

#### User Management
- `createUserProfile(profile)` - Create new user
- `getUserProfile(userId)` - Get user by ID
- `updateUserProfile(userId, updates)` - Update user data

#### Session Management
- `createSession(userId)` - Create new session
- `getActiveSession(userId)` - Get current session
- `updateSessionActivity(sessionId)` - Update last active time

#### Progress Tracking
- `saveQuizProgress(progress)` - Save quiz completion
- `getUserProgress(userId)` - Get all user progress
- `getModuleProgress(userId, moduleId)` - Get module-specific progress

#### Analytics
- `saveQuizAttempt(attempt)` - Save question attempt
- `getUserAttempts(userId)` - Get all attempts
- `getUserStats(userId)` - Calculate user statistics

#### Utility
- `exportData()` - Export all database data
- `clearAllData()` - Clear all tables

## Usage Examples

### Basic Setup
```typescript
import { database } from './services/database';

// Initialize database
await database.initialize();

// Create user
const userId = await database.createUserProfile({
  username: 'john_doe',
  email: 'john@example.com',
  totalScore: 0,
  completedModules: [],
  achievements: [],
  stats: {
    totalQuizzesTaken: 0,
    totalTimeSpent: 0,
    averageScore: 0,
    streakDays: 0,
  }
});
```

### Recording Quiz Progress
```typescript
// Save quiz completion
await database.saveQuizProgress({
  userId: 'user123',
  moduleId: 'arrays-basics',
  topicId: 'arrays',
  score: 85,
  totalQuestions: 10,
  correctAnswers: 8,
  timeSpent: 300000, // 5 minutes
});

// Get user's progress
const progress = await database.getUserProgress('user123');
```

### Using React Hooks
```typescript
import { useUserProfile, useQuizProgress } from './hooks/useDatabase';

function MyComponent() {
  const { profile, updateProfile, loading } = useUserProfile();
  const { progress, saveProgress } = useQuizProgress();
  
  // Use profile and progress data
  return <div>Welcome {profile?.username}!</div>;
}
```

## Testing

### Browser Console Testing
Open browser developer tools and use these functions:

```javascript
// Basic functionality test
await testDatabase();

// Initialize with sample data
await initDatabase();

// Comprehensive verification
await verifyDatabase();

// Get statistics
await getDatabaseStats();
```

### Automated Testing
```typescript
import { testDatabase } from './services/database-test';

// Run in development
if (process.env.NODE_ENV === 'development') {
  testDatabase().then(success => {
    console.log('Database test:', success ? 'PASSED' : 'FAILED');
  });
}
```

## Migration

The app automatically migrates data from localStorage to IndexedDB on first run:

1. Checks for existing migration
2. Scans localStorage for legacy data
3. Converts to new schema
4. Imports to IndexedDB
5. Cleans up localStorage
6. Marks migration complete

## Development Tools

### Database Debugger
Visual component for inspecting database state:
```typescript
import { DatabaseDebugger } from './components/DatabaseDebugger';

// Add to your app for debugging
<DatabaseDebugger />
```

### Export/Import
```typescript
// Export data for backup
const backup = await database.exportData();

// Save to file
const blob = new Blob([JSON.stringify(backup)], {type: 'application/json'});
```

## Error Handling

The database service includes comprehensive error handling:

- Connection failures
- Transaction errors
- Constraint violations
- Version mismatches
- Quota exceeded

All errors are logged and propagated with meaningful messages.

## Performance Considerations

- Uses IndexedDB for optimal performance
- Indexed queries for fast lookups
- Batch operations for bulk updates
- Automatic cleanup of old sessions
- Efficient serialization

## Browser Support

Requires browsers with IndexedDB support:
- Chrome 24+
- Firefox 16+
- Safari 7+
- Edge 12+

## Security

- All data stored locally in browser
- No server communication required
- User data remains private
- Can be cleared by user at any time
