/**
 * Unified type definitions for DSA Quiz Master
 * This file centralizes all type definitions to avoid conflicts
 */

// User Profile - compatible with both database and UI components
export interface UserProfile {
    id: string;
    username: string;
    email?: string;
    displayName?: string; // Optional for backward compatibility
    createdAt: Date | string; // Allow both Date and string for serialization
    totalScore: number;
    completedModules: string[];
    achievements: string[];
    stats: {
        totalQuizzesTaken: number;
        totalTimeSpent: number;
        averageScore: number;
        streakDays: number;
        lastQuizDate?: Date | string;
    };
    // Legacy fields for compatibility with existing components
    totalQuizzes?: number; // Maps to stats.totalQuizzesTaken
    bestOverallScore?: number; // Maps to highest score or totalScore
}

// User Session
export interface UserSession {
    id: string;
    userId: string;
    createdAt: Date | string;
    lastActive: Date | string;
    preferences: {
        theme: 'light' | 'dark' | 'system';
        difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
        soundEnabled: boolean;
    };
}

// Quiz Progress
export interface QuizProgress {
    id: string;
    userId: string;
    moduleId: string;
    topicId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    completedAt: Date | string;
    timeSpent: number; // in milliseconds
}

// Quiz Attempt
export interface QuizAttempt {
    id: string;
    userId: string;
    moduleId: string;
    questionId: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
    timestamp: Date | string;
}

// Helper function to normalize UserProfile for compatibility
export function normalizeUserProfile(profile: UserProfile): UserProfile {
    const displayName = profile.displayName || profile.username;
    const email = profile.email || '';
    const totalQuizzes = profile.totalQuizzes || profile.stats?.totalQuizzesTaken || 0;
    const bestOverallScore = profile.bestOverallScore || profile.totalScore || 0;

    return {
        ...profile,
        displayName,
        email,
        totalQuizzes,
        bestOverallScore,
        createdAt: typeof profile.createdAt === 'string' ? profile.createdAt : profile.createdAt.toISOString(),
        stats: {
            ...profile.stats,
            lastQuizDate: profile.stats?.lastQuizDate
                ? (typeof profile.stats.lastQuizDate === 'string'
                    ? profile.stats.lastQuizDate
                    : profile.stats.lastQuizDate.toISOString())
                : undefined
        }
    };
}// Helper function to convert UI UserProfile to Database UserProfile
export function toDatabaseUserProfile(profile: UserProfile): UserProfile {
    return {
        id: profile.id,
        username: profile.username,
        email: profile.email,
        createdAt: typeof profile.createdAt === 'string' ? new Date(profile.createdAt) : profile.createdAt,
        totalScore: profile.totalScore,
        completedModules: profile.completedModules || [],
        achievements: profile.achievements || [],
        stats: {
            totalQuizzesTaken: profile.stats?.totalQuizzesTaken || profile.totalQuizzes || 0,
            totalTimeSpent: profile.stats?.totalTimeSpent || 0,
            averageScore: profile.stats?.averageScore || 0,
            streakDays: profile.stats?.streakDays || 0,
            lastQuizDate: profile.stats?.lastQuizDate
                ? (typeof profile.stats.lastQuizDate === 'string'
                    ? new Date(profile.stats.lastQuizDate)
                    : profile.stats.lastQuizDate)
                : undefined
        }
    };
}
