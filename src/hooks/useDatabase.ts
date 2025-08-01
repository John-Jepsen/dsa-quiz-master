/**
 * Database hooks for DSA Quiz Master
 * Provides React hooks for database operations
 */

import { useState, useEffect, useCallback } from 'react';
import { database, UserProfile, QuizProgress, UserSession, QuizAttempt } from '../services/database';
import { migrationService } from '../services/migration';

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

      // Load the user profile
      const userProfile = await database.getUserProfile(userId);
      if (userProfile) {
        setProfile(userProfile);
      } else {
        throw new Error('User profile not found');
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
      setProfile(prev => prev ? { ...prev, ...updates } : null);
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

      const userProgress = await database.getUserProgress(userId);
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

      const progressId = await database.saveQuizProgress({
        userId,
        moduleId,
        topicId,
        score,
        totalQuestions,
        correctAnswers,
        timeSpent,
      });

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
    return progress.filter(p => p.moduleId === moduleId);
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

      const attemptId = await database.saveQuizAttempt({
        userId,
        moduleId,
        questionId,
        userAnswer,
        correctAnswer,
        isCorrect: userAnswer === correctAnswer,
        timeSpent,
      });

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