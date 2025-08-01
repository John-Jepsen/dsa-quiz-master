# GitHub Actions React Authentication Guide

This guide explains how to implement GitHub OAuth authentication in a React application using GitHub Actions for secure deployment and credential management.

## Overview

GitHub OAuth authentication allows users to log in using their GitHub accounts, providing a secure and familiar authentication experience. When combined with GitHub Actions, you can create a robust authentication system that:

- Authenticates users via GitHub OAuth
- Securely manages client secrets using GitHub Secrets
- Automatically deploys with proper environment configuration
- Maintains user sessions and profiles

## Prerequisites

Before implementing GitHub authentication, ensure you have:

- A GitHub repository with Actions enabled
- A React application (like this DSA Quiz Master)
- Access to GitHub repository settings
- Basic understanding of OAuth 2.0 flow

## Step 1: Register GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: DSA Quiz Master
   - **Homepage URL**: `https://yourusername.github.io/dsa-quiz-master`
   - **Authorization callback URL**: `https://yourusername.github.io/dsa-quiz-master/auth/callback`
4. Note the **Client ID** and **Client Secret**

## Step 2: Configure GitHub Secrets

Add the following secrets to your repository:

1. Go to repository Settings → Secrets and variables → Actions
2. Add these repository secrets:
   - `GITHUB_CLIENT_ID`: Your OAuth app's client ID
   - `GITHUB_CLIENT_SECRET`: Your OAuth app's client secret

## Step 3: Update GitHub Actions Workflow

Modify `.github/workflows/deploy.yml` to include environment variables:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_GITHUB_CLIENT_ID: ${{ secrets.GITHUB_CLIENT_ID }}
          VITE_APP_URL: https://${{ github.repository_owner }}.github.io/${{ github.event.repository.name }}

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Step 4: Install Required Dependencies

Add OAuth and HTTP client dependencies:

```bash
npm install @octokit/oauth-authorization-url @octokit/oauth-app axios
npm install --save-dev @types/node
```

## Step 5: Create GitHub Auth Service

Create `src/services/githubAuth.ts`:

```typescript
interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

class GitHubAuthService {
  private clientId: string;
  private redirectUri: string;

  constructor() {
    this.clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
    this.redirectUri = `${import.meta.env.VITE_APP_URL}/auth/callback`;
  }

  // Generate GitHub OAuth authorization URL
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'user:email',
      state: this.generateState()
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  // Handle OAuth callback and exchange code for token
  async handleCallback(code: string, state: string): Promise<GitHubUser> {
    // Verify state parameter
    const storedState = sessionStorage.getItem('github_oauth_state');
    if (state !== storedState) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for access token using GitHub proxy
    const tokenResponse = await this.exchangeCodeForToken(code);
    
    // Fetch user profile
    const user = await this.fetchUserProfile(tokenResponse.access_token);
    
    // Store token securely
    this.storeToken(tokenResponse.access_token);
    
    return user;
  }

  // Exchange authorization code for access token
  private async exchangeCodeForToken(code: string): Promise<AuthTokenResponse> {
    // Note: This requires a backend proxy to securely exchange the code
    // since client secret cannot be exposed in frontend code
    const response = await fetch('/api/auth/github', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  }

  // Fetch user profile from GitHub API
  private async fetchUserProfile(accessToken: string): Promise<GitHubUser> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  }

  // Generate cryptographically secure state parameter
  private generateState(): string {
    const state = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    sessionStorage.setItem('github_oauth_state', state);
    return state;
  }

  // Securely store access token
  private storeToken(token: string): void {
    // Store in secure HTTP-only cookie if possible, or encrypted localStorage
    localStorage.setItem('github_access_token', token);
  }

  // Get stored access token
  getStoredToken(): string | null {
    return localStorage.getItem('github_access_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('github_access_token');
    sessionStorage.removeItem('github_oauth_state');
  }
}

export const githubAuth = new GitHubAuthService();
export type { GitHubUser };
```

## Step 6: Create GitHub Auth Hook

Create `src/hooks/useGitHubAuth.ts`:

```typescript
import { useState, useEffect } from 'react';
import { githubAuth, GitHubUser } from '@/services/githubAuth';

interface UseGitHubAuthReturn {
  user: GitHubUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  handleCallback: (code: string, state: string) => Promise<void>;
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
          // Verify token is still valid and fetch user profile
          const userProfile = await fetchUserProfile(token);
          setUser(userProfile);
        }
      } catch (error) {
        // Token is invalid, clear it
        githubAuth.logout();
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
    setUser(null);
  };

  const handleCallback = async (code: string, state: string) => {
    setIsLoading(true);
    try {
      const userProfile = await githubAuth.handleCallback(code, state);
      setUser(userProfile);
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
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
    handleCallback
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
```

## Step 7: Update UserAuth Component

Modify `src/components/UserAuth.tsx` to support GitHub authentication:

```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { User, Zap } from 'lucide-react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { toast } from 'sonner';

interface UserAuthProps {
  onLogin: (user: UserProfile) => void;
  onRegister: (user: UserProfile) => void;
}

export function UserAuth({ onLogin, onRegister }: UserAuthProps) {
  const { login: gitHubLogin, isLoading } = useGitHubAuth();
  const [localUsername, setLocalUsername] = useState('');

  const handleGitHubLogin = () => {
    gitHubLogin();
  };

  const handleLocalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // ... existing local authentication logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">DSA Quiz Master</h1>
          <p className="text-muted-foreground">Master Data Structures & Algorithms</p>
        </div>

        <div className="space-y-4">
          {/* GitHub Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitHubLogoIcon className="w-5 h-5" />
                Sign in with GitHub
              </CardTitle>
              <CardDescription>
                Use your GitHub account for a personalized experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleGitHubLogin} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Connecting...' : 'Continue with GitHub'}
              </Button>
            </CardContent>
          </Card>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Local Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Enter a username to start learning locally
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* ... existing local auth form */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## Step 8: Handle OAuth Callback

Create routing to handle the OAuth callback. Add to your main App component:

```typescript
import { useEffect } from 'react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';

function App() {
  const { handleCallback, user } = useGitHubAuth();

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && state) {
      handleCallback(code, state)
        .then(() => {
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((error) => {
          console.error('Authentication failed:', error);
          toast.error('Authentication failed. Please try again.');
        });
    }
  }, [handleCallback]);

  // ... rest of your app logic
}
```

## Security Considerations

### 1. Environment Variables
- Never expose client secrets in frontend code
- Use `VITE_` prefix for public environment variables
- Store sensitive secrets in GitHub repository secrets

### 2. State Parameter Validation
- Always use and validate the state parameter to prevent CSRF attacks
- Generate cryptographically secure random states
- Store state in sessionStorage, not localStorage

### 3. Token Storage
- Consider using secure HTTP-only cookies for token storage
- Implement token refresh if using short-lived tokens
- Clear tokens on logout and session expiry

### 4. Backend Proxy (Recommended)
For production applications, implement a backend proxy service to:
- Securely exchange authorization codes for tokens
- Validate tokens server-side
- Implement proper CORS policies

Example backend endpoint (`/api/auth/github`):
```javascript
app.post('/api/auth/github', async (req, res) => {
  const { code } = req.body;
  
  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    res.json(tokenData);
  } catch (error) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});
```

## Testing the Implementation

1. **Local Development**: Test with a development OAuth app
2. **Staging**: Use staging environment secrets
3. **Production**: Ensure all secrets are properly configured

### Test Checklist
- [ ] OAuth app registration completed
- [ ] GitHub secrets configured
- [ ] Environment variables accessible in build
- [ ] Authorization flow redirects correctly
- [ ] Callback handling works
- [ ] User profile fetched successfully
- [ ] Token storage and retrieval working
- [ ] Logout clears all authentication data

## Troubleshooting

### Common Issues

1. **"Application not found" error**
   - Verify OAuth app registration
   - Check client ID in environment variables

2. **"Redirect URI mismatch"**
   - Ensure callback URL matches OAuth app configuration
   - Check for trailing slashes and exact URL match

3. **"Invalid state parameter"**
   - Verify state generation and validation logic
   - Check sessionStorage functionality

4. **CORS errors**
   - Implement backend proxy for token exchange
   - Configure proper CORS policies

## Migration from Local Auth

To migrate existing users from local authentication:

1. Add GitHub account linking feature
2. Allow users to connect their existing profiles
3. Provide data export/import functionality
4. Maintain backward compatibility during transition

## Best Practices

1. **User Experience**
   - Provide clear authentication options
   - Handle authentication states gracefully
   - Show appropriate loading and error states

2. **Performance**
   - Cache user profiles appropriately
   - Implement token refresh to avoid re-authentication
   - Use lazy loading for authentication components

3. **Monitoring**
   - Log authentication events
   - Monitor OAuth flow completion rates
   - Track authentication errors

This guide provides a comprehensive approach to implementing GitHub OAuth authentication in your React application using GitHub Actions for deployment and secret management.