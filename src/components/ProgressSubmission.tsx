/**
 * Progress Submission Component
 * UI component for submitting user progress to remote database
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, CheckCircle, XCircle, Info, History, Database } from 'lucide-react';
import { progressSubmissionService, ProgressSubmissionData, SubmissionResponse } from '@/services/progress-submission';
import { useUserProfile } from '@/hooks/useDatabase';
import { toast } from 'sonner';

interface ProgressSubmissionProps {
    onSubmissionComplete?: (response: SubmissionResponse) => void;
}

export function ProgressSubmission({ onSubmissionComplete }: ProgressSubmissionProps) {
    const { profile: currentUser } = useUserProfile();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastSubmission, setLastSubmission] = useState<SubmissionResponse | null>(null);
    const [progressData, setProgressData] = useState<ProgressSubmissionData | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleSubmitProgress = async () => {
        if (!currentUser) {
            toast.error('No user profile found');
            return;
        }

        setIsSubmitting(true);
        setLastSubmission(null);

        try {
            toast.info('📊 Capturing progress data...');

            // Capture progress data
            const data = await progressSubmissionService.captureUserProgress(currentUser.id);
            setProgressData(data);

            toast.info('📤 Submitting to database...');

            // Submit to remote database
            const response = await progressSubmissionService.submitCurrentUserProgress();
            setLastSubmission(response);

            if (response.success) {
                toast.success('🎉 Progress submitted successfully!');
            } else {
                toast.error(`❌ Submission failed: ${response.message}`);
            }

            onSubmissionComplete?.(response);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`Failed to submit progress: ${errorMessage}`);
            setLastSubmission({
                success: false,
                submissionId: '',
                message: errorMessage,
                errors: [errorMessage]
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusIcon = () => {
        if (isSubmitting) return <Loader2 className="h-4 w-4 animate-spin" />;
        if (lastSubmission?.success) return <CheckCircle className="h-4 w-4 text-green-600" />;
        if (lastSubmission && !lastSubmission.success) return <XCircle className="h-4 w-4 text-red-600" />;
        return <Upload className="h-4 w-4" />;
    };

    const getStatusColor = () => {
        if (lastSubmission?.success) return 'bg-green-100 border-green-300 text-green-800';
        if (lastSubmission && !lastSubmission.success) return 'bg-red-100 border-red-300 text-red-800';
        return 'bg-blue-100 border-blue-300 text-blue-800';
    };

    const formatDataSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
        return `${Math.round(bytes / 1024 / 1024 * 100) / 100} MB`;
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Submit Progress
                </CardTitle>
                <CardDescription>
                    Upload your quiz progress to the cloud for backup and synchronization
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Main Submit Button */}
                <Button
                    onClick={handleSubmitProgress}
                    disabled={isSubmitting || !currentUser}
                    className="w-full"
                    size="lg"
                >
                    {getStatusIcon()}
                    {isSubmitting ? 'Submitting...' : 'Submit Progress'}
                </Button>

                {/* Status Display */}
                {lastSubmission && (
                    <Alert className={getStatusColor()}>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            <div className="space-y-1">
                                <p className="font-medium">{lastSubmission.message}</p>
                                {lastSubmission.submissionId && (
                                    <p className="text-xs opacity-75">
                                        ID: {lastSubmission.submissionId}
                                    </p>
                                )}
                                {lastSubmission.errors && lastSubmission.errors.length > 0 && (
                                    <ul className="text-xs mt-2 space-y-1">
                                        {lastSubmission.errors.map((error, index) => (
                                            <li key={index}>• {error}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Progress Data Summary */}
                {progressData && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Data Summary</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDetails(!showDetails)}
                            >
                                {showDetails ? 'Hide' : 'Show'} Details
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span>Quiz Progress:</span>
                                <Badge variant="secondary">{progressData.quizProgress.length}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Attempts:</span>
                                <Badge variant="secondary">{progressData.quizAttempts.length}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Data Size:</span>
                                <Badge variant="secondary">{formatDataSize(progressData.metadata.totalDataSize)}</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span>Sessions:</span>
                                <Badge variant="secondary">{progressData.userSessions.length}</Badge>
                            </div>
                        </div>

                        {showDetails && (
                            <div className="border rounded-lg p-3 bg-muted/50 text-xs space-y-2">
                                <div>
                                    <strong>User:</strong> {progressData.userProfile.username}
                                </div>
                                <div>
                                    <strong>Total Score:</strong> {progressData.userProfile.totalScore}
                                </div>
                                <div>
                                    <strong>Completed Modules:</strong> {progressData.userProfile.completedModules.length}
                                </div>
                                <div>
                                    <strong>Achievements:</strong> {progressData.userProfile.achievements.length}
                                </div>
                                <div>
                                    <strong>Submission Time:</strong> {new Date(progressData.timestamp).toLocaleString()}
                                </div>
                                <div>
                                    <strong>App Version:</strong> {progressData.metadata.appVersion}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* User Info */}
                {currentUser && (
                    <div className="text-sm text-muted-foreground border-t pt-3">
                        <p>Submitting progress for: <strong>{currentUser.username}</strong></p>
                        <p>Total quizzes taken: <strong>{currentUser.stats?.totalQuizzesTaken || 0}</strong></p>
                    </div>
                )}

                {/* No User Warning */}
                {!currentUser && (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            No user profile found. Please create a profile first to submit progress.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}

export default ProgressSubmission;
