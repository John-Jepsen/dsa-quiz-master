import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Zap } from 'lucide-react';
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
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    if (username.trim().length < 2) {
      toast.error('Username must be at least 2 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('dsa-quiz-users') || '[]');
      let user = users.find((u: UserProfile) => u.username.toLowerCase() === username.trim().toLowerCase());

      if (!user) {
        // Create new user automatically
        user = {
          id: Date.now().toString(),
          username: username.trim(),
          email: `${username.trim()}@local.demo`, // Auto-generate email
          displayName: username.trim(),
          createdAt: new Date().toISOString(),
          totalQuizzes: 0,
          bestOverallScore: 0
        };

        // Save new user to localStorage
        users.push(user);
        localStorage.setItem('dsa-quiz-users', JSON.stringify(users));

        toast.success(`Welcome to DSA Quiz Master, ${user.displayName}! 🎉`);
        onRegister(user);
      } else {
        // User exists, log them in
        toast.success(`Welcome back, ${user.displayName}! 👋`);
        onLogin(user);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">DSA Quiz Master</h1>
          <p className="text-muted-foreground">Master Data Structures & Algorithms</p>
        </div>

        <Card>
          <form onSubmit={handleAuth}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Get Started
              </CardTitle>
              <CardDescription>
                Enter a username to start learning! We'll create your account automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose any username..."
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !username.trim()}>
                {isLoading ? 'Getting you ready...' : 'Start Learning! 🚀'}
              </Button>
            </CardContent>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ✨ No passwords needed! All data stays in your browser
          </p>
        </div>
      </div>
    </div>
  );
}