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
    try {
      // Try to fetch a small resource to verify real connectivity
      const response = await fetch('/ping', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      
      const wasOnline = this.isOnline;
      this.isOnline = response.ok;
      
      if (!wasOnline && this.isOnline) {
        // Just came back online
        this.notifyListeners();
        this.attemptSync();
      } else if (wasOnline && !this.isOnline) {
        // Just went offline
        this.notifyListeners();
      }
    } catch {
      // If fetch fails, we're likely offline
      if (this.isOnline) {
        this.isOnline = false;
        this.notifyListeners();
      }
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

    let successCount = 0;
    const maxRetries = 3;

    try {
      // Process operations in chronological order
      const operations = [...this.pendingOperations].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );

      for (const operation of operations) {
        try {
          const success = await this.executeOperation(operation);
          
          if (success) {
            // Remove successful operation
            this.pendingOperations = this.pendingOperations.filter(op => op.id !== operation.id);
            successCount++;
          } else {
            // Increment retry count
            operation.retryCount++;
            
            // Remove operation if max retries exceeded
            if (operation.retryCount >= maxRetries) {
              console.error(`Max retries exceeded for operation ${operation.id}`);
              this.pendingOperations = this.pendingOperations.filter(op => op.id !== operation.id);
            }
          }
        } catch (error) {
          console.error(`Error executing operation ${operation.id}:`, error);
          operation.retryCount++;
          
          if (operation.retryCount >= maxRetries) {
            this.pendingOperations = this.pendingOperations.filter(op => op.id !== operation.id);
          }
        }
      }

      this.lastSyncTime = new Date();
      this.savePendingOperations();

      return successCount > 0;
    } finally {
      this.syncInProgress = false;
      this.notifyListeners();
    }
  }

  private async executeOperation(operation: PendingOperation): Promise<boolean> {
    // For now, this is a placeholder since we don't have a server backend
    // In a real implementation, this would make API calls to sync with a server
    
    try {
      // Simulate network operation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Log the operation for debugging
      console.log(`[SYNC] Would execute ${operation.type} on ${operation.table}:`, operation.data);
      
      // For now, just return true to simulate successful sync
      // In real implementation, this would:
      // 1. Make HTTP request to server
      // 2. Handle server response
      // 3. Update local data if needed
      // 4. Return success/failure
      
      return true;
    } catch (error) {
      console.error('Error executing sync operation:', error);
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
    if (!this.isOnline) {
      return false;
    }

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