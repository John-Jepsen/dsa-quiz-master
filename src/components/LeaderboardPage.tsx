/**
 * Leaderboard components for ranking and social features
 */

import React, { useState } from 'react';
import { ArrowLeft, Crown, Medal, Trophy, User, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useLeaderboard } from '../hooks/useDatabase';
import type { LeaderboardEntry } from '../types';
import { cn } from '../lib/utils';

interface LeaderboardPageProps {
  onBack: () => void;
  currentUserId?: string;
}

export function LeaderboardPage({ onBack, currentUserId }: LeaderboardPageProps) {
  const { leaderboard, userRank, loading, error } = useLeaderboard();
  const [selectedTab, setSelectedTab] = useState('global');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-amber-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Trophy className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    if (rank <= 3) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (rank <= 10) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rank <= 25) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 font-semibold';
    if (score >= 75) return 'text-blue-600 font-medium';
    if (score >= 60) return 'text-amber-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl">🏆</div>
          <div className="text-lg text-muted-foreground">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl">⚠️</div>
          <div className="text-lg text-muted-foreground">Failed to load leaderboard</div>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">🏆 Leaderboard</h1>
              <p className="text-muted-foreground mt-1">
                See how you rank against other learners
              </p>
            </div>
          </div>
        </div>

        {/* Your Rank Card */}
        {userRank && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <User className="w-5 h-5" />
                Your Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getRankIcon(userRank)}
                  <div>
                    <div className="font-semibold text-blue-700">Rank #{userRank}</div>
                    <div className="text-sm text-blue-600">Keep learning to climb higher!</div>
                  </div>
                </div>
                <Badge className={cn('px-3 py-1', getRankBadgeColor(userRank))}>
                  Top {Math.ceil((userRank / leaderboard.length) * 100)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-1">
            <TabsTrigger value="global" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Global Rankings
            </TabsTrigger>
            {/* Future: Add topic-specific leaderboards */}
          </TabsList>

          <TabsContent value="global" className="space-y-4">
            {/* Top 3 Podium */}
            {leaderboard.length >= 3 && (
              <Card className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-center text-amber-700">🏆 Top Performers 🏆</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {leaderboard.slice(0, 3).map((entry, index) => (
                      <div key={entry.id} className="text-center">
                        <div className="flex justify-center mb-2">
                          {getRankIcon(index + 1)}
                        </div>
                        <Avatar className="mx-auto mb-2 w-12 h-12">
                          <AvatarFallback>
                            {entry.displayName?.charAt(0) || entry.username.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-semibold text-sm">{entry.displayName || entry.username}</div>
                        <div className={cn('text-sm', getScoreColor(entry.averageScore))}>
                          {entry.averageScore.toFixed(1)}% avg
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.totalQuizzes} quizzes
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Full Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle>Global Rankings</CardTitle>
                <CardDescription>
                  Rankings based on total score and performance across all topics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {leaderboard.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={cn(
                        'flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors',
                        currentUserId === entry.userId && 'bg-blue-50 border-blue-200'
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          {getRankIcon(entry.rank || index + 1)}
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>
                              {entry.displayName?.charAt(0) || entry.username.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {entry.displayName || entry.username}
                            </span>
                            {currentUserId === entry.userId && (
                              <Badge variant="secondary" className="text-xs">You</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {entry.completedModules} modules completed • {entry.achievementCount} achievements
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-1">
                        <div className={cn('font-semibold', getScoreColor(entry.averageScore))}>
                          {entry.averageScore.toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {entry.totalQuizzes} quizzes
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.totalScore} total pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {leaderboard.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  Leaderboard Coming Soon
                </h3>
                <p className="text-muted-foreground">
                  Complete some quizzes to see rankings appear here!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Stats */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{leaderboard.length}</div>
                <div className="text-sm text-muted-foreground">Active Learners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {leaderboard.reduce((sum, entry) => sum + entry.totalQuizzes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Quizzes Taken</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {leaderboard.reduce((sum, entry) => sum + entry.completedModules, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Modules Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {leaderboard.length > 0 
                    ? (leaderboard.reduce((sum, entry) => sum + entry.averageScore, 0) / leaderboard.length).toFixed(1)
                    : '0'}%
                </div>
                <div className="text-sm text-muted-foreground">Community Average</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}