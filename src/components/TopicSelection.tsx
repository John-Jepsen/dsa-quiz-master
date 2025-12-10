import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookOpen, TrendingUp, Award, BarChart3, Trophy, User, Upload, Snowflake, PartyPopper } from 'lucide-react';
import { enhancedQuizTopics, getTopicProgress } from '@/lib/quiz-modules';
import { UserProfile } from '@/types';
import { motion } from 'framer-motion';
import { ProgressSubmission } from './ProgressSubmission';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface TopicSelectionProps {
  onTopicSelect: (topicId: string) => void;
  onViewProgress: () => void;
  onViewProfile: () => void;
  onViewAchievements?: () => void;
  onViewLeaderboard?: () => void;
  onCodePractice?: () => void;
  currentUser: UserProfile | null;
  completedModules: string[];
  moduleScores: Record<string, number>;
}

export function TopicSelection({
  onTopicSelect,
  onViewProgress,
  onViewProfile,
  onViewAchievements,
  onViewLeaderboard,
  onCodePractice,
  currentUser,
  completedModules,
  moduleScores
}: TopicSelectionProps) {
  const [showProgressSubmission, setShowProgressSubmission] = useState(false);
  const [riddleState, setRiddleState] = useState<'idle' | 'hint' | 'answer'>('idle');
  const [firstWord, setFirstWord] = useState<string | null>(null);
  const [secondWord, setSecondWord] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const blizzardActive = puzzleSolved || riddleState === 'answer';

  const wordOptionsOne = ['Binary', 'Bitwise', 'Snowy'];
  const wordOptionsTwo = ['Blizard', 'Breeze', 'Bugstorm'];
  const clues = [
    'It is icy and digital—two words.',
    'Both words start with B.',
    'The weather word is not a breeze.',
    'If you think winter and bits, you’re close.'
  ];
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
              {currentUser ? getInitials(currentUser.displayName || currentUser.username) : 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Welcome back, {currentUser?.displayName || currentUser?.username}!</h2>
            <p className="text-muted-foreground">Ready to level up your DSA skills?</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onViewProgress}>
            <TrendingUp size={16} className="mr-2" />
            Progress
          </Button>
          <Button variant="outline" size="sm" onClick={onViewProfile}>
            <User size={16} className="mr-2" />
            Profile
          </Button>
          {onViewAchievements && (
            <Button variant="outline" size="sm" onClick={onViewAchievements}>
              <Award size={16} className="mr-2" />
              Achievements
            </Button>
          )}
          {onViewLeaderboard && (
            <Button variant="outline" size="sm" onClick={onViewLeaderboard}>
              <Trophy size={16} className="mr-2" />
              Leaderboard
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowProgressSubmission(!showProgressSubmission)}
          >
            <Upload size={16} className="mr-2" />
            Submit Progress
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`relative overflow-hidden rounded-lg border p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3 ${
          blizzardActive
            ? 'border-sky-300/80 bg-gradient-to-br from-slate-900 via-sky-900/80 to-cyan-800/80 shadow-2xl shadow-sky-500/30 ring-2 ring-cyan-300/60'
            : 'bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 shadow-sm'
        }`}
      >
        {blizzardActive && (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_40%)]" />
          </>
        )}

        <div className="relative z-10 flex items-start gap-3">
          <div
            className={`p-2 rounded-full ${blizzardActive ? 'bg-white/10 border border-white/20 shadow-lg' : 'bg-background shadow-inner'}`}
          >
            <Sparkles className={`h-5 w-5 ${blizzardActive ? 'text-white' : 'text-primary'}`} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <p className={`font-semibold ${blizzardActive ? 'text-white' : 'text-foreground'}`}>Holiday coding puzzle</p>
              {blizzardActive && (
                <motion.span
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-2 py-1 text-[10px] uppercase tracking-[0.28em] rounded-full bg-white/15 text-white border border-white/25 shadow"
                >
                  Binary Blizard
                </motion.span>
              )}
            </div>
            <p className={`text-sm ${blizzardActive ? 'text-white/80' : 'text-muted-foreground'}`}>
              What do snowbound coders call a storm of 1s and 0s? Pick the two words to name it.
            </p>

            {blizzardActive && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="mt-1 flex items-center gap-3 rounded-lg border border-white/20 bg-white/10 px-3 py-2 shadow-lg backdrop-blur"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 border border-white/30 text-white">
                  <Snowflake className="h-6 w-6" />
                </div>
                <div className="space-y-0.5 text-white">
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/80">Binary Blizard</p>
                  <p className="text-lg font-extrabold leading-tight">Blizzard unleashed</p>
                  <p className="text-xs text-white/80">A storm of 1s and 0s just swept the quiz.</p>
                </div>
                <PartyPopper className="h-8 w-8 text-white drop-shadow" />
              </motion.div>
            )}

            <p className={`text-xs mt-1 ${blizzardActive ? 'text-white/80' : 'text-muted-foreground'}`}>
              Attempts: {attempts} / 5 before reveal unlocks
            </p>
            {feedback && (
              <p
                className={`text-xs mt-1 ${
                  blizzardActive
                    ? 'px-3 py-2 rounded-md bg-white/10 text-white shadow border border-white/15'
                    : 'text-muted-foreground'
                }`}
              >
                {feedback}
              </p>
            )}
          </div>
        </div>
        <div className="relative z-10 flex flex-col gap-3 w-full">
          <div className="flex flex-col gap-2">
            <p className={`text-sm font-medium ${blizzardActive ? 'text-white' : 'text-foreground'}`}>Pick word 1</p>
            <div className="flex flex-wrap gap-2">
              {wordOptionsOne.map((word) => (
                <Button
                  key={word}
                  variant={firstWord === word ? 'default' : 'outline'}
                  onClick={() => {
                    const nextWord = firstWord === word ? null : word;
                    setFirstWord(nextWord);
                    setFeedback(null);
                    setPuzzleSolved(false);
                    if (riddleState !== 'idle') setRiddleState('idle');
                  }}
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className={`text-sm font-medium ${blizzardActive ? 'text-white' : 'text-foreground'}`}>Pick word 2</p>
            <div className="flex flex-wrap gap-2">
              {wordOptionsTwo.map((word) => (
                <Button
                  key={word}
                  variant={secondWord === word ? 'default' : 'outline'}
                  onClick={() => {
                    const nextWord = secondWord === word ? null : word;
                    setSecondWord(nextWord);
                    setFeedback(null);
                    setPuzzleSolved(false);
                    if (riddleState !== 'idle') setRiddleState('idle');
                  }}
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {puzzleSolved ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full md:w-auto overflow-hidden px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-400 text-white font-extrabold uppercase tracking-wide shadow-xl flex items-center gap-3 ring-2 ring-white/30"
              >
                <Snowflake className="h-6 w-6 drop-shadow" />
                <span className="text-sm">Binary Blizard</span>
                <span className="text-lg">Unleashed!</span>
              </motion.div>
            ) : (
              <Button
                variant="default"
                onClick={() => {
                  if (!firstWord || !secondWord) {
                    setFeedback('Pick both words first.');
                    return;
                  }
                  const nextAttempts = attempts + 1;
                  setAttempts(nextAttempts);

                  const normalized = `${firstWord} ${secondWord}`.toLowerCase();
                  const isCorrect = normalized === 'binary blizard' || normalized === 'binary blizzard';
                  if (isCorrect) {
                    setPuzzleSolved(true);
                    setRiddleState('answer');
                    setFeedback('Binary Blizard unleashed! ❄️🎉');
                  } else {
                    const clueIndex = Math.min(nextAttempts - 1, clues.length - 1);
                    const clue = clues[clueIndex];
                    const remaining = Math.max(0, 5 - nextAttempts);
                    const extra = remaining > 0 ? ` ${remaining} more before reveal unlocks.` : ' You can reveal now.';
                    setFeedback(`Close. ${clue}${extra}`);
                    setRiddleState('hint');
                  }
                }}
              >
                Unleash the blizzard
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setFirstWord(null);
                setSecondWord(null);
                setFeedback(null);
                setPuzzleSolved(false);
                setRiddleState('idle');
                setAttempts(0);
              }}
            >
              Reset
            </Button>
            <Button
              size="sm"
              variant={riddleState === 'answer' ? 'outline' : 'default'}
              disabled={!puzzleSolved && attempts < 5}
              onClick={() => {
                if (puzzleSolved || attempts >= 5) {
                  setPuzzleSolved(true);
                  setRiddleState('answer');
                  setFeedback('Revealed: Binary Blizard — the storm is official. ❄️');
                } else {
                  setFeedback(`Make ${5 - attempts} more attempt(s) before revealing.`);
                }
              }}
            >
              {riddleState === 'answer' ? 'Solved!' : attempts < 5 ? 'Reveal after 5 attempts' : 'Reveal answer'}
            </Button>
          </div>
        </div>
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
                    <BookOpen size={12} />
                    <span>
                      {topic.modules.length} modules
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
        className="text-center pt-8 space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onTopicSelect('random')}
            className="px-8"
          >
            🎲 Random Quiz (Mixed Topics)
          </Button>
          {onCodePractice && (
            <Button
              variant="default"
              size="lg"
              onClick={onCodePractice}
              className="px-8"
            >
              💻 Code Practice (Hands-on)
            </Button>
          )}
        </div>
      </motion.div>

      {/* Progress Submission Modal/Section */}
      {showProgressSubmission && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex justify-center"
        >
          <ProgressSubmission
            onSubmissionComplete={(response) => {
              if (response.success) {
                setShowProgressSubmission(false);
              }
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
