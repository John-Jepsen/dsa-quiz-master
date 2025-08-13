import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trophy, Medal, Crown, Share, Download, Upload, Copy } from 'lucide-react';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

interface LeaderboardProps {
  currentUser: UserProfile;
  onBack: () => void;
}

interface UserStats extends UserProfile {
  totalQuizzes: number;
  bestOverallScore: number;
  topicProgress: Record<string, {
    completed: number;
    total: number;
    bestScore: number;
    lastAttempt?: string;
  }>;
}

export function Leaderboard({ currentUser, onBack }: LeaderboardProps) {
  const [allUsers, setAllUsers] = useState<UserStats[]>([]);
  const [importData, setImportData] = useState('');
  const [exportData, setExportData] = useState('');

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = () => {
    try {
      const users = JSON.parse(localStorage.getItem('dsa-quiz-users') || '[]');
      const usersWithStats: UserStats[] = users.map((user: UserProfile) => {
        const progressKey = `quiz-progress-${user.id}`;
        const topicProgress = JSON.parse(localStorage.getItem(progressKey) || '{}');

        // Calculate overall stats
        let totalQuizzes = 0;
        let totalScore = 0;
        let completedTopics = 0;

        Object.values(topicProgress).forEach((progress: any) => {
          if (progress.bestScore > 0) {
            totalQuizzes++;
            totalScore += progress.bestScore;
            if (progress.bestScore >= 70) completedTopics++;
          }
        });

        return {
          ...user,
          topicProgress,
          totalQuizzes,
          bestOverallScore: totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0
        };
      });

      // Sort by best overall score, then by total quizzes
      usersWithStats.sort((a, b) => {
        if (b.bestOverallScore !== a.bestOverallScore) {
          return b.bestOverallScore - a.bestOverallScore;
        }
        return b.totalQuizzes - a.totalQuizzes;
      });

      setAllUsers(usersWithStats);
    } catch (error) {
      toast.error('Failed to load leaderboard data');
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{index + 1}</span>;
  };

  const generateShareableData = () => {
    const currentUserStats = allUsers.find(u => u.id === currentUser.id);
    if (!currentUserStats) return;

    const shareData = {
      user: {
        displayName: currentUserStats.displayName,
        totalQuizzes: currentUserStats.totalQuizzes,
        bestOverallScore: currentUserStats.bestOverallScore,
        achievements: getAchievements(currentUserStats)
      },
      timestamp: new Date().toISOString(),
      appVersion: '1.0.0'
    };

    setExportData(JSON.stringify(shareData, null, 2));
  };

  const getAchievements = (user: UserStats) => {
    const achievements: string[] = [];

    if (user.bestOverallScore >= 90) achievements.push('Quiz Master');
    if (user.bestOverallScore >= 80) achievements.push('Expert');
    if (user.totalQuizzes >= 20) achievements.push('Dedicated Learner');
    if (user.totalQuizzes >= 10) achievements.push('Quiz Enthusiast');

    // Topic-specific achievements
    const excellentTopics = Object.values(user.topicProgress).filter(p => p.bestScore >= 80).length;
    if (excellentTopics >= 5) achievements.push('Multi-Topic Expert');
    if (excellentTopics >= 3) achievements.push('Well Rounded');

    return achievements;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadData = () => {
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-quiz-results-${currentUser.username}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Results downloaded!');
  };

  const importUserData = () => {
    try {
      const data = JSON.parse(importData);
      if (!data.user || !data.user.displayName) {
        toast.error('Invalid data format');
        return;
      }

      toast.success(`Imported results for ${data.user.displayName}`);
      setImportData('');
    } catch (error) {
      toast.error('Failed to import data. Please check the format.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Leaderboard</h1>
            <p className="text-muted-foreground">See how you stack up against other learners</p>
          </div>
          <Button onClick={onBack} variant="outline">Back to Quiz</Button>
        </div>

        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leaderboard">Rankings</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="share">Share & Import</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-4">
            {allUsers.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No quiz results to display yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">Complete some quizzes to see the leaderboard!</p>
                </CardContent>
              </Card>
            ) : (
              allUsers.map((user, index) => (
                <Card key={user.id} className={user.id === currentUser.id ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      {getRankIcon(index)}
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {user.displayName}
                          {user.id === currentUser.id && <Badge variant="secondary">You</Badge>}
                        </h3>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{user.bestOverallScore}%</div>
                      <div className="text-sm text-muted-foreground">{user.totalQuizzes} quiz{user.totalQuizzes !== 1 ? 'es' : ''}</div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            {allUsers.map(user => user.id === currentUser.id && (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex flex-wrap gap-2">
                      {getAchievements(user).map(achievement => (
                        <Badge key={achievement} variant="secondary" className="text-sm">
                          {achievement}
                        </Badge>
                      ))}
                      {getAchievements(user).length === 0 && (
                        <p className="text-muted-foreground">Complete more quizzes to earn achievements!</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-primary">{user.totalQuizzes}</div>
                        <div className="text-sm text-muted-foreground">Total Quizzes</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-accent">{user.bestOverallScore}%</div>
                        <div className="text-sm text-muted-foreground">Average Score</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="share" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="w-5 h-5" />
                  Share Your Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Generate a shareable summary of your quiz performance to show your friends!
                </p>
                <div className="flex gap-2">
                  <Button onClick={generateShareableData} className="flex items-center gap-2">
                    <Share className="w-4 h-4" />
                    Generate Share Data
                  </Button>
                  {exportData && (
                    <>
                      <Button onClick={downloadData} variant="outline" className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(exportData)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </Button>
                    </>
                  )}
                </div>
                {exportData && (
                  <div className="mt-4">
                    <Textarea
                      value={exportData}
                      readOnly
                      className="font-mono text-xs"
                      rows={8}
                      placeholder="Your shareable data will appear here..."
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Import Friend's Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Paste your friend's quiz results to see their achievements!
                </p>
                <Textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your friend's quiz data here..."
                  rows={6}
                  className="font-mono text-xs"
                />
                <Button onClick={importUserData} disabled={!importData.trim()}>
                  Import Results
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}