import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear individual error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    // Account registration with persistent session activation
    setTimeout(() => {
      setIsSubmitting(false);
      signup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization || undefined,
        job_title: formData.jobTitle || undefined,
        account_type: 'user'
      });
      navigate('/');
    }, 600);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/welcome" className="auth-brand">
            <span className="brand-logo" aria-hidden="true">📡</span>
            <span className="brand-title">EventCoord</span>
          </Link>
          <h1>Create an account</h1>
          <p>Join to access event updates, schedules, and personalized coordination.</p>
        </div>

        {generalError && (
          <Alert type="error" title="Registration Error">
            {generalError}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Required Fields (Prompt Section 5) */}
          <div className="auth-grid-2">
            <Input
              label="First name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
              autoComplete="given-name"
            />
            <Input
              label="Last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              required
              autoComplete="family-name"
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
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
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            helperText="Used for urgent last-minute schedule and venue updates"
            required
            autoComplete="tel"
          />

          <div className="auth-grid-2">
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="new-password"
            />
            <Input
              label="Confirm password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Optional Fields (Prompt Section 5) */}
          <div className="auth-grid-2">
            <Input
              label="Organization / School"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              helperText="Optional"
              autoComplete="organization"
            />
            <Input
              label="Job title / Programme"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              helperText="Optional"
            />
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
              I agree to the terms and conditions and privacy policy for event coordination.
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="form-field__error" style={{ marginTop: '-16px', marginBottom: '16px' }} role="alert">
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
