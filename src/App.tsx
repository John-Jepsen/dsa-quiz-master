import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { UserAuth, UserProfile } from '@/components/UserAuth';
import { TopicSelection } from '@/components/TopicSelection';
import { Quiz } from '@/components/Quiz';
import { QuizResults } from '@/components/QuizResults';
import { ProgressTracking } from '@/components/ProgressTracking';
import { Leaderboard } from '@/components/Leaderboard';
import { UserProfileComponent } from '@/components/UserProfileComponent';
import { quizTopics, getQuestionsByTopic, getRandomQuestions, QuizQuestion } from '@/lib/quiz-data';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type AppState = 'auth' | 'topic-selection' | 'quiz' | 'results' | 'progress' | 'leaderboard' | 'profile';

interface UserProgress {
  [topicId: string]: {
    completed: number;
    total: number;
    bestScore: number;
    lastAttempt?: string;
  };
}

function App() {
  const [appState, setAppState] = useState<AppState>('auth');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [quizScore, setQuizScore] = useState(0);
  const [userProgress, setUserProgress] = useKV<UserProgress>('quiz-progress', {});

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

  // Use user-specific progress key
  const progressKey = currentUser ? `quiz-progress-${currentUser.id}` : 'quiz-progress';
  const [userProgress, setUserProgress] = useKV<UserProgress>(progressKey, {});

  // Initialize progress for all topics when user changes
  useEffect(() => {
    if (!currentUser) return;
    
    setUserProgress((currentProgress) => {
      const updatedProgress = { ...currentProgress };
      let hasChanges = false;

      quizTopics.forEach(topic => {
        if (!updatedProgress[topic.id]) {
          updatedProgress[topic.id] = {
            completed: 0,
            total: topic.questionCount,
            bestScore: 0
          };
          hasChanges = true;
        }
      });

      return hasChanges ? updatedProgress : currentProgress;
    });
  }, [currentUser, setUserProgress]);

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
    let questions: QuizQuestion[];
    let topicName: string;

    if (topicId === 'random') {
      questions = getRandomQuestions(10);
      topicName = 'Mixed Topics';
    } else {
      questions = getQuestionsByTopic(topicId);
      const topic = quizTopics.find(t => t.id === topicId);
      topicName = topic?.name || 'Unknown Topic';
    }

    if (questions.length === 0) {
      toast.error('No questions available for this topic');
      return;
    }

    setCurrentQuestions(questions);
    setCurrentTopic(topicId);
    setAppState('quiz');
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    setQuizScore(score);
    
    // Update progress
    if (currentTopic !== 'random' && currentUser) {
      setUserProgress((currentProgress) => {
        const updatedProgress = { ...currentProgress };
        const topicProgress = updatedProgress[currentTopic] || {
          completed: 0,
          total: totalQuestions,
          bestScore: 0
        };

        const newScore = Math.round((score / totalQuestions) * 100);
        const questionsAnswered = Math.max(topicProgress.completed, score);

        updatedProgress[currentTopic] = {
          ...topicProgress,
          completed: questionsAnswered,
          bestScore: Math.max(topicProgress.bestScore, newScore),
          lastAttempt: new Date().toISOString()
        };

        return updatedProgress;
      });

      // Update user's overall stats
      const users = JSON.parse(localStorage.getItem('dsa-quiz-users') || '[]');
      const userIndex = users.findIndex((u: UserProfile) => u.id === currentUser.id);
      
      if (userIndex !== -1) {
        const currentBest = userProgress[currentTopic]?.bestScore || 0;
        const newScore = Math.round((score / totalQuestions) * 100);
        
        users[userIndex].totalQuizzes += 1;
        
        // Update best overall score (average of all topic best scores)
        const allScores = Object.values(userProgress).map(p => p.bestScore).filter(s => s > 0);
        allScores.push(newScore);
        users[userIndex].bestOverallScore = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
        
        localStorage.setItem('dsa-quiz-users', JSON.stringify(users));
        setCurrentUser(users[userIndex]);
        
        // Show achievement toast for new best score
        if (newScore > currentBest && newScore >= 80) {
          toast.success(`New best score: ${newScore}%! 🎉`);
        }
      }
    }

    setAppState('results');
  };

  const handleRetakeQuiz = () => {
    handleTopicSelect(currentTopic);
  };

  const handleBackToTopics = () => {
    setAppState('topic-selection');
    setCurrentQuestions([]);
    setCurrentTopic('');
  };

  const handleViewProgress = () => {
    setAppState('progress');
  };

  const handleViewLeaderboard = () => {
    setAppState('leaderboard');
  };

  const handleViewProfile = () => {
    setAppState('profile');
  };

  const getCurrentTopicName = () => {
    if (currentTopic === 'random') return 'Mixed Topics';
    const topic = quizTopics.find(t => t.id === currentTopic);
    return topic?.name || 'Unknown Topic';
  };

  const getPreviousBestScore = () => {
    if (currentTopic === 'random') return 0;
    return userProgress[currentTopic]?.bestScore || 0;
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
          topics={quizTopics}
          onTopicSelect={handleTopicSelect}
          onViewProgress={handleViewProgress}
          onViewLeaderboard={handleViewLeaderboard}
          onViewProfile={handleViewProfile}
          userProgress={userProgress}
          currentUser={currentUser}
        />
      )}

      {appState === 'quiz' && (
        <Quiz
          questions={currentQuestions}
          onComplete={handleQuizComplete}
          onExit={handleBackToTopics}
        />
      )}

      {appState === 'results' && (
        <QuizResults
          score={quizScore}
          totalQuestions={currentQuestions.length}
          topicName={getCurrentTopicName()}
          onRetakeQuiz={handleRetakeQuiz}
          onBackToTopics={handleBackToTopics}
          previousBestScore={getPreviousBestScore()}
        />
      )}

      {appState === 'progress' && (
        <ProgressTracking
          onBack={handleBackToTopics}
          userProgress={userProgress}
        />
      )}

      {appState === 'leaderboard' && currentUser && (
        <Leaderboard
          currentUser={currentUser}
          onBack={handleBackToTopics}
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