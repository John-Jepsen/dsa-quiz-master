import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('renders the provided label', () => {
    render(<Button>Start quiz</Button>);
    expect(screen.getByRole('button', { name: /start quiz/i })).toBeInTheDocument();
  });

  it('applies the requested variant styles', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });

    expect(button.className).toContain('bg-destructive');
  });
});
