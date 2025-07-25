import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserAuth, UserProfile } from '@/components/UserAuth';
import { TopicSelection } from '@/components/TopicSelection';
import { ModuleSelection } from '@/components/ModuleSelection';
import { Quiz } from '@/components/Quiz';
import { QuizResults } from '@/components/QuizResults';
import { ProgressTracking } from '@/components/ProgressTracking';
import { UserProfileComponent } from '@/components/UserProfileComponent';
import { enhancedQuizTopics, getModuleById, QuizModule } from '@/lib/quiz-modules';
import { quizQuestions, QuizQuestion } from '@/lib/quiz-data';
import { moduleQuestions, getQuestionsByModule } from '@/lib/module-questions';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type AppState = 'auth' | 'topic-selection' | 'module-selection' | 'quiz' | 'results' | 'progress' | 'profile';

function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentModule, setCurrentModule] = useState<QuizModule | null>(null);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [quizScore, setQuizScore] = useState(0);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('dsa-quiz-current-user');
    if (savedUser) {
      try {
        const user: UserProfile = JSON.parse(savedUser);
        setCurrentUser(user);
        setAppState('topic-selection');
      } catch (error) {
        localStorage.removeItem('dsa-quiz-current-user');
      }
    }
  }, []);

  // Use user-specific progress keys
  const completedModulesKey = currentUser ? `completed-modules-${currentUser.id}` : 'completed-modules';
  const moduleScoresKey = currentUser ? `module-scores-${currentUser.id}` : 'module-scores';

  const [completedModules, setCompletedModules] = useLocalStorage<string[]>(completedModulesKey, []);
  const [moduleScores, setModuleScores] = useLocalStorage<Record<string, number>>(moduleScoresKey, {});

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('dsa-quiz-current-user', JSON.stringify(user));
    setAppState('topic-selection');
  };

  const handleRegister = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('dsa-quiz-current-user', JSON.stringify(user));
    setAppState('topic-selection');
    toast.success('Welcome to DSA Quiz Master! 🎉');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dsa-quiz-current-user');
    setAppState('auth');
    toast.success('Logged out successfully');
  };

  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('dsa-quiz-current-user', JSON.stringify(updatedUser));
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
    setAppState('quiz');
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    setQuizScore(score);

    if (currentModule && currentUser) {
      const scorePercentage = Math.round((score / totalQuestions) * 100);

      // Update module completion and score
      if (!completedModules.includes(currentModule.id)) {
        setCompletedModules(prev => [...prev, currentModule.id]);
      }

      // Update best score for this module
      setModuleScores(prev => ({
        ...prev,
        [currentModule.id]: Math.max(prev[currentModule.id] || 0, scorePercentage)
      }));

      // Update current user's stats locally
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          totalQuizzes: currentUser.totalQuizzes + 1,
          bestOverallScore: Math.max(currentUser.bestOverallScore, scorePercentage)
        };

        setCurrentUser(updatedUser);
        localStorage.setItem('dsa-quiz-current-user', JSON.stringify(updatedUser));

        // Show achievement toast for new best score
        if (scorePercentage >= 80) {
          toast.success(`Great score: ${scorePercentage}%! 🎉`);
        }
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
          currentUser={currentUser}
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
          user={currentUser}
          onBack={handleBackToTopics}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      <Toaster />
    </div>
  );
}

export default App;