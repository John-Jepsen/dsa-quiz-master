/**
 * Advanced analytics dashboard component
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useUserProgress, useQuizAttempts, useUserProfile } from '../hooks/useDatabase';
import type { QuizProgress, QuizAttempt } from '../types';

interface AnalyticsData {
  totalQuizzes: number;
  totalQuestions: number;
  averageScore: number;
  accuracy: number;
  timeSpent: number;
  streakDays: number;
  topicPerformance: TopicPerformance[];
  recentActivity: QuizProgress[];
  performanceTrend: PerformanceTrend[];
  difficultyBreakdown: DifficultyStats;
}

interface TopicPerformance {
  topicId: string;
  topicName: string;
  quizzesTaken: number;
  averageScore: number;
  accuracy: number;
  totalQuestions: number;
  timeSpent: number;
  lastAttempt: Date;
}

interface PerformanceTrend {
  date: string;
  score: number;
  quizzesTaken: number;
}

interface DifficultyStats {
  beginner: { count: number; averageScore: number };
  intermediate: { count: number; averageScore: number };
  advanced: { count: number; averageScore: number };
}

export function AdvancedAnalyticsDashboard() {
  const { progress, loading: progressLoading } = useUserProgress();
  const { attempts, loading: attemptsLoading } = useQuizAttempts();
  const { profile } = useUserProfile();
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const analyticsData = useMemo(() => {
    if (!progress.length && !attempts.length) return null;

    // Filter data by timeframe
    const cutoffDate = new Date();
    switch (timeframe) {
      case '7d':
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(cutoffDate.getDate() - 90);
        break;
      case 'all':
        cutoffDate.setFullYear(2000); // Very old date to include all
        break;
    }

    const filteredProgress = progress.filter(p => 
      new Date(p.completedAt) >= cutoffDate
    );
    const filteredAttempts = attempts.filter(a => 
      new Date(a.timestamp) >= cutoffDate
    );

    // Calculate basic metrics
    const totalQuizzes = filteredProgress.length;
    const totalQuestions = filteredAttempts.length;
    const averageScore = totalQuizzes > 0 
      ? filteredProgress.reduce((sum, p) => sum + p.score, 0) / totalQuizzes 
      : 0;
    const accuracy = totalQuestions > 0
      ? (filteredAttempts.filter(a => a.isCorrect).length / totalQuestions) * 100
      : 0;
    const timeSpent = filteredProgress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Calculate streak
    const quizDates = progress
      .map(p => new Date(p.completedAt).toDateString())
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let streakDays = 0;
    const today = new Date().toDateString();
    
    for (let i = 0; i < quizDates.length; i++) {
      const daysDiff = Math.floor(
        (new Date(today).getTime() - new Date(quizDates[i]).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === i) {
        streakDays++;
      } else {
        break;
      }
    }

    // Topic performance analysis
    const topicMap = new Map<string, {
      progress: QuizProgress[];
      attempts: QuizAttempt[];
    }>();

    filteredProgress.forEach(p => {
      if (!topicMap.has(p.topicId)) {
        topicMap.set(p.topicId, { progress: [], attempts: [] });
      }
      topicMap.get(p.topicId)!.progress.push(p);
    });

    filteredAttempts.forEach(a => {
      // Map attempts to topics based on module
      const topicId = a.moduleId.replace('-basics', ''); // Simple mapping
      if (!topicMap.has(topicId)) {
        topicMap.set(topicId, { progress: [], attempts: [] });
      }
      topicMap.get(topicId)!.attempts.push(a);
    });

    const topicPerformance: TopicPerformance[] = Array.from(topicMap.entries())
      .map(([topicId, data]) => {
        const topicProgress = data.progress;
        const topicAttempts = data.attempts;
        
        return {
          topicId,
          topicName: formatTopicName(topicId),
          quizzesTaken: topicProgress.length,
          averageScore: topicProgress.length > 0
            ? topicProgress.reduce((sum, p) => sum + p.score, 0) / topicProgress.length
            : 0,
          accuracy: topicAttempts.length > 0
            ? (topicAttempts.filter(a => a.isCorrect).length / topicAttempts.length) * 100
            : 0,
          totalQuestions: topicAttempts.length,
          timeSpent: topicProgress.reduce((sum, p) => sum + p.timeSpent, 0),
          lastAttempt: topicProgress.length > 0
            ? new Date(Math.max(...topicProgress.map(p => new Date(p.completedAt).getTime())))
            : new Date(0),
        };
      })
      .filter(topic => topic.quizzesTaken > 0)
      .sort((a, b) => b.lastAttempt.getTime() - a.lastAttempt.getTime());

    // Performance trend (last 30 days)
    const performanceTrend: PerformanceTrend[] = [];
    const trendDays = timeframe === 'all' ? 30 : Math.min(parseInt(timeframe), 30);
    
    for (let i = trendDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayProgress = progress.filter(p => 
        new Date(p.completedAt).toDateString() === date.toDateString()
      );
      
      const dayScore = dayProgress.length > 0
        ? dayProgress.reduce((sum, p) => sum + p.score, 0) / dayProgress.length
        : 0;
      
      performanceTrend.push({
        date: dateStr,
        score: dayScore,
        quizzesTaken: dayProgress.length,
      });
    }

    // Difficulty breakdown (simulated based on topic)
    const difficultyBreakdown: DifficultyStats = {
      beginner: { count: 0, averageScore: 0 },
      intermediate: { count: 0, averageScore: 0 },
      advanced: { count: 0, averageScore: 0 },
    };

    filteredProgress.forEach(p => {
      const difficulty = getDifficultyByTopic(p.topicId);
      difficultyBreakdown[difficulty].count++;
      difficultyBreakdown[difficulty].averageScore += p.score;
    });

    Object.keys(difficultyBreakdown).forEach(key => {
      const difficulty = key as keyof DifficultyStats;
      if (difficultyBreakdown[difficulty].count > 0) {
        difficultyBreakdown[difficulty].averageScore /= difficultyBreakdown[difficulty].count;
      }
    });

    const recentActivity = filteredProgress
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 10);

    return {
      totalQuizzes,
      totalQuestions,
      averageScore,
      accuracy,
      timeSpent,
      streakDays,
      topicPerformance,
      recentActivity,
      performanceTrend,
      difficultyBreakdown,
    } as AnalyticsData;
  }, [progress, attempts, timeframe]);

  const formatTopicName = (topicId: string): string => {
    return topicId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getDifficultyByTopic = (topicId: string): keyof DifficultyStats => {
    // Simple mapping - in a real app this would come from topic metadata
    const beginnerTopics = ['arrays', 'strings', 'basic-math'];
    const advancedTopics = ['graphs', 'dynamic-programming', 'advanced-trees'];
    
    if (beginnerTopics.some(t => topicId.includes(t))) return 'beginner';
    if (advancedTopics.some(t => topicId.includes(t))) return 'advanced';
    return 'intermediate';
  };

  const formatTime = (milliseconds: number): string => {
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (progressLoading || attemptsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">Take some quizzes to see your analytics here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as typeof timeframe)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{analyticsData.totalQuizzes}</div>
          <div className="text-sm text-gray-600">Quizzes Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{analyticsData.averageScore.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Average Score</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-purple-600">{analyticsData.accuracy.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">{analyticsData.streakDays}</div>
          <div className="text-sm text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Topic Performance */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Topic Performance</h3>
        </div>
        <div className="p-4">
          {analyticsData.topicPerformance.length === 0 ? (
            <p className="text-gray-500 text-center">No topic data available</p>
          ) : (
            <div className="space-y-3">
              {analyticsData.topicPerformance.map((topic) => (
                <div key={topic.topicId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{topic.topicName}</div>
                    <div className="text-sm text-gray-600">
                      {topic.quizzesTaken} quizzes • {topic.totalQuestions} questions
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">{topic.averageScore.toFixed(1)}%</div>
                    <div className="text-sm text-gray-600">{topic.accuracy.toFixed(1)}% accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Difficulty Breakdown</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(analyticsData.difficultyBreakdown).map(([difficulty, stats]) => (
              <div key={difficulty} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.count}</div>
                <div className="text-sm text-gray-600 capitalize">{difficulty}</div>
                {stats.count > 0 && (
                  <div className="text-sm text-blue-600">{stats.averageScore.toFixed(1)}% avg</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-4">
          {analyticsData.recentActivity.length === 0 ? (
            <p className="text-gray-500 text-center">No recent activity</p>
          ) : (
            <div className="space-y-2">
              {analyticsData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-gray-900">{formatTopicName(activity.topicId)}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(new Date(activity.completedAt))} • {formatTime(activity.timeSpent)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-600">{activity.score}%</div>
                    <div className="text-sm text-gray-600">
                      {activity.correctAnswers}/{activity.totalQuestions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total time spent:</span>
              <span className="font-medium ml-2">{formatTime(analyticsData.timeSpent)}</span>
            </div>
            <div>
              <span className="text-gray-600">Questions answered:</span>
              <span className="font-medium ml-2">{analyticsData.totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}