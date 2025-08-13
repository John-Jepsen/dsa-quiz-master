/**
 * Migration service to handle data migration from localStorage to IndexedDB
 */

import { database, UserProfile } from './database';

export interface LegacyQuizResult {
  topic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timestamp: number;
}

export interface LegacyUserData {
  username?: string;
  email?: string;
  quizResults?: LegacyQuizResult[];
  preferences?: {
    theme?: string;
    difficulty?: string;
    soundEnabled?: boolean;
  };
  completedModules?: string[];
  totalScore?: number;
}

export class MigrationService {
  private static instance: MigrationService | null = null;

  private constructor() {}

  static getInstance(): MigrationService {
    if (!MigrationService.instance) {
      MigrationService.instance = new MigrationService();
    }
    return MigrationService.instance;
  }

  async checkAndMigrate(): Promise<boolean> {
    try {
      // Check if migration has already been completed
      if (this.isMigrationCompleted()) {
        return false;
      }

      // Initialize database first
      await database.initialize();

      // Check if there's any legacy data to migrate
      const legacyData = this.getLegacyData();
      if (!legacyData || Object.keys(legacyData).length === 0) {
        // No legacy data, mark migration as complete
        this.markMigrationCompleted();
        return false;
      }

      console.log('Starting data migration from localStorage to IndexedDB...');
      
      // Perform the migration
      const success = await this.migrateData(legacyData);
      
      if (success) {
        // Clean up legacy data and mark migration as complete
        this.cleanupLegacyData();
        this.markMigrationCompleted();
        console.log('Migration completed successfully!');
        return true;
      } else {
        console.error('Migration failed');
        return false;
      }
    } catch (error) {
      console.error('Migration error:', error);
      return false;
    }
  }

  private getLegacyData(): LegacyUserData {
    const legacyKeys = [
      'quiz-results',
      'user-profile',
      'quiz-preferences',
      'completed-modules',
      'user-progress'
    ];

    const legacyData: LegacyUserData = {};

    try {
      // Collect all legacy data from localStorage
      legacyKeys.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            
            switch (key) {
              case 'quiz-results':
                legacyData.quizResults = Array.isArray(parsed) ? parsed : [];
                break;
              case 'user-profile':
                if (parsed.username) legacyData.username = parsed.username;
                if (parsed.email) legacyData.email = parsed.email;
                if (parsed.totalScore) legacyData.totalScore = parsed.totalScore;
                break;
              case 'quiz-preferences':
                legacyData.preferences = {
                  theme: parsed.theme || 'system',
                  difficulty: parsed.difficulty || 'mixed',
                  soundEnabled: parsed.soundEnabled !== false,
                };
                break;
              case 'completed-modules':
                legacyData.completedModules = Array.isArray(parsed) ? parsed : [];
                break;
              case 'user-progress':
                // Handle any additional progress data if exists
                if (parsed.quizResults && Array.isArray(parsed.quizResults)) {
                  legacyData.quizResults = [...(legacyData.quizResults || []), ...parsed.quizResults];
                }
                break;
            }
          } catch (parseError) {
            console.warn(`Failed to parse legacy data for key ${key}:`, parseError);
          }
        }
      });

      return legacyData;
    } catch (error) {
      console.error('Error collecting legacy data:', error);
      return {};
    }
  }

  private async migrateData(legacyData: LegacyUserData): Promise<boolean> {
    try {
      // Create default user if no username exists
      const username = legacyData.username || `user_${Date.now()}`;
      
      // Create user profile
      const userId = await database.createUserProfile({
        username,
        email: legacyData.email,
        totalScore: legacyData.totalScore || 0,
        completedModules: legacyData.completedModules || [],
        achievements: [],
        stats: {
          totalQuizzesTaken: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          streakDays: 0,
        },
      });

      // Create session with preferences
      const sessionId = await database.createSession(userId);
      
      // Migrate quiz results to progress records
      if (legacyData.quizResults && legacyData.quizResults.length > 0) {
        for (const result of legacyData.quizResults) {
          try {
            await database.saveQuizProgress({
              userId,
              moduleId: this.mapTopicToModule(result.topic),
              topicId: result.topic,
              score: result.score,
              totalQuestions: result.totalQuestions,
              correctAnswers: result.correctAnswers,
              timeSpent: 0, // Legacy data doesn't have time spent
            });
          } catch (error) {
            console.warn('Failed to migrate quiz result:', result, error);
          }
        }
      }

      // Update user stats after migration
      const stats = await database.getUserStats(userId);
      await database.updateUserProfile(userId, { stats });

      // Store the migrated user ID for future reference
      localStorage.setItem('current-user-id', userId);
      
      return true;
    } catch (error) {
      console.error('Migration failed:', error);
      return false;
    }
  }

  private mapTopicToModule(topic: string): string {
    // Map legacy topic names to module IDs
    const topicToModuleMap: Record<string, string> = {
      'arrays': 'arrays-basics',
      'linked-lists': 'linked-lists-basics',
      'stacks-queues': 'stacks-basics',
      'trees': 'trees-basics',
      'graphs': 'graph-basics',
      'sorting': 'sorting-basics',
    };

    return topicToModuleMap[topic] || `${topic}-basics`;
  }

  private cleanupLegacyData(): void {
    const legacyKeys = [
      'quiz-results',
      'user-profile',
      'quiz-preferences',
      'completed-modules',
      'user-progress'
    ];

    legacyKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove legacy key ${key}:`, error);
      }
    });
  }

  private isMigrationCompleted(): boolean {
    return localStorage.getItem('migration-completed') === 'true';
  }

  private markMigrationCompleted(): void {
    localStorage.setItem('migration-completed', 'true');
    localStorage.setItem('migration-date', new Date().toISOString());
  }

  async getCurrentUserId(): Promise<string | null> {
    // Check if we have a current user ID from migration or previous session
    let userId = localStorage.getItem('current-user-id');
    
    if (!userId) {
      // Try to find any existing user in the database
      try {
        await database.initialize();
        const exportedData = await database.exportData();
        if (exportedData.userProfiles.length > 0) {
          userId = exportedData.userProfiles[0].id;
          localStorage.setItem('current-user-id', userId);
        }
      } catch (error) {
        console.error('Error getting current user ID:', error);
      }
    }

    return userId;
  }

  async createDefaultUser(): Promise<string> {
    await database.initialize();
    
    const username = `user_${Date.now()}`;
    const userId = await database.createUserProfile({
      username,
      totalScore: 0,
      completedModules: [],
      achievements: [],
      stats: {
        totalQuizzesTaken: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        streakDays: 0,
      },
    });

    // Create a session for the new user
    await database.createSession(userId);
    
    // Store the user ID
    localStorage.setItem('current-user-id', userId);
    
    return userId;
  }

  // Development helper methods
  async resetMigration(): Promise<void> {
    localStorage.removeItem('migration-completed');
    localStorage.removeItem('migration-date');
    localStorage.removeItem('current-user-id');
    
    try {
      await database.initialize();
      await database.clearAllData();
    } catch (error) {
      console.error('Error resetting migration:', error);
    }
  }

  getMigrationInfo(): {
    isCompleted: boolean;
    migrationDate?: string;
    currentUserId?: string;
  } {
    return {
      isCompleted: this.isMigrationCompleted(),
      migrationDate: localStorage.getItem('migration-date') || undefined,
      currentUserId: localStorage.getItem('current-user-id') || undefined,
    };
  }
}

export const migrationService = MigrationService.getInstance();