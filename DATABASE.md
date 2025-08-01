# Database Implementation

This project now uses IndexedDB as the primary database for storing user data, quiz progress, and session information.

## Database Structure

### Tables

1. **userProfiles** - User account information
2. **userSessions** - User session and preferences
3. **quizProgress** - Quiz completion records
4. **quizAttempts** - Individual question attempts (for analytics)

### Schemas

#### UserProfile
```typescript
interface UserProfile {
  id: string;
  username: string;
  email?: string;
  createdAt: Date;
  totalScore: number;
  completedModules: string[];
  achievements: string[];
  stats: {
    totalQuizzesTaken: number;
    totalTimeSpent: number;
    averageScore: number;
    streakDays: number;
    lastQuizDate?: Date;
  };
}
```

#### QuizProgress
```typescript
interface QuizProgress {
  id: string;
  userId: string;
  moduleId: string;
  topicId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
  timeSpent: number;
}
```

#### UserSession
```typescript
interface UserSession {
  id: string;
  userId: string;
  createdAt: Date;
  lastActive: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
    soundEnabled: boolean;
  };
}
```

#### QuizAttempt
```typescript
interface QuizAttempt {
  id: string;
  userId: string;
  moduleId: string;
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
  timestamp: Date;
}
```

## Migration

The app automatically migrates data from localStorage to IndexedDB on first load. This includes:

- User profiles
- Quiz results
- Preferences
- Completed modules

## Usage

### Database Service
```typescript
import { database } from '@/services/database';

// Initialize database
await database.initialize();

// Create user profile
const userId = await database.createUserProfile({
  username: 'john_doe',
  totalScore: 0,
  completedModules: [],
  achievements: [],
  stats: { ... }
});
```

### React Hooks
```typescript
import { useUserProfile, useQuizProgress } from '@/hooks/useDatabase';

function MyComponent() {
  const { profile, updateProfile } = useUserProfile();
  const { progress, saveProgress } = useQuizProgress();
  
  // Use profile and progress data
}
```

### Database Provider
The app is wrapped with a `DatabaseProvider` that handles initialization and provides global database state.

## Features

- **Automatic Migration**: Seamlessly migrates from localStorage to IndexedDB
- **Offline Support**: Works completely offline using browser storage
- **Type Safety**: Full TypeScript support for all database operations
- **Error Handling**: Comprehensive error handling and fallbacks
- **Performance**: Indexed queries for fast data retrieval
- **Analytics**: Detailed tracking of quiz attempts and user behavior

## Development

### Resetting Database
```typescript
import { migrationService } from '@/services/migration';

// Reset all data and migration state
await migrationService.resetMigration();
```

### Exporting Data
```typescript
import { database } from '@/services/database';

// Export all data for backup
const data = await database.exportData();
```

## Browser Support

- Chrome 58+
- Firefox 55+
- Safari 10+
- Edge 79+

All modern browsers support IndexedDB. The app gracefully falls back to localStorage if IndexedDB is unavailable.