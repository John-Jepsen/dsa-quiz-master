import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Trophy, LogOut, Settings } from 'lucide-react';
import { UserProfile } from './UserAuth';
import { toast } from 'sonner';

interface UserProfileComponentProps {
  user: UserProfile;
  onBack: () => void;
  onLogout: () => void;
  onUpdateProfile: (updatedUser: UserProfile) => void;
}

export function UserProfileComponent({ user, onBack, onLogout, onUpdateProfile }: UserProfileComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: user.displayName,
    email: user.email
  });

  const handleSaveProfile = () => {
    if (!editForm.displayName.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }

    if (!editForm.email.trim()) {
      toast.error('Email cannot be empty');
      return;
    }

    const updatedUser: UserProfile = {
      ...user,
      displayName: editForm.displayName,
      email: editForm.email
    };

    // Update user in localStorage
    try {
      const users = JSON.parse(localStorage.getItem('dsa-quiz-users') || '[]');
      const userIndex = users.findIndex((u: UserProfile) => u.id === user.id);

      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('dsa-quiz-users', JSON.stringify(users));
        onUpdateProfile(updatedUser);
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      displayName: user.displayName,
      email: user.email
    });
    setIsEditing(false);
  };

  const getAchievementBadges = () => {
    const badges = [];

    if (user.bestOverallScore >= 90) badges.push({ text: 'Quiz Master', color: 'bg-yellow-500' });
    if (user.bestOverallScore >= 80) badges.push({ text: 'Expert', color: 'bg-blue-500' });
    if (user.totalQuizzes >= 20) badges.push({ text: 'Dedicated', color: 'bg-purple-500' });
    if (user.totalQuizzes >= 10) badges.push({ text: 'Enthusiast', color: 'bg-green-500' });

    return badges;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account and view your progress</p>
          </div>
          <Button onClick={onBack} variant="outline">Back</Button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{user.displayName}</h2>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Joined {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-destructive hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile Form */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-display-name">Display Name</Label>
                  <Input
                    id="edit-display-name"
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                  <Button onClick={handleCancelEdit} variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Quiz Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary">{user.totalQuizzes}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Quizzes</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-accent">{user.bestOverallScore}%</div>
                  <div className="text-sm text-muted-foreground mt-1">Best Average</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {getAchievementBadges().map((badge, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {badge.text}
                  </Badge>
                ))}
                {getAchievementBadges().length === 0 && (
                  <p className="text-muted-foreground">Complete more quizzes to earn achievements!</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Username</p>
                  <p className="text-sm text-muted-foreground">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}