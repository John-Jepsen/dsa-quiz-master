import { useState, useEffect } from 'react';
import { githubAuth, GitHubUser } from '@/services/githubAuth';

interface UseGitHubAuthReturn {
  user: GitHubUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  handleCallback: (code: string, state: string) => Promise<void>;
  simulateLogin: (username: string) => void;
}

export function useGitHubAuth(): UseGitHubAuthReturn {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on mount
    const checkAuth = async () => {
      try {
        const token = githubAuth.getStoredToken();
        if (token) {
          // For demo purposes, if we have a mock token, create a mock user
          if (token.startsWith('mock_token_')) {
            const storedUser = localStorage.getItem('github_user_profile');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          } else {
            // Verify token is still valid and fetch user profile
            const userProfile = await fetchUserProfile(token);
            setUser(userProfile);
            localStorage.setItem('github_user_profile', JSON.stringify(userProfile));
          }
        }
      } catch (error) {
        // Token is invalid, clear it
        githubAuth.logout();
        localStorage.removeItem('github_user_profile');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    const authUrl = githubAuth.getAuthorizationUrl();
    window.location.href = authUrl;
  };

  const logout = () => {
    githubAuth.logout();
    localStorage.removeItem('github_user_profile');
    setUser(null);
  };

  const handleCallback = async (code: string, state: string) => {
    setIsLoading(true);
    try {
      const userProfile = await githubAuth.handleCallback(code, state);
      setUser(userProfile);
      localStorage.setItem('github_user_profile', JSON.stringify(userProfile));
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate login for demo purposes
  const simulateLogin = (username: string) => {
    setIsLoading(true);
    try {
      const mockUser = githubAuth.simulateAuthSuccess(username);
      setUser(mockUser);
      localStorage.setItem('github_user_profile', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Simulated authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    handleCallback,
    simulateLogin
  };
}

// Helper function to fetch user profile
async function fetchUserProfile(token: string): Promise<GitHubUser> {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }

  return response.json();
}