/**
 * Comprehensive demo component showcasing all database storage enhancements
 */

import React, { useState } from 'react';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { AdvancedAnalyticsDashboard } from './AdvancedAnalyticsDashboard';
import { DataImportComponent } from './DataImportComponent';
import { DatabaseMaintenanceDashboard } from './DatabaseMaintenanceDashboard';
import { useSync } from '../hooks/useSync';

type TabType = 'sync' | 'analytics' | 'import' | 'maintenance';

export function DatabaseEnhancementsDemo() {
  const [activeTab, setActiveTab] = useState<TabType>('sync');
  const { isOnline, pendingOperations, simulateOffline, simulateOnline } = useSync();

  const tabs = [
    { id: 'sync' as TabType, name: 'Sync & Offline', icon: '🔄' },
    { id: 'analytics' as TabType, name: 'Analytics', icon: '📊' },
    { id: 'import' as TabType, name: 'Import/Restore', icon: '📥' },
    { id: 'maintenance' as TabType, name: 'Maintenance', icon: '🛠️' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sync':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Database Synchronization & Offline Support
              </h3>
              
              <div className="space-y-4">
                <SyncStatusIndicator showDetails />
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Features:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Real-time online/offline detection</li>
                    <li>• Automatic sync when connection is restored</li>
                    <li>• Operation queuing for offline scenarios</li>
                    <li>• Retry mechanism with exponential backoff</li>
                    <li>• Periodic connectivity checking</li>
                  </ul>
                </div>

                {process.env.NODE_ENV === 'development' && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Development Testing:</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={simulateOffline}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Simulate Offline
                      </button>
                      <button
                        onClick={simulateOnline}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Simulate Online
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Current state: {isOnline ? 'Online' : 'Offline'} 
                      {pendingOperations > 0 && ` (${pendingOperations} pending operations)`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Advanced Data Analytics
              </h3>
              
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <h4 className="font-medium text-green-800 mb-2">Enhanced Analytics Features:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Comprehensive performance tracking across topics</li>
                  <li>• Time-based filtering (7d, 30d, 90d, all time)</li>
                  <li>• Accuracy and score trend analysis</li>
                  <li>• Difficulty-based performance breakdown</li>
                  <li>• Recent activity monitoring</li>
                  <li>• Learning streak tracking</li>
                </ul>
              </div>
            </div>
            
            <AdvancedAnalyticsDashboard />
          </div>
        );

      case 'import':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Data Import & Restore System
              </h3>
              
              <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-6">
                <h4 className="font-medium text-purple-800 mb-2">Import/Restore Features:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Complete backup/restore functionality</li>
                  <li>• Multiple merge strategies (merge, overwrite, skip)</li>
                  <li>• Conflict detection and resolution</li>
                  <li>• Data validation and integrity checking</li>
                  <li>• Detailed import reports with statistics</li>
                  <li>• Support for partial and full data imports</li>
                </ul>
              </div>
            </div>
            
            <DataImportComponent />
          </div>
        );

      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Database Maintenance & Optimization
              </h3>
              
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-6">
                <h4 className="font-medium text-orange-800 mb-2">Maintenance Features:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Automated cleanup of orphaned records</li>
                  <li>• Configurable data retention policies</li>
                  <li>• Cache performance monitoring and optimization</li>
                  <li>• Database size tracking and compression</li>
                  <li>• Data archiving for long-term storage</li>
                  <li>• Scheduled and manual maintenance operations</li>
                </ul>
              </div>
            </div>
            
            <DatabaseMaintenanceDashboard />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Database Storage Enhancements
        </h1>
        <p className="text-lg text-gray-600">
          Comprehensive local database storage features including synchronization, 
          analytics, import/restore, and maintenance capabilities.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>

      {/* Feature Summary */}
      <div className="mt-12 bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Implementation Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium text-gray-900">Sync Service</div>
            <div className="text-sm text-gray-600">
              Online/offline state management with operation queuing
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-gray-900">Analytics</div>
            <div className="text-sm text-gray-600">
              Advanced performance tracking and visualization
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-medium text-gray-900">Caching</div>
            <div className="text-sm text-gray-600">
              Intelligent caching with LRU eviction and TTL
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-2">📥</div>
            <div className="font-medium text-gray-900">Import/Restore</div>
            <div className="text-sm text-gray-600">
              Complete backup and restore functionality
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl mb-2">🛠️</div>
            <div className="font-medium text-gray-900">Maintenance</div>
            <div className="text-sm text-gray-600">
              Automated cleanup and optimization tools
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-white rounded-md border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Technical Highlights:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Modular architecture with singleton services for consistent state management</li>
            <li>• React hooks for seamless integration with existing UI components</li>
            <li>• IndexedDB optimization with intelligent caching and query strategies</li>
            <li>• Comprehensive error handling and recovery mechanisms</li>
            <li>• Development tools and debugging capabilities</li>
            <li>• Type-safe implementation with full TypeScript support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}