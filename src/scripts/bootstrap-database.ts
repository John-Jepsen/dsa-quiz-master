/**
 * Database Bootstrap
 * Automatically initializes the database when the app starts
 */

import { database } from '../services/database';
import { migrationService } from '../services/migration';
import { achievementService } from '../services/achievement-service';

let initializationPromise: Promise<void> | null = null;

export async function bootstrapDatabase(): Promise<void> {
    // Ensure we only initialize once
    if (initializationPromise) {
        return initializationPromise;
    }

    initializationPromise = (async () => {
        try {
            console.log('🚀 Bootstrapping DSA Quiz Master Database...');

            // Initialize the database
            await database.initialize();
            console.log('✅ Database initialized');

            // Check and run migration
            const migrationNeeded = await migrationService.checkAndMigrate();
            if (migrationNeeded) {
                console.log('✅ Data migration completed');
            }

            // Initialize achievement system
            await achievementService.initialize();
            console.log('✅ Achievement system initialized');

            // Log success
            console.log('🎉 Database bootstrap completed successfully');

        } catch (error) {
            console.error('❌ Database bootstrap failed:', error);
            throw error;
        }
    })();

    return initializationPromise;
}

// Auto-bootstrap in development
if (process.env.NODE_ENV === 'development') {
    bootstrapDatabase().catch(console.error);
}
