import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Target, BookOpen, Calendar } from 'lucide-react';
import { quizTopics } from '@/lib/quiz-data';
import { motion } from 'framer-motion';

interface ProgressTrackingProps {
  onBack: () => void;
  userProgress: Record<string, {
    completed: number;
    total: number;
    bestScore: number;
    lastAttempt?: string;
  }>;
}

export function ProgressTracking({ onBack, userProgress }: ProgressTrackingProps) {
  const getTotalStats = () => {
    const totalCompleted = Object.values(userProgress).reduce((sum, progress) => sum + progress.completed, 0);
    const totalQuestions = Object.values(userProgress).reduce((sum, progress) => sum + progress.total, 0);
    const completedTopics = Object.values(userProgress).filter(p => p.completed === p.total).length;
    const averageScore = Object.values(userProgress).filter(p => p.bestScore > 0);
    const avgScore = averageScore.length > 0
      ? averageScore.reduce((sum, p) => sum + p.bestScore, 0) / averageScore.length
      : 0;

    return {
      totalCompleted,
      totalQuestions,
      completedTopics,
      averageScore: avgScore,
      overallProgress: totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0
    };
  };

  const stats = getTotalStats();

  const getTopicIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      'squares-2x2': '⊞',
      'link': '🔗',
      'queue-list': '📋',
      'folder-tree': '🌳',
      'chart-scatter': '📊',
      'bars-arrow-up': '📈'
    };
    return iconMap[iconName] || '📚';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Topics
        </Button>
        <h1 className="text-3xl font-bold">Your Progress</h1>
      </div>

      {/* Overall Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalCompleted}</div>
                <div className="text-sm text-muted-foreground">Questions Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Target size={24} className="text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.overallProgress.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Trophy size={24} className="text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.averageScore.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.completedTopics}</div>
                <div className="text-sm text-muted-foreground">Topics Mastered</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Topic Progress */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Topic Breakdown</h2>
        <div className="grid gap-4">
          {quizTopics.map((topic, index) => {
            const progress = userProgress[topic.id] || {
              completed: 0,
              total: topic.questionCount,
              bestScore: 0
            };
            const completionRate = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
            const isCompleted = progress.completed === progress.total;

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl p-3 bg-card rounded-lg border">
                          {getTopicIcon(topic.icon)}
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{topic.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {topic.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              {progress.completed}/{progress.total} questions
                            </span>
                            {isCompleted && (
                              <Badge className="bg-success/10 text-success text-xs">
                                Complete
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        {progress.bestScore > 0 ? (
                          <Badge
                            className={`${getScoreColor(progress.bestScore)} text-sm px-3 py-1`}
                            variant="outline"
                          >
                            Best: {progress.bestScore}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-sm px-3 py-1">
                            Not Started
                          </Badge>
                        )}

                        {progress.lastAttempt && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={12} />
                            {formatDate(progress.lastAttempt)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{completionRate.toFixed(0)}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievement Section */}
      {stats.completedTopics > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy size={24} className="text-primary" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.completedTopics >= 1 && (
                  <Badge className="bg-blue-100 text-blue-800">First Topic Complete! 🎉</Badge>
                )}
                {stats.completedTopics >= 3 && (
                  <Badge className="bg-green-100 text-green-800">Topic Conqueror! 🏆</Badge>
                )}
                {stats.averageScore >= 80 && (
                  <Badge className="bg-yellow-100 text-yellow-800">High Achiever! ⭐</Badge>
                )}
                {stats.overallProgress >= 50 && (
                  <Badge className="bg-purple-100 text-purple-800">Halfway There! 🚀</Badge>
                )}
                {stats.overallProgress >= 100 && (
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    Quiz Master! 👑
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}