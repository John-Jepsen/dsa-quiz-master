/**
 * Synchronization service for handling online/offline state and data sync
 */

import { database } from './database';
import type { UserProfile, QuizProgress, QuizAttempt } from '../types';

export interface SyncStatus {
  isOnline: boolean;
  lastSyncTime?: Date;
  pendingOperations: number;
  syncInProgress: boolean;
}

export interface PendingOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: 'userProfiles' | 'quizProgress' | 'quizAttempts' | 'userSessions';
  data: any;
  timestamp: Date;
  retryCount: number;
}

export class SyncService {
  private static instance: SyncService | null = null;
  private pendingOperations: PendingOperation[] = [];
  private syncListeners: ((status: SyncStatus) => void)[] = [];
  private isOnline = navigator.onLine;
  private syncInProgress = false;
  private lastSyncTime?: Date;

  private constructor() {
    this.setupOnlineDetection();
    this.loadPendingOperations();
  }

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private setupOnlineDetection(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners();
      this.attemptSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners();
    });

    // Periodic connectivity check
    setInterval(() => {
      this.checkConnectivity();
    }, 30000); // Check every 30 seconds
  }

  private async checkConnectivity(): Promise<void> {
    // For local-only operation, just use navigator.onLine
    const wasOnline = this.isOnline;
    this.isOnline = navigator.onLine;
    
    if (!wasOnline && this.isOnline) {
      // Just came back online
      this.notifyListeners();
    } else if (wasOnline && !this.isOnline) {
      // Just went offline
      this.notifyListeners();
    }
  }

  private loadPendingOperations(): void {
    try {
      const stored = localStorage.getItem('sync-pending-operations');
      if (stored) {
        this.pendingOperations = JSON.parse(stored).map((op: any) => ({
          ...op,
          timestamp: new Date(op.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading pending operations:', error);
      this.pendingOperations = [];
    }
  }

  private savePendingOperations(): void {
    try {
      localStorage.setItem('sync-pending-operations', JSON.stringify(this.pendingOperations));
    } catch (error) {
      console.error('Error saving pending operations:', error);
    }
  }

  private notifyListeners(): void {
    const status: SyncStatus = {
      isOnline: this.isOnline,
      lastSyncTime: this.lastSyncTime,
      pendingOperations: this.pendingOperations.length,
      syncInProgress: this.syncInProgress
    };

    this.syncListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  public addSyncListener(listener: (status: SyncStatus) => void): () => void {
    this.syncListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.syncListeners.indexOf(listener);
      if (index > -1) {
        this.syncListeners.splice(index, 1);
      }
    };
  }

  public queueOperation(
    type: PendingOperation['type'],
    table: PendingOperation['table'],
    data: any
  ): void {
    const operation: PendingOperation = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      table,
      data,
      timestamp: new Date(),
      retryCount: 0
    };

    this.pendingOperations.push(operation);
    this.savePendingOperations();
    this.notifyListeners();

    // If online, attempt immediate sync
    if (this.isOnline && !this.syncInProgress) {
      this.attemptSync();
    }
  }

  public async attemptSync(): Promise<boolean> {
    if (!this.isOnline || this.syncInProgress || this.pendingOperations.length === 0) {
      return false;
    }

    this.syncInProgress = true;
    this.notifyListeners();

    try {
      // For local-only operation, we'll just log the operations and mark them as processed
      console.log('🔄 Processing local operations...');
      
      for (const operation of this.pendingOperations) {
        console.log(`[LOCAL] Processing ${operation.type} on ${operation.table}:`, operation.data);
      }

      // Clear all pending operations as they're now "processed" locally
      this.pendingOperations = [];
      this.lastSyncTime = new Date();
      this.savePendingOperations();

      return true;
    } finally {
      this.syncInProgress = false;
      this.notifyListeners();
    }
  }

  private async executeOperation(operation: PendingOperation): Promise<boolean> {
    // For local-only operation, just log and return success
    try {
      console.log(`[LOCAL] Would execute ${operation.type} on ${operation.table}:`, operation.data);
      return true;
    } catch (error) {
      console.error('Error processing local operation:', error);
      return false;
    }
  }

  public getStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      lastSyncTime: this.lastSyncTime,
      pendingOperations: this.pendingOperations.length,
      syncInProgress: this.syncInProgress
    };
  }

  public async forcSync(): Promise<boolean> {
    // For local-only operation, always return true
    return this.attemptSync();
  }

  public clearPendingOperations(): void {
    this.pendingOperations = [];
    this.savePendingOperations();
    this.notifyListeners();
  }

  public getPendingOperations(): PendingOperation[] {
    return [...this.pendingOperations];
  }

  // Helper method to simulate going offline (for testing)
  public simulateOffline(): void {
    this.isOnline = false;
    this.notifyListeners();
  }

  // Helper method to simulate going online (for testing)
  public simulateOnline(): void {
    this.isOnline = true;
    this.notifyListeners();
    this.attemptSync();
  }
}

export const syncService = SyncService.getInstance();