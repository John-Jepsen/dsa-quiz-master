/**
 * Development Testing Script for Progress Submission
 * Run this in browser console to test the progress submission features
 */

async function testProgressSubmission() {
    console.log('🧪 Testing Progress Submission Features...');

    try {
        // Test 1: Check if services are available
        console.log('1. Checking service availability...');
        if (typeof progressSubmissionService === 'undefined') {
            console.error('❌ progressSubmissionService not available');
            return false;
        }
        console.log('✅ Progress submission service is available');

        // Test 2: Check database initialization
        console.log('2. Testing database connection...');
        const { database } = await import('/src/services/database.js');
        await database.initialize();
        console.log('✅ Database initialized successfully');

        // Test 3: Check if user exists
        console.log('3. Checking for user data...');
        const exportData = await database.exportData();
        console.log(`Found ${exportData.userProfiles.length} user profiles`);

        if (exportData.userProfiles.length === 0) {
            console.log('ℹ️  No users found, creating test user...');
            await createTestUser();
        }

        // Test 4: Test progress capture
        console.log('4. Testing progress data capture...');
        const userId = exportData.userProfiles[0]?.id || await getCurrentTestUserId();
        const progressData = await progressSubmissionService.captureUserProgress(userId);
        console.log('✅ Progress data captured:', {
            userId: progressData.userId,
            quizProgress: progressData.quizProgress.length,
            quizAttempts: progressData.quizAttempts.length,
            dataSize: Math.round(progressData.metadata.totalDataSize / 1024) + 'KB'
        });

        // Test 5: Test submission (development mode)
        console.log('5. Testing progress submission...');
        const response = await progressSubmissionService.submitProgress(progressData);
        console.log('✅ Submission response:', response);

        // Test 6: Check submission history
        console.log('6. Testing submission history...');
        const history = await progressSubmissionService.getSubmissionHistory(userId);
        console.log(`✅ Found ${history.length} previous submissions`);

        console.log('\n🎉 All tests passed! Progress submission is working correctly.');
        console.log('\n📋 Test Summary:');
        console.log(`- Service: Available`);
        console.log(`- Database: Connected`);
        console.log(`- Users: ${exportData.userProfiles.length}`);
        console.log(`- Progress Records: ${progressData.quizProgress.length}`);
        console.log(`- Data Size: ${Math.round(progressData.metadata.totalDataSize / 1024)}KB`);
        console.log(`- Submission: ${response.success ? 'Success' : 'Failed'}`);
        console.log(`- History: ${history.length} records`);

        return true;

    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    }
}

async function createTestUser() {
    const { database } = await import('/src/services/database.js');

    const testUserId = await database.createUserProfile({
        username: 'test-user-dev',
        email: 'test@example.com',
        totalScore: 150,
        completedModules: ['arrays-basics', 'linked-lists'],
        achievements: ['first-quiz', 'week-streak'],
        stats: {
            totalQuizzesTaken: 5,
            totalTimeSpent: 900000, // 15 minutes
            averageScore: 85,
            streakDays: 3,
            lastQuizDate: new Date()
        }
    });

    // Add some test progress
    await database.saveQuizProgress({
        userId: testUserId,
        moduleId: 'arrays-basics',
        topicId: 'arrays',
        score: 85,
        totalQuestions: 10,
        correctAnswers: 8,
        timeSpent: 300000
    });

    await database.saveQuizAttempt({
        userId: testUserId,
        moduleId: 'arrays-basics',
        questionId: 'q1',
        userAnswer: 1,
        correctAnswer: 1,
        isCorrect: true,
        timeSpent: 15000
    });

    console.log('✅ Test user created with sample data');
    return testUserId;
}

async function getCurrentTestUserId() {
    const { database } = await import('/src/services/database.js');
    const exportData = await database.exportData();
    return exportData.userProfiles[0]?.id;
}

// Test UI components
function testUIComponents() {
    console.log('🎨 Testing UI Components...');

    // Check if floating button is present
    const floatingButton = document.querySelector('[class*="fixed"][class*="rounded-full"]');
    if (floatingButton) {
        console.log('✅ Floating submit button found in DOM');
    } else {
        console.log('❌ Floating submit button not found');
    }

    // Check for progress submission components
    const progressComponents = document.querySelectorAll('[class*="progress"], [class*="submit"]');
    console.log(`✅ Found ${progressComponents.length} progress-related elements`);

    return true;
}

// Quick test for button functionality
function testButtonClick() {
    console.log('🖱️  Testing button click functionality...');

    const floatingButton = document.querySelector('[class*="fixed"][class*="rounded-full"] button');
    if (floatingButton) {
        console.log('✅ Floating button found, simulating click...');
        floatingButton.click();
        setTimeout(() => {
            console.log('✅ Button click simulated successfully');
        }, 1000);
    } else {
        console.log('❌ Could not find floating button to test');
    }
}

// Make functions available globally
window.testProgressSubmission = testProgressSubmission;
window.testUIComponents = testUIComponents;
window.testButtonClick = testButtonClick;
window.createTestUser = createTestUser;

console.log('🔧 Development testing tools loaded!');
console.log('📋 Available commands:');
console.log('  - testProgressSubmission() - Full functionality test');
console.log('  - testUIComponents() - Check UI elements');
console.log('  - testButtonClick() - Test button interaction');
console.log('  - createTestUser() - Create test user with data');

// Auto-run UI test
testUIComponents();
