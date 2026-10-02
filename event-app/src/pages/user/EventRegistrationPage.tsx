import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Users,
  Briefcase,
  ShieldCheck,
  Utensils,
  ClipboardCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Edit2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import type { EventWithMeta } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import './EventRegistrationPage.css';

type RoleOption = 'Participant' | 'Volunteer' | 'Speaker';

export const EventRegistrationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();

  const [event, setEvent] = useState<EventWithMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);
  const [finalStatus, setFinalStatus] = useState<'approved' | 'pending'>('pending');

  // Step 1: Profile editing toggle
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
    email: currentUser.email,
    phone: currentUser.phone || '',
    organization: currentUser.organization || '',
    jobTitle: currentUser.job_title || ''
  });

  // Step 2: Role Selection
  const [selectedRole, setSelectedRole] = useState<RoleOption>('Participant');

  // Step 3: Role-Specific Answers
  const [roleAnswers, setRoleAnswers] = useState({
    // Participant
    attendanceType: 'In-person',
    attendanceGoals: '',
    // Volunteer
    volunteerArea: 'Registration',
    volunteerHours: 'Full Day',
    // Speaker
    sessionTopic: '',
    bio: '',
    websiteOrLinkedIn: ''
  });

  // Step 4: Accessibility / Accommodations (Section 11)
  const [needsAccommodations, setNeedsAccommodations] = useState<'No' | 'Yes' | 'Prefer not to say'>('No');
  const [selectedSupports, setSelectedSupports] = useState<string[]>([]);
  const [additionalAccommodationNotes, setAdditionalAccommodationNotes] = useState('');

  // Step 5: Dietary Requirements (Section 12)
  const [dietaryChoice, setDietaryChoice] = useState('None');
  const [customDietary, setCustomDietary] = useState('');

  useEffect(() => {
    if (!id) return;
    eventService.getEventById(id).then((evt) => {
      setEvent(evt);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading || !event) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) var(--space-4)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Loading event registration...</p>
      </div>
    );
  }

  const handleSupportCheckbox = (support: string) => {
    setSelectedSupports((prev) =>
      prev.includes(support) ? prev.filter((s) => s !== support) : [...prev, support]
    );
  };

  const handleSaveProfileEdits = () => {
    updateProfile({
      first_name: profileForm.firstName,
      last_name: profileForm.lastName,
      email: profileForm.email,
      phone: profileForm.phone,
      organization: profileForm.organization,
      job_title: profileForm.jobTitle
    });
    setIsEditingProfile(false);
  };

  const handleSubmitRegistration = async () => {
    setIsSubmitting(true);

    const willBeApproved = event.approval_mode === 'automatic' && selectedRole === 'Participant';
    const statusResult = willBeApproved ? 'approved' : 'pending';

    await registrationService.createRegistration({
      event_id: event.id,
      user_id: currentUser.id,
      event_role_id: `role-${selectedRole.toLowerCase()}`,
      status: statusResult,
      requires_accommodation: needsAccommodations === 'Yes',
      accommodation_details:
        needsAccommodations === 'Yes'
          ? `${selectedSupports.join(', ')}. ${additionalAccommodationNotes}`.trim()
          : undefined,
      dietary_requirements: dietaryChoice === 'Other' ? customDietary : dietaryChoice,
      session_topic: selectedRole === 'Speaker' ? roleAnswers.sessionTopic : undefined,
      volunteer_availability: selectedRole === 'Volunteer' ? `${roleAnswers.volunteerArea} (${roleAnswers.volunteerHours})` : undefined,
      attendance_goals: selectedRole === 'Participant' ? roleAnswers.attendanceGoals : undefined
    });

    setIsSubmitting(false);
    setFinalStatus(statusResult);
    setRegistrationSubmitted(true);
  };

  // SUCCESS SCREEN (Prompt Section 14)
  if (registrationSubmitted) {
    return (
      <div className="container reg-success-container">
        <div className="reg-success-card">
          <div className="reg-success-icon">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="reg-success-title">✓ Registration Submitted</h1>
          <p className="reg-success-event">{event.name}</p>

          <div className="reg-success-badge-row">
            <span className="role-tag">Role: {selectedRole}</span>
            <StatusBadge
              status={finalStatus === 'approved' ? 'approved' : 'pending'}
              label={finalStatus === 'approved' ? 'Approved' : 'Pending Review'}
            />
          </div>

          <div className="reg-success-message">
            {finalStatus === 'approved' ? (
              <p>You are registered for this event as a {selectedRole}.</p>
            ) : (
              <p>Your registration has been submitted and is waiting for organizer approval.</p>
            )}
          </div>

          <div className="reg-success-actions">
            <Link to={`/events/${event.id}`}>
              <Button variant="outline" size="md">
                View Event
              </Button>
            </Link>
            <Link to="/my-events">
              <Button variant="primary" size="md">
                View My Events
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container reg-wizard-page">
      {/* Top Header */}
      <div className="reg-wizard-header">
        <button type="button" onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={16} />
          <span>Exit Registration</span>
        </button>
        <div className="reg-wizard-title-group">
          <h1>Event Registration</h1>
          <p className="reg-event-name">{event.name}</p>
        </div>

        {/* Steps Progress Indicator (Dynamically skips Dietary if disabled by organizer) */}
        <div className="steps-progress" aria-label="Registration Steps">
          {[
            { num: 1, label: 'About You' },
            { num: 2, label: 'Participation' },
            { num: 3, label: 'Role Details' },
            { num: 4, label: 'Accessibility' },
            ...(event.collect_dietary !== false ? [{ num: 5, label: 'Dietary' }] : []),
            { num: 6, label: 'Review' }
          ].map((s) => (
            <div
              key={s.num}
              className={`step-item ${step === s.num ? 'step-item--active' : step > s.num ? 'step-item--completed' : ''}`}
            >
              <div className="step-circle">{s.num}</div>
              <span className="step-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reg-wizard-card">
        {/* ====================================================================
            STEP 1: ABOUT YOU (Prompt Section 10)
            ==================================================================== */}
        {step === 1 && (
          <div className="wizard-step">
            <div className="wizard-step__header">
              <User size={24} className="wizard-step__icon" />
              <div>
                <h2>Step 1: About You</h2>
                <p>We pre-filled this from your profile so you don't have to retype information.</p>
              </div>
            </div>

            {!isEditingProfile ? (
              <div className="profile-display-card">
                <div className="profile-display-grid">
                  <div>
                    <span className="display-label">Full Name</span>
                    <span className="display-value">{currentUser.first_name} {currentUser.last_name}</span>
                  </div>
                  <div>
                    <span className="display-label">Email</span>
                    <span className="display-value">{currentUser.email}</span>
                  </div>
                  <div>
                    <span className="display-label">Phone</span>
                    <span className="display-value">{currentUser.phone || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="display-label">Organization / School</span>
                    <span className="display-value">{currentUser.organization || 'Not provided'}</span>
                  </div>
                  <div>
                    <span className="display-label">Job Title / Programme</span>
                    <span className="display-value">{currentUser.job_title || 'Not provided'}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingProfile(true)}
                  leftIcon={<Edit2 size={14} />}
                  style={{ marginTop: 'var(--space-4)' }}
                >
                  Edit profile information
                </Button>
              </div>
            ) : (
              <div className="profile-edit-box">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <Input
                    label="First Name"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  />
                  <Input
                    label="Last Name"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  />
                </div>
                <Input
                  label="Email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <Input
                    label="Organization"
                    value={profileForm.organization}
                    onChange={(e) => setProfileForm({ ...profileForm, organization: e.target.value })}
                  />
                  <Input
                    label="Job Title / Programme"
                    value={profileForm.jobTitle}
                    onChange={(e) => setProfileForm({ ...profileForm, jobTitle: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button variant="primary" size="sm" onClick={handleSaveProfileEdits}>
                    Save Changes
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="wizard-step__nav">
              <div />
              <Button variant="primary" size="md" onClick={() => setStep(2)} rightIcon={<ArrowRight size={16} />}>
                Continue to Participation Role
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STEP 2: HOW ARE YOU PARTICIPATING? (Prompt Section 10)
            ==================================================================== */}
        {step === 2 && (
          <div className="wizard-step">
            <div className="wizard-step__header">
              <Users size={24} className="wizard-step__icon" />
              <div>
                <h2>Step 2: How Are You Participating?</h2>
                <p>Choose how you want to participate in {event.name}.</p>
              </div>
            </div>

            <div className="role-selection-options">
              {[
                {
                  id: 'Participant',
                  title: 'Participant',
                  desc: 'Attend sessions, participate in audience Q&A, and network with speakers and attendees.'
                },
                {
                  id: 'Volunteer',
                  title: 'Volunteer',
                  desc: 'Support the event team with registration desks, stage tech, directions, and attendee coordination.'
                },
                {
                  id: 'Speaker',
                  title: 'Speaker',
                  desc: 'Deliver a talk, panel presentation, or hands-on breakout session.'
                }
              ].map((role) => (
                <label
                  key={role.id}
                  className={`role-option-card ${selectedRole === role.id ? 'role-option-card--selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="eventRole"
                    value={role.id}
                    checked={selectedRole === role.id}
                    onChange={() => setSelectedRole(role.id as RoleOption)}
                    className="role-radio"
                  />
                  <div className="role-option-content">
                    <div className="role-option-title">{role.title}</div>
                    <p className="role-option-desc">{role.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="wizard-step__nav">
              <Button variant="outline" size="md" onClick={() => setStep(1)} leftIcon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(3)} rightIcon={<ArrowRight size={16} />}>
                Next: Role Information
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STEP 3: ROLE-SPECIFIC INFORMATION (Prompt Section 10)
            ==================================================================== */}
        {step === 3 && (
          <div className="wizard-step">
            <div className="wizard-step__header">
              <Briefcase size={24} className="wizard-step__icon" />
              <div>
                <h2>Step 3: Role-Specific Details</h2>
                <p>Questions tailored specifically for <strong>{selectedRole}s</strong>.</p>
              </div>
            </div>

            {selectedRole === 'Participant' && (
              <div className="role-fields">
                <Select
                  label="Attendance Type"
                  value={roleAnswers.attendanceType}
                  onChange={(e) => setRoleAnswers({ ...roleAnswers, attendanceType: e.target.value })}
                  options={[
                    { value: 'In-person', label: 'In-person (at venue)' },
                    { value: 'Virtual', label: 'Virtual (live stream & interactive chat)' }
                  ]}
                />
                <Textarea
                  label="What do you hope to gain from this event?"
                  placeholder="e.g. Networking with accessibility researchers, learning about system scaling..."
                  value={roleAnswers.attendanceGoals}
                  onChange={(e) => setRoleAnswers({ ...roleAnswers, attendanceGoals: e.target.value })}
                  helperText="Helps organizers tailor discussion sessions"
                />
              </div>
            )}

            {selectedRole === 'Volunteer' && (
              <div className="role-fields">
                <Select
                  label="Preferred Volunteer Area"
                  value={roleAnswers.volunteerArea}
                  onChange={(e) => setRoleAnswers({ ...roleAnswers, volunteerArea: e.target.value })}
                  options={[
                    { value: 'Registration', label: 'Attendee Registration & Badging' },
                    { value: 'Technical support', label: 'Technical & AV Support' },
                    { value: 'Logistics', label: 'Hall Logistics & Signage' },
                    { value: 'Media', label: 'Photography & Social Media' },
                    { value: 'General assistance', label: 'General Assistance & Accessibility Guidance' }
                  ]}
                />
                <Select
                  label="Availability Schedule"
                  value={roleAnswers.volunteerHours}
                  onChange={(e) => setRoleAnswers({ ...roleAnswers, volunteerHours: e.target.value })}
                  options={[
                    { value: 'Full Day', label: 'Full Day (Morning setup through closing)' },
                    { value: 'Morning Shift', label: 'Morning Shift (08:00 - 13:00)' },
                    { value: 'Afternoon Shift', label: 'Afternoon Shift (13:00 - 18:00)' }
                  ]}
                />
              </div>
            )}

            {selectedRole === 'Speaker' && (
              <div className="role-fields">
                <Input
                  label="Session / Presentation Topic"
                  placeholder="e.g. Building Resilient Microservices for Live Events"
                  value={roleAnswers.sessionTopic}
                  onChange={(e) => setRoleAnswers({ ...roleAnswers, sessionTopic: e.target.value })}
                  required
                />
                <Textarea
                  label="Short Biography"
                  placeholder="Brief summary of your professional background (2-3 sentences)..."
                  value={roleAnswers.bio}
                  onChange={(e) => setRoleAnswers({ ...roleAnswers, bio: e.target.value })}
                  required
                />
                <Input
                  label="LinkedIn or Website URL"
                  placeholder="https://linkedin.com/in/username"
                  value={roleAnswers.websiteOrLinkedIn}
                  onChange={(e) => setRoleAnswers({ ...roleAnswers, websiteOrLinkedIn: e.target.value })}
                />
              </div>
            )}

            <div className="wizard-step__nav">
              <Button variant="outline" size="md" onClick={() => setStep(2)} leftIcon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(4)} rightIcon={<ArrowRight size={16} />}>
                Next: Accessibility
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STEP 4: ACCESSIBILITY / ACCOMMODATION (Prompt Section 11)
            ==================================================================== */}
        {step === 4 && (
          <div className="wizard-step">
            <div className="wizard-step__header">
              <ShieldCheck size={24} className="wizard-step__icon" />
              <div>
                <h2>Step 4: Accessibility & Support</h2>
                <p>We ensure everyone can participate fully. This information is kept private and confidential.</p>
              </div>
            </div>

            {/* Inclusive question (Section 11) */}
            <div className="form-field">
              <label className="form-field__label">
                Do you need any accommodations or accessibility support to participate in this event?
              </label>
              <div className="radio-group-horizontal">
                {(['No', 'Yes', 'Prefer not to say'] as const).map((opt) => (
                  <label key={opt} className="radio-pill">
                    <input
                      type="radio"
                      name="needsAccommodations"
                      value={opt}
                      checked={needsAccommodations === opt}
                      onChange={() => setNeedsAccommodations(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Support checkboxes (If Yes) */}
            {needsAccommodations === 'Yes' && (
              <div className="accommodations-box">
                <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-3)' }}>
                  What support do you need?
                </h4>
                <div className="accommodations-checkboxes">
                  {[
                    'Wheelchair / step-free access',
                    'Accessible seating',
                    'Sign-language interpretation',
                    'Live captions',
                    'Assistive listening support',
                    'Large-print materials',
                    'Accessible digital materials',
                    'Quiet / sensory-friendly space',
                    'Support person / companion',
                    'Other'
                  ].map((support) => (
                    <label key={support} className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={selectedSupports.includes(support)}
                        onChange={() => handleSupportCheckbox(support)}
                      />
                      <span>{support}</span>
                    </label>
                  ))}
                </div>

                <div style={{ marginTop: 'var(--space-4)' }}>
                  <Textarea
                    label="Is there anything else we should know to help you participate?"
                    placeholder="Provide details for our accessibility coordinator..."
                    value={additionalAccommodationNotes}
                    onChange={(e) => setAdditionalAccommodationNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="wizard-step__nav">
              <Button variant="outline" size="md" onClick={() => setStep(3)} leftIcon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(event.collect_dietary !== false ? 5 : 6)}
                rightIcon={<ArrowRight size={16} />}
              >
                {event.collect_dietary !== false ? 'Next: Dietary Requirements' : 'Next: Review Registration'}
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STEP 5: DIETARY REQUIREMENTS (Prompt Section 12)
            ==================================================================== */}
        {step === 5 && event.collect_dietary !== false && (
          <div className="wizard-step">
            <div className="wizard-step__header">
              <Utensils size={24} className="wizard-step__icon" />
              <div>
                <h2>Step 5: Dietary Needs</h2>
                <p>Food and refreshments are provided during breaks.</p>
              </div>
            </div>

            <div className="form-field">
              <label className="form-field__label">Do you have any dietary requirements?</label>
              <div className="dietary-options-grid">
                {['None', 'Vegetarian', 'Vegan', 'Halal', 'Food allergies', 'Other'].map((diet) => (
                  <label key={diet} className={`dietary-card ${dietaryChoice === diet ? 'dietary-card--selected' : ''}`}>
                    <input
                      type="radio"
                      name="dietaryChoice"
                      value={diet}
                      checked={dietaryChoice === diet}
                      onChange={() => setDietaryChoice(diet)}
                    />
                    <span>{diet}</span>
                  </label>
                ))}
              </div>
            </div>

            {dietaryChoice === 'Other' && (
              <Input
                label="Please specify your dietary requirement"
                placeholder="e.g. Gluten-free, Kosher, Nut allergy..."
                value={customDietary}
                onChange={(e) => setCustomDietary(e.target.value)}
                required
              />
            )}

            <div className="wizard-step__nav">
              <Button variant="outline" size="md" onClick={() => setStep(4)} leftIcon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(6)} rightIcon={<ArrowRight size={16} />}>
                Next: Review Registration
              </Button>
            </div>
          </div>
        )}

        {/* ====================================================================
            STEP 6: REGISTRATION REVIEW SCREEN (Prompt Section 13)
            ==================================================================== */}
        {step === 6 && (
          <div className="wizard-step">
            <div className="wizard-step__header">
              <ClipboardCheck size={24} className="wizard-step__icon" />
              <div>
                <h2>Step 6: Review & Submit</h2>
                <p>Please confirm your details before completing registration.</p>
              </div>
            </div>

            <div className="review-sections-list">
              <Card className="review-card">
                <CardContent>
                  <h4 className="review-card__heading">Your Information</h4>
                  <p><strong>Name:</strong> {currentUser.first_name} {currentUser.last_name}</p>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Phone:</strong> {currentUser.phone || 'None provided'}</p>
                </CardContent>
              </Card>

              <Card className="review-card">
                <CardContent>
                  <h4 className="review-card__heading">Participation</h4>
                  <p><strong>Role:</strong> {selectedRole}</p>
                  {selectedRole === 'Speaker' && (
                    <p><strong>Topic:</strong> {roleAnswers.sessionTopic || 'General Presentation'}</p>
                  )}
                  {selectedRole === 'Volunteer' && (
                    <p><strong>Area:</strong> {roleAnswers.volunteerArea}</p>
                  )}
                </CardContent>
              </Card>

              <Card className="review-card">
                <CardContent>
                  <h4 className="review-card__heading">Accessibility</h4>
                  <p>
                    {needsAccommodations === 'Yes'
                      ? selectedSupports.length > 0
                        ? selectedSupports.join(', ')
                        : 'Accommodations requested'
                      : 'No accommodations requested'}
                  </p>
                </CardContent>
              </Card>

              <Card className="review-card">
                <CardContent>
                  <h4 className="review-card__heading">Dietary Requirements</h4>
                  <p>{dietaryChoice === 'Other' ? customDietary : dietaryChoice}</p>
                </CardContent>
              </Card>
            </div>

            <div className="wizard-step__nav">
              <Button
                variant="outline"
                size="md"
                onClick={() => setStep(event.collect_dietary !== false ? 5 : 4)}
                leftIcon={<ArrowLeft size={16} />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmitRegistration}
                isLoading={isSubmitting}
              >
                Submit Registration
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
