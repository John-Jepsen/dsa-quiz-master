/**
 * Achievements page component
 * Displays all achievements with filters and progress tracking
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Award, Crown, Star, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AchievementGrid, AchievementSummary } from './Achievement';
import { useAchievements } from '../hooks/useDatabase';
import { achievementService } from '../services/achievement-service';
import { getAchievementsByCategory, getAchievementsByRarity } from '../lib/achievements';
import type { Achievement } from '../types';

interface AchievementsPageProps {
  onBack: () => void;
}

export function AchievementsPage({ onBack }: AchievementsPageProps) {
  const { 
    achievements, 
    userAchievements, 
    loading, 
    error,
    getUnlockedAchievements,
    getLockedAchievements
  } = useAchievements();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [achievementProgress, setAchievementProgress] = useState<{ [id: string]: number }>({});

  // Load achievement progress for locked achievements
  useEffect(() => {
    const loadProgress = async () => {
      if (!userAchievements.length || !achievements.length) return;

      const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
      const lockedAchievements = achievements.filter(a => !unlockedIds.has(a.id));
      
      const progress: { [id: string]: number } = {};
      
      // Note: This would need the current user ID, we'll mock it for now
      // In a real implementation, you'd get this from the current user context
      const userId = 'current-user-id'; // This should come from user context
      
      for (const achievement of lockedAchievements) {
        try {
          const progressValue = await achievementService.getAchievementProgress(userId, achievement.id);
          progress[achievement.id] = progressValue;
        } catch (error) {
          console.error('Error loading progress for achievement:', achievement.id, error);
          progress[achievement.id] = 0;
        }
      }
      
      setAchievementProgress(progress);
    };

    loadProgress();
  }, [achievements, userAchievements]);

  const filterAchievements = (achievementList: Achievement[]): Achievement[] => {
    let filtered = achievementList;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    if (selectedRarity !== 'all') {
      filtered = filtered.filter(a => a.rarity === selectedRarity);
    }

    return filtered;
  };

  const unlockedAchievements = getUnlockedAchievements();
  const lockedAchievements = getLockedAchievements();

  const filteredUnlocked = filterAchievements(unlockedAchievements);
  const filteredLocked = filterAchievements(lockedAchievements);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'progress': return <Target className="w-4 h-4" />;
      case 'performance': return <Star className="w-4 h-4" />;
      case 'mastery': return <Crown className="w-4 h-4" />;
      case 'streak': return <Award className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl">🏆</div>
          <div className="text-lg text-muted-foreground">Loading achievements...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl">⚠️</div>
          <div className="text-lg text-muted-foreground">Failed to load achievements</div>
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
              <h1 className="text-3xl font-bold text-foreground">🏆 Achievements</h1>
              <p className="text-muted-foreground mt-1">
                Track your progress and unlock rewards
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <AchievementSummary
            userAchievements={userAchievements}
            totalAchievements={achievements.length}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="progress">
                <div className="flex items-center gap-2">
                  {getCategoryIcon('progress')}
                  Progress
                </div>
              </SelectItem>
              <SelectItem value="performance">
                <div className="flex items-center gap-2">
                  {getCategoryIcon('performance')}
                  Performance
                </div>
              </SelectItem>
              <SelectItem value="mastery">
                <div className="flex items-center gap-2">
                  {getCategoryIcon('mastery')}
                  Mastery
                </div>
              </SelectItem>
              <SelectItem value="streak">
                <div className="flex items-center gap-2">
                  {getCategoryIcon('streak')}
                  Streak
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRarity} onValueChange={setSelectedRarity}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="common">⭐ Common</SelectItem>
              <SelectItem value="rare">💎 Rare</SelectItem>
              <SelectItem value="epic">🏆 Epic</SelectItem>
              <SelectItem value="legendary">👑 Legendary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Achievement Tabs */}
        <Tabs defaultValue="unlocked" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="unlocked" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Unlocked ({filteredUnlocked.length})
            </TabsTrigger>
            <TabsTrigger value="locked" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Available ({filteredLocked.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="unlocked" className="space-y-6">
            {filteredUnlocked.length > 0 ? (
              <AchievementGrid
                achievements={filteredUnlocked}
                userAchievements={userAchievements}
                achievementProgress={achievementProgress}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No unlocked achievements
                </h3>
                <p className="text-muted-foreground">
                  {selectedCategory !== 'all' || selectedRarity !== 'all'
                    ? 'Try adjusting your filters or complete more quizzes to unlock achievements.'
                    : 'Complete your first quiz to start earning achievements!'}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="locked" className="space-y-6">
            {filteredLocked.length > 0 ? (
              <AchievementGrid
                achievements={filteredLocked}
                userAchievements={userAchievements}
                achievementProgress={achievementProgress}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  All achievements unlocked!
                </h3>
                <p className="text-muted-foreground">
                  Congratulations! You've unlocked all available achievements in this category.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}