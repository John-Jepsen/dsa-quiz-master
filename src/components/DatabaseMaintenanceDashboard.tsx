/**
 * Database maintenance dashboard component
 */

import React, { useState, useEffect } from 'react';
import { databaseMaintenanceService } from '../services/database-maintenance';
import { databaseCache } from '../services/database-cache';

interface MaintenanceStatus {
  orphanedRecords: number;
  oldSessions: number;
  oldAttempts: number;
  cacheSize: number;
  lastMaintenance?: string;
}

interface DatabaseSize {
  estimatedSize: number;
  recordCounts: {
    userProfiles: number;
    userSessions: number;
    quizProgress: number;
    quizAttempts: number;
  };
}

interface CleanupResult {
  orphanedSessions: number;
  orphanedProgress: number;
  orphanedAttempts: number;
  oldSessions: number;
  archivedData: number;
  freedSpace: number;
}

export function DatabaseMaintenanceDashboard() {
  const [status, setStatus] = useState<MaintenanceStatus | null>(null);
  const [databaseSize, setDatabaseSize] = useState<DatabaseSize | null>(null);
  const [cacheStats, setCacheStats] = useState(databaseCache.getStats());
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [result, setResult] = useState<CleanupResult | null>(null);
  const [options, setOptions] = useState({
    removeOrphanedData: true,
    archiveOldSessions: true,
    archiveOldAttempts: false,
    sessionRetentionDays: 30,
    attemptRetentionDays: 90,
    compactData: true,
  });

  const loadStatus = async () => {
    try {
      setLoading(true);
      const [maintenanceStatus, dbSize] = await Promise.all([
        databaseMaintenanceService.getMaintenanceStatus(),
        databaseMaintenanceService.getDatabaseSize(),
      ]);
      setStatus(maintenanceStatus);
      setDatabaseSize(dbSize);
      setCacheStats(databaseCache.getStats());
    } catch (error) {
      console.error('Failed to load maintenance status:', error);
    } finally {
      setLoading(false);
    }
  };

  const performMaintenance = async () => {
    try {
      setCleaning(true);
      setResult(null);
      
      const cleanupResult = await databaseMaintenanceService.performMaintenance(options);
      databaseMaintenanceService.markMaintenanceCompleted();
      
      setResult(cleanupResult);
      await loadStatus(); // Refresh status
    } catch (error) {
      console.error('Maintenance failed:', error);
      setResult({
        orphanedSessions: 0,
        orphanedProgress: 0,
        orphanedAttempts: 0,
        oldSessions: 0,
        archivedData: 0,
        freedSpace: 0,
      });
    } finally {
      setCleaning(false);
    }
  };

  const clearCache = () => {
    databaseCache.clear();
    setCacheStats(databaseCache.getStats());
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    loadStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Database Maintenance</h2>
        <button
          onClick={loadStatus}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
        >
          Refresh Status
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{status?.orphanedRecords || 0}</div>
          <div className="text-sm text-gray-600">Orphaned Records</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{status?.oldSessions || 0}</div>
          <div className="text-sm text-gray-600">Old Sessions</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{cacheStats.size}</div>
          <div className="text-sm text-gray-600">Cache Entries</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {databaseSize ? formatBytes(databaseSize.estimatedSize) : '-'}
          </div>
          <div className="text-sm text-gray-600">Database Size</div>
        </div>
      </div>

      {/* Database Statistics */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Database Statistics</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {databaseSize?.recordCounts.userProfiles || 0}
              </div>
              <div className="text-sm text-gray-600">User Profiles</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {databaseSize?.recordCounts.userSessions || 0}
              </div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {databaseSize?.recordCounts.quizProgress || 0}
              </div>
              <div className="text-sm text-gray-600">Progress Records</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">
                {databaseSize?.recordCounts.quizAttempts || 0}
              </div>
              <div className="text-sm text-gray-600">Quiz Attempts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cache Information */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Cache Status</h3>
          <button
            onClick={clearCache}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Clear Cache
          </button>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{cacheStats.size}</div>
              <div className="text-sm text-gray-600">Entries</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{cacheStats.hits}</div>
              <div className="text-sm text-gray-600">Hits</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">{cacheStats.misses}</div>
              <div className="text-sm text-gray-600">Misses</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{cacheStats.hitRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Hit Rate</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Memory usage: {databaseCache.getMemoryUsageFormatted()}
          </div>
        </div>
      </div>

      {/* Maintenance Options */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Maintenance Options</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.removeOrphanedData}
                onChange={(e) => setOptions(prev => ({ ...prev, removeOrphanedData: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remove orphaned data</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.archiveOldSessions}
                onChange={(e) => setOptions(prev => ({ ...prev, archiveOldSessions: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Archive old sessions</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.archiveOldAttempts}
                onChange={(e) => setOptions(prev => ({ ...prev, archiveOldAttempts: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Archive old attempts</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.compactData}
                onChange={(e) => setOptions(prev => ({ ...prev, compactData: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Compact data</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session retention (days)
              </label>
              <input
                type="number"
                value={options.sessionRetentionDays}
                onChange={(e) => setOptions(prev => ({ ...prev, sessionRetentionDays: parseInt(e.target.value) || 30 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="365"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attempt retention (days)
              </label>
              <input
                type="number"
                value={options.attemptRetentionDays}
                onChange={(e) => setOptions(prev => ({ ...prev, attemptRetentionDays: parseInt(e.target.value) || 90 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="365"
              />
            </div>
          </div>

          <button
            onClick={performMaintenance}
            disabled={cleaning}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {cleaning && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            <span>{cleaning ? 'Running Maintenance...' : 'Run Maintenance'}</span>
          </button>
        </div>
      </div>

      {/* Maintenance Result */}
      {result && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Maintenance Result</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">{result.orphanedSessions + result.orphanedProgress + result.orphanedAttempts}</div>
                <div className="text-sm text-gray-600">Orphaned Removed</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">{result.oldSessions}</div>
                <div className="text-sm text-gray-600">Old Sessions Removed</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{result.archivedData}</div>
                <div className="text-sm text-gray-600">Attempts Archived</div>
              </div>
            </div>
            {result.freedSpace > 0 && (
              <div className="mt-4 text-center">
                <div className="text-lg font-semibold text-green-600">
                  {formatBytes(result.freedSpace)} cache space freed
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Last Maintenance */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="text-sm text-gray-600">
          <strong>Last maintenance:</strong> {formatDate(status?.lastMaintenance)}
        </div>
      </div>
    </div>
  );
}