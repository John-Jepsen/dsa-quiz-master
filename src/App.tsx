import { useState, useEffect } from 'react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { useUserProfile, useQuizProgress, useQuizAttempts, useAchievements, useLeaderboard } from '@/hooks/useDatabase';
import { DatabaseProvider, DatabaseLoader } from '@/components/DatabaseProvider';
import { DatabaseDebugger } from '@/components/DatabaseDebugger';
import '@/services/database-utils'; // Import for development utilities
import '@/services/database-test'; // Import for testing utilities
import '@/scripts/bootstrap-database'; // Initialize database on app start
import { UserAuth } from '@/components/UserAuth';
import { UserProfile, normalizeUserProfile } from '@/types';
import { TopicSelection } from '@/components/TopicSelection';
import { ModuleSelection } from '@/components/ModuleSelection';
import { Quiz } from '@/components/Quiz';
import { QuizResults } from '@/components/QuizResults';
import { ProgressTracking } from '@/components/ProgressTracking';
import { UserProfileComponent } from '@/components/UserProfileComponent';
import { CodePracticeSelection } from '@/components/CodePracticeSelection';
import { CodePractice } from '@/components/CodePractice';
import { AchievementsPage } from '@/components/AchievementsPage';
import { LeaderboardPage } from '@/components/LeaderboardPage';
import { FloatingSubmitButton } from '@/components/FloatingSubmitButton';
import { enhancedQuizTopics, getModuleById, QuizModule } from '@/lib/quiz-modules';
import { quizQuestions, QuizQuestion } from '@/lib/quiz-data';
import { moduleQuestions, getQuestionsByModule } from '@/lib/module-questions';
import { CodeExercise } from '@/lib/code-exercises';
import { achievementService } from '@/services/achievement-service';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type AppState = 'auth' | 'topic-selection' | 'module-selection' | 'quiz' | 'results' | 'progress' | 'profile' | 'code-practice-selection' | 'code-practice' | 'achievements' | 'leaderboard';

function AppContent() {
  const { handleCallback, user: githubUser } = useGitHubAuth();
  const { profile: currentUser, updateProfile } = useUserProfile();
  const { progress, saveProgress, getModuleProgress } = useQuizProgress();
  const { saveAttempt } = useQuizAttempts();
  const { unlockAchievement } = useAchievements();
  const { updateUserLeaderboardEntry } = useLeaderboard();

  const [appState, setAppState] = useState<AppState>('auth');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentModule, setCurrentModule] = useState<QuizModule | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [currentExercise, setCurrentExercise] = useState<CodeExercise | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleCallback(code, state)
        .then(() => {
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((error) => {
          console.error('Authentication failed:', error);
          toast.error('Authentication failed. Please try again.');
        });
    }
  }, [handleCallback]);

  // Set initial state based on user profile
  useEffect(() => {
    if (currentUser) {
      setAppState('topic-selection');
    } else {
      setAppState('auth');
    }
  }, [currentUser]);

  // Helper to get completed modules from progress
  const getCompletedModules = (): string[] => {
    const moduleIds = new Set<string>();
    progress.forEach(p => {
      if (p.score >= 70) { // Consider 70% as passing
        moduleIds.add(p.moduleId);
      }
    });
    return Array.from(moduleIds);
  };

  // Helper to get module scores
  const getModuleScores = (): Record<string, number> => {
    const scores: Record<string, number> = {};
    progress.forEach(p => {
      const currentScore = scores[p.moduleId] || 0;
      scores[p.moduleId] = Math.max(currentScore, p.score);
    });
    return scores;
  };

  const completedModules = getCompletedModules();
  const moduleScores = getModuleScores();

  // These functions are now handled by the database hooks automatically
  const handleLogin = (user: UserProfile) => {
    // Database automatically creates user profile through hooks
    toast.success(`Welcome back, ${user.displayName}! 🎉`);
  };

  const handleRegister = (user: UserProfile) => {
    // Database automatically creates user profile through hooks
    toast.success('Welcome to DSA Quiz Master! 🎉');
  };

  const handleLogout = () => {
    // Clear local session data but keep database intact
    localStorage.removeItem('current-user-id');
    window.location.reload(); // Reload to reset app state
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    if (updateProfile) {
      // Convert dates properly for database storage
      const updates: Partial<UserProfile> = {
        ...updatedUser,
        createdAt: typeof updatedUser.createdAt === 'string'
          ? new Date(updatedUser.createdAt)
          : updatedUser.createdAt
      };
      updateProfile(updates);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    if (topicId === 'random') {
      // For random quiz, get questions from multiple modules
      const allQuestions = quizQuestions.slice(0, 10); // Get first 10 questions as random sample
      setCurrentQuestions(allQuestions);
      setCurrentTopic('random');
      setCurrentModule(null);
      setAppState('quiz');
    } else {
      setCurrentTopic(topicId);
      setAppState('module-selection');
    }
  };

  const handleModuleSelect = (moduleId: string) => {
    const module = getModuleById(moduleId);
    if (!module) {
      toast.error('Module not found');
      return;
    }

    // Get questions for this specific module
    const moduleQuestions = getQuestionsByModule(moduleId);
    if (moduleQuestions.length === 0) {
      toast.error('No questions available for this module yet');
      return;
    }

    setCurrentModule(module);
    setCurrentQuestions(moduleQuestions);
    setQuestionStartTime(new Date());
    setAppState('quiz');
  };

  const handleQuizComplete = async (score: number, totalQuestions: number, questionAttempts?: Array<{ questionId: string; userAnswer: number; correctAnswer: number; timeSpent: number }>) => {
    setQuizScore(score);

    if (currentModule && currentUser) {
      const scorePercentage = Math.round((score / totalQuestions) * 100);
      const timeSpent = Date.now() - questionStartTime.getTime();

      try {
        // Save quiz progress to database
        await saveProgress(
          currentModule.id,
          currentTopic || currentModule.id.split('-')[0], // Extract topic from module ID
          scorePercentage,
          totalQuestions,
          score,
          timeSpent
        );

        // Save individual question attempts if provided
        if (questionAttempts && saveAttempt) {
          for (const attempt of questionAttempts) {
            await saveAttempt(
              currentModule.id,
              attempt.questionId,
              attempt.userAnswer,
              attempt.correctAnswer,
              attempt.timeSpent
            );
          }
        }

        // Update user stats and calculate average score
        const newTotalQuizzes = currentUser.stats.totalQuizzesTaken + 1;
        const newTotalScore = currentUser.totalScore + scorePercentage;
        const newAverageScore = Math.round((currentUser.stats.averageScore * currentUser.stats.totalQuizzesTaken + scorePercentage) / newTotalQuizzes);
        
        const updatedProfile = {
          ...currentUser,
          totalScore: newTotalScore,
          stats: {
            ...currentUser.stats,
            totalQuizzesTaken: newTotalQuizzes,
            totalTimeSpent: currentUser.stats.totalTimeSpent + timeSpent,
            averageScore: newAverageScore,
            lastQuizDate: new Date()
          }
        };

        await updateProfile(updatedProfile);

        // Check for achievements
        try {
          const unlockedAchievements = await achievementService.checkAndUnlockAchievements(
            currentUser.id,
            updatedProfile,
            progress,
            {
              justCompletedQuiz: true,
              lastQuizScore: scorePercentage,
              lastQuizTime: timeSpent
            }
          );

          if (unlockedAchievements.length > 0) {
            console.log('New achievements unlocked:', unlockedAchievements);
          }
        } catch (error) {
          console.error('Error checking achievements:', error);
        }

        // Update leaderboard
        try {
          await updateUserLeaderboardEntry(updatedProfile);
        } catch (error) {
          console.error('Error updating leaderboard:', error);
        }

        // Show achievement toast for good scores
        if (scorePercentage >= 80) {
          toast.success(`Great score: ${scorePercentage}%! 🎉`);
        } else if (scorePercentage >= 60) {
          toast.success(`Good job: ${scorePercentage}%! Keep practicing! 💪`);
        }

      } catch (error) {
        console.error('Error saving quiz results:', error);
        toast.error('Failed to save quiz results');
      }
    }

    setAppState('results');
  };

  const handleRetakeQuiz = () => {
    if (currentModule) {
      handleModuleSelect(currentModule.id);
    } else {
      handleTopicSelect(currentTopic);
    }
  };

  const handleBackToTopics = () => {
    setAppState('topic-selection');
    setCurrentQuestions([]);
    setCurrentTopic('');
    setCurrentModule(null);
  };

  const handleBackToModules = () => {
    setAppState('module-selection');
    setCurrentQuestions([]);
    setCurrentModule(null);
  };

  const handleViewProgress = () => {
    setAppState('progress');
  };

  const handleViewProfile = () => {
    setAppState('profile');
  };

  const handleCodePractice = () => {
    setAppState('code-practice-selection');
  };

  const handleViewAchievements = () => {
    setAppState('achievements');
  };

  const handleViewLeaderboard = () => {
    setAppState('leaderboard');
  };

  const handleExerciseSelect = (exercise: CodeExercise) => {
    setCurrentExercise(exercise);
    setAppState('code-practice');
  };

  const handleExerciseComplete = () => {
    toast.success('Exercise completed! Great job! 🎉');
    setAppState('code-practice-selection');
    setCurrentExercise(null);
  };

  const handleBackToCodePractice = () => {
    setAppState('code-practice-selection');
    setCurrentExercise(null);
  };

  const getCurrentTopicName = () => {
    if (currentTopic === 'random') return 'Mixed Topics';
    const topic = enhancedQuizTopics.find(t => t.id === currentTopic);
    return topic?.name || 'Unknown Topic';
  };

  const getPreviousBestScore = () => {
    if (currentModule) {
      return moduleScores[currentModule.id] || 0;
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {appState === 'auth' && (
        <UserAuth
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {appState === 'topic-selection' && currentUser && (
        <TopicSelection
          onTopicSelect={handleTopicSelect}
          onViewProgress={handleViewProgress}
          onViewProfile={handleViewProfile}
          onViewAchievements={handleViewAchievements}
          onViewLeaderboard={handleViewLeaderboard}
          onCodePractice={handleCodePractice}
          currentUser={normalizeUserProfile(currentUser)}
          completedModules={completedModules}
          moduleScores={moduleScores}
        />
      )}

      {appState === 'module-selection' && currentUser && (
        <ModuleSelection
          topic={enhancedQuizTopics.find(t => t.id === currentTopic)!}
          onModuleSelect={handleModuleSelect}
          onBack={handleBackToTopics}
          completedModules={completedModules}
          moduleScores={moduleScores}
        />
      )}

      {appState === 'quiz' && (
        <Quiz
          questions={currentQuestions}
          onComplete={handleQuizComplete}
          onExit={currentModule ? handleBackToModules : handleBackToTopics}
        />
      )}

      {appState === 'results' && (
        <QuizResults
          score={quizScore}
          totalQuestions={currentQuestions.length}
          topicName={currentModule ? currentModule.name : getCurrentTopicName()}
          onRetakeQuiz={handleRetakeQuiz}
          onBackToTopics={currentModule ? handleBackToModules : handleBackToTopics}
          previousBestScore={getPreviousBestScore()}
        />
      )}

      {appState === 'progress' && (
        <ProgressTracking
          onBack={handleBackToTopics}
          userProgress={{}} // TODO: Adapt this component for new module system
        />
      )}

      {appState === 'profile' && currentUser && (
        <UserProfileComponent
          user={normalizeUserProfile(currentUser)}
          onBack={handleBackToTopics}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {appState === 'code-practice-selection' && (
        <CodePracticeSelection
          onExerciseSelect={handleExerciseSelect}
          onBack={handleBackToTopics}
        />
      )}

      {appState === 'code-practice' && currentExercise && (
        <CodePractice
          exercise={currentExercise}
          onComplete={handleExerciseComplete}
          onBack={handleBackToCodePractice}
        />
      )}

      {appState === 'achievements' && (
        <AchievementsPage
          onBack={handleBackToTopics}
        />
      )}

      {appState === 'leaderboard' && (
        <LeaderboardPage
          onBack={handleBackToTopics}
          currentUserId={currentUser?.id}
        />
      )}

      <Toaster />
      <DatabaseDebugger />

      {/* Floating Submit Button - shows on all pages except auth */}
      {appState !== 'auth' && <FloatingSubmitButton />}
    </div>
  );
}

function App() {
  return (
    <DatabaseProvider>
      <DatabaseLoader>
        <AppContent />
      </DatabaseLoader>
    </DatabaseProvider>
  );
}

export default App;