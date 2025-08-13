/**
 * Floating Progress Submit Button
 * A simple floating action button for quick progress submission
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useProgressSubmission } from '@/hooks/useProgressSubmission';
import { toast } from 'sonner';

interface FloatingSubmitButtonProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    className?: string;
}

export function FloatingSubmitButton({
    position = 'bottom-right',
    className = ''
}: FloatingSubmitButtonProps) {
    const { isSubmitting, lastSubmission, submitProgress } = useProgressSubmission();

    const handleSubmit = async () => {
        const response = await submitProgress();

        if (response.success) {
            toast.success('🎉 Progress submitted successfully!');
        } else {
            toast.error(`❌ Failed to submit: ${response.message}`);
        }
    };

    const getPositionClasses = () => {
        switch (position) {
            case 'bottom-left':
                return 'bottom-6 left-6';
            case 'top-right':
                return 'top-6 right-6';
            case 'top-left':
                return 'top-6 left-6';
            default:
                return 'bottom-6 right-6';
        }
    };

    const getIcon = () => {
        if (isSubmitting) return <Loader2 className="h-5 w-5 animate-spin" />;
        if (lastSubmission?.success) return <CheckCircle className="h-5 w-5 text-green-600" />;
        if (lastSubmission && !lastSubmission.success) return <XCircle className="h-5 w-5 text-red-600" />;
        return <Upload className="h-5 w-5" />;
    };

    const getButtonVariant = () => {
        if (lastSubmission?.success) return 'default';
        if (lastSubmission && !lastSubmission.success) return 'destructive';
        return 'default';
    };

    const getTooltipText = () => {
        if (isSubmitting) return 'Submitting progress...';
        if (lastSubmission?.success) return 'Progress submitted successfully!';
        if (lastSubmission && !lastSubmission.success) return `Failed: ${lastSubmission.message}`;
        return 'Submit your progress to the cloud';
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size="lg"
                        variant={getButtonVariant()}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`fixed z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${getPositionClasses()} ${className}`}
                    >
                        {getIcon()}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{getTooltipText()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default FloatingSubmitButton;
