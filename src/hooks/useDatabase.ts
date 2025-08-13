/**
 * Database hooks for DSA Quiz Master
 * Provides React hooks for database operations
 */

import { useState, useEffect, useCallback } from 'react';
import { database, UserProfile, QuizProgress, UserSession, QuizAttempt, Achievement, UserAchievement, LeaderboardEntry } from '../services/database';
import { migrationService } from '../services/migration';
import { syncService } from '../services/sync-service';
import { databaseCache } from '../services/database-cache';

// Hook for user profile management
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Ensure migration is complete and get current user ID
      await migrationService.checkAndMigrate();
      let userId = await migrationService.getCurrentUserId();

      if (!userId) {
        // Create a default user if none exists
        userId = await migrationService.createDefaultUser();
      }

      // Try to get from cache first
      let userProfile = databaseCache.getUserProfile(userId);
      
      if (!userProfile) {
        // Load from database if not in cache
        userProfile = await database.getUserProfile(userId);
        if (userProfile) {
          // Cache the profile
          databaseCache.cacheUserProfile(userId, userProfile);
          setProfile(userProfile);
        } else {
          throw new Error('User profile not found');
        }
      } else {
        setProfile(userProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profile');
      console.error('Error loading user profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      setError(null);
      await database.updateUserProfile(profile.id, updates);
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      
      // Update cache
      databaseCache.cacheUserProfile(profile.id, updatedProfile);
      
      // Queue sync operation
      syncService.queueOperation('update', 'userProfiles', { id: profile.id, ...updates });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      console.error('Error updating profile:', err);
    }
  }, [profile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: loadProfile,
  };
}

// Hook for quiz progress management
export function useQuizProgress() {
  const [progress, setProgress] = useState<QuizProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await migrationService.getCurrentUserId();
      if (!userId) {
        throw new Error('No user found');
      }

      // Try cache first
      let userProgress = databaseCache.getUserProgress(userId);
      
      if (!userProgress) {
        // Load from database if not cached
        userProgress = await database.getUserProgress(userId);
        // Cache the progress
        databaseCache.cacheUserProgress(userId, userProgress);
      }
      
      setProgress(userProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
      console.error('Error loading progress:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProgress = useCallback(async (
    moduleId: string,
    topicId: string,
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    timeSpent: number
  ) => {
    try {
      setError(null);

      const userId = await migrationService.getCurrentUserId();
      if (!userId) {
        throw new Error('No user found');
      }

      const progressData = {
        userId,
        moduleId,
        topicId,
        score,
        totalQuestions,
        correctAnswers,
        timeSpent,
      };

      const progressId = await database.saveQuizProgress(progressData);

      // Queue sync operation
      syncService.queueOperation('create', 'quizProgress', { id: progressId, ...progressData });

      // Invalidate cache for this user's progress
      databaseCache.invalidateUserProgress(userId);

      // Reload progress to get the updated list
      await loadProgress();

      return progressId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save progress');
      console.error('Error saving progress:', err);
      throw err;
    }
  }, [loadProgress]);

  const getModuleProgress = useCallback((moduleId: string) => {
    // Try to get from cache first if we have a user ID
    const cachedProgress = progress.filter(p => p.moduleId === moduleId);
    return cachedProgress;
  }, [progress]);

  const getTopicProgress = useCallback((topicId: string) => {
    return progress.filter(p => p.topicId === topicId);
  }, [progress]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    loading,
    error,
    saveProgress,
    getModuleProgress,
    getTopicProgress,
    refetch: loadProgress,
  };
}

// Hook for session management
export function useSession() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await migrationService.getCurrentUserId();
      if (!userId) {
        throw new Error('No user found');
      }

      let userSession = await database.getActiveSession(userId);
      
      if (!userSession) {
        // Create a new session if none exists
        const sessionId = await database.createSession(userId);
        userSession = await database.getActiveSession(userId);
      }

      setSession(userSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
      console.error('Error loading session:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateActivity = useCallback(async () => {
    if (!session) return;

    try {
      await database.updateSessionActivity(session.id);
    } catch (err) {
      console.error('Error updating session activity:', err);
    }
  }, [session]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Update activity every 5 minutes
  useEffect(() => {
    if (session) {
      const interval = setInterval(updateActivity, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [session, updateActivity]);

  return {
    session,
    loading,
    error,
    updateActivity,
    refetch: loadSession,
  };
}

// Hook for quiz attempts tracking
export function useQuizAttempts() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAttempts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await migrationService.getCurrentUserId();
      if (!userId) {
        throw new Error('No user found');
      }

      const userAttempts = await database.getUserAttempts(userId);
      setAttempts(userAttempts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attempts');
      console.error('Error loading attempts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAttempt = useCallback(async (
    moduleId: string,
    questionId: string,
    userAnswer: number,
    correctAnswer: number,
    timeSpent: number
  ) => {
    try {
      setError(null);

      const userId = await migrationService.getCurrentUserId();
      if (!userId) {
        throw new Error('No user found');
      }

      const attemptData = {
        userId,
        moduleId,
        questionId,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer === correctAnswer,
        timeSpent,
      };

      const attemptId = await database.saveQuizAttempt(attemptData);

      // Queue sync operation
      syncService.queueOperation('create', 'quizAttempts', { id: attemptId, ...attemptData });

      // Add the new attempt to the local state
      const newAttempt: QuizAttempt = {
        id: attemptId,
        userId,
        moduleId,
        questionId,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer === correctAnswer,
        timeSpent,
        timestamp: new Date(),
      };

      setAttempts(prev => [...prev, newAttempt]);

      return attemptId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save attempt');
      console.error('Error saving attempt:', err);
      throw err;
    }
  }, []);

  const getAttemptsByModule = useCallback((moduleId: string) => {
    return attempts.filter(a => a.moduleId === moduleId);
  }, [attempts]);

  const getAttemptsByQuestion = useCallback((questionId: string) => {
    return attempts.filter(a => a.questionId === questionId);
  }, [attempts]);

  useEffect(() => {
    loadAttempts();
  }, [loadAttempts]);

  return {
    attempts,
    loading,
    error,
    saveAttempt,
    getAttemptsByModule,
    getAttemptsByQuestion,
    refetch: loadAttempts,
  };
}

// Hook for user statistics
export function useUserStats() {
  const [stats, setStats] = useState<UserProfile['stats'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = await migrationService.getCurrentUserId();
      if (!userId) {
        throw new Error('No user found');
      }

      const userStats = await database.getUserStats(userId);
      setStats(userStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refetch: loadStats,
  };
}

// Hook for database initialization and health
export function useDatabase() {
  const [initialized, setInitialized] = useState(false);
  const [migrated, setMigrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize database
      await database.initialize();
      setInitialized(true);

      // Check and perform migration
      const migrationPerformed = await migrationService.checkAndMigrate();
      setMigrated(true);

      if (migrationPerformed) {
        console.log('Database migration completed successfully');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
      console.error('Database initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(async () => {
    try {
      setError(null);
      await migrationService.resetMigration();
      await initialize();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset database');
      console.error('Database reset error:', err);
    }
  }, [initialize]);

  const exportData = useCallback(async () => {
    try {
      const data = await database.exportData();
      return data;
    } catch (err) {
      console.error('Export error:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    initialized,
    migrated,
    loading,
    error,
    reset,
    exportData,
    refetch: initialize,
  };
}

// Hook for achievement management
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all achievements
      const allAchievements = await database.getAllAchievements();
      setAchievements(allAchievements);

      // Load user's unlocked achievements
      const userId = await migrationService.getCurrentUserId();
      if (userId) {
        const userUnlocked = await database.getUserAchievements(userId);
        setUserAchievements(userUnlocked);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load achievements');
      console.error('Error loading achievements:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const unlockAchievement = useCallback(async (achievementId: string) => {
    try {
      setError(null);

      const userId = await migrationService.getCurrentUserId();
      if (!userId) {
        throw new Error('No user found');
      }

      // Check if already unlocked
      if (userAchievements.some(ua => ua.achievementId === achievementId)) {
        return false; // Already unlocked
      }

      const unlockId = await database.unlockAchievement(userId, achievementId);
      
      // Add to local state
      const newAchievement: UserAchievement = {
        id: unlockId,
        userId,
        achievementId,
        unlockedAt: new Date(),
        progress: 100
      };

      setUserAchievements(prev => [...prev, newAchievement]);
      return true; // Successfully unlocked
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlock achievement');
      console.error('Error unlocking achievement:', err);
      return false;
    }
  }, [userAchievements]);

  const getUnlockedAchievements = useCallback(() => {
    return achievements.filter(achievement => 
      userAchievements.some(ua => ua.achievementId === achievement.id)
    );
  }, [achievements, userAchievements]);

  const getLockedAchievements = useCallback(() => {
    return achievements.filter(achievement => 
      !userAchievements.some(ua => ua.achievementId === achievement.id) && !achievement.isSecret
    );
  }, [achievements, userAchievements]);

  const isAchievementUnlocked = useCallback((achievementId: string) => {
    return userAchievements.some(ua => ua.achievementId === achievementId);
  }, [userAchievements]);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  return {
    achievements,
    userAchievements,
    loading,
    error,
    unlockAchievement,
    getUnlockedAchievements,
    getLockedAchievements,
    isAchievementUnlocked,
    refetch: loadAchievements,
  };
}

// Hook for leaderboard management
export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const entries = await database.getGlobalLeaderboard(50);
      setLeaderboard(entries);

      // Find current user's rank
      const userId = await migrationService.getCurrentUserId();
      if (userId) {
        const userEntry = entries.find(entry => entry.userId === userId);
        setUserRank(userEntry?.rank || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      console.error('Error loading leaderboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserLeaderboardEntry = useCallback(async (userProfile: UserProfile) => {
    try {
      setError(null);

      const entry: Omit<LeaderboardEntry, 'id' | 'rank'> = {
        userId: userProfile.id,
        username: userProfile.username,
        displayName: userProfile.displayName,
        totalScore: userProfile.totalScore,
        averageScore: userProfile.stats.averageScore,
        completedModules: userProfile.completedModules.length,
        totalQuizzes: userProfile.stats.totalQuizzesTaken,
        achievementCount: userProfile.achievements.length,
        lastActiveAt: new Date()
      };

      await database.updateLeaderboardEntry(entry);
      
      // Refresh leaderboard to show updated position
      await loadLeaderboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update leaderboard');
      console.error('Error updating leaderboard:', err);
    }
  }, [loadLeaderboard]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  return {
    leaderboard,
    userRank,
    loading,
    error,
    updateUserLeaderboardEntry,
    refetch: loadLeaderboard,
  };
}