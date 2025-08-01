/**
 * Example API endpoint for progress submission
 * This shows how to handle the progress data on a backend server
 */

// Example Express.js endpoint (Node.js)
/*
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Progress submission endpoint
app.post('/api/progress/submit', async (req, res) => {
  try {
    const progressData = req.body;
    
    // Validate the request
    if (!progressData.userId || !progressData.userProfile) {
      return res.status(400).json({
        success: false,
        message: 'Invalid progress data',
        errors: ['userId and userProfile are required']
      });
    }

    // Store in database (example with MongoDB/Mongoose)
    const progressRecord = new ProgressRecord({
      userId: progressData.userId,
      submissionId: progressData.metadata.submissionId,
      timestamp: new Date(progressData.timestamp),
      userProfile: progressData.userProfile,
      quizProgress: progressData.quizProgress,
      quizAttempts: progressData.quizAttempts,
      userSessions: progressData.userSessions,
      metadata: progressData.metadata
    });

    await progressRecord.save();

    // Update user statistics
    await UserStats.updateOne(
      { userId: progressData.userId },
      {
        $set: {
          lastSubmission: new Date(),
          totalQuizzes: progressData.quizProgress.length,
          totalAttempts: progressData.quizAttempts.length,
          averageScore: calculateAverageScore(progressData.quizProgress),
          lastActiveDate: new Date(progressData.userProfile.stats.lastQuizDate)
        }
      },
      { upsert: true }
    );

    res.json({
      success: true,
      submissionId: progressData.metadata.submissionId,
      message: 'Progress submitted successfully',
      recordId: progressRecord._id
    });

  } catch (error) {
    console.error('Progress submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      errors: [error.message]
    });
  }
});

// Get submission history endpoint
app.get('/api/progress/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, offset = 0 } = req.query;

    const history = await ProgressRecord.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .select('submissionId timestamp metadata.totalDataSize quizProgress.length quizAttempts.length');

    const totalCount = await ProgressRecord.countDocuments({ userId });

    res.json({
      success: true,
      data: history,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
      }
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history',
      errors: [error.message]
    });
  }
});

// Helper function
function calculateAverageScore(quizProgress) {
  if (quizProgress.length === 0) return 0;
  const totalScore = quizProgress.reduce((sum, quiz) => sum + quiz.score, 0);
  return Math.round(totalScore / quizProgress.length);
}

app.listen(3001, () => {
  console.log('Progress API running on port 3001');
});
*/

// Example Django REST Framework endpoint (Python)
/*
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import ProgressRecord, UserStats
from .serializers import ProgressSubmissionSerializer
import json

@api_view(['POST'])
def submit_progress(request):
    try:
        serializer = ProgressSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                'success': False,
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        progress_data = serializer.validated_data
        
        # Create progress record
        progress_record = ProgressRecord.objects.create(
            user_id=progress_data['userId'],
            submission_id=progress_data['metadata']['submissionId'],
            timestamp=progress_data['timestamp'],
            user_profile=progress_data['userProfile'],
            quiz_progress=progress_data['quizProgress'],
            quiz_attempts=progress_data['quizAttempts'],
            user_sessions=progress_data['userSessions'],
            metadata=progress_data['metadata']
        )

        # Update user stats
        user_stats, created = UserStats.objects.get_or_create(
            user_id=progress_data['userId'],
            defaults={
                'total_quizzes': len(progress_data['quizProgress']),
                'total_attempts': len(progress_data['quizAttempts']),
                'last_submission': timezone.now()
            }
        )

        if not created:
            user_stats.total_quizzes = len(progress_data['quizProgress'])
            user_stats.total_attempts = len(progress_data['quizAttempts'])
            user_stats.last_submission = timezone.now()
            user_stats.save()

        return Response({
            'success': True,
            'submissionId': progress_data['metadata']['submissionId'],
            'message': 'Progress submitted successfully',
            'recordId': str(progress_record.id)
        })

    except Exception as e:
        return Response({
            'success': False,
            'message': 'Internal server error',
            'errors': [str(e)]
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
*/

// Database Schema Examples

// MongoDB Schema (Mongoose)
/*
const progressRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  submissionId: { type: String, required: true, unique: true },
  timestamp: { type: Date, required: true },
  userProfile: {
    id: String,
    username: String,
    email: String,
    displayName: String,
    createdAt: Date,
    totalScore: Number,
    completedModules: [String],
    achievements: [String],
    stats: {
      totalQuizzesTaken: Number,
      totalTimeSpent: Number,
      averageScore: Number,
      streakDays: Number,
      lastQuizDate: Date
    }
  },
  quizProgress: [{
    id: String,
    userId: String,
    moduleId: String,
    topicId: String,
    score: Number,
    totalQuestions: Number,
    correctAnswers: Number,
    completedAt: Date,
    timeSpent: Number
  }],
  quizAttempts: [{
    id: String,
    userId: String,
    moduleId: String,
    questionId: String,
    userAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number,
    timestamp: Date
  }],
  userSessions: [{
    id: String,
    userId: String,
    createdAt: Date,
    lastActive: Date,
    preferences: {
      theme: String,
      difficulty: String,
      soundEnabled: Boolean
    }
  }],
  metadata: {
    appVersion: String,
    submissionId: String,
    totalDataSize: Number
  }
}, {
  timestamps: true
});

const ProgressRecord = mongoose.model('ProgressRecord', progressRecordSchema);
*/

// PostgreSQL Schema (SQL)
/*
CREATE TABLE progress_records (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    submission_id VARCHAR(255) UNIQUE NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    user_profile JSONB NOT NULL,
    quiz_progress JSONB NOT NULL,
    quiz_attempts JSONB NOT NULL,
    user_sessions JSONB NOT NULL,
    metadata JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_records_user_id ON progress_records(user_id);
CREATE INDEX idx_progress_records_timestamp ON progress_records(timestamp);
CREATE INDEX idx_progress_records_submission_id ON progress_records(submission_id);

CREATE TABLE user_stats (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    total_quizzes INTEGER DEFAULT 0,
    total_attempts INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    last_submission TIMESTAMP,
    first_submission TIMESTAMP,
    total_submissions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

// Environment Variables (.env)
/*
# API Configuration
VITE_API_URL=https://api.dsaquizmaster.com
API_SECRET_KEY=your-secret-key-here
DATABASE_URL=your-database-connection-string

# CORS Configuration
ALLOWED_ORIGINS=https://dsaquizmaster.com,https://www.dsaquizmaster.com,http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # 100 requests per window

# Data Limits
MAX_SUBMISSION_SIZE_MB=5
MAX_SUBMISSIONS_PER_DAY=50
*/

console.log('📚 Example API implementations are documented in this file');
console.log('🔧 Configure your backend using the examples above');
console.log('🌐 Set VITE_API_URL environment variable to your API endpoint');
