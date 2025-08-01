/**
 * Database debugging component for development
 */

import React, { useState, useEffect } from 'react';
import { DatabaseUtils } from '../services/database-utils';

interface DatabaseStats {
  userProfiles: number;
  userSessions: number;
  quizProgress: number;
  quizAttempts: number;
  totalSize: number;
  migrationInfo: any;
}

export function DatabaseDebugger() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const dbStats = await DatabaseUtils.getStats();
      setStats(dbStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      setError(null);
      const success = await DatabaseUtils.backup();
      if (!success) {
        setError('Backup failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backup failed');
    }
  };

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset all database data? This cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      const success = await DatabaseUtils.reset();
      if (success) {
        window.location.reload();
      } else {
        setError('Reset failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    }
  };

  const handleValidate = async () => {
    try {
      setError(null);
      const validation = await DatabaseUtils.validate();
      if (validation.isValid) {
        alert('Database is valid!');
      } else {
        alert(`Database has issues:\n${validation.issues.join('\n')}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="text-lg font-semibold mb-3">Database Debug</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : stats ? (
        <div className="space-y-2 text-sm">
          <div>Users: {stats.userProfiles}</div>
          <div>Sessions: {stats.userSessions}</div>
          <div>Progress: {stats.quizProgress}</div>
          <div>Attempts: {stats.quizAttempts}</div>
          <div>Size: {Math.round(stats.totalSize / 1024)}KB</div>
          <div>Migrated: {stats.migrationInfo.isCompleted ? 'Yes' : 'No'}</div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 mt-3">
        <button 
          onClick={loadStats}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Refresh
        </button>
        <button 
          onClick={handleBackup}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
        >
          Backup
        </button>
        <button 
          onClick={handleValidate}
          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
        >
          Validate
        </button>
        <button 
          onClick={handleReset}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}