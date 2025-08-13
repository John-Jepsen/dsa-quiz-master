/**
 * Database utilities for development and administration
 */

import { database } from './database';
import { migrationService } from './migration';

export class DatabaseUtils {
  /**
   * Get database statistics
   */
  static async getStats() {
    try {
      await database.initialize();
      const data = await database.exportData();
      
      return {
        userProfiles: data.userProfiles.length,
        userSessions: data.userSessions.length,
        quizProgress: data.quizProgress.length,
        quizAttempts: data.quizAttempts.length,
        totalSize: JSON.stringify(data).length,
        migrationInfo: migrationService.getMigrationInfo(),
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return null;
    }
  }

  /**
   * Backup database to downloadable JSON file
   */
  static async backup() {
    try {
      await database.initialize();
      const data = await database.exportData();
      
      const backup = {
        version: 1,
        timestamp: new Date().toISOString(),
        data,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dsa-quiz-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error creating backup:', error);
      return false;
    }
  }

  /**
   * Reset all database data (development only)
   */
  static async reset() {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Database reset is not allowed in production');
      return false;
    }

    try {
      await migrationService.resetMigration();
      return true;
    } catch (error) {
      console.error('Error resetting database:', error);
      return false;
    }
  }

  /**
   * Validate database integrity
   */
  static async validate() {
    try {
      await database.initialize();
      const data = await database.exportData();
      const issues: string[] = [];

      // Check for orphaned sessions
      const userIds = new Set(data.userProfiles.map(u => u.id));
      const orphanedSessions = data.userSessions.filter(s => !userIds.has(s.userId));
      if (orphanedSessions.length > 0) {
        issues.push(`Found ${orphanedSessions.length} orphaned sessions`);
      }

      // Check for orphaned progress
      const orphanedProgress = data.quizProgress.filter(p => !userIds.has(p.userId));
      if (orphanedProgress.length > 0) {
        issues.push(`Found ${orphanedProgress.length} orphaned progress records`);
      }

      // Check for orphaned attempts
      const orphanedAttempts = data.quizAttempts.filter(a => !userIds.has(a.userId));
      if (orphanedAttempts.length > 0) {
        issues.push(`Found ${orphanedAttempts.length} orphaned attempt records`);
      }

      // Check for invalid dates
      const invalidDates: string[] = [];
      data.userProfiles.forEach(u => {
        if (isNaN(new Date(u.createdAt).getTime())) {
          invalidDates.push(`User ${u.id} has invalid createdAt`);
        }
      });

      if (invalidDates.length > 0) {
        issues.push(...invalidDates);
      }

      return {
        isValid: issues.length === 0,
        issues,
      };
    } catch (error) {
      console.error('Error validating database:', error);
      return {
        isValid: false,
        issues: ['Database validation failed: ' + (error as Error).message],
      };
    }
  }

  /**
   * Clean up orphaned records
   */
  static async cleanup() {
    try {
      await database.initialize();
      const validation = await this.validate();
      
      if (validation.isValid) {
        return { cleaned: 0, message: 'Database is already clean' };
      }

      // This would require implementing cleanup methods in the database service
      // For now, just return the validation result
      return { 
        cleaned: 0, 
        message: 'Cleanup not implemented yet',
        issues: validation.issues 
      };
    } catch (error) {
      console.error('Error cleaning up database:', error);
      return { cleaned: 0, message: 'Cleanup failed' };
    }
  }

  /**
   * Get user analytics
   */
  static async getUserAnalytics(userId: string) {
    try {
      await database.initialize();
      const [progress, attempts] = await Promise.all([
        database.getUserProgress(userId),
        database.getUserAttempts(userId),
      ]);

      // Calculate statistics
      const totalQuizzes = progress.length;
      const averageScore = totalQuizzes > 0 
        ? progress.reduce((sum, p) => sum + p.score, 0) / totalQuizzes 
        : 0;

      const topicPerformance: Record<string, { count: number; averageScore: number }> = {};
      progress.forEach(p => {
        if (!topicPerformance[p.topicId]) {
          topicPerformance[p.topicId] = { count: 0, averageScore: 0 };
        }
        topicPerformance[p.topicId].count++;
        topicPerformance[p.topicId].averageScore = 
          (topicPerformance[p.topicId].averageScore * (topicPerformance[p.topicId].count - 1) + p.score) 
          / topicPerformance[p.topicId].count;
      });

      const questionAccuracy = attempts.length > 0
        ? (attempts.filter(a => a.isCorrect).length / attempts.length) * 100
        : 0;

      return {
        totalQuizzes,
        totalAttempts: attempts.length,
        averageScore,
        questionAccuracy,
        topicPerformance,
        recentActivity: progress
          .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .slice(0, 10),
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      return null;
    }
  }
}

// Development helper - expose utilities globally in development
if (process.env.NODE_ENV === 'development') {
  (window as any).dbUtils = DatabaseUtils;
  console.log('Database utilities available at window.dbUtils');
}