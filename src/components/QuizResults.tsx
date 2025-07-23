import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, TrendingUp, RotateCcw, Home } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  topicName: string;
  onRetakeQuiz: () => void;
  onBackToTopics: () => void;
  previousBestScore?: number;
}

export function QuizResults({
  score,
  totalQuestions,
  topicName,
  onRetakeQuiz,
  onBackToTopics,
  previousBestScore = 0
}: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isNewBest = percentage > previousBestScore;

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', emoji: '🏆' };
    if (percentage >= 80) return { level: 'Great', color: 'text-blue-600', emoji: '🎉' };
    if (percentage >= 70) return { level: 'Good', color: 'text-yellow-600', emoji: '👍' };
    if (percentage >= 60) return { level: 'Fair', color: 'text-orange-600', emoji: '📚' };
    return { level: 'Needs Work', color: 'text-red-600', emoji: '💪' };
  };

  const performance = getPerformanceLevel(percentage);

  const getMotivationalMessage = (percentage: number, isNewBest: boolean) => {
    if (isNewBest && percentage >= 90) return "Outstanding! You've mastered this topic! 🌟";
    if (isNewBest && percentage >= 80) return "Excellent improvement! You're really getting the hang of this! 🚀";
    if (isNewBest) return "Great progress! You're improving with each attempt! 📈";
    if (percentage >= 90) return "Perfect performance! You've got this topic down! ✨";
    if (percentage >= 80) return "Great work! You have a solid understanding! 💪";
    if (percentage >= 70) return "Good job! Keep practicing to improve further! 📖";
    if (percentage >= 60) return "You're on the right track! Review the explanations and try again! 🎯";
    return "Don't give up! Learning takes time. Review the concepts and keep trying! 🌱";
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center">
          <CardHeader className="pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-6xl mb-4"
            >
              {performance.emoji}
            </motion.div>
            <CardTitle className="text-3xl mb-2">Quiz Complete!</CardTitle>
            <p className="text-muted-foreground">
              {topicName === 'random' ? 'Mixed Topics Quiz' : `${topicName} Quiz`}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <div className="text-center space-y-2">
                <div className="text-5xl font-bold text-primary">{percentage}%</div>
                <div className="text-lg text-muted-foreground">
                  {score} out of {totalQuestions} correct
                </div>
                <Badge
                  className={`${performance.color} bg-transparent border-current text-lg px-4 py-1`}
                  variant="outline"
                >
                  {performance.level}
                </Badge>
              </div>

              <Progress value={percentage} className="w-full h-3" />

              {isNewBest && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2 p-3 bg-accent/10 rounded-lg border border-accent/20"
                >
                  <Trophy size={20} className="text-accent" />
                  <span className="text-accent font-medium">New Best Score!</span>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-4 bg-muted/50 rounded-lg"
              >
                <p className="text-sm leading-relaxed">
                  {getMotivationalMessage(percentage, isNewBest)}
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid gap-4 pt-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-card rounded-lg border">
                  <Target size={20} className="mx-auto mb-1 text-primary" />
                  <div className="text-sm font-medium">Accuracy</div>
                  <div className="text-lg font-bold">{percentage}%</div>
                </div>
                <div className="text-center p-3 bg-card rounded-lg border">
                  <TrendingUp size={20} className="mx-auto mb-1 text-accent" />
                  <div className="text-sm font-medium">Best Score</div>
                  <div className="text-lg font-bold">{Math.max(percentage, previousBestScore)}%</div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={onRetakeQuiz} variant="outline" className="flex-1">
                  <RotateCcw size={16} className="mr-2" />
                  Retake Quiz
                </Button>
                <Button onClick={onBackToTopics} className="flex-1">
                  <Home size={16} className="mr-2" />
                  All Topics
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}