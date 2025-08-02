/**
 * Database service using IndexedDB for DSA Quiz Master
 * Provides structured storage for quiz data, user progress, and session management
 */

// Import unified types
import type { UserProfile, UserSession, QuizProgress, QuizAttempt, Achievement, UserAchievement, LeaderboardEntry, TopicLeaderboard } from '../types';

// Re-export types for convenience
export type { UserProfile, UserSession, QuizProgress, QuizAttempt, Achievement, UserAchievement, LeaderboardEntry, TopicLeaderboard } from '../types';

// Database configuration
const DB_NAME = 'DSAQuizMasterDB';
const DB_VERSION = 2; // Updated for achievements and leaderboard tables

export class DatabaseService {
  private db: IDBDatabase | null = null;
  private static instance: DatabaseService | null = null;

  private constructor() { }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async initialize(): Promise<void> {
    if (this.db) {
      return; // Already initialized
    }

    return new Promise((resolve, reject) => {
      // Check if IndexedDB is supported
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this browser'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        const error = request.error;
        console.error('Database initialization failed:', error);
        reject(new Error(`Failed to open database: ${error?.message || 'Unknown error'}`));
      };

      request.onsuccess = () => {
        this.db = request.result;

        // Add error handler for database
        this.db.onerror = (event) => {
          console.error('Database error:', event);
        };

        resolve();
      };

      request.onupgradeneeded = (event) => {
        try {
          const db = (event.target as IDBOpenDBRequest).result;
          this.createTables(db);
        } catch (error) {
          console.error('Database upgrade failed:', error);
          reject(new Error('Failed to upgrade database schema'));
        }
      };

      request.onblocked = () => {
        console.warn('Database upgrade blocked. Please close other tabs with this application.');
      };
    });
  }

  private createTables(db: IDBDatabase): void {
    // User profiles table
    if (!db.objectStoreNames.contains('userProfiles')) {
      const userStore = db.createObjectStore('userProfiles', { keyPath: 'id' });
      userStore.createIndex('username', 'username', { unique: true });
      userStore.createIndex('email', 'email', { unique: false });
    }

    // User sessions table
    if (!db.objectStoreNames.contains('userSessions')) {
      const sessionStore = db.createObjectStore('userSessions', { keyPath: 'id' });
      sessionStore.createIndex('userId', 'userId', { unique: false });
      sessionStore.createIndex('lastActive', 'lastActive', { unique: false });
    }

    // Quiz progress table
    if (!db.objectStoreNames.contains('quizProgress')) {
      const progressStore = db.createObjectStore('quizProgress', { keyPath: 'id' });
      progressStore.createIndex('userId', 'userId', { unique: false });
      progressStore.createIndex('moduleId', 'moduleId', { unique: false });
      progressStore.createIndex('topicId', 'topicId', { unique: false });
      progressStore.createIndex('completedAt', 'completedAt', { unique: false });
    }

    // Quiz attempts table (for detailed analytics)
    if (!db.objectStoreNames.contains('quizAttempts')) {
      const attemptStore = db.createObjectStore('quizAttempts', { keyPath: 'id' });
      attemptStore.createIndex('userId', 'userId', { unique: false });
      attemptStore.createIndex('moduleId', 'moduleId', { unique: false });
      attemptStore.createIndex('questionId', 'questionId', { unique: false });
      attemptStore.createIndex('timestamp', 'timestamp', { unique: false });
    }

    // Achievements table (master list of all achievements)
    if (!db.objectStoreNames.contains('achievements')) {
      const achievementStore = db.createObjectStore('achievements', { keyPath: 'id' });
      achievementStore.createIndex('category', 'category', { unique: false });
      achievementStore.createIndex('rarity', 'rarity', { unique: false });
    }

    // User achievements table (tracks which achievements users have unlocked)
    if (!db.objectStoreNames.contains('userAchievements')) {
      const userAchievementStore = db.createObjectStore('userAchievements', { keyPath: 'id' });
      userAchievementStore.createIndex('userId', 'userId', { unique: false });
      userAchievementStore.createIndex('achievementId', 'achievementId', { unique: false });
      userAchievementStore.createIndex('unlockedAt', 'unlockedAt', { unique: false });
    }

    // Leaderboard entries table (pre-computed leaderboard data)
    if (!db.objectStoreNames.contains('leaderboardEntries')) {
      const leaderboardStore = db.createObjectStore('leaderboardEntries', { keyPath: 'id' });
      leaderboardStore.createIndex('userId', 'userId', { unique: false });
      leaderboardStore.createIndex('totalScore', 'totalScore', { unique: false });
      leaderboardStore.createIndex('averageScore', 'averageScore', { unique: false });
      leaderboardStore.createIndex('lastActiveAt', 'lastActiveAt', { unique: false });
    }
  }

  private ensureDatabase(): void {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }

    if (this.db.version !== DB_VERSION) {
      throw new Error('Database version mismatch. Please refresh the page.');
    }
  }

  private handleTransactionError(transaction: IDBTransaction, operation: string): void {
    transaction.onerror = () => {
      console.error(`Transaction failed for ${operation}:`, transaction.error);
    };

    transaction.onabort = () => {
      console.error(`Transaction aborted for ${operation}:`, transaction.error);
    };
  }

  // User Profile operations
  async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt'>): Promise<string> {
    this.ensureDatabase();

    const newProfile: UserProfile = {
      ...profile,
      id: this.generateId(),
      createdAt: new Date(),
      stats: {
        ...profile.stats,
        lastQuizDate: profile.stats.lastQuizDate
          ? (typeof profile.stats.lastQuizDate === 'string'
            ? new Date(profile.stats.lastQuizDate)
            : profile.stats.lastQuizDate)
          : undefined
      }
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userProfiles'], 'readwrite');
      this.handleTransactionError(transaction, 'createUserProfile');

      const store = transaction.objectStore('userProfiles');
      const request = store.add(newProfile);

      request.onsuccess = () => resolve(newProfile.id);
      request.onerror = () => {
        const error = request.error;
        if (error?.name === 'ConstraintError') {
          reject(new Error('Username already exists'));
        } else {
          reject(new Error(`Failed to create user profile: ${error?.message || 'Unknown error'}`));
        }
      };
    });
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userProfiles'], 'readonly');
      const store = transaction.objectStore('userProfiles');
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error('Failed to get user profile'));
    });
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    this.ensureDatabase();

    const profile = await this.getUserProfile(userId);
    if (!profile) {
      throw new Error('User profile not found');
    }

    const updatedProfile = { ...profile, ...updates };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userProfiles'], 'readwrite');
      const store = transaction.objectStore('userProfiles');
      const request = store.put(updatedProfile);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Failed to update user profile'));
    });
  }

  // Session operations
  async createSession(userId: string): Promise<string> {
    this.ensureDatabase();

    const session: UserSession = {
      id: this.generateId(),
      userId,
      createdAt: new Date(),
      lastActive: new Date(),
      preferences: {
        theme: 'system',
        difficulty: 'mixed',
        soundEnabled: true,
      },
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userSessions'], 'readwrite');
      const store = transaction.objectStore('userSessions');
      const request = store.add(session);

      request.onsuccess = () => resolve(session.id);
      request.onerror = () => reject(new Error('Failed to create session'));
    });
  }

  async getActiveSession(userId: string): Promise<UserSession | null> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userSessions'], 'readonly');
      const store = transaction.objectStore('userSessions');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const sessions = request.result;
        if (sessions.length === 0) {
          resolve(null);
          return;
        }

        // Return the most recent session
        const latestSession = sessions.sort((a, b) =>
          new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
        )[0];

        resolve(latestSession);
      };

      request.onerror = () => reject(new Error('Failed to get active session'));
    });
  }

  async updateSessionActivity(sessionId: string): Promise<void> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userSessions'], 'readwrite');
      const store = transaction.objectStore('userSessions');
      const getRequest = store.get(sessionId);

      getRequest.onsuccess = () => {
        const session = getRequest.result;
        if (!session) {
          reject(new Error('Session not found'));
          return;
        }

        session.lastActive = new Date();
        const putRequest = store.put(session);

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(new Error('Failed to update session activity'));
      };

      getRequest.onerror = () => reject(new Error('Failed to get session'));
    });
  }

  // Quiz Progress operations
  async saveQuizProgress(progress: Omit<QuizProgress, 'id' | 'completedAt'>): Promise<string> {
    this.ensureDatabase();

    const newProgress: QuizProgress = {
      ...progress,
      id: this.generateId(),
      completedAt: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['quizProgress'], 'readwrite');
      const store = transaction.objectStore('quizProgress');
      const request = store.add(newProgress);

      request.onsuccess = () => resolve(newProgress.id);
      request.onerror = () => reject(new Error('Failed to save quiz progress'));
    });
  }

  async getUserProgress(userId: string): Promise<QuizProgress[]> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['quizProgress'], 'readonly');
      const store = transaction.objectStore('quizProgress');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get user progress'));
    });
  }

  async getModuleProgress(userId: string, moduleId: string): Promise<QuizProgress[]> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['quizProgress'], 'readonly');
      const store = transaction.objectStore('quizProgress');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const allProgress = request.result;
        const moduleProgress = allProgress.filter(p => p.moduleId === moduleId);
        resolve(moduleProgress);
      };

      request.onerror = () => reject(new Error('Failed to get module progress'));
    });
  }

  // Quiz Attempts operations (for detailed analytics)
  async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'timestamp'>): Promise<string> {
    this.ensureDatabase();

    const newAttempt: QuizAttempt = {
      ...attempt,
      id: this.generateId(),
      timestamp: new Date(),
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['quizAttempts'], 'readwrite');
      const store = transaction.objectStore('quizAttempts');
      const request = store.add(newAttempt);

      request.onsuccess = () => resolve(newAttempt.id);
      request.onerror = () => reject(new Error('Failed to save quiz attempt'));
    });
  }

  async getUserAttempts(userId: string): Promise<QuizAttempt[]> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['quizAttempts'], 'readonly');
      const store = transaction.objectStore('quizAttempts');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get user attempts'));
    });
  }

  // Analytics and statistics
  async getUserStats(userId: string): Promise<UserProfile['stats']> {
    const [progress, attempts] = await Promise.all([
      this.getUserProgress(userId),
      this.getUserAttempts(userId),
    ]);

    const totalQuizzesTaken = progress.length;
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);
    const averageScore = totalQuizzesTaken > 0
      ? progress.reduce((sum, p) => sum + p.score, 0) / totalQuizzesTaken
      : 0;

    // Calculate streak (simplified - consecutive days with quiz activity)
    const quizDates = progress
      .map(p => new Date(p.completedAt).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streakDays = 0;
    const today = new Date().toDateString();

    for (let i = 0; i < quizDates.length; i++) {
      const daysDiff = Math.floor(
        (new Date(today).getTime() - new Date(quizDates[i]).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === i) {
        streakDays++;
      } else {
        break;
      }
    }

    const lastQuizDate = progress.length > 0
      ? new Date(Math.max(...progress.map(p => new Date(p.completedAt).getTime())))
      : undefined;

    return {
      totalQuizzesTaken,
      totalTimeSpent,
      averageScore,
      streakDays,
      lastQuizDate,
    };
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async clearAllData(): Promise<void> {
    this.ensureDatabase();

    const storeNames = ['userProfiles', 'userSessions', 'quizProgress', 'quizAttempts'];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeNames, 'readwrite');

      let completed = 0;
      const onComplete = () => {
        completed++;
        if (completed === storeNames.length) {
          resolve();
        }
      };

      storeNames.forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        request.onsuccess = onComplete;
        request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
      });
    });
  }

  // Achievement operations
  async initializeAchievements(achievements: Achievement[]): Promise<void> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['achievements'], 'readwrite');
      this.handleTransactionError(transaction, 'initializeAchievements');

      const store = transaction.objectStore('achievements');
      let completed = 0;

      const onComplete = () => {
        completed++;
        if (completed === achievements.length) {
          resolve();
        }
      };

      achievements.forEach(achievement => {
        const request = store.put(achievement);
        request.onsuccess = onComplete;
        request.onerror = () => reject(new Error(`Failed to initialize achievement: ${achievement.id}`));
      });

      if (achievements.length === 0) {
        resolve();
      }
    });
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userAchievements'], 'readonly');
      const store = transaction.objectStore('userAchievements');
      const index = store.index('userId');
      const request = index.getAll(userId);

      request.onsuccess = () => {
        const achievements = request.result.map(achievement => ({
          ...achievement,
          unlockedAt: typeof achievement.unlockedAt === 'string'
            ? achievement.unlockedAt
            : achievement.unlockedAt.toISOString()
        }));
        resolve(achievements);
      };
      request.onerror = () => reject(new Error('Failed to get user achievements'));
    });
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<string> {
    this.ensureDatabase();

    // Check if already unlocked
    const existingAchievements = await this.getUserAchievements(userId);
    if (existingAchievements.some(ua => ua.achievementId === achievementId)) {
      throw new Error('Achievement already unlocked');
    }

    const userAchievement: UserAchievement = {
      id: this.generateId(),
      userId,
      achievementId,
      unlockedAt: new Date(),
      progress: 100
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userAchievements'], 'readwrite');
      this.handleTransactionError(transaction, 'unlockAchievement');

      const store = transaction.objectStore('userAchievements');
      const request = store.add(userAchievement);

      request.onsuccess = () => resolve(userAchievement.id);
      request.onerror = () => reject(new Error('Failed to unlock achievement'));
    });
  }

  async getAllAchievements(): Promise<Achievement[]> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['achievements'], 'readonly');
      const store = transaction.objectStore('achievements');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Failed to get achievements'));
    });
  }

  // Leaderboard operations
  async updateLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'rank'>): Promise<string> {
    this.ensureDatabase();

    // Check if entry exists for this user
    const existingEntry = await this.getLeaderboardEntryByUserId(entry.userId);
    
    if (existingEntry) {
      // Update existing entry
      const updatedEntry: LeaderboardEntry = {
        ...existingEntry,
        ...entry,
        lastActiveAt: new Date()
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['leaderboardEntries'], 'readwrite');
        this.handleTransactionError(transaction, 'updateLeaderboardEntry');

        const store = transaction.objectStore('leaderboardEntries');
        const request = store.put(updatedEntry);

        request.onsuccess = () => resolve(existingEntry.id);
        request.onerror = () => reject(new Error('Failed to update leaderboard entry'));
      });
    } else {
      // Create new entry
      const newEntry: LeaderboardEntry = {
        id: this.generateId(),
        ...entry,
        lastActiveAt: new Date()
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction(['leaderboardEntries'], 'readwrite');
        this.handleTransactionError(transaction, 'updateLeaderboardEntry');

        const store = transaction.objectStore('leaderboardEntries');
        const request = store.add(newEntry);

        request.onsuccess = () => resolve(newEntry.id);
        request.onerror = () => reject(new Error('Failed to create leaderboard entry'));
      });
    }
  }

  async getLeaderboardEntryByUserId(userId: string): Promise<LeaderboardEntry | null> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['leaderboardEntries'], 'readonly');
      const store = transaction.objectStore('leaderboardEntries');
      const index = store.index('userId');
      const request = index.get(userId);

      request.onsuccess = () => {
        const entry = request.result;
        if (entry) {
          const normalizedEntry = {
            ...entry,
            lastActiveAt: typeof entry.lastActiveAt === 'string'
              ? entry.lastActiveAt
              : entry.lastActiveAt.toISOString()
          };
          resolve(normalizedEntry);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(new Error('Failed to get leaderboard entry'));
    });
  }

  async getGlobalLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    this.ensureDatabase();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['leaderboardEntries'], 'readonly');
      const store = transaction.objectStore('leaderboardEntries');
      const index = store.index('totalScore');
      const request = index.openCursor(null, 'prev'); // Descending order by total score

      const entries: LeaderboardEntry[] = [];
      let rank = 1;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && entries.length < limit) {
          const entry = cursor.value;
          entries.push({
            ...entry,
            rank,
            lastActiveAt: typeof entry.lastActiveAt === 'string'
              ? entry.lastActiveAt
              : entry.lastActiveAt.toISOString()
          });
          rank++;
          cursor.continue();
        } else {
          resolve(entries);
        }
      };
      request.onerror = () => reject(new Error('Failed to get global leaderboard'));
    });
  }

  async exportData(): Promise<{
    userProfiles: UserProfile[];
    userSessions: UserSession[];
    quizProgress: QuizProgress[];
    quizAttempts: QuizAttempt[];
  }> {
    this.ensureDatabase();

    const [userProfiles, userSessions, quizProgress, quizAttempts] = await Promise.all([
      this.getAllFromStore<UserProfile>('userProfiles'),
      this.getAllFromStore<UserSession>('userSessions'),
      this.getAllFromStore<QuizProgress>('quizProgress'),
      this.getAllFromStore<QuizAttempt>('quizAttempts'),
    ]);

    return {
      userProfiles,
      userSessions,
      quizProgress,
      quizAttempts,
    };
  }

  private getAllFromStore<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to get all from ${storeName}`));
    });
  }
}

// Singleton instance
export const database = DatabaseService.getInstance();