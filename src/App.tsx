import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { TopicSelection } from '@/components/TopicSelection';
import { Quiz } from '@/components/Quiz';
import { QuizResults } from '@/components/QuizResults';
import { ProgressTracking } from '@/components/ProgressTracking';
import { quizTopics, getQuestionsByTopic, getRandomQuestions, QuizQuestion } from '@/lib/quiz-data';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

type AppState = 'topic-selection' | 'quiz' | 'results' | 'progress';

interface UserProgress {
  [topicId: string]: {
    completed: number;
    total: number;
    bestScore: number;
    lastAttempt?: string;
  };
}

function App() {
  const [appState, setAppState] = useState<AppState>('topic-selection');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [quizScore, setQuizScore] = useState(0);
  const [userProgress, setUserProgress] = useKV<UserProgress>('quiz-progress', {});

  // Initialize progress for all topics
  useEffect(() => {
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
  }, [setUserProgress]);

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
    if (currentTopic !== 'random') {
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

      // Show achievement toast for new best score
      const currentBest = userProgress[currentTopic]?.bestScore || 0;
      const newScore = Math.round((score / totalQuestions) * 100);
      if (newScore > currentBest && newScore >= 80) {
        toast.success(`New best score: ${newScore}%! 🎉`);
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
      {appState === 'topic-selection' && (
        <TopicSelection
          topics={quizTopics}
          onTopicSelect={handleTopicSelect}
          onViewProgress={handleViewProgress}
          userProgress={userProgress}
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

      <Toaster />
    </div>
  );
}

export default App;