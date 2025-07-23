import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, TrendingUp, Award, ChartBar } from '@phosphor-icons/react';
import { QuizTopic, getQuestionsByTopic } from '@/lib/quiz-data';
import { motion } from 'framer-motion';

interface TopicSelectionProps {
  topics: QuizTopic[];
  onTopicSelect: (topicId: string) => void;
  onViewProgress: () => void;
  userProgress: Record<string, { completed: number; total: number; bestScore: number }>;
}

export function TopicSelection({ topics, onTopicSelect, onViewProgress, userProgress }: TopicSelectionProps) {
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      'squares-2x2': '⊞',
      'link': '🔗',
      'queue-list': '📋',
      'folder-tree': '🌳',
      'chart-scatter': '📊',
      'bars-arrow-up': '📈'
    };
    return iconMap[iconName] || '📚';
  };

  const getTotalProgress = () => {
    const totalCompleted = Object.values(userProgress).reduce((sum, progress) => sum + progress.completed, 0);
    const totalQuestions = Object.values(userProgress).reduce((sum, progress) => sum + progress.total, 0);
    return totalQuestions > 0 ? (totalCompleted / totalQuestions) * 100 : 0;
  };

  const getOverallScore = () => {
    const scores = Object.values(userProgress).filter(p => p.bestScore > 0);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, p) => sum + p.bestScore, 0) / scores.length;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-foreground"
        >
          DSA Quiz Master
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Master Data Structures and Algorithms through interactive quizzes with detailed explanations and progress tracking.
        </motion.p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{topics.length}</div>
                <div className="text-sm text-muted-foreground">Topics Available</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp size={24} className="text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">{getTotalProgress().toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Award size={24} className="text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{getOverallScore().toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Choose a Topic</h2>
        <Button variant="outline" onClick={onViewProgress}>
          <ChartBar size={16} className="mr-2" />
          View Progress
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => {
          const progress = userProgress[topic.id] || { completed: 0, total: topic.questionCount, bestScore: 0 };
          const completionRate = progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;
          
          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl p-2 bg-card rounded-lg group-hover:scale-110 transition-transform">
                        {getIconComponent(topic.icon)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{topic.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {topic.questionCount} questions
                          </Badge>
                          {progress.bestScore > 0 && (
                            <Badge className="text-xs bg-success/10 text-success">
                              Best: {progress.bestScore}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {topic.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{progress.completed}/{progress.total}</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>

                  <Button 
                    onClick={() => onTopicSelect(topic.id)}
                    className="w-full"
                    variant={completionRate === 100 ? "outline" : "default"}
                  >
                    {completionRate === 100 ? 'Review Topic' : 'Start Quiz'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-8"
      >
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => onTopicSelect('random')}
          className="px-8"
        >
          🎲 Random Quiz (Mixed Topics)
        </Button>
      </motion.div>
    </div>
  );
}