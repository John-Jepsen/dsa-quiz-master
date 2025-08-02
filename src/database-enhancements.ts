/**
 * Test file to verify all new components and services are properly exportable
 */

// Test imports of all new features
import { syncService } from './services/sync-service';
import { databaseCache } from './services/database-cache';
import { dataImportService } from './services/data-import';
import { databaseMaintenanceService } from './services/database-maintenance';

import { useSync, useOfflineQueue } from './hooks/useSync';

import { SyncStatusIndicator } from './components/SyncStatusIndicator';
import { AdvancedAnalyticsDashboard } from './components/AdvancedAnalyticsDashboard';
import { DataImportComponent } from './components/DataImportComponent';
import { DatabaseMaintenanceDashboard } from './components/DatabaseMaintenanceDashboard';
import { DatabaseEnhancementsDemo } from './components/DatabaseEnhancementsDemo';

// Verify service exports
console.log('Services loaded:', {
  syncService: !!syncService,
  databaseCache: !!databaseCache,
  dataImportService: !!dataImportService,
  databaseMaintenanceService: !!databaseMaintenanceService,
});

// Verify hook exports
console.log('Hooks loaded:', {
  useSync: typeof useSync === 'function',
  useOfflineQueue: typeof useOfflineQueue === 'function',
});

// Verify component exports
console.log('Components loaded:', {
  SyncStatusIndicator: !!SyncStatusIndicator,
  AdvancedAnalyticsDashboard: !!AdvancedAnalyticsDashboard,
  DataImportComponent: !!DataImportComponent,
  DatabaseMaintenanceDashboard: !!DatabaseMaintenanceDashboard,
  DatabaseEnhancementsDemo: !!DatabaseEnhancementsDemo,
});

export {
  // Services
  syncService,
  databaseCache,
  dataImportService,
  databaseMaintenanceService,
  
  // Hooks
  useSync,
  useOfflineQueue,
  
  // Components
  SyncStatusIndicator,
  AdvancedAnalyticsDashboard,
  DataImportComponent,
  DatabaseMaintenanceDashboard,
  DatabaseEnhancementsDemo,
};