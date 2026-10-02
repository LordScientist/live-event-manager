import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import lcIcon from '../../assets/lc-icon.png';
import './AuthPages.css';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organization: '',
    jobTitle: '',
    agreeTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms and Condition';
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
      signup({
        email: formData.email,
        account_type: 'user'
      });
      updateProfile({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || undefined,
        organization: formData.organization.trim() || undefined,
        job_title: formData.jobTitle.trim() || undefined
      });
      setIsSubmitting(false);
      navigate('/');
    }, 400);
  };

  return (
    <div className="auth-page auth-page--signup">
      <div className="auth-card auth-card--signup">
        <div className="auth-card__theme-toggle">
          <ThemeToggle size="sm" />
        </div>

        {/* LC Logo — Top Left */}
        <div className="signup-logo">
          <img src={lcIcon} alt="Live Connect" className="signup-logo__icon-img" />
          <span className="signup-logo__text">
            <span className="signup-logo__live">LIVE</span>{' '}
            <span className="signup-logo__connect">CONNECT</span>
          </span>
        </div>

        {/* Left-aligned heading + subtitle */}
        <div className="signup-header">
          <h1 className="signup-header__title">Create your Account</h1>
          <p className="signup-header__subtitle">
            Join events, get updates and be part{'\n'}of something great
          </p>
        </div>

        {generalError && (
          <Alert type="error" title="Registration Error">
            {generalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Row 1: First name + Last name */}
          <div className="signup-grid">
            <Input
              label="First name"
              name="firstName"
              placeholder=""
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
              autoComplete="given-name"
            />
            <Input
              label="Last name"
              name="lastName"
              placeholder=""
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
              autoComplete="family-name"
            />
          </div>

          {/* Row 2: Your Email + Phone number */}
          <div className="signup-grid">
            <Input
              label="Your Email"
              type="email"
              name="email"
              placeholder=""
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />
            <Input
              label="Phone number"
              type="tel"
              name="phone"
              placeholder=""
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
          </div>

          {/* Row 3: Create a Password + Confirm Password */}
          <div className="signup-grid">
            <Input
              label="Create a Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder=""
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
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder=""
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
          </div>

          {/* Password hint (matches Figma) */}
          <p className="signup-password-hint">Password must be at least 8 characters.</p>

          {/* Row 4: Optional — Organization + Job title */}
          <div className="signup-optional-header">Optional</div>
          <div className="signup-grid">
            <Input
              label="Organizational/School"
              name="organization"
              placeholder=""
              value={formData.organization}
              onChange={handleChange}
              autoComplete="organization"
            />
            <Input
              label="Job title / programme"
              name="jobTitle"
              placeholder=""
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </div>

          {/* Terms and Condition Checkbox */}
          <div className="signup-checkbox-group">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              aria-invalid={errors.agreeTerms ? 'true' : 'false'}
            />
            <label htmlFor="agreeTerms" className="signup-checkbox-label">
              I agree to the <strong>Teams and Condition</strong>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="form-field__error" style={{ marginTop: '-8px', marginBottom: '16px' }} role="alert">
              {errors.agreeTerms}
            </p>
          )}

          {/* Orange pill Create account button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="signup-submit-btn"
          >
            Create account
          </Button>
        </form>

        <div className="signup-footer">
          Already Have an Account? <Link to="/login"><strong>Enter</strong></Link>
        </div>
      </div>
    </div>
  );
};
