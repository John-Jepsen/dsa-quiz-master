/**
 * Progress Submission Service
 * Captures IndexedDB state and submits to remote database
 */

import { database } from './database';
import { UserProfile, QuizProgress, QuizAttempt, UserSession } from '../types';

export interface ProgressSubmissionData {
    userId: string;
    timestamp: string;
    userProfile: UserProfile;
    quizProgress: QuizProgress[];
    quizAttempts: QuizAttempt[];
    userSessions: UserSession[];
    metadata: {
        appVersion: string;
        submissionId: string;
        totalDataSize: number;
    };
}

export interface SubmissionResponse {
    success: boolean;
    submissionId: string;
    message: string;
    errors?: string[];
}

class ProgressSubmissionService {
    private static instance: ProgressSubmissionService | null = null;
    private readonly APP_VERSION = '1.0.0';

    private constructor() { }

    static getInstance(): ProgressSubmissionService {
        if (!ProgressSubmissionService.instance) {
            ProgressSubmissionService.instance = new ProgressSubmissionService();
        }
        return ProgressSubmissionService.instance;
    }

    /**
     * Captures current IndexedDB state for a user
     */
    async captureUserProgress(userId: string): Promise<ProgressSubmissionData> {
        try {
            await database.initialize();

            // Get user profile
            const userProfile = await database.getUserProfile(userId);
            if (!userProfile) {
                throw new Error('User profile not found');
            }

            // Get all user data
            const [quizProgress, quizAttempts, userSessions] = await Promise.all([
                database.getUserProgress(userId),
                database.getUserAttempts(userId),
                this.getUserSessions(userId)
            ]);

            const submissionData: ProgressSubmissionData = {
                userId,
                timestamp: new Date().toISOString(),
                userProfile,
                quizProgress,
                quizAttempts,
                userSessions,
                metadata: {
                    appVersion: this.APP_VERSION,
                    submissionId: this.generateSubmissionId(),
                    totalDataSize: 0
                }
            };

            // Calculate data size
            submissionData.metadata.totalDataSize = JSON.stringify(submissionData).length;

            return submissionData;
        } catch (error) {
            console.error('Error capturing user progress:', error);
            throw new Error(`Failed to capture progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Submits progress data to local storage
     */
    async submitProgress(progressData: ProgressSubmissionData): Promise<SubmissionResponse> {
        try {
            console.log('📤 Saving progress to local storage...');
            console.log(`Data size: ${Math.round(progressData.metadata.totalDataSize / 1024)}KB`);

            // Local storage submission only
            return this.saveToLocalStorage(progressData);

        } catch (error) {
            console.error('Error saving progress:', error);
            return {
                success: false,
                submissionId: progressData.metadata.submissionId,
                message: `Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                errors: [error instanceof Error ? error.message : 'Unknown error']
            };
        }
    }

    /**
     * Submits progress for current user (convenience method)
     */
    async submitCurrentUserProgress(): Promise<SubmissionResponse> {
        try {
            const userId = await this.getCurrentUserId();
            if (!userId) {
                throw new Error('No current user found');
            }

            const progressData = await this.captureUserProgress(userId);
            return await this.submitProgress(progressData);
        } catch (error) {
            console.error('Error submitting current user progress:', error);
            return {
                success: false,
                submissionId: this.generateSubmissionId(),
                message: `Failed to submit progress: ${error instanceof Error ? error.message : 'Unknown error'}`,
                errors: [error instanceof Error ? error.message : 'Unknown error']
            };
        }
    }

    /**
     * Gets submission history for a user from local storage
     */
    async getSubmissionHistory(userId: string): Promise<any[]> {
        try {
            // Return submission history from local storage
            return this.getLocalSubmissionHistory(userId);
        } catch (error) {
            console.error('Error getting submission history:', error);
            return [];
        }
    }

    /**
     * Validates progress data before submission
     */
    validateProgressData(data: ProgressSubmissionData): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!data.userId) errors.push('User ID is required');
        if (!data.userProfile) errors.push('User profile is required');
        if (!data.timestamp) errors.push('Timestamp is required');
        if (!data.metadata.submissionId) errors.push('Submission ID is required');

        // Validate data integrity
        if (data.quizProgress.some(p => p.userId !== data.userId)) {
            errors.push('Quiz progress contains data for different users');
        }

        if (data.quizAttempts.some(a => a.userId !== data.userId)) {
            errors.push('Quiz attempts contains data for different users');
        }

        // Check data size limits (e.g., 5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (data.metadata.totalDataSize > maxSize) {
            errors.push(`Data size exceeds limit (${Math.round(data.metadata.totalDataSize / 1024 / 1024)}MB > 5MB)`);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Private helper methods

    private async getUserSessions(userId: string): Promise<UserSession[]> {
        // Get active session for the user
        const activeSession = await database.getActiveSession(userId);
        return activeSession ? [activeSession] : [];
    }

    private async getCurrentUserId(): Promise<string | null> {
        // Try to get from localStorage first
        const storedUserId = localStorage.getItem('current-user-id');
        if (storedUserId) return storedUserId;

        // Try to get from database export
        const exportData = await database.exportData();
        if (exportData.userProfiles.length > 0) {
            return exportData.userProfiles[0].id;
        }

        return null;
    }

    private getAuthToken(): string {
        return localStorage.getItem('auth-token') || 'local-token';
    }

    private generateSubmissionId(): string {
        return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private async saveToLocalStorage(data: ProgressSubmissionData): Promise<SubmissionResponse> {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Validate data
        const validation = this.validateProgressData(data);
        if (!validation.valid) {
            return {
                success: false,
                submissionId: data.metadata.submissionId,
                message: 'Validation failed',
                errors: validation.errors
            };
        }

        // Store in localStorage
        const submissions = JSON.parse(localStorage.getItem('progress-submissions') || '[]');
        submissions.push({
            submissionId: data.metadata.submissionId,
            userId: data.userId,
            timestamp: data.timestamp,
            dataSize: data.metadata.totalDataSize,
            quizCount: data.quizProgress.length,
            attemptCount: data.quizAttempts.length
        });
        localStorage.setItem('progress-submissions', JSON.stringify(submissions));

        return {
            success: true,
            submissionId: data.metadata.submissionId,
            message: 'Progress saved successfully to local storage'
        };
    }

    private getLocalSubmissionHistory(userId: string): any[] {
        const submissions = JSON.parse(localStorage.getItem('progress-submissions') || '[]');
        return submissions.filter((s: any) => s.userId === userId);
    }
}

// Export singleton instance
export const progressSubmissionService = ProgressSubmissionService.getInstance();

// Make available in development console
if (process.env.NODE_ENV === 'development') {
    (window as any).progressSubmissionService = progressSubmissionService;
    console.log('🔧 Progress submission service available at: progressSubmissionService');
}
