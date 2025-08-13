/**
 * React hook for progress submission functionality
 */

import { useState, useCallback } from 'react';
import { progressSubmissionService, SubmissionResponse } from '../services/progress-submission';
import { useUserProfile } from './useDatabase';

export interface UseProgressSubmissionReturn {
    isSubmitting: boolean;
    lastSubmission: SubmissionResponse | null;
    submitProgress: () => Promise<SubmissionResponse>;
    clearLastSubmission: () => void;
}

export function useProgressSubmission(): UseProgressSubmissionReturn {
    const { profile: currentUser } = useUserProfile();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSubmission, setLastSubmission] = useState<SubmissionResponse | null>(null);

    const submitProgress = useCallback(async (): Promise<SubmissionResponse> => {
        if (!currentUser) {
            const errorResponse: SubmissionResponse = {
                success: false,
                submissionId: '',
                message: 'No user profile found',
                errors: ['User must be logged in to submit progress']
            };
            setLastSubmission(errorResponse);
            return errorResponse;
        }

        setIsSubmitting(true);
        setLastSubmission(null);

        try {
            const response = await progressSubmissionService.submitCurrentUserProgress();
            setLastSubmission(response);
            return response;
        } catch (error) {
            const errorResponse: SubmissionResponse = {
                success: false,
                submissionId: '',
                message: `Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                errors: [error instanceof Error ? error.message : 'Unknown error']
            };
            setLastSubmission(errorResponse);
            return errorResponse;
        } finally {
            setIsSubmitting(false);
        }
    }, [currentUser]);

    const clearLastSubmission = useCallback(() => {
        setLastSubmission(null);
    }, []);

    return {
        isSubmitting,
        lastSubmission,
        submitProgress,
        clearLastSubmission
    };
}

export default useProgressSubmission;
