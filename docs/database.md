# Database Guide

This app uses IndexedDB for client-side storage of user data, quiz progress, and analytics with advanced features for synchronization, analytics, and maintenance.

## Structure
- **userProfiles**: User account info
- **userSessions**: Session and preferences
- **quizProgress**: Quiz completion records
- **quizAttempts**: Individual question attempts (analytics)

## Enhanced Features

### 1. Synchronization & Offline Support
- **Online/Offline Detection**: Real-time connectivity monitoring
- **Operation Queuing**: Automatically queues operations when offline
- **Auto-Sync**: Syncs pending operations when back online
- **Retry Logic**: Intelligent retry with exponential backoff

### 2. Advanced Analytics
- **Performance Tracking**: Comprehensive analytics across topics and modules
- **Time-based Filtering**: View data for 7d, 30d, 90d, or all time
- **Trend Analysis**: Track learning progress and performance trends
- **Difficulty Breakdown**: Performance analysis by difficulty level

### 3. Performance Optimization
- **Intelligent Caching**: LRU cache with configurable TTL
- **Memory Management**: Automatic cleanup and memory optimization
- **Query Optimization**: Indexed queries for fast data retrieval
- **Batch Operations**: Efficient bulk data operations

### 4. Import/Restore System
- **Complete Backup/Restore**: Full data backup and restoration
- **Merge Strategies**: Multiple conflict resolution strategies
- **Data Validation**: Integrity checking and validation
- **Import Reports**: Detailed statistics and conflict reporting

### 5. Database Maintenance
- **Automated Cleanup**: Remove orphaned and outdated data
- **Data Archiving**: Long-term storage with retention policies
- **Cache Management**: Monitor and optimize cache performance
- **Storage Optimization**: Database compression and optimization

## Services

### Core Services
- `database.ts` - Main IndexedDB service
- `migration.ts` - Data migration from localStorage
- `sync-service.ts` - Online/offline synchronization
- `database-cache.ts` - Performance caching layer
- `data-import.ts` - Backup/restore functionality
- `database-maintenance.ts` - Cleanup and optimization

### React Hooks
- `useDatabase.ts` - Core database operations with caching
- `useSync.ts` - Synchronization state management

### Components
- `SyncStatusIndicator.tsx` - Real-time sync status
- `AdvancedAnalyticsDashboard.tsx` - Comprehensive analytics
- `DataImportComponent.tsx` - Import/restore interface
- `DatabaseMaintenanceDashboard.tsx` - Maintenance tools
- `DatabaseEnhancementsDemo.tsx` - Feature showcase

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
    soundEnabled: boolean;
  };
}
```

## Usage Examples

### Using the Sync Service
```typescript
import { useSync } from './hooks/useSync';

function MyComponent() {
  const { isOnline, pendingOperations, forceSync } = useSync();
  
  return (
    <div>
      Status: {isOnline ? 'Online' : 'Offline'}
      {pendingOperations > 0 && (
        <button onClick={forceSync}>
          Sync {pendingOperations} pending operations
        </button>
      )}
    </div>
  );
}
```

### Using Enhanced Analytics
```typescript
import { AdvancedAnalyticsDashboard } from './components/AdvancedAnalyticsDashboard';

function AnalyticsPage() {
  return <AdvancedAnalyticsDashboard />;
}
```

### Database Maintenance
```typescript
import { databaseMaintenanceService } from './services/database-maintenance';

// Perform maintenance
const result = await databaseMaintenanceService.performMaintenance({
  removeOrphanedData: true,
  archiveOldSessions: true,
  sessionRetentionDays: 30,
});
```

## Performance Features
- Automatic migration from localStorage
- Intelligent caching with configurable TTL
- Real-time sync via React hooks
- Comprehensive backup/restore utilities
- Automated maintenance and cleanup
- Dev tools: Database Debugger, analytics dashboard

## Browser Support
- Chrome 24+
- Firefox 16+
- Safari 7+
- Edge 12+

## Development Tools
Available in development mode:
- `window.dbCache` - Cache management
- `window.dbUtils` - Database utilities
- `window.testDatabase()` - Database testing
- Sync simulation controls
- Maintenance dashboard

See implementation in `src/services/` and `src/components/` for detailed usage.
