import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Fingerprint } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth, MOCK_REGULAR_USER, MOCK_EVENT_MANAGER } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import lcIcon from '../../assets/lc-icon.png';
import decorGraphic from '../../assets/login-decor-top-right.png';
import './AuthPages.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
      const isManager =
        email.toLowerCase().includes('manager') ||
        email.toLowerCase().includes('roland') ||
        email.toLowerCase().includes('adjei') ||
        email.toLowerCase().includes('chen');

      if (isManager) {
        login('manager');
        navigate('/manager');
      } else {
        login('user');
        navigate('/');
      }
    }, 450);
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
    <div className="auth-page auth-page--login">
      {/* Top right decorative shapes matching Figma design */}
      <img
        src={decorGraphic}
        alt=""
        className="login-decor-graphic"
        aria-hidden="true"
      />

      <div className="auth-card auth-card--login">
        {/* Top Bar: Brand Icon on left, Theme Toggle on right */}
        <div className="login-top-bar">
          <Link to="/welcome" aria-label="Live Connect Home">
            <img src={lcIcon} alt="Live Connect" className="login-logo-img" />
          </Link>
          <ThemeToggle size="sm" />
        </div>

        {/* Centered Brand Title */}
        <div className="login-brand-hero">
          <span className="login-brand-hero__live">Live</span>{' '}
          <span className="login-brand-hero__connect">Connect</span>
        </div>

        {/* Left-aligned Welcome Header */}
        <div className="login-welcome-block">
          <h1 className="login-welcome-block__title">Welcome back</h1>
          <p className="login-welcome-block__subtitle">Login in to your account</p>
        </div>

        {generalError && (
          <div style={{ marginBottom: '20px' }}>
            <Alert type="error" title="Sign In Error">
              {generalError}
            </Alert>
          </div>
        )}

        {forgotSent ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
            <Alert type="success" title="Check your inbox">
              A password reset link has been dispatched to <strong>{email}</strong>.
            </Alert>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForgotSent(false)}
              style={{ marginTop: 'var(--space-4)' }}
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} noValidate className="login-form">
            {/* Email Address Field */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              placeholder="hello@reallygreatsite.com"
              error={errors.email}
              required
              autoComplete="email"
            />

            {/* Password Field */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              placeholder="********"
              error={errors.password}
              required
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              }
            />

            {/* Password Length Hint */}
            <p className="login-password-hint">
              Password must be at least 8 characters.
            </p>

            {/* Forgot Password Link */}
            <div className="login-forgot-action">
              <button
                type="button"
                className="login-forgot-btn"
                onClick={handleForgotSubmit}
              >
                Forgot password?
              </button>
            </div>

            {/* Orange Pill Button with Fingerprint Icon */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="login-submit-btn"
            >
              <Fingerprint size={20} className="login-btn-icon" aria-hidden="true" />
              <span>Login</span>
            </Button>
          </form>
        )}

        {/* Footer Link */}
        <div className="login-footer-block">
          Don't Have an Account? <Link to="/signup"><strong>Sign Up</strong></Link>
        </div>

        {/* Version Tag */}
        <div className="login-version-tag">
          1.2.0
        </div>

        {/* Subtle Demo Quick Sign In Bar for evaluation */}
        <div className="login-demo-bar">
          <span className="login-demo-bar__label">Demo:</span>
          <button
            type="button"
            className="login-demo-pill"
            onClick={() => fillQuickPreset('user')}
          >
            Attendee
          </button>
          <button
            type="button"
            className="login-demo-pill"
            onClick={() => fillQuickPreset('manager')}
          >
            Roland (Manager)
          </button>
        </div>
      </div>
    </div>
  );
};
