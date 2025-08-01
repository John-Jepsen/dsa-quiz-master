import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import { User, Zap } from 'lucide-react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { toast } from 'sonner';

interface UserAuthProps {
  onLogin: (user: UserProfile) => void;
  onRegister: (user: UserProfile) => void;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  displayName: string;
  createdAt: string;
  totalQuizzes: number;
  bestOverallScore: number;
}

export function UserAuth({ onLogin, onRegister }: UserAuthProps) {
  const { login: gitHubLogin, isLoading: githubLoading, simulateLogin } = useGitHubAuth();
  const [localUsername, setLocalUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = () => {
    gitHubLogin();
  };

  // For demo purposes - simulate GitHub login
  const handleGitHubDemo = () => {
    const demoUsername = 'demo-user';
    simulateLogin(demoUsername);
    
    // Convert GitHub user to UserProfile format
    const user = {
      id: `github-${Date.now()}`,
      username: demoUsername,
      email: `${demoUsername}@github.demo`,
      displayName: `GitHub User (${demoUsername})`,
      createdAt: new Date().toISOString(),
      totalQuizzes: 0,
      bestOverallScore: 0
    };

    toast.success(`Welcome via GitHub, ${user.displayName}! 🎉`);
    onRegister(user);
  };

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!localUsername.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setIsLoading(true);

    try {
      // Create user profile without storing in users list
      const user = {
        id: Date.now().toString(),
        username: localUsername.trim(),
        email: `${localUsername.trim()}@local.demo`, // Auto-generate email
        displayName: localUsername.trim(),
        createdAt: new Date().toISOString(),
        totalQuizzes: 0,
        bestOverallScore: 0
      };

      toast.success(`Welcome to DSA Quiz Master, ${user.displayName}! 🎉`);
      onRegister(user);
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }; return (
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
            <CardContent className="space-y-3">
              <Button 
                onClick={handleGitHubLogin} 
                className="w-full" 
                disabled={githubLoading}
                variant="outline"
              >
                {githubLoading ? 'Connecting...' : 'Continue with GitHub'}
              </Button>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Demo mode (GitHub OAuth requires backend setup)
                </p>
                <Button 
                  onClick={handleGitHubDemo} 
                  className="w-full" 
                  size="sm"
                  variant="secondary"
                >
                  Try GitHub Demo
                </Button>
              </div>
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
            <form onSubmit={handleLocalSubmit}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Start
                </CardTitle>
                <CardDescription>
                  Enter a username to start learning locally
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose any username..."
                    value={localUsername}
                    onChange={(e) => setLocalUsername(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || !localUsername.trim()}>
                  {isLoading ? 'Getting you ready...' : 'Start Learning! 🚀'}
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ No passwords needed! All data stays in your browser
          </p>
        </div>
      </div>
    </div>
  );
}