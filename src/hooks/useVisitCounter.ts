import { useState, useEffect, useRef } from 'react';

export interface VisitCounterState {
  visits: number;
  loading: boolean;
  error: string | null;
}

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

export function useVisitCounter() {
  const [state, setState] = useState<VisitCounterState>({
    visits: 0,
    loading: true,
    error: null
  });

  // Use ref to track if we've already incremented on this page load
  const hasIncremented = useRef(false);

  useEffect(() => {
    // Only increment once per page load
    if (hasIncremented.current) {
      return;
    }

    const incrementCounter = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        // In development mode, show mock data since API won't be available
        if (isDevelopment) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setState({
            visits: Math.floor(Math.random() * 1000) + 100, // Random number for demo
            loading: false,
            error: null
          });
          hasIncremented.current = true;
          return;
        }

        const response = await fetch('/api/increment', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        setState({
          visits: data.visits || 0,
          loading: false,
          error: null
        });

        hasIncremented.current = true;

      } catch (error) {
        console.error('Failed to increment visit counter:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load visit count'
        }));
      }
    };

    incrementCounter();
  }, []); // Empty dependency array ensures this only runs once

  return state;
}