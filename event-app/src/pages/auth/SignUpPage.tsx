import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import './AuthPages.css';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Requirements checks
  const requirements = useMemo(() => {
    const pwd = formData.password;
    const hasMinLength = pwd.length >= 6;
    const hasNumber = /\d/.test(pwd);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd);
    const passwordsMatch = pwd.length > 0 && pwd === formData.confirmPassword;

    return {
      hasMinLength,
      hasNumber,
      hasSymbol,
      passwordsMatch
    };
  }, [formData.password, formData.confirmPassword]);

  // Password strength calculation
  const strength = useMemo(() => {
    const { hasMinLength, hasNumber, hasSymbol, passwordsMatch } = requirements;
    let score = 0;
    if (formData.password.length > 0) {
      if (hasMinLength) score += 1;
      if (hasNumber) score += 1;
      if (hasSymbol) score += 1;
      if (formData.password.length >= 10 || (score === 3 && passwordsMatch)) score += 1;
    }

    if (score <= 1) return { score, grade: 'weak', label: 'Weak' };
    if (score === 2) return { score, grade: 'fair', label: 'Fair' };
    if (score === 3) return { score, grade: 'good', label: 'Good' };
    return { score, grade: 'strong', label: 'Strong' };
  }, [formData.password, requirements]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and privacy policy';
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
      setIsSubmitting(false);
      // Register account and immediately proceed to the independent onboarding screen
      signup({
        email: formData.email,
        account_type: 'user'
      });
      navigate('/onboarding');
    }, 400);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__theme-toggle">
          <ThemeToggle size="sm" />
        </div>

        {/* Header with App Logo and Description */}
        <div className="auth-header">
          <Link to="/welcome" className="auth-brand" aria-label="EventCoord Home">
            <span className="brand-logo" aria-hidden="true">📡</span>
            <span className="brand-title">EventCoord</span>
          </Link>
          <h1>Create account</h1>
          <p className="auth-header__desc">Get started in managing your events.</p>
        </div>

        {generalError && (
          <Alert type="error" title="Registration Error">
            {generalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Address */}
          <Input
            label="Email address"
            type="email"
            name="email"
            placeholder="you@domain.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            autoComplete="email"
          />

          {/* Password with View Toggle */}
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            autoComplete="new-password"
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

          {/* Confirm Password with View Toggle */}
          <Input
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
            rightElement={
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {/* Visual Password Strength Meter */}
          {formData.password.length > 0 && (
            <div className="password-strength-meter" aria-live="polite">
              <div className="password-strength-header">
                <span className="password-strength-title">Password Strength</span>
                <span className={`password-strength-grade password-strength-grade--${strength.grade}`}>
                  {strength.label}
                </span>
              </div>
              <div className="password-strength-track">
                <div
                  className={`password-strength-segment ${
                    strength.score >= 1 ? `password-strength-segment--active-${strength.grade}` : ''
                  }`}
                />
                <div
                  className={`password-strength-segment ${
                    strength.score >= 2 ? `password-strength-segment--active-${strength.grade}` : ''
                  }`}
                />
                <div
                  className={`password-strength-segment ${
                    strength.score >= 3 ? `password-strength-segment--active-${strength.grade}` : ''
                  }`}
                />
                <div
                  className={`password-strength-segment ${
                    strength.score >= 4 ? `password-strength-segment--active-${strength.grade}` : ''
                  }`}
                />
              </div>
            </div>
          )}

          {/* Password Dynamic Requirements Checklist with Strikethrough */}
          <div className="password-checklist" aria-label="Password requirements">
            <div
              className={`checklist-item ${requirements.hasMinLength ? 'checklist-item--met' : ''}`}
            >
              {requirements.hasMinLength ? (
                <Check size={14} className="checklist-item__icon" />
              ) : (
                <X size={14} className="checklist-item__icon" />
              )}
              <span>6+ characters</span>
            </div>

            <div
              className={`checklist-item ${requirements.hasNumber ? 'checklist-item--met' : ''}`}
            >
              {requirements.hasNumber ? (
                <Check size={14} className="checklist-item__icon" />
              ) : (
                <X size={14} className="checklist-item__icon" />
              )}
              <span>Add a number</span>
            </div>

            <div
              className={`checklist-item ${requirements.hasSymbol ? 'checklist-item--met' : ''}`}
            >
              {requirements.hasSymbol ? (
                <Check size={14} className="checklist-item__icon" />
              ) : (
                <X size={14} className="checklist-item__icon" />
              )}
              <span>Add a symbol</span>
            </div>

            <div
              className={`checklist-item ${requirements.passwordsMatch ? 'checklist-item--met' : ''}`}
            >
              {requirements.passwordsMatch ? (
                <Check size={14} className="checklist-item__icon" />
              ) : (
                <X size={14} className="checklist-item__icon" />
              )}
              <span>Passwords match</span>
            </div>
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="auth-checkbox-group">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              aria-invalid={errors.agreeTerms ? 'true' : 'false'}
            />
            <label htmlFor="agreeTerms" className="auth-checkbox-label">
              I agree to the terms and privacy policy for event coordination.
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="form-field__error" style={{ marginTop: '-12px', marginBottom: '16px' }} role="alert">
              {errors.agreeTerms}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            style={{ width: '100%' }}
          >
            Create account
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};
