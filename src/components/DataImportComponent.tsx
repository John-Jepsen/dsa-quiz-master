/**
 * Data import/restore component
 */

import React, { useState, useRef } from 'react';
import { dataImportService } from '../services/data-import';

interface ImportResult {
  success: boolean;
  message: string;
  imported: {
    userProfiles: number;
    userSessions: number;
    quizProgress: number;
    quizAttempts: number;
  };
  conflicts: string[];
  errors: string[];
}

export function DataImportComponent() {
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [mergeStrategy, setMergeStrategy] = useState<'overwrite' | 'merge' | 'skip'>('merge');
  const [clearExisting, setClearExisting] = useState(false);
  const [validateData, setValidateData] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const importResult = await dataImportService.importFromFile(file, {
        mergeStrategy,
        clearExisting,
        validateData,
      });

      setResult(importResult);
    } catch (error) {
      setResult({
        success: false,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        imported: { userProfiles: 0, userSessions: 0, quizProgress: 0, quizAttempts: 0 },
        conflicts: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      });
    } finally {
      setImporting(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCreateTestBackup = async () => {
    try {
      const testData = await dataImportService.createTestBackup();
      const blob = new Blob([testData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test-backup.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to create test backup:', error);
    }
  };

  const resetResult = () => {
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Import/Restore Data</h3>
        
        <div className="space-y-4">
          {/* Import Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Merge Strategy
              </label>
              <select
                value={mergeStrategy}
                onChange={(e) => setMergeStrategy(e.target.value as typeof mergeStrategy)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="merge">Merge (keep newer data)</option>
                <option value="overwrite">Overwrite existing</option>
                <option value="skip">Skip existing</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={clearExisting}
                  onChange={(e) => setClearExisting(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Clear existing data</span>
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={validateData}
                  onChange={(e) => setValidateData(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Validate data</span>
              </label>
            </div>
          </div>

          {/* Clear existing warning */}
          {clearExisting && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="ml-2 text-sm text-red-700">
                  <strong>Warning:</strong> This will permanently delete all existing data before importing.
                </div>
              </div>
            </div>
          )}

          {/* File Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select backup file to import
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              disabled={importing}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </div>

          {/* Import Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {importing && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>{importing ? 'Importing...' : 'Select File to Import'}</span>
            </button>

            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={handleCreateTestBackup}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 text-sm"
              >
                Create Test Backup
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Import Result */}
      {result && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Import Result</h3>
            <button
              onClick={resetResult}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status */}
          <div className={`flex items-center space-x-2 mb-4 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.success ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{result.message}</span>
          </div>

          {/* Import Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{result.imported.userProfiles}</div>
              <div className="text-sm text-gray-600">User Profiles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.imported.quizProgress}</div>
              <div className="text-sm text-gray-600">Quiz Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{result.imported.quizAttempts}</div>
              <div className="text-sm text-gray-600">Quiz Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{result.imported.userSessions}</div>
              <div className="text-sm text-gray-600">Sessions</div>
            </div>
          </div>

          {/* Conflicts */}
          {result.conflicts.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-yellow-700 mb-2">Conflicts ({result.conflicts.length})</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 max-h-32 overflow-y-auto">
                <ul className="text-sm text-yellow-700 space-y-1">
                  {result.conflicts.map((conflict, index) => (
                    <li key={index}>• {conflict}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Errors */}
          {result.errors.length > 0 && (
            <div>
              <h4 className="font-medium text-red-700 mb-2">Errors ({result.errors.length})</h4>
              <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-32 overflow-y-auto">
                <ul className="text-sm text-red-700 space-y-1">
                  {result.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {result.success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                Import completed successfully! The page will refresh automatically to load the new data.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Refresh Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="font-medium text-blue-800 mb-2">Import Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Only JSON backup files created by this application are supported</li>
          <li>• <strong>Merge:</strong> Keeps newer data when conflicts occur</li>
          <li>• <strong>Overwrite:</strong> Replaces existing data with imported data</li>
          <li>• <strong>Skip:</strong> Ignores data that already exists</li>
          <li>• Always create a backup before importing to avoid data loss</li>
        </ul>
      </div>
    </div>
  );
}