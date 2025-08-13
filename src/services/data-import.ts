/**
 * Data import/restore service for database backups
 */

import { database } from './database';
import { migrationService } from './migration';
import { databaseCache } from './database-cache';
import type { UserProfile, QuizProgress, QuizAttempt, UserSession } from '../types';

interface BackupData {
  version: number;
  timestamp: string;
  data: {
    userProfiles: UserProfile[];
    userSessions: UserSession[];
    quizProgress: QuizProgress[];
    quizAttempts: QuizAttempt[];
  };
}

interface ImportResult {
  success: boolean;
  message: string;
  imported: {
    userProfiles: number;
    userSessions: number;
    quizProgress: number;
    quizAttempts: number;
  };
  conflicts: string[];
  errors: string[];
}

interface ImportOptions {
  mergeStrategy: 'overwrite' | 'merge' | 'skip';
  clearExisting: boolean;
  validateData: boolean;
}

export class DataImportService {
  private static instance: DataImportService | null = null;

  private constructor() {}

  static getInstance(): DataImportService {
    if (!DataImportService.instance) {
      DataImportService.instance = new DataImportService();
    }
    return DataImportService.instance;
  }

  async importFromFile(file: File, options: ImportOptions = {
    mergeStrategy: 'merge',
    clearExisting: false,
    validateData: true,
  }): Promise<ImportResult> {
    try {
      // Read and parse the file
      const text = await this.readFileAsText(file);
      const backupData = JSON.parse(text) as BackupData;

      return this.importData(backupData, options);
    } catch (error) {
      return {
        success: false,
        message: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        imported: { userProfiles: 0, userSessions: 0, quizProgress: 0, quizAttempts: 0 },
        conflicts: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  async importFromJSON(jsonData: string, options: ImportOptions = {
    mergeStrategy: 'merge',
    clearExisting: false,
    validateData: true,
  }): Promise<ImportResult> {
    try {
      const backupData = JSON.parse(jsonData) as BackupData;
      return this.importData(backupData, options);
    } catch (error) {
      return {
        success: false,
        message: `Failed to parse JSON: ${error instanceof Error ? error.message : 'Unknown error'}`,
        imported: { userProfiles: 0, userSessions: 0, quizProgress: 0, quizAttempts: 0 },
        conflicts: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  private async importData(backupData: BackupData, options: ImportOptions): Promise<ImportResult> {
    const result: ImportResult = {
      success: false,
      message: '',
      imported: { userProfiles: 0, userSessions: 0, quizProgress: 0, quizAttempts: 0 },
      conflicts: [],
      errors: [],
    };

    try {
      // Initialize database
      await database.initialize();

      // Validate backup data format
      if (options.validateData && !this.validateBackupData(backupData)) {
        throw new Error('Invalid backup data format');
      }

      // Clear existing data if requested
      if (options.clearExisting) {
        await database.clearAllData();
        databaseCache.clear();
      }

      // Get existing data for conflict detection
      const existingData = await database.exportData();
      const existingUserIds = new Set(existingData.userProfiles.map(u => u.id));
      const existingProgressIds = new Set(existingData.quizProgress.map(p => p.id));
      const existingAttemptIds = new Set(existingData.quizAttempts.map(a => a.id));
      const existingSessionIds = new Set(existingData.userSessions.map(s => s.id));

      // Import user profiles
      for (const profile of backupData.data.userProfiles) {
        try {
          if (existingUserIds.has(profile.id)) {
            switch (options.mergeStrategy) {
              case 'skip':
                result.conflicts.push(`User profile ${profile.username} already exists, skipping`);
                continue;
              case 'overwrite':
                await database.updateUserProfile(profile.id, profile);
                result.conflicts.push(`User profile ${profile.username} overwritten`);
                break;
              case 'merge':
                // For profiles, we merge by updating with newer data
                const existing = existingData.userProfiles.find(u => u.id === profile.id);
                if (existing && new Date(profile.createdAt) > new Date(existing.createdAt)) {
                  await database.updateUserProfile(profile.id, profile);
                  result.conflicts.push(`User profile ${profile.username} merged (newer data)`);
                } else {
                  result.conflicts.push(`User profile ${profile.username} not merged (older data)`);
                  continue;
                }
                break;
            }
          } else {
            // Create new profile
            await this.createUserProfileWithId(profile);
          }
          result.imported.userProfiles++;
        } catch (error) {
          result.errors.push(`Failed to import user profile ${profile.username}: ${error}`);
        }
      }

      // Import sessions
      for (const session of backupData.data.userSessions) {
        try {
          if (existingSessionIds.has(session.id)) {
            if (options.mergeStrategy === 'skip') {
              result.conflicts.push(`Session ${session.id} already exists, skipping`);
              continue;
            }
            // For sessions, we don't merge - just skip or overwrite
            if (options.mergeStrategy === 'overwrite') {
              await this.createSessionWithId(session);
              result.conflicts.push(`Session ${session.id} overwritten`);
            }
          } else {
            await this.createSessionWithId(session);
          }
          result.imported.userSessions++;
        } catch (error) {
          result.errors.push(`Failed to import session ${session.id}: ${error}`);
        }
      }

      // Import quiz progress
      for (const progress of backupData.data.quizProgress) {
        try {
          if (existingProgressIds.has(progress.id)) {
            if (options.mergeStrategy === 'skip') {
              result.conflicts.push(`Progress record ${progress.id} already exists, skipping`);
              continue;
            }
            // Skip progress records if they exist (they shouldn't be overwritten)
            result.conflicts.push(`Progress record ${progress.id} already exists, skipping`);
            continue;
          }
          
          await this.createProgressWithId(progress);
          result.imported.quizProgress++;
        } catch (error) {
          result.errors.push(`Failed to import progress ${progress.id}: ${error}`);
        }
      }

      // Import quiz attempts
      for (const attempt of backupData.data.quizAttempts) {
        try {
          if (existingAttemptIds.has(attempt.id)) {
            if (options.mergeStrategy === 'skip') {
              result.conflicts.push(`Attempt ${attempt.id} already exists, skipping`);
              continue;
            }
            // Skip attempts if they exist (they shouldn't be overwritten)
            result.conflicts.push(`Attempt ${attempt.id} already exists, skipping`);
            continue;
          }
          
          await this.createAttemptWithId(attempt);
          result.imported.quizAttempts++;
        } catch (error) {
          result.errors.push(`Failed to import attempt ${attempt.id}: ${error}`);
        }
      }

      // Clear cache to force reload of fresh data
      databaseCache.clear();

      result.success = result.errors.length === 0;
      result.message = result.success 
        ? 'Import completed successfully'
        : `Import completed with ${result.errors.length} errors`;

      return result;

    } catch (error) {
      result.success = false;
      result.message = `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
      return result;
    }
  }

  private validateBackupData(backupData: any): boolean {
    try {
      // Check basic structure
      if (!backupData || typeof backupData !== 'object') return false;
      if (!backupData.version || !backupData.timestamp || !backupData.data) return false;
      
      const { data } = backupData;
      if (!data.userProfiles || !Array.isArray(data.userProfiles)) return false;
      if (!data.userSessions || !Array.isArray(data.userSessions)) return false;
      if (!data.quizProgress || !Array.isArray(data.quizProgress)) return false;
      if (!data.quizAttempts || !Array.isArray(data.quizAttempts)) return false;

      // Validate user profiles have required fields
      for (const profile of data.userProfiles) {
        if (!profile.id || !profile.username || !profile.createdAt) return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  private readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  // Helper methods to create records with specific IDs (bypassing normal creation)
  private async createUserProfileWithId(profile: UserProfile): Promise<void> {
    // We need to directly insert into the database with the existing ID
    // This is a workaround since the normal createUserProfile generates a new ID
    const normalizedProfile = {
      ...profile,
      createdAt: typeof profile.createdAt === 'string' ? new Date(profile.createdAt) : profile.createdAt,
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
      const transaction = (database as any).db!.transaction(['userProfiles'], 'readwrite');
      const store = transaction.objectStore('userProfiles');
      const request = store.put(normalizedProfile); // Use put instead of add to allow overwrites

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async createSessionWithId(session: UserSession): Promise<void> {
    const normalizedSession = {
      ...session,
      createdAt: typeof session.createdAt === 'string' ? new Date(session.createdAt) : session.createdAt,
      lastActive: typeof session.lastActive === 'string' ? new Date(session.lastActive) : session.lastActive,
    };

    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['userSessions'], 'readwrite');
      const store = transaction.objectStore('userSessions');
      const request = store.put(normalizedSession);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async createProgressWithId(progress: QuizProgress): Promise<void> {
    const normalizedProgress = {
      ...progress,
      completedAt: typeof progress.completedAt === 'string' ? new Date(progress.completedAt) : progress.completedAt,
    };

    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['quizProgress'], 'readwrite');
      const store = transaction.objectStore('quizProgress');
      const request = store.put(normalizedProgress);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async createAttemptWithId(attempt: QuizAttempt): Promise<void> {
    const normalizedAttempt = {
      ...attempt,
      timestamp: typeof attempt.timestamp === 'string' ? new Date(attempt.timestamp) : attempt.timestamp,
    };

    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['quizAttempts'], 'readwrite');
      const store = transaction.objectStore('quizAttempts');
      const request = store.put(normalizedAttempt);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Utility method to create a test backup file
  async createTestBackup(): Promise<string> {
    const testData: BackupData = {
      version: 1,
      timestamp: new Date().toISOString(),
      data: {
        userProfiles: [{
          id: 'test-user-import',
          username: 'imported_user',
          email: 'imported@example.com',
          createdAt: new Date(),
          totalScore: 100,
          completedModules: ['test-module'],
          achievements: ['test-achievement'],
          stats: {
            totalQuizzesTaken: 5,
            totalTimeSpent: 300000,
            averageScore: 80,
            streakDays: 3,
            lastQuizDate: new Date(),
          }
        }],
        userSessions: [],
        quizProgress: [{
          id: 'test-progress-import',
          userId: 'test-user-import',
          moduleId: 'test-module',
          topicId: 'test-topic',
          score: 85,
          totalQuestions: 10,
          correctAnswers: 8,
          completedAt: new Date(),
          timeSpent: 300000,
        }],
        quizAttempts: [],
      }
    };

    return JSON.stringify(testData, null, 2);
  }
}

export const dataImportService = DataImportService.getInstance();