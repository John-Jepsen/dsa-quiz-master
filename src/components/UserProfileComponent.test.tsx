import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { UserProfileComponent } from './UserProfileComponent';
import { UserProfile } from '@/types';

vi.mock('./ProgressSubmission', () => ({
  ProgressSubmission: () => <div data-testid="progress-submission" />
}));

const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => toastSuccess(...args),
    error: (...args: unknown[]) => toastError(...args)
  }
}));

const baseUser: UserProfile = {
  id: 'user-1',
  username: 'janedoe',
  displayName: 'Jane Doe',
  email: 'jane@example.com',
  createdAt: new Date('2024-01-01'),
  totalScore: 1200,
  completedModules: ['arrays-basics'],
  achievements: [],
  stats: {
    totalQuizzesTaken: 5,
    totalTimeSpent: 200,
    averageScore: 78,
    streakDays: 3,
    lastQuizDate: new Date('2024-01-02')
  },
  totalQuizzes: 5,
  bestOverallScore: 90
};

const buildUser = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  ...baseUser,
  ...overrides,
  stats: { ...baseUser.stats, ...(overrides.stats ?? {}) }
});

beforeEach(() => {
  toastSuccess.mockReset();
  toastError.mockReset();
});

describe('UserProfileComponent', () => {
  it('renders profile details with safe fallbacks', () => {
    const onUpdateProfile = vi.fn();
    const user = buildUser({
      displayName: undefined,
      email: undefined,
      totalQuizzes: undefined,
      bestOverallScore: undefined,
      stats: { ...baseUser.stats, totalQuizzesTaken: 4, averageScore: 72 }
    });

    render(
      <UserProfileComponent
        user={user}
        onBack={vi.fn()}
        onLogout={vi.fn()}
        onUpdateProfile={onUpdateProfile}
      />
    );

    expect(screen.getByText('@janedoe')).toBeInTheDocument();
    expect(screen.getByText('Not set')).toBeInTheDocument();

    const totalQuizzesCard = screen.getByText(/Total Quizzes/i).parentElement;
    expect(totalQuizzesCard).toBeTruthy();
    expect(totalQuizzesCard).toHaveTextContent('4');

    const bestScoreCard = screen.getByText(/Best Average/i).parentElement;
    expect(bestScoreCard).toBeTruthy();
    expect(bestScoreCard).toHaveTextContent('72%');

    expect(screen.getByTestId('progress-submission')).toBeInTheDocument();
  });

  it('lets a user edit and save profile details', async () => {
    const user = buildUser();
    const onUpdateProfile = vi.fn();
    const onLogout = vi.fn();
    const onBack = vi.fn();
    const ui = userEvent.setup();

    render(
      <UserProfileComponent
        user={user}
        onBack={onBack}
        onLogout={onLogout}
        onUpdateProfile={onUpdateProfile}
      />
    );

    await ui.click(screen.getByRole('button', { name: /edit/i }));
    await ui.clear(screen.getByLabelText(/Display Name/i));
    await ui.type(screen.getByLabelText(/Display Name/i), 'New Name');
    await ui.clear(screen.getByLabelText(/Email/i));
    await ui.type(screen.getByLabelText(/Email/i), 'new@example.com');
    await ui.click(screen.getByRole('button', { name: /Save Changes/i }));

    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(onUpdateProfile.mock.calls[0][0].displayName).toBe('New Name');
    expect(onUpdateProfile.mock.calls[0][0].email).toBe('new@example.com');

    await ui.click(screen.getByRole('button', { name: /Logout/i }));
    await ui.click(screen.getByRole('button', { name: /Back/i }));
    expect(onLogout).toHaveBeenCalled();
    expect(onBack).toHaveBeenCalled();
  });

  it('blocks saving when required fields are empty', async () => {
    const ui = userEvent.setup();
    const onUpdateProfile = vi.fn();

    render(
      <UserProfileComponent
        user={buildUser()}
        onBack={vi.fn()}
        onLogout={vi.fn()}
        onUpdateProfile={onUpdateProfile}
      />
    );

    await ui.click(screen.getByRole('button', { name: /edit/i }));
    await ui.clear(screen.getByLabelText(/Display Name/i));
    await ui.clear(screen.getByLabelText(/Email/i));
    await ui.click(screen.getByRole('button', { name: /Save Changes/i }));

    expect(onUpdateProfile).not.toHaveBeenCalled();
    expect(toastError).toHaveBeenCalled();
  });
});
