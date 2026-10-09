import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronsLeft, Users, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { SplashScreen } from './SplashScreen';
import './AuthPages.css';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, updateProfile } = useAuth();

  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('has_seen_splash') && !sessionStorage.getItem('lc_get_started_splash_seen');
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [selectedRole, setSelectedRole] = useState<'Attendee' | 'Speaker' | 'Volunteer' | 'Event Manager'>('Attendee');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const isManager = selectedRole === 'Event Manager';
      signup({
        email: formData.email.trim(),
        account_type: isManager ? 'manager' : 'user',
        job_title: selectedRole
      });
      updateProfile({
        first_name: formData.username.trim(),
        last_name: '',
        job_title: selectedRole
      });

      // Flag fresh signup tour for interactive onboarding tour
      localStorage.setItem('fresh_signup_tour_pending', 'true');
      localStorage.removeItem('has_completed_tour');
      localStorage.setItem('selected_signup_role', selectedRole);

      setIsSubmitting(false);
      navigate('/role-confirmed', { state: { role: selectedRole } });
    }, 400);
  };

  return (
    <>
      {showSplash && (
        <SplashScreen
          duration={2200}
          onComplete={() => {
            setShowSplash(false);
            sessionStorage.setItem('has_seen_splash', 'true');
          }}
        />
      )}

      <div className="auth-page auth-page--signup">
        {/* World Map Backdrop (Light mode only via CSS, untouched in dark mode) */}
        <div className="signup-map-backdrop" aria-hidden="true" />

        <div className="auth-card auth-card--signup">
          {/* Top navigation row: Double chevron back on left, ThemeToggle on right */}
          <div className="signup-top-nav">
            <button
              type="button"
              className="signup-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ChevronsLeft size={28} className="signup-back-icon" />
            </button>
            <div className="signup-top-actions">
              <ThemeToggle size="sm" />
            </div>
          </div>

          {/* Title Header: "Create an" (white) + "Account!" (orange) */}
          <div className="signup-header">
            <h1 className="signup-header__title">
              <span className="signup-header__title-white">Create an</span>
              <span className="signup-header__title-orange">Account!</span>
            </h1>
          </div>

          {generalError && (
            <Alert type="error" title="Registration Error">
              {generalError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate className="signup-form">
            {/* Field 1: Username */}
            <Input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              leftElement={<Users size={20} />}
              required
              autoComplete="username"
            />

            {/* Field 2: Email Address */}
            <Input
              name="email"
              type="email"
              placeholder="Email Adress"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftElement={<Mail size={20} />}
              required
              autoComplete="email"
            />

            {/* Field 3: Password with Lock icon + Eye toggle */}
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              leftElement={<Lock size={20} />}
              rightElement={
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              required
              autoComplete="new-password"
            />

            {/* Field 4: Confirm Password with Lock icon + Eye toggle */}
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              leftElement={<Lock size={20} />}
              rightElement={
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              required
              autoComplete="new-password"
            />

            {/* Role Radio Group: "I am a:" */}
            <div className="signup-role-section">
              <span className="signup-role-title">I am a:</span>
              <div className="signup-role-options" role="radiogroup" aria-label="I am a">
                {(['Attendee', 'Speaker', 'Volunteer', 'Event Manager'] as const).map((role) => (
                  <label key={role} className="signup-role-option">
                    <input
                      type="radio"
                      name="selectedRole"
                      value={role}
                      checked={selectedRole === role}
                      onChange={() => setSelectedRole(role)}
                      className="signup-role-radio"
                    />
                    <span className="signup-role-custom-radio" aria-hidden="true">
                      <span className="signup-role-radio-dot" />
                    </span>
                    <span className="signup-role-label">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button: Pill shaped orange LOG IN */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="signup-submit-btn"
            >
              LOG IN
            </Button>
          </form>

          {/* Footer: "Already have an account? Sign in" */}
          <div className="signup-footer">
            <span className="signup-footer__text">Already have an account?</span>{' '}
            <Link to="/login" className="signup-footer__link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
