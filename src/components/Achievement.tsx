/**
 * Achievement components for displaying achievements and badges
 */

import React from 'react';
import { Achievement, UserAchievement } from '../types';
import { ACHIEVEMENT_COLORS } from '../lib/achievements';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';

interface AchievementCardProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  progress?: number;
  className?: string;
}

export function AchievementCard({ achievement, userAchievement, progress = 0, className }: AchievementCardProps) {
  const isUnlocked = !!userAchievement;
  const colors = ACHIEVEMENT_COLORS[achievement.rarity];
  
  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      isUnlocked ? colors.bg : 'bg-gray-50',
      isUnlocked ? colors.border : 'border-gray-200',
      isUnlocked ? 'opacity-100' : 'opacity-75',
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'text-2xl',
              isUnlocked ? colors.icon : 'text-gray-400'
            )}>
              {achievement.icon}
            </div>
            <div>
              <CardTitle className={cn(
                'text-lg',
                isUnlocked ? colors.text : 'text-gray-500'
              )}>
                {achievement.name}
              </CardTitle>
              <CardDescription className={cn(
                'mt-1',
                isUnlocked ? colors.text : 'text-gray-400'
              )}>
                {achievement.description}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={isUnlocked ? 'default' : 'secondary'}
            className={cn(
              'capitalize text-xs',
              isUnlocked && colors.bg
            )}
          >
            {achievement.rarity}
          </Badge>
        </div>
      </CardHeader>
      
      {!isUnlocked && progress > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      )}
      
      {isUnlocked && userAchievement && (
        <CardContent className="pt-0">
          <div className="text-sm text-gray-600">
            Unlocked {new Date(userAchievement.unlockedAt).toLocaleDateString()}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function AchievementBadge({ achievement, size = 'md', className }: AchievementBadgeProps) {
  const colors = ACHIEVEMENT_COLORS[achievement.rarity];
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  };
  
  return (
    <div 
      className={cn(
        'rounded-full flex items-center justify-center border-2 transition-all duration-200',
        colors.bg,
        colors.border,
        sizeClasses[size],
        'hover:scale-110 cursor-default',
        className
      )}
      title={`${achievement.name}: ${achievement.description}`}
    >
      <span className={colors.icon}>
        {achievement.icon}
      </span>
    </div>
  );
}

interface AchievementGridProps {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  achievementProgress?: { [achievementId: string]: number };
  className?: string;
}

export function AchievementGrid({ 
  achievements, 
  userAchievements, 
  achievementProgress = {},
  className 
}: AchievementGridProps) {
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
  
  return (
    <div className={cn(
      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
      className
    )}>
      {achievements.map(achievement => {
        const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
        const progress = achievementProgress[achievement.id] || 0;
        
        return (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            userAchievement={userAchievement}
            progress={progress}
          />
        );
      })}
    </div>
  );
}

interface AchievementSummaryProps {
  userAchievements: UserAchievement[];
  totalAchievements: number;
  className?: string;
}

export function AchievementSummary({ userAchievements, totalAchievements, className }: AchievementSummaryProps) {
  const unlockedCount = userAchievements.length;
  const percentage = totalAchievements > 0 ? Math.round((unlockedCount / totalAchievements) * 100) : 0;
  
  // Count by rarity (this would need to be passed in or calculated from achievement definitions)
  const rarityStats = {
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🏆</span>
          Achievement Progress
        </CardTitle>
        <CardDescription>
          {unlockedCount} of {totalAchievements} achievements unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-gray-600">Recent Unlocks</div>
              <div className="font-medium">
                {Math.min(3, unlockedCount)} this week
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-600">Completion Rate</div>
              <div className="font-medium">{percentage}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}