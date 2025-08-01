/**
 * Database service using IndexedDB for DSA Quiz Master
 * Provides structured storage for quiz data, user progress, and session management
 */

// Database schemas
export interface QuizProgress {
  id: string;
  userId: string;
  moduleId: string;
  topicId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: Date;
  timeSpent: number; // in milliseconds
}

export interface UserSession {
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

export interface UserProfile {
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

export interface QuizAttempt {
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

// Database configuration
const DB_NAME = 'DSAQuizMasterDB';
const DB_VERSION = 1;

export class DatabaseService {
  private db: IDBDatabase | null = null;
  private static instance: DatabaseService | null = null;

  private constructor() {}

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