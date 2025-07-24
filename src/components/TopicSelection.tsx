import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, TrendingUp, Award, BarChart3, Trophy, User, Clock } from 'lucide-react';
import { enhancedQuizTopics, getTopicProgress } from '@/lib/quiz-modules';
import { UserProfile } from './UserAuth';
import { motion } from 'framer-motion';

interface TopicSelectionProps {
  onTopicSelect: (topicId: string) => void;
  onViewProgress: () => void;
  onViewLeaderboard: () => void;
  onViewProfile: () => void;
  currentUser: UserProfile;
  completedModules: string[]; // Array of completed module IDs
  moduleScores: Record<string, number>; // moduleId -> best score
}

export function TopicSelection({
  onTopicSelect,
  onViewProgress,
  onViewLeaderboard,
  onViewProfile,
  currentUser,
  completedModules,
  moduleScores
}: TopicSelectionProps) {
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
    const allTopics = enhancedQuizTopics;
    let totalCompleted = 0;
    let totalModules = 0;

    allTopics.forEach(topic => {
      const progress = getTopicProgress(topic.id, completedModules);
      totalCompleted += progress.completed;
      totalModules += progress.total;
    });

    return totalModules > 0 ? (totalCompleted / totalModules) * 100 : 0;
  };

  const getOverallScore = () => {
    const scores = Object.values(moduleScores).filter(score => score > 0);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  };

  const getTotalQuestions = () => {
    return enhancedQuizTopics.reduce((sum, topic) => sum + topic.totalQuestions, 0);
  };

  const getCompletedQuestions = () => {
    return enhancedQuizTopics.reduce((sum, topic) => {
      const completedInTopic = topic.modules
        .filter(module => completedModules.includes(module.id))
        .reduce((moduleSum, module) => moduleSum + module.questionCount, 0);
      return sum + completedInTopic;
    }, 0);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* User Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {getInitials(currentUser.displayName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Welcome back, {currentUser.displayName}!</h2>
            <p className="text-muted-foreground">Ready to level up your DSA skills?</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onViewProfile}>
            <User size={16} className="mr-2" />
            Profile
          </Button>
          <Button variant="outline" size="sm" onClick={onViewLeaderboard}>
            <Trophy size={16} className="mr-2" />
            Leaderboard
          </Button>
          <Button variant="outline" size="sm" onClick={onViewProgress}>
            <BarChart3 size={16} className="mr-2" />
            Progress
          </Button>
        </div>
      </motion.div>

      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-foreground"
        >
          DSA Quiz Master
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Master Data Structures and Algorithms through interactive quizzes with detailed explanations and progress tracking.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen size={24} className="text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{enhancedQuizTopics.length}</div>
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
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enhancedQuizTopics.map((topic, index) => {
          const progress = getTopicProgress(topic.id, completedModules);
          const completionRate = progress.percentage;
          const topicScores = topic.modules
            .map(module => moduleScores[module.id])
            .filter(score => score !== undefined && score > 0);
          const avgScore = topicScores.length > 0
            ? topicScores.reduce((sum, score) => sum + score, 0) / topicScores.length
            : 0;

          return (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
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
                            {topic.modules.length} modules
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {topic.totalQuestions} questions
                          </Badge>
                          {avgScore > 0 && (
                            <Badge className="text-xs bg-success/10 text-success">
                              Avg: {avgScore.toFixed(0)}%
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
                      <span>{progress.completed}/{progress.total} modules</span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock size={12} />
                    <span>
                      ~{topic.modules.reduce((sum, m) => sum + m.estimatedTime, 0)} min total
                    </span>
                  </div>

                  <Button
                    onClick={() => onTopicSelect(topic.id)}
                    className="w-full"
                    variant={completionRate === 100 ? "outline" : "default"}
                  >
                    {completionRate === 100 ? 'Review Modules' : progress.completed > 0 ? 'Continue Learning' : 'Start Learning'}
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
        transition={{ delay: 0.9 }}
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