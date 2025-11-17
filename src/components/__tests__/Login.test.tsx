import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Login } from '../Login';
import { AuthProvider } from '../../contexts/AuthContext';

describe('Login Component', () => {
  it('renders login form', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    expect(screen.getByText('Solo Leveling System')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows sign in button by default', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    );

    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
