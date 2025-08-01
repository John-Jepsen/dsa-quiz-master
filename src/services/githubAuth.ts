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
    // For now, we'll throw an error with instructions
    throw new Error(
      'Backend proxy required: This operation requires a backend service to securely exchange the authorization code for an access token. ' +
      'Please implement a backend endpoint at /api/auth/github that accepts the code and returns the access token.'
    );
    
    // This is what the implementation would look like with a backend:
    /*
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
    */
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

  // Simulate successful authentication for demo purposes
  // This would be removed when a proper backend is implemented
  simulateAuthSuccess(username: string): GitHubUser {
    const mockUser: GitHubUser = {
      id: Date.now(),
      login: username,
      name: username,
      email: `${username}@github.local`,
      avatar_url: `https://github.com/${username}.png`
    };

    // Store a mock token
    this.storeToken(`mock_token_${Date.now()}`);
    
    return mockUser;
  }
}

export const githubAuth = new GitHubAuthService();
export type { GitHubUser };