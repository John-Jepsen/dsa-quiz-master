/**
 * Achievement definitions for DSA Quiz Master
 * Defines all available achievements and their unlock conditions
 */

import { Achievement } from '../types';

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  // Progress-based achievements
  {
    id: 'first-quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    category: 'progress',
    condition: {
      type: 'quiz_count',
      target: 1
    },
    rarity: 'common'
  },
  {
    id: 'quiz-veteran',
    name: 'Quiz Veteran',
    description: 'Complete 10 quizzes',
    icon: '📚',
    category: 'progress',
    condition: {
      type: 'quiz_count',
      target: 10
    },
    rarity: 'rare'
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: '👑',
    category: 'progress',
    condition: {
      type: 'quiz_count',
      target: 50
    },
    rarity: 'epic'
  },

  // Performance-based achievements
  {
    id: 'high-scorer',
    name: 'High Scorer',
    description: 'Score 80% or higher on a quiz',
    icon: '⭐',
    category: 'performance',
    condition: {
      type: 'score_threshold',
      target: 80
    },
    rarity: 'common'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score 100% on a quiz',
    icon: '💎',
    category: 'performance',
    condition: {
      type: 'perfect_score',
      target: 100
    },
    rarity: 'rare'
  },
  {
    id: 'consistent-performer',
    name: 'Consistent Performer',
    description: 'Maintain an average score of 75% or higher',
    icon: '🏆',
    category: 'performance',
    condition: {
      type: 'score_threshold',
      target: 75
    },
    rarity: 'epic'
  },

  // Mastery-based achievements (topic specific)
  {
    id: 'array-master',
    name: 'Array Master',
    description: 'Complete all Array modules',
    icon: '⊞',
    category: 'mastery',
    condition: {
      type: 'module_completion',
      target: 6, // Total array modules
      topicId: 'arrays'
    },
    rarity: 'rare'
  },
  {
    id: 'linked-list-master',
    name: 'Linked List Master',
    description: 'Complete all Linked List modules',
    icon: '🔗',
    category: 'mastery',
    condition: {
      type: 'module_completion',
      target: 5, // Total linked list modules
      topicId: 'linked-lists'
    },
    rarity: 'rare'
  },
  {
    id: 'stack-queue-master',
    name: 'Stack & Queue Master',
    description: 'Complete all Stack & Queue modules',
    icon: '📋',
    category: 'mastery',
    condition: {
      type: 'module_completion',
      target: 5, // Total stack/queue modules
      topicId: 'stacks-queues'
    },
    rarity: 'rare'
  },
  {
    id: 'tree-master',
    name: 'Tree Master',
    description: 'Complete all Tree modules',
    icon: '🌳',
    category: 'mastery',
    condition: {
      type: 'module_completion',
      target: 6, // Total tree modules
      topicId: 'trees'
    },
    rarity: 'rare'
  },

  // Streak-based achievements
  {
    id: 'daily-learner',
    name: 'Daily Learner',
    description: 'Practice for 3 consecutive days',
    icon: '🔥',
    category: 'streak',
    condition: {
      type: 'streak_days',
      target: 3
    },
    rarity: 'common'
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Practice for 7 consecutive days',
    icon: '⚡',
    category: 'streak',
    condition: {
      type: 'streak_days',
      target: 7
    },
    rarity: 'rare'
  },
  {
    id: 'dedication-master',
    name: 'Dedication Master',
    description: 'Practice for 30 consecutive days',
    icon: '🌟',
    category: 'streak',
    condition: {
      type: 'streak_days',
      target: 30
    },
    rarity: 'legendary'
  },

  // Secret achievements
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a quiz in under 2 minutes',
    icon: '⚡',
    category: 'performance',
    condition: {
      type: 'time_based',
      target: 120000 // 2 minutes in milliseconds
    },
    rarity: 'epic',
    isSecret: true
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Master all available topics',
    icon: '🎯',
    category: 'mastery',
    condition: {
      type: 'module_completion',
      target: 22 // Total modules across all topics (6+5+5+6)
    },
    rarity: 'legendary',
    isSecret: true
  }
];

// Helper functions for achievement management
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENT_DEFINITIONS.find(achievement => achievement.id === id);
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.filter(achievement => achievement.category === category);
}

export function getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.filter(achievement => achievement.rarity === rarity);
}

export function getVisibleAchievements(): Achievement[] {
  return ACHIEVEMENT_DEFINITIONS.filter(achievement => !achievement.isSecret);
}

export function getAllAchievements(): Achievement[] {
  return [...ACHIEVEMENT_DEFINITIONS];
}

// Achievement checking logic
export function checkAchievementCondition(
  achievement: Achievement,
  userStats: {
    totalQuizzesTaken: number;
    averageScore: number;
    streakDays: number;
    completedModules: string[];
    lastQuizTime?: number; // Time spent on last quiz in milliseconds
  },
  topicProgress?: { [topicId: string]: number } // Number of completed modules per topic
): boolean {
  const { condition } = achievement;

  switch (condition.type) {
    case 'quiz_count':
      return userStats.totalQuizzesTaken >= condition.target;

    case 'score_threshold':
      if (achievement.id === 'consistent-performer') {
        return userStats.averageScore >= condition.target;
      }
      // For single quiz score achievements, this would be checked at quiz completion
      return false;

    case 'perfect_score':
      // This would be checked at quiz completion with the actual score
      return false;

    case 'streak_days':
      return userStats.streakDays >= condition.target;

    case 'module_completion':
      if (condition.topicId && topicProgress) {
        const topicCompletedModules = topicProgress[condition.topicId] || 0;
        return topicCompletedModules >= condition.target;
      } else {
        // For overall completion
        return userStats.completedModules.length >= condition.target;
      }

    case 'time_based':
      if (userStats.lastQuizTime !== undefined) {
        return userStats.lastQuizTime <= condition.target;
      }
      return false;

    default:
      return false;
  }
}

// Color scheme for achievement rarities
export const ACHIEVEMENT_COLORS = {
  common: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700',
    icon: 'text-gray-600'
  },
  rare: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-700',
    icon: 'text-blue-600'
  },
  epic: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-700',
    icon: 'text-purple-600'
  },
  legendary: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    icon: 'text-amber-600'
  }
};