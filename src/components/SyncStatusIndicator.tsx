/**
 * Sync status indicator component
 */

import React from 'react';
import { useSync } from '../hooks/useSync';

interface SyncStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function SyncStatusIndicator({ className = '', showDetails = false }: SyncStatusIndicatorProps) {
  const {
    isOnline,
    lastSyncTime,
    pendingOperations,
    syncInProgress,
    forceSync,
    clearPending,
  } = useSync();

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getStatusIcon = () => {
    if (syncInProgress) {
      return (
        <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }

    if (!isOnline) {
      return (
        <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
        </svg>
      );
    }

    if (pendingOperations > 0) {
      return (
        <svg className="h-4 w-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    }

    return (
      <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  };

  const getStatusText = () => {
    if (syncInProgress) return 'Syncing...';
    if (!isOnline) return 'Offline';
    if (pendingOperations > 0) return `${pendingOperations} pending`;
    return 'Online';
  };

  const handleForceSync = async () => {
    if (isOnline && !syncInProgress) {
      await forceSync();
    }
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getStatusIcon()}
        <span className="text-sm text-gray-600">{getStatusText()}</span>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium text-gray-900">{getStatusText()}</span>
        </div>
        
        {isOnline && !syncInProgress && (
          <button
            onClick={handleForceSync}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Sync Now
          </button>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Status:</span>
          <span className={isOnline ? 'text-green-600' : 'text-red-600'}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Last sync:</span>
          <span>{formatLastSync(lastSyncTime)}</span>
        </div>
        
        {pendingOperations > 0 && (
          <div className="flex justify-between">
            <span>Pending operations:</span>
            <span className="text-yellow-600 font-medium">{pendingOperations}</span>
          </div>
        )}
      </div>

      {pendingOperations > 0 && !isOnline && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
          Some changes are waiting to sync when you're back online.
        </div>
      )}

      {process.env.NODE_ENV === 'development' && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Development Tools:</div>
          <div className="flex space-x-2">
            <button
              onClick={clearPending}
              className="text-xs text-red-600 hover:text-red-800"
            >
              Clear Pending
            </button>
          </div>
        </div>
      )}
    </div>
  );
}