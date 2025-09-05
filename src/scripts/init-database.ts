/**
 * Database initialization script
 * This script initializes the database and creates sample data for testing
 */

import { database } from '../services/database';
import { migrationService } from '../services/migration';

export async function initializeDatabase() {
    console.log('🔄 Initializing DSA Quiz Master Database...');

    try {
        // Step 1: Initialize the database
        console.log('1. Setting up IndexedDB...');
        await database.initialize();
        console.log('✅ IndexedDB initialized successfully');

        // Step 2: Check and run migration if needed
        console.log('2. Checking for data migration...');
        const migrationNeeded = await migrationService.checkAndMigrate();
        if (migrationNeeded) {
            console.log('✅ Data migration completed');
        } else {
            console.log('✅ No migration needed');
        }

        // Step 3: Create a sample user if none exists
        console.log('3. Setting up sample data...');
        const exportData = await database.exportData();

        if (exportData.userProfiles.length === 0) {
            console.log('Creating sample user...');

            const sampleUserId = await database.createUserProfile({
                username: 'demo_user',
                email: 'demo@example.com',
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

            // Create a sample session
            await database.createSession(sampleUserId);

            // Add some sample quiz progress
            await database.saveQuizProgress({
                userId: sampleUserId,
                moduleId: 'arrays-basics',
                topicId: 'arrays',
                score: 85,
                totalQuestions: 10,
                correctAnswers: 8,
                timeSpent: 300000, // 5 minutes
            });

            await database.saveQuizProgress({
                userId: sampleUserId,
                moduleId: 'linked-lists',
                topicId: 'singly-linked-list',
                score: 92,
                totalQuestions: 8,
                correctAnswers: 7,
                timeSpent: 240000, // 4 minutes
            });

            console.log('✅ Sample user and data created');
        } else {
            console.log('✅ Existing users found, no sample data needed');
        }

        // Step 4: Display database statistics
        console.log('4. Database Statistics:');
        const stats = await getDatabaseStats();
        console.table(stats);

        console.log('🎉 Database initialization completed successfully!');
        console.log('📊 You can now use the application with a fully functional database.');

        return true;

    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
}

async function getDatabaseStats() {
    const data = await database.exportData();

    return {
        'User Profiles': data.userProfiles.length,
        'User Sessions': data.userSessions.length,
        'Quiz Progress Records': data.quizProgress.length,
        'Quiz Attempts': data.quizAttempts.length,
        'Total Data Size (KB)': Math.round(JSON.stringify(data).length / 1024),
        'Migration Status': migrationService.getMigrationInfo().isCompleted ? 'Complete' : 'Pending'
    };
}

// Export for use in other modules
export { getDatabaseStats };

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
    // Make it available in browser console
    (window as any).initDatabase = initializeDatabase;
    (window as any).getDatabaseStats = getDatabaseStats;
    console.log('🔧 Database tools available:');
    console.log('  - initDatabase() - Initialize and test database');
    console.log('  - getDatabaseStats() - Get database statistics');
}
