/**
 * Simple test to verify database functionality
 * Run this in browser console in development mode
 */

// Test database initialization and basic operations
export async function testDatabase() {
  console.log('🧪 Testing database implementation...');
  
  try {
    const { database } = await import('./database');
    const { migrationService } = await import('./migration');
    
    // Test 1: Initialize database
    console.log('1. Initializing database...');
    await database.initialize();
    console.log('✅ Database initialized');
    
    // Test 2: Check migration
    console.log('2. Checking migration...');
    const migrationInfo = migrationService.getMigrationInfo();
    console.log('✅ Migration info:', migrationInfo);
    
    // Test 3: Create test user
    console.log('3. Creating test user...');
    const userId = await database.createUserProfile({
      username: `test_user_${Date.now()}`,
      email: 'test@example.com',
      totalScore: 0,
      completedModules: [],
      achievements: [],
      stats: {
        totalQuizzesTaken: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        streakDays: 0,
      }
    });
    console.log('✅ Test user created:', userId);
    
    // Test 4: Save progress
    console.log('4. Saving test progress...');
    const progressId = await database.saveQuizProgress({
      userId,
      moduleId: 'arrays-basics',
      topicId: 'arrays',
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8,
      timeSpent: 300000, // 5 minutes
    });
    console.log('✅ Progress saved:', progressId);
    
    // Test 5: Retrieve data
    console.log('5. Retrieving user data...');
    const userProfile = await database.getUserProfile(userId);
    const userProgress = await database.getUserProgress(userId);
    console.log('✅ User profile:', userProfile);
    console.log('✅ User progress:', userProgress);
    
    // Test 6: Get stats
    console.log('6. Calculating user stats...');
    const stats = await database.getUserStats(userId);
    console.log('✅ User stats:', stats);
    
    // Test 7: Export data
    console.log('7. Exporting database...');
    const exportData = await database.exportData();
    console.log('✅ Export successful. Total records:', {
      users: exportData.userProfiles.length,
      sessions: exportData.userSessions.length,
      progress: exportData.quizProgress.length,
      attempts: exportData.quizAttempts.length,
    });
    
    console.log('🎉 All tests passed! Database is working correctly.');
    return true;
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

// Expose test function globally in development
if (process.env.NODE_ENV === 'development') {
  (window as any).testDatabase = testDatabase;
  console.log('📋 Database test available at window.testDatabase()');
}