/**
 * Database cleanup and maintenance service
 */

import { database } from './database';
import { databaseCache } from './database-cache';
import type { UserProfile, QuizProgress, QuizAttempt, UserSession } from '../types';

interface CleanupResult {
  orphanedSessions: number;
  orphanedProgress: number;
  orphanedAttempts: number;
  oldSessions: number;
  archivedData: number;
  freedSpace: number;
}

interface MaintenanceOptions {
  removeOrphanedData: boolean;
  archiveOldSessions: boolean;
  archiveOldAttempts: boolean;
  sessionRetentionDays: number;
  attemptRetentionDays: number;
  compactData: boolean;
}

export class DatabaseMaintenanceService {
  private static instance: DatabaseMaintenanceService | null = null;
  private readonly DEFAULT_SESSION_RETENTION_DAYS = 30;
  private readonly DEFAULT_ATTEMPT_RETENTION_DAYS = 90;

  private constructor() {}

  static getInstance(): DatabaseMaintenanceService {
    if (!DatabaseMaintenanceService.instance) {
      DatabaseMaintenanceService.instance = new DatabaseMaintenanceService();
    }
    return DatabaseMaintenanceService.instance;
  }

  async performMaintenance(options: MaintenanceOptions = {
    removeOrphanedData: true,
    archiveOldSessions: true,
    archiveOldAttempts: false, // Keep all attempts by default
    sessionRetentionDays: 30,
    attemptRetentionDays: 90,
    compactData: true,
  }): Promise<CleanupResult> {
    await database.initialize();
    
    const result: CleanupResult = {
      orphanedSessions: 0,
      orphanedProgress: 0,
      orphanedAttempts: 0,
      oldSessions: 0,
      archivedData: 0,
      freedSpace: 0,
    };

    try {
      // Get all data for analysis
      const data = await database.exportData();
      const userIds = new Set(data.userProfiles.map(u => u.id));

      // Remove orphaned data
      if (options.removeOrphanedData) {
        result.orphanedSessions = await this.removeOrphanedSessions(userIds);
        result.orphanedProgress = await this.removeOrphanedProgress(userIds);
        result.orphanedAttempts = await this.removeOrphanedAttempts(userIds);
      }

      // Archive old sessions
      if (options.archiveOldSessions) {
        result.oldSessions = await this.archiveOldSessions(options.sessionRetentionDays);
      }

      // Archive old attempts (if enabled)
      if (options.archiveOldAttempts) {
        result.archivedData = await this.archiveOldAttempts(options.attemptRetentionDays);
      }

      // Compact data (clear cache and optimize)
      if (options.compactData) {
        result.freedSpace = await this.compactDatabase();
      }

      return result;
    } catch (error) {
      console.error('Maintenance failed:', error);
      throw error;
    }
  }

  private async removeOrphanedSessions(validUserIds: Set<string>): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['userSessions'], 'readwrite');
      const store = transaction.objectStore('userSessions');
      const request = store.getAll();
      let removedCount = 0;

      request.onsuccess = () => {
        const sessions = request.result as UserSession[];
        const deletePromises: Promise<void>[] = [];

        sessions.forEach(session => {
          if (!validUserIds.has(session.userId)) {
            deletePromises.push(this.deleteSession(session.id));
            removedCount++;
          }
        });

        Promise.all(deletePromises)
          .then(() => {
            if (removedCount > 0) {
              databaseCache.invalidate('session');
            }
            resolve(removedCount);
          })
          .catch(reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async removeOrphanedProgress(validUserIds: Set<string>): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['quizProgress'], 'readwrite');
      const store = transaction.objectStore('quizProgress');
      const request = store.getAll();
      let removedCount = 0;

      request.onsuccess = () => {
        const progressRecords = request.result as QuizProgress[];
        const deletePromises: Promise<void>[] = [];

        progressRecords.forEach(progress => {
          if (!validUserIds.has(progress.userId)) {
            deletePromises.push(this.deleteProgress(progress.id));
            removedCount++;
          }
        });

        Promise.all(deletePromises)
          .then(() => {
            if (removedCount > 0) {
              databaseCache.invalidate('progress');
            }
            resolve(removedCount);
          })
          .catch(reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async removeOrphanedAttempts(validUserIds: Set<string>): Promise<number> {
    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['quizAttempts'], 'readwrite');
      const store = transaction.objectStore('quizAttempts');
      const request = store.getAll();
      let removedCount = 0;

      request.onsuccess = () => {
        const attempts = request.result as QuizAttempt[];
        const deletePromises: Promise<void>[] = [];

        attempts.forEach(attempt => {
          if (!validUserIds.has(attempt.userId)) {
            deletePromises.push(this.deleteAttempt(attempt.id));
            removedCount++;
          }
        });

        Promise.all(deletePromises)
          .then(() => {
            if (removedCount > 0) {
              databaseCache.invalidate('attempts');
            }
            resolve(removedCount);
          })
          .catch(reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async archiveOldSessions(retentionDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['userSessions'], 'readwrite');
      const store = transaction.objectStore('userSessions');
      const request = store.getAll();
      let removedCount = 0;

      request.onsuccess = () => {
        const sessions = request.result as UserSession[];
        const deletePromises: Promise<void>[] = [];

        sessions.forEach(session => {
          const lastActive = new Date(session.lastActive);
          if (lastActive < cutoffDate) {
            deletePromises.push(this.deleteSession(session.id));
            removedCount++;
          }
        });

        Promise.all(deletePromises)
          .then(() => {
            if (removedCount > 0) {
              databaseCache.invalidate('session');
            }
            resolve(removedCount);
          })
          .catch(reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async archiveOldAttempts(retentionDays: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    // Store archived attempts in localStorage before deleting
    const archivedAttempts = await this.getOldAttempts(cutoffDate);
    
    if (archivedAttempts.length > 0) {
      this.storeArchivedData('attempts', archivedAttempts);
    }

    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['quizAttempts'], 'readwrite');
      const store = transaction.objectStore('quizAttempts');
      const request = store.getAll();
      let removedCount = 0;

      request.onsuccess = () => {
        const attempts = request.result as QuizAttempt[];
        const deletePromises: Promise<void>[] = [];

        attempts.forEach(attempt => {
          const timestamp = new Date(attempt.timestamp);
          if (timestamp < cutoffDate) {
            deletePromises.push(this.deleteAttempt(attempt.id));
            removedCount++;
          }
        });

        Promise.all(deletePromises)
          .then(() => {
            if (removedCount > 0) {
              databaseCache.invalidate('attempts');
            }
            resolve(removedCount);
          })
          .catch(reject);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private async getOldAttempts(cutoffDate: Date): Promise<QuizAttempt[]> {
    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['quizAttempts'], 'readonly');
      const store = transaction.objectStore('quizAttempts');
      const request = store.getAll();

      request.onsuccess = () => {
        const attempts = request.result as QuizAttempt[];
        const oldAttempts = attempts.filter(attempt => 
          new Date(attempt.timestamp) < cutoffDate
        );
        resolve(oldAttempts);
      };

      request.onerror = () => reject(request.error);
    });
  }

  private storeArchivedData(type: string, data: any[]): void {
    try {
      const existingArchive = localStorage.getItem(`archived-${type}`) || '[]';
      const archived = JSON.parse(existingArchive);
      
      archived.push({
        archivedAt: new Date().toISOString(),
        count: data.length,
        data: data,
      });

      localStorage.setItem(`archived-${type}`, JSON.stringify(archived));
    } catch (error) {
      console.error('Failed to archive data:', error);
    }
  }

  private async compactDatabase(): Promise<number> {
    // Clear cache to free memory
    const cacheStats = databaseCache.getStats();
    const initialMemory = cacheStats.memoryUsage;
    
    databaseCache.clear();
    
    // Force garbage collection if available (development only)
    if (process.env.NODE_ENV === 'development' && (window as any).gc) {
      (window as any).gc();
    }

    return initialMemory;
  }

  // Helper methods for deleting individual records
  private deleteSession(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['userSessions'], 'readwrite');
      const store = transaction.objectStore('userSessions');
      const request = store.delete(sessionId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private deleteProgress(progressId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['quizProgress'], 'readwrite');
      const store = transaction.objectStore('quizProgress');
      const request = store.delete(progressId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private deleteAttempt(attemptId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = (database as any).db!.transaction(['quizAttempts'], 'readwrite');
      const store = transaction.objectStore('quizAttempts');
      const request = store.delete(attemptId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Public utility methods
  async getDatabaseSize(): Promise<{
    estimatedSize: number;
    recordCounts: {
      userProfiles: number;
      userSessions: number;
      quizProgress: number;
      quizAttempts: number;
    };
  }> {
    const data = await database.exportData();
    const jsonSize = JSON.stringify(data).length * 2; // Rough estimate (UTF-16)

    return {
      estimatedSize: jsonSize,
      recordCounts: {
        userProfiles: data.userProfiles.length,
        userSessions: data.userSessions.length,
        quizProgress: data.quizProgress.length,
        quizAttempts: data.quizAttempts.length,
      },
    };
  }

  async getMaintenanceStatus(): Promise<{
    orphanedRecords: number;
    oldSessions: number;
    oldAttempts: number;
    cacheSize: number;
    lastMaintenance?: string;
  }> {
    const data = await database.exportData();
    const userIds = new Set(data.userProfiles.map(u => u.id));
    
    const orphanedSessions = data.userSessions.filter(s => !userIds.has(s.userId)).length;
    const orphanedProgress = data.quizProgress.filter(p => !userIds.has(p.userId)).length;
    const orphanedAttempts = data.quizAttempts.filter(a => !userIds.has(a.userId)).length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - this.DEFAULT_SESSION_RETENTION_DAYS);
    
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - this.DEFAULT_ATTEMPT_RETENTION_DAYS);

    const oldSessions = data.userSessions.filter(s => 
      new Date(s.lastActive) < thirtyDaysAgo
    ).length;

    const oldAttempts = data.quizAttempts.filter(a => 
      new Date(a.timestamp) < ninetyDaysAgo
    ).length;

    const cacheStats = databaseCache.getStats();

    return {
      orphanedRecords: orphanedSessions + orphanedProgress + orphanedAttempts,
      oldSessions,
      oldAttempts,
      cacheSize: cacheStats.size,
      lastMaintenance: localStorage.getItem('last-maintenance') || undefined,
    };
  }

  markMaintenanceCompleted(): void {
    localStorage.setItem('last-maintenance', new Date().toISOString());
  }

  getArchivedData(type: 'attempts'): any[] {
    try {
      const archived = localStorage.getItem(`archived-${type}`);
      return archived ? JSON.parse(archived) : [];
    } catch {
      return [];
    }
  }

  clearArchivedData(type: 'attempts'): void {
    localStorage.removeItem(`archived-${type}`);
  }
}

export const databaseMaintenanceService = DatabaseMaintenanceService.getInstance();