/**
 * Database Setup Verification
 * Comprehensive test suite to verify all database functionality
 */

import { database } from '../services/database';
import { migrationService } from '../services/migration';

export async function verifyDatabaseSetup() {
    console.log('🧪 Running comprehensive database verification...');

    const results = {
        passed: 0,
        failed: 0,
        errors: [] as string[]
    };

    const test = async (name: string, testFn: () => Promise<void>) => {
        try {
            console.log(`Testing: ${name}...`);
            await testFn();
            console.log(`✅ ${name} - PASSED`);
            results.passed++;
        } catch (error) {
            console.error(`❌ ${name} - FAILED:`, error);
            results.failed++;
            results.errors.push(`${name}: ${error instanceof Error ? error.message : String(error)}`);
        }
    };

    // Test 1: Database Initialization
    await test('Database Initialization', async () => {
        await database.initialize();
        if (!database) throw new Error('Database not initialized');
    });

    // Test 2: Migration System
    await test('Migration System', async () => {
        const migrationInfo = migrationService.getMigrationInfo();
        if (typeof migrationInfo.isCompleted !== 'boolean') {
            throw new Error('Migration info invalid');
        }
    });

    // Test 3: User Profile Operations
    let testUserId: string;
    await test('Create User Profile', async () => {
        testUserId = await database.createUserProfile({
            username: `test_${Date.now()}`,
            email: 'test@verification.com',
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
        if (!testUserId) throw new Error('Failed to create user');
    });

    await test('Retrieve User Profile', async () => {
        const profile = await database.getUserProfile(testUserId);
        if (!profile || profile.id !== testUserId) {
            throw new Error('Failed to retrieve user profile');
        }
    });

    await test('Update User Profile', async () => {
        await database.updateUserProfile(testUserId, { totalScore: 100 });
        const updated = await database.getUserProfile(testUserId);
        if (!updated || updated.totalScore !== 100) {
            throw new Error('Failed to update user profile');
        }
    });

    // Test 4: Session Management
    let sessionId: string;
    await test('Create Session', async () => {
        sessionId = await database.createSession(testUserId);
        if (!sessionId) throw new Error('Failed to create session');
    });

    await test('Retrieve Active Session', async () => {
        const session = await database.getActiveSession(testUserId);
        if (!session || session.userId !== testUserId) {
            throw new Error('Failed to retrieve active session');
        }
    });

    await test('Update Session Activity', async () => {
        const originalSession = await database.getActiveSession(testUserId);
        await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
        await database.updateSessionActivity(sessionId);
        const updatedSession = await database.getActiveSession(testUserId);

        if (!originalSession || !updatedSession) {
            throw new Error('Session not found');
        }

        if (new Date(updatedSession.lastActive).getTime() <= new Date(originalSession.lastActive).getTime()) {
            throw new Error('Session activity not updated');
        }
    });

    // Test 5: Quiz Progress
    let progressId: string;
    await test('Save Quiz Progress', async () => {
        progressId = await database.saveQuizProgress({
            userId: testUserId,
            moduleId: 'test-module',
            topicId: 'test-topic',
            score: 85,
            totalQuestions: 10,
            correctAnswers: 8,
            timeSpent: 300000,
        });
        if (!progressId) throw new Error('Failed to save progress');
    });

    await test('Retrieve User Progress', async () => {
        const progress = await database.getUserProgress(testUserId);
        if (!progress || progress.length === 0) {
            throw new Error('Failed to retrieve user progress');
        }
    });

    await test('Retrieve Module Progress', async () => {
        const moduleProgress = await database.getModuleProgress(testUserId, 'test-module');
        if (!moduleProgress || moduleProgress.length === 0) {
            throw new Error('Failed to retrieve module progress');
        }
    });

    // Test 6: Quiz Attempts
    await test('Save Quiz Attempt', async () => {
        const attemptId = await database.saveQuizAttempt({
            userId: testUserId,
            moduleId: 'test-module',
            questionId: 'q1',
            userAnswer: 1,
            correctAnswer: 1,
            isCorrect: true,
            timeSpent: 5000,
        });
        if (!attemptId) throw new Error('Failed to save quiz attempt');
    });

    await test('Retrieve User Attempts', async () => {
        const attempts = await database.getUserAttempts(testUserId);
        if (!attempts || attempts.length === 0) {
            throw new Error('Failed to retrieve user attempts');
        }
    });

    // Test 7: Statistics
    await test('Calculate User Stats', async () => {
        const stats = await database.getUserStats(testUserId);
        if (typeof stats.totalQuizzesTaken !== 'number' ||
            typeof stats.averageScore !== 'number') {
            throw new Error('Invalid user stats calculation');
        }
    });

    // Test 8: Data Export
    await test('Export Database', async () => {
        const exportData = await database.exportData();
        if (!exportData.userProfiles || !exportData.quizProgress) {
            throw new Error('Export data incomplete');
        }
    });

    // Test 9: Error Handling
    await test('Error Handling - Invalid User', async () => {
        try {
            await database.getUserProfile('invalid-id');
            // Should not throw, but return null
        } catch (error) {
            throw new Error('Error handling failed for invalid user ID');
        }
    });

    // Summary
    console.log('\n📊 Verification Results:');
    console.log(`✅ Tests Passed: ${results.passed}`);
    console.log(`❌ Tests Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);

    if (results.errors.length > 0) {
        console.log('\n🚨 Errors:');
        results.errors.forEach(error => console.log(`  - ${error}`));
    }

    if (results.failed === 0) {
        console.log('\n🎉 All tests passed! Database is fully functional.');
        return true;
    } else {
        console.log('\n⚠️  Some tests failed. Please check the errors above.');
        return false;
    }
}

// Make available in development
if (process.env.NODE_ENV === 'development') {
    (window as any).verifyDatabase = verifyDatabaseSetup;
    console.log('🔧 Database verification available at: verifyDatabase()');
}
