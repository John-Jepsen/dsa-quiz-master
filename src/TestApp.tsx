import React from 'react';
import { DatabaseProvider, DatabaseLoader } from '@/components/DatabaseProvider';

function SimpleApp() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">DSA Quiz Master</h1>
                <p className="text-lg text-muted-foreground mb-8">Database is working!</p>
                <div className="space-y-4">
                    <p>🎉 IndexedDB initialized</p>
                    <p>✅ Migration system ready</p>
                    <p>🔧 Testing tools available in console</p>
                    <button
                        onClick={() => {
                            console.log('Testing database...');
                            // @ts-ignore
                            if (window.testDatabase) {
                                // @ts-ignore
                                window.testDatabase();
                            }
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Test Database
                    </button>
                </div>
            </div>
        </div>
    );
}

function TestApp() {
    return (
        <DatabaseProvider>
            <DatabaseLoader>
                <SimpleApp />
            </DatabaseLoader>
        </DatabaseProvider>
    );
}

export default TestApp;
