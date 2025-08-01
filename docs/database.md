# Database Guide

This app uses IndexedDB for client-side storage of user data, quiz progress, and analytics.

## Structure
- **userProfiles**: User account info
- **userSessions**: Session and preferences
- **quizProgress**: Quiz completion records
- **quizAttempts**: Individual question attempts (analytics)

## Schemas

### UserProfile
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

### QuizProgress
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

### UserSession
```typescript
interface UserSession {
  id: string;
  userId: string;
  createdAt: Date;
  lastActive: Date;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
  };
}
```

## Features
- Automatic migration from localStorage
- Offline support
- TypeScript type safety
- Real-time sync via React hooks
- Backup/restore utilities
- Dev tools: Database Debugger, automated tests

See code in `src/services/database.ts`, `src/hooks/useDatabase.ts`, and related files for implementation details.
