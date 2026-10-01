import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth, MOCK_REGULAR_USER, MOCK_EVENT_MANAGER } from '../../context/AuthContext';
import './AuthPages.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchAccountType } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Determine account type based on input email or default to user
      if (email.toLowerCase().includes('manager') || email.toLowerCase().includes('chen')) {
        switchAccountType('manager');
        navigate('/manager');
      } else {
        switchAccountType('user');
        navigate('/events');
      }
    }, 500);
  };

  const fillQuickPreset = (role: 'user' | 'manager') => {
    if (role === 'manager') {
      setEmail(MOCK_EVENT_MANAGER.email);
      setPassword('ManagerPass2026!');
    } else {
      setEmail(MOCK_REGULAR_USER.email);
      setPassword('ParticipantPass2026!');
    }
    setErrors({});
    setGeneralError(null);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter your account email first' });
      return;
    }
    setForgotSent(true);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/welcome" className="auth-brand">
            <span className="brand-logo" aria-hidden="true">📡</span>
            <span className="brand-title">EventCoord</span>
          </Link>
          <h1>Welcome back</h1>
          <p>Sign in to view your registrations, schedules, and live updates.</p>
        </div>

        {generalError && (
          <Alert type="error" title="Sign In Error">
            {generalError}
          </Alert>
        )}

        {forgotSent ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
            <Alert type="success" title="Check your inbox">
              A password reset link has been dispatched to <strong>{email}</strong>.
            </Alert>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setForgotSent(false);
              }}
              style={{ marginTop: 'var(--space-4)' }}
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} noValidate>
            {/* Quick Demonstration Presets */}
            <div style={{ marginBottom: 'var(--space-5)', padding: 'var(--space-3)', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', fontWeight: 600 }}>
                QUICK DEMO SIGN IN PRESETS:
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillQuickPreset('user')}
                  style={{ flex: 1, fontSize: 'var(--text-xs)' }}
                >
                  👤 Attendee / Speaker
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillQuickPreset('manager')}
                  style={{ flex: 1, fontSize: 'var(--text-xs)' }}
                >
                  🛠️ Event Manager
                </Button>
              </div>
            </div>

            {/* Email Field (Prompt Section 6) */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              error={errors.email}
              required
              autoComplete="email"
            />

            {/* Password Field (Prompt Section 6) */}
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            {/* Forgot Password Action (Prompt Section 6) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-8px', marginBottom: 'var(--space-5)' }}>
              <button
                type="button"
                onClick={handleForgotSubmit}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Log in Action (Prompt Section 6) */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              style={{ width: '100%' }}
            >
              Log in
            </Button>
          </form>
        )}

        {/* Create account Action (Prompt Section 6) */}
        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create account</Link>
        </div>
      </div>
    </div>
  );
};
