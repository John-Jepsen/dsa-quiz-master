/**
 * Achievement service for DSA Quiz Master
 * Handles achievement initialization, checking, and unlocking
 */

import { database } from './database';
import { ACHIEVEMENT_DEFINITIONS, checkAchievementCondition } from '../lib/achievements';
import type { UserProfile, QuizProgress, Achievement } from '../types';
import { toast } from 'sonner';

export class AchievementService {
  private static instance: AchievementService | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): AchievementService {
    if (!AchievementService.instance) {
      AchievementService.instance = new AchievementService();
    }
    return AchievementService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize all achievement definitions in the database
      await database.initializeAchievements(ACHIEVEMENT_DEFINITIONS);
      this.initialized = true;
      console.log('Achievement system initialized with', ACHIEVEMENT_DEFINITIONS.length, 'achievements');
    } catch (error) {
      console.error('Failed to initialize achievement system:', error);
      throw error;
    }
  }

  async checkAndUnlockAchievements(
    userId: string,
    userProfile: UserProfile,
    quizProgress: QuizProgress[],
    context?: {
      justCompletedQuiz?: boolean;
      lastQuizScore?: number;
      lastQuizTime?: number;
    }
  ): Promise<Achievement[]> {
    try {
      const unlockedAchievements: Achievement[] = [];
      const existingAchievements = await database.getUserAchievements(userId);
      const unlockedIds = new Set(existingAchievements.map(ua => ua.achievementId));

      // Calculate topic progress for mastery achievements
      const topicProgress = this.calculateTopicProgress(quizProgress);

      // Prepare user stats for checking conditions
      const userStats = {
        totalQuizzesTaken: userProfile.stats.totalQuizzesTaken,
        averageScore: userProfile.stats.averageScore,
        streakDays: userProfile.stats.streakDays,
        completedModules: userProfile.completedModules,
        lastQuizTime: context?.lastQuizTime
      };

      for (const achievement of ACHIEVEMENT_DEFINITIONS) {
        // Skip if already unlocked
        if (unlockedIds.has(achievement.id)) {
          continue;
        }

        let shouldUnlock = false;

        // Check specific context-based achievements
        if (context?.justCompletedQuiz && context.lastQuizScore !== undefined) {
          if (achievement.condition.type === 'score_threshold' && achievement.id !== 'consistent-performer') {
            shouldUnlock = context.lastQuizScore >= achievement.condition.target;
          } else if (achievement.condition.type === 'perfect_score') {
            shouldUnlock = context.lastQuizScore === 100;
          }
        }

        // Check other achievement conditions
        if (!shouldUnlock) {
          shouldUnlock = checkAchievementCondition(achievement, userStats, topicProgress);
        }

        if (shouldUnlock) {
          try {
            await database.unlockAchievement(userId, achievement.id);
            unlockedAchievements.push(achievement);
            console.log('Achievement unlocked:', achievement.name);
          } catch (error) {
            console.error('Failed to unlock achievement:', achievement.id, error);
          }
        }
      }

      // Show toast notifications for newly unlocked achievements
      if (unlockedAchievements.length > 0) {
        this.showAchievementNotifications(unlockedAchievements);
      }

      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  private calculateTopicProgress(quizProgress: QuizProgress[]): { [topicId: string]: number } {
    const topicModules: { [topicId: string]: Set<string> } = {};

    // Count unique modules completed per topic (score >= 70%)
    quizProgress
      .filter(progress => progress.score >= 70)
      .forEach(progress => {
        if (!topicModules[progress.topicId]) {
          topicModules[progress.topicId] = new Set();
        }
        topicModules[progress.topicId].add(progress.moduleId);
      });

    // Convert to counts
    const topicProgress: { [topicId: string]: number } = {};
    Object.keys(topicModules).forEach(topicId => {
      topicProgress[topicId] = topicModules[topicId].size;
    });

    return topicProgress;
  }

  private showAchievementNotifications(achievements: Achievement[]): void {
    achievements.forEach((achievement, index) => {
      // Stagger notifications slightly
      setTimeout(() => {
        const rarityEmoji = this.getRarityEmoji(achievement.rarity);
        toast.success(
          `🎉 Achievement Unlocked! ${rarityEmoji}`,
          {
            description: `${achievement.icon} ${achievement.name}: ${achievement.description}`,
            duration: 5000,
          }
        );
      }, index * 1000);
    });
  }

  private getRarityEmoji(rarity: Achievement['rarity']): string {
    switch (rarity) {
      case 'common': return '⭐';
      case 'rare': return '💎';
      case 'epic': return '🏆';
      case 'legendary': return '👑';
      default: return '🎯';
    }
  }

  async getAchievementProgress(userId: string, achievementId: string): Promise<number> {
    try {
      const userProfile = await database.getUserProfile(userId);
      const quizProgress = await database.getUserProgress(userId);
      
      if (!userProfile) {
        return 0;
      }

      const achievement = ACHIEVEMENT_DEFINITIONS.find(a => a.id === achievementId);
      if (!achievement) {
        return 0;
      }

      const topicProgress = this.calculateTopicProgress(quizProgress);
      const userStats = {
        totalQuizzesTaken: userProfile.stats.totalQuizzesTaken,
        averageScore: userProfile.stats.averageScore,
        streakDays: userProfile.stats.streakDays,
        completedModules: userProfile.completedModules
      };

      // Calculate progress percentage based on achievement type
      const { condition } = achievement;
      switch (condition.type) {
        case 'quiz_count':
          return Math.min(100, (userStats.totalQuizzesTaken / condition.target) * 100);
        
        case 'score_threshold':
          if (achievement.id === 'consistent-performer') {
            return Math.min(100, (userStats.averageScore / condition.target) * 100);
          }
          return 0; // Single quiz achievements don't have gradual progress
        
        case 'streak_days':
          return Math.min(100, (userStats.streakDays / condition.target) * 100);
        
        case 'module_completion':
          if (condition.topicId && topicProgress[condition.topicId] !== undefined) {
            return Math.min(100, (topicProgress[condition.topicId] / condition.target) * 100);
          } else {
            return Math.min(100, (userStats.completedModules.length / condition.target) * 100);
          }
        
        default:
          return 0;
      }
    } catch (error) {
      console.error('Error calculating achievement progress:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const achievementService = AchievementService.getInstance();