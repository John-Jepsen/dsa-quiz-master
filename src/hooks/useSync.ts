/**
 * React hook for using the sync service
 */

import { useState, useEffect, useCallback } from 'react';
import { syncService, SyncStatus } from '../services/sync-service';

export function useSync() {
  const [status, setStatus] = useState<SyncStatus>(syncService.getStatus());

  useEffect(() => {
    // Subscribe to sync status updates
    const unsubscribe = syncService.addSyncListener(setStatus);
    
    // Get initial status
    setStatus(syncService.getStatus());

    return unsubscribe;
  }, []);

  const forceSync = useCallback(async (): Promise<boolean> => {
    return syncService.forcSync();
  }, []);

  const clearPending = useCallback((): void => {
    syncService.clearPendingOperations();
  }, []);

  const getPendingOperations = useCallback(() => {
    return syncService.getPendingOperations();
  }, []);

  // Development helpers
  const simulateOffline = useCallback((): void => {
    syncService.simulateOffline();
  }, []);

  const simulateOnline = useCallback((): void => {
    syncService.simulateOnline();
  }, []);

  return {
    isOnline: status.isOnline,
    lastSyncTime: status.lastSyncTime,
    pendingOperations: status.pendingOperations,
    syncInProgress: status.syncInProgress,
    forceSync,
    clearPending,
    getPendingOperations,
    // Development helpers
    simulateOffline,
    simulateOnline,
  };
}

export function useOfflineQueue() {
  const { pendingOperations, getPendingOperations } = useSync();
  
  const [operations, setOperations] = useState(getPendingOperations());

  useEffect(() => {
    setOperations(getPendingOperations());
  }, [pendingOperations, getPendingOperations]);

  const queueOperation = useCallback((
    type: 'create' | 'update' | 'delete',
    table: 'userProfiles' | 'quizProgress' | 'quizAttempts' | 'userSessions',
    data: any
  ) => {
    syncService.queueOperation(type, table, data);
  }, []);

  return {
    operations,
    queueOperation,
    hasOperations: operations.length > 0,
  };
}