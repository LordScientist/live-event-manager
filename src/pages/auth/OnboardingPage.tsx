import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Sparkles, Building, ShieldCheck } from 'lucide-react';
import { Input, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import './OnboardingPage.css';

const GENDER_OPTIONS = [
  { value: '', label: 'Select gender' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Prefer not to say', label: 'Prefer not to say' }
];

const DIETARY_OPTIONS = [
  { value: 'None', label: 'No dietary restrictions' },
  { value: 'Vegetarian', label: 'Vegetarian' },
  { value: 'Vegan', label: 'Vegan' },
  { value: 'Halal', label: 'Halal' },
  { value: 'Kosher', label: 'Kosher' },
  { value: 'Gluten-Free', label: 'Gluten-Free' },
  { value: 'Nut Allergy', label: 'Nut Allergy' }
];

const ACCESSIBILITY_OPTIONS = [
  { value: 'None', label: 'No special accommodations' },
  { value: 'Wheelchair access', label: 'Wheelchair / Ramp accessibility' },
  { value: 'Sign language / CART', label: 'Sign language interpreter or CART captions' },
  { value: 'Front row priority seating', label: 'Priority front-row seating (hearing/visual)' },
  { value: 'Sensory quiet space', label: 'Access to low-sensory quiet break space' }
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    firstName: currentUser.first_name === 'Participant' ? '' : currentUser.first_name || '',
    lastName: currentUser.last_name === 'User' ? '' : currentUser.last_name || '',
    gender: currentUser.gender || '',
    phone: currentUser.phone || '',
    organization: currentUser.organization === 'General Community' ? '' : currentUser.organization || '',
    jobTitle: currentUser.job_title === 'Attendee' ? '' : currentUser.job_title || '',
    dietary: currentUser.dietary || 'None',
    accessibility: currentUser.accessibility || 'None'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.gender) newErrors.gender = 'Please select a gender option';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required for event notices';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      updateProfile({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        gender: formData.gender,
        phone: formData.phone.trim(),
        organization: formData.organization.trim() || undefined,
        job_title: formData.jobTitle.trim() || undefined,
        dietary: formData.dietary,
        accessibility: formData.accessibility
      });
      setIsSubmitting(false);
      navigate('/');
    }, 400);
  };

  const handleSkip = () => {
    // If skipped, allow entering app with default/initial profile
    navigate('/');
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <div className="onboarding-card__theme-toggle">
          <ThemeToggle size="sm" />
        </div>

        <div className="onboarding-header">
          <div className="onboarding-step-badge">
            <Sparkles size={14} />
            <span>Profile Setup</span>
          </div>
          <h1>Welcome to Live Connect</h1>
          <p>
            Tell us a bit about yourself so event organizers can prepare attendee credentials,
            seating, and tailored arrangements for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Personal Contact */}
          <div className="onboarding-section">
            <h2 className="onboarding-section__title">
              <User size={16} />
              <span>Personal Information</span>
            </h2>

            <div className="auth-grid-2">
              <Input
                label="First name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="e.g. Roland"
                error={errors.firstName}
                required
                autoComplete="given-name"
              />
              <Input
                label="Last name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="e.g. Adjei"
                error={errors.lastName}
                required
                autoComplete="family-name"
              />
            </div>

            <div className="auth-grid-2">
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={GENDER_OPTIONS}
                error={errors.gender}
                required
              />

              <Input
                label="Phone number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+233 24 555 7890"
                error={errors.phone}
                helperText="Used for urgent last-minute schedule shifts"
                required
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Section 2: Professional & Academic */}
          <div className="onboarding-section">
            <h2 className="onboarding-section__title">
              <Building size={16} />
              <span>Professional & Academic Background</span>
            </h2>

            <div className="auth-grid-2">
              <Input
                label="Organization / University"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. KNUST or Company Ltd"
                helperText="Optional"
                autoComplete="organization"
              />
              <Input
                label="Role / Programme / Major"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="e.g. Computer Engineering"
                helperText="Optional"
              />
            </div>
          </div>

          {/* Section 3: Event Coordination & Accommodations */}
          <div className="onboarding-section">
            <h2 className="onboarding-section__title">
              <ShieldCheck size={16} />
              <span>Event Requirements & Preferences</span>
            </h2>

            <div className="auth-grid-2">
              <Select
                label="Dietary Requirement"
                name="dietary"
                value={formData.dietary}
                onChange={handleChange}
                options={DIETARY_OPTIONS}
                helperText="For catered events and workshops"
              />

              <Select
                label="Accessibility Accommodation"
                name="accessibility"
                value={formData.accessibility}
                onChange={handleChange}
                options={ACCESSIBILITY_OPTIONS}
                helperText="For venue arrangements and room access"
              />
            </div>
          </div>

          <div className="onboarding-actions">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              style={{ width: '100%' }}
            >
              Save Profile & Get Started
            </Button>

            <button
              type="button"
              className="onboarding-skip-btn"
              onClick={handleSkip}
            >
              Skip for now and continue to events
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
