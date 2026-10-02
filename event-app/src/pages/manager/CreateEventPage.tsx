import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Globe,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import { eventService } from '../../services/eventService';
import './CreateEventPage.css';

const CATEGORIES = ['Conference', 'Workshop', 'Seminar', 'Career', 'Community', 'Other'];

const COVER_PRESETS = [
  {
    name: 'Conference Hall',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Keynote & Tech',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Hands-on Lab',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80'
  },
  {
    name: 'Networking & Career',
    url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80'
  }
];

export const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Information (Section 24)
    name: '',
    description: '',
    category: 'Conference',
    cover_image: COVER_PRESETS[0].url,

    // Step 2: Date & Location (Section 25)
    start_date: '2026-11-20',
    end_date: '2026-11-20',
    start_time: '09:00',
    end_time: '17:00',
    format: 'physical' as 'physical' | 'online' | 'hybrid',
    venue: '',
    address: '',
    online_link: '',

    // Step 3: Registration Settings (Section 26)
    registration_status: 'open' as 'open' | 'closed',
    approval_mode: 'manual' as 'automatic' | 'manual',
    roles: ['Participant', 'Volunteer', 'Speaker'],
    capacity: 250,
    registration_deadline_date: '2026-11-15',
    registration_deadline_time: '23:59',

    // Step 4: Information to Collect & Accessibility (Section 27)
    accessibility_info: 'Wheelchair ramp at main entrance, sign language interpretation for main stage sessions, and accessible seating in rows 1-3.',
    collected_fields: [
      'organization',
      'job_title',
      'accessibility_requirements',
      'dietary_requirements',
      'support_person',
      'attendance_type',
      'emergency_assistance',
      'role_specific_questions'
    ]
  });

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleRole = (role: string) => {
    setFormData((prev) => {
      const exists = prev.roles.includes(role);
      const updated = exists ? prev.roles.filter((r) => r !== role) : [...prev.roles, role];
      if (updated.length === 0) return prev; // Keep at least one role
      return { ...prev, roles: updated };
    });
  };

  const toggleCollectedField = (field: string) => {
    setFormData((prev) => {
      const exists = prev.collected_fields.includes(field);
      return {
        ...prev,
        collected_fields: exists
          ? prev.collected_fields.filter((f) => f !== field)
          : [...prev.collected_fields, field]
      };
    });
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    if (step === 1) {
      if (!formData.name.trim()) {
        setError('Please enter an event name.');
        return false;
      }
      if (!formData.description.trim()) {
        setError('Please provide a brief event description.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.start_date || !formData.end_date) {
        setError('Please select start and end dates.');
        return false;
      }
      if (formData.format !== 'online' && !formData.venue.trim()) {
        setError('Please specify a physical venue name.');
        return false;
      }
      if (formData.format === 'online' && !formData.online_link.trim()) {
        setError('Please enter the online meeting link or streaming URL.');
        return false;
      }
    } else if (step === 3) {
      if (formData.roles.length === 0) {
        setError('Please select at least one participating role.');
        return false;
      }
      if (formData.capacity <= 0) {
        setError('Capacity must be greater than zero.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    setSubmitting(true);
    try {
      const startDateTime = `${formData.start_date}T${formData.start_time}:00Z`;
      const endDateTime = `${formData.end_date}T${formData.end_time}:00Z`;
      const deadline = `${formData.registration_deadline_date}T${formData.registration_deadline_time}:00Z`;

      await eventService.createEvent({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        cover_image: formData.cover_image,
        start_date: startDateTime,
        end_date: endDateTime,
        venue: formData.format === 'online' ? 'Online' : formData.venue,
        location_details: formData.format === 'online' ? formData.online_link : formData.address,
        format: formData.format,
        online_link: formData.online_link,
        status,
        approval_mode: formData.approval_mode,
        roles: formData.roles,
        capacity: formData.capacity,
        registration_deadline: deadline,
        accessibility_info: formData.accessibility_info,
        collected_fields: formData.collected_fields
      });

      navigate('/manager/events');
    } catch (err) {
      console.error(err);
      setError('Failed to create event. Please verify all fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-event-page">
      {/* Header */}
      <div className="create-event-header">
        <div>
          <h1 className="create-event-header__title">Create Event</h1>
          <p className="create-event-header__subtitle">
            Configure schedule details, registration settings, and inclusive attendee fields.
          </p>
        </div>
        <Link to="/manager/events">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={16} />}>
            Cancel
          </Button>
        </Link>
      </div>

      {/* Progress Indicator (Prompt Section 23) */}
      <nav className="wizard-progress-bar" aria-label="Event Creation Steps">
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Date & Location' },
          { num: 3, label: 'Registration' },
          { num: 4, label: 'Accessibility & Fields' },
          { num: 5, label: 'Review & Publish' }
        ].map((step, idx) => {
          const isCompleted = currentStep > step.num;
          const isActive = currentStep === step.num;

          return (
            <React.Fragment key={step.num}>
              {idx > 0 && <span className="wizard-step-separator" aria-hidden="true">›</span>}
              <button
                type="button"
                className={`wizard-step-node ${isActive ? 'wizard-step-node--active' : ''} ${
                  isCompleted ? 'wizard-step-node--completed' : ''
                }`}
                onClick={() => isCompleted && setCurrentStep(step.num)}
                disabled={!isCompleted && !isActive}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="wizard-step-node__num">
                  {isCompleted ? <Check size={14} /> : step.num}
                </span>
                <span>{step.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {error && (
        <div style={{ marginBottom: 'var(--space-2)' }}>
          <Alert type="error" title="Required Information Missing">
            {error}
          </Alert>
        </div>
      )}

      {/* STEP 1: BASIC INFORMATION (Prompt Section 24) */}
      {currentStep === 1 && (
        <div className="wizard-step-card">
          <div>
            <h2 className="wizard-step-title">Step 1 — Basic Information</h2>
            <p className="wizard-step-desc">
              Provide the core identity and summary for your event.
            </p>
          </div>

          <Input
            label="Event Name"
            placeholder="e.g. KNUST Technology Conference 2026"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />

          <div className="wizard-field-group">
            <label className="wizard-field-label">Category</label>
            <div className="category-pill-selector">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-pill-btn ${formData.category === cat ? 'category-pill-btn--active' : ''}`}
                  onClick={() => updateField('category', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="wizard-field-group">
            <label className="wizard-field-label">Description</label>
            <span className="wizard-field-label-desc">
              Explain the agenda, target audience, and what attendees will experience.
            </span>
            <textarea
              className="wizard-textarea"
              placeholder="Describe your event..."
              rows={4}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              required
            />
          </div>

          <div className="wizard-field-group">
            <label className="wizard-field-label">Cover Image</label>
            <span className="wizard-field-label-desc">
              Select a themed cover or provide an image link.
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              {COVER_PRESETS.map((preset) => (
                <div
                  key={preset.name}
                  onClick={() => updateField('cover_image', preset.url)}
                  style={{
                    height: '80px',
                    borderRadius: 'var(--radius-md)',
                    backgroundImage: `url(${preset.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    border: formData.cover_image === preset.url ? '3px solid var(--color-primary)' : '1px solid var(--color-border)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  title={preset.name}
                >
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#ffffff',
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      padding: '2px 4px',
                      textAlign: 'center'
                    }}
                  >
                    {preset.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="wizard-nav-footer">
            <div />
            <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />} onClick={handleNext}>
              Continue to Date & Location
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & LOCATION (Prompt Section 25) */}
      {currentStep === 2 && (
        <div className="wizard-step-card">
          <div>
            <h2 className="wizard-step-title">Step 2 — Date & Location</h2>
            <p className="wizard-step-desc">
              When and where will this event take place?
            </p>
          </div>

          <div className="wizard-field-group">
            <label className="wizard-field-label">Attendance Format</label>
            <div className="format-selector-grid">
              <div
                className={`format-option-card ${formData.format === 'physical' ? 'format-option-card--active' : ''}`}
                onClick={() => updateField('format', 'physical')}
              >
                <MapPin size={22} />
                <span className="format-option-card__title">In-Person</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Physical venue</span>
              </div>
              <div
                className={`format-option-card ${formData.format === 'online' ? 'format-option-card--active' : ''}`}
                onClick={() => updateField('format', 'online')}
              >
                <Globe size={22} />
                <span className="format-option-card__title">Online</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Virtual / Stream</span>
              </div>
              <div
                className={`format-option-card ${formData.format === 'hybrid' ? 'format-option-card--active' : ''}`}
                onClick={() => updateField('format', 'hybrid')}
              >
                <Layers size={22} />
                <span className="format-option-card__title">Hybrid</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Both options</span>
              </div>
            </div>
          </div>

          <div className="wizard-form-grid-2">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => updateField('start_date', e.target.value)}
              required
            />
            <Input
              label="Start Time"
              type="time"
              value={formData.start_time}
              onChange={(e) => updateField('start_time', e.target.value)}
              required
            />
          </div>

          <div className="wizard-form-grid-2">
            <Input
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(e) => updateField('end_date', e.target.value)}
              required
            />
            <Input
              label="End Time"
              type="time"
              value={formData.end_time}
              onChange={(e) => updateField('end_time', e.target.value)}
              required
            />
          </div>

          {formData.format !== 'online' && (
            <>
              <Input
                label="Venue Name"
                placeholder="e.g. Great Hall, KNUST"
                value={formData.venue}
                onChange={(e) => updateField('venue', e.target.value)}
                required
              />
              <Input
                label="Physical Address / Location Details"
                placeholder="e.g. Main Campus, Kumasi, Ghana"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
              />
            </>
          )}

          {formData.format !== 'physical' && (
            <Input
              label="Online Meeting Link / Stream URL"
              placeholder="e.g. https://meet.google.com/xyz-abc or Zoom URL"
              value={formData.online_link}
              onChange={(e) => updateField('online_link', e.target.value)}
              required={formData.format === 'online'}
            />
          )}

          <div className="wizard-nav-footer">
            <Button variant="outline" size="md" leftIcon={<ArrowLeft size={16} />} onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />} onClick={handleNext}>
              Continue to Registration Settings
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: REGISTRATION SETTINGS (Prompt Section 26) */}
      {currentStep === 3 && (
        <div className="wizard-step-card">
          <div>
            <h2 className="wizard-step-title">Step 3 — Registration Settings</h2>
            <p className="wizard-step-desc">
              Control registration status, approval workflows, capacity, and participating roles.
            </p>
          </div>

          {/* Registration Status */}
          <div className="wizard-field-group">
            <label className="wizard-field-label">Registration Status</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button
                type="button"
                variant={formData.registration_status === 'open' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateField('registration_status', 'open')}
              >
                Open for Registration
              </Button>
              <Button
                type="button"
                variant={formData.registration_status === 'closed' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => updateField('registration_status', 'closed')}
              >
                Closed
              </Button>
            </div>
          </div>

          {/* Approval Mode */}
          <div className="wizard-field-group">
            <label className="wizard-field-label">Approval Workflow</label>
            <div className="approval-mode-grid">
              <div
                className={`approval-mode-card ${formData.approval_mode === 'automatic' ? 'approval-mode-card--active' : ''}`}
                onClick={() => updateField('approval_mode', 'automatic')}
              >
                <input
                  type="radio"
                  name="approval_mode"
                  checked={formData.approval_mode === 'automatic'}
                  onChange={() => updateField('approval_mode', 'automatic')}
                  style={{ marginTop: '2px' }}
                />
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Automatic Approval</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                    Registrations are immediately approved upon submission.
                  </div>
                </div>
              </div>

              <div
                className={`approval-mode-card ${formData.approval_mode === 'manual' ? 'approval-mode-card--active' : ''}`}
                onClick={() => updateField('approval_mode', 'manual')}
              >
                <input
                  type="radio"
                  name="approval_mode"
                  checked={formData.approval_mode === 'manual'}
                  onChange={() => updateField('approval_mode', 'manual')}
                  style={{ marginTop: '2px' }}
                />
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>Manual Review</div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--color-text-muted)' }}>
                    Organizers review and approve attendee requests before confirmation.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Roles (Prompt Section 26: Participant, Volunteer, Speaker) */}
          <div className="wizard-field-group">
            <label className="wizard-field-label">Available Roles</label>
            <span className="wizard-field-label-desc">
              Select which roles participants can sign up for.
            </span>
            <div className="wizard-checkbox-grid">
              {[
                { name: 'Participant', desc: 'General attendees joining sessions and workshops' },
                { name: 'Volunteer', desc: 'Event staff assisting coordinators and logistics' },
                { name: 'Speaker', desc: 'Presenters and panel guests leading sessions' }
              ].map((role) => {
                const checked = formData.roles.includes(role.name);
                return (
                  <label
                    key={role.name}
                    className={`wizard-checkbox-label ${checked ? 'wizard-checkbox-label--checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="wizard-checkbox-input"
                      checked={checked}
                      onChange={() => toggleRole(role.name)}
                    />
                    <div className="wizard-checkbox-text">
                      <span className="wizard-checkbox-name">{role.name}</span>
                      <span className="wizard-checkbox-desc">{role.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Registration Capacity & Deadline */}
          <div className="wizard-form-grid-2">
            <Input
              label="Registration Capacity (Maximum participants)"
              type="number"
              min={1}
              value={formData.capacity}
              onChange={(e) => updateField('capacity', parseInt(e.target.value) || 0)}
              required
            />
            <div className="wizard-form-grid-2" style={{ gap: 'var(--space-2)' }}>
              <Input
                label="Registration Deadline Date"
                type="date"
                value={formData.registration_deadline_date}
                onChange={(e) => updateField('registration_deadline_date', e.target.value)}
                required
              />
              <Input
                label="Deadline Time"
                type="time"
                value={formData.registration_deadline_time}
                onChange={(e) => updateField('registration_deadline_time', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="wizard-nav-footer">
            <Button variant="outline" size="md" leftIcon={<ArrowLeft size={16} />} onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />} onClick={handleNext}>
              Continue to Fields to Collect
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: INFORMATION TO COLLECT & ACCESSIBILITY (Prompt Section 27) */}
      {currentStep === 4 && (
        <div className="wizard-step-card">
          <div>
            <h2 className="wizard-step-title">Step 4 — Accessibility & Information to Collect</h2>
            <p className="wizard-step-desc">
              Specify what your venue supports and choose which questions to ask attendees.
            </p>
          </div>

          {/* Accessibility Disclosure (Prompt Section 9 & 27) */}
          <div className="wizard-field-group">
            <label className="wizard-field-label">Proactive Venue Accessibility Information</label>
            <span className="wizard-field-label-desc">
              Detail the physical and digital accessibility accommodations provided by default.
            </span>
            <textarea
              className="wizard-textarea"
              placeholder="e.g. Wheelchair ramp at main entrance, sign language interpretation, priority seating..."
              rows={3}
              value={formData.accessibility_info}
              onChange={(e) => updateField('accessibility_info', e.target.value)}
            />
          </div>

          {/* Optional Registration Fields Checkboxes (Prompt Section 27) */}
          <div className="wizard-field-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <label className="wizard-field-label">Optional Registration Fields</label>
              <span style={{ fontSize: '0.725rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                (Organizer choice)
              </span>
            </div>
            <span className="wizard-field-label-desc">
              Select which fields will be presented to attendees. Organizers are not forced to collect every field.
            </span>

            <div className="wizard-checkbox-grid">
              {[
                { id: 'organization', name: 'Organization', desc: 'Company, university, or affiliation' },
                { id: 'job_title', name: 'Job title / Programme', desc: 'Professional role or academic programme' },
                { id: 'accessibility_requirements', name: 'Accessibility requirements', desc: 'Sensory, physical, or communication accommodations' },
                { id: 'dietary_requirements', name: 'Dietary requirements', desc: 'Meals, allergies, or religious dietary needs' },
                { id: 'support_person', name: 'Support person', desc: 'Registration for a companion or personal assistant' },
                { id: 'attendance_type', name: 'Attendance type', desc: 'Confirm attending in-person vs online stream' },
                { id: 'emergency_assistance', name: 'Emergency assistance', desc: 'Evacuation support instructions' },
                { id: 'role_specific_questions', name: 'Role-specific questions', desc: 'Speaker topics, volunteer availability, goals' }
              ].map((field) => {
                const checked = formData.collected_fields.includes(field.id);
                return (
                  <label
                    key={field.id}
                    className={`wizard-checkbox-label ${checked ? 'wizard-checkbox-label--checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="wizard-checkbox-input"
                      checked={checked}
                      onChange={() => toggleCollectedField(field.id)}
                    />
                    <div className="wizard-checkbox-text">
                      <span className="wizard-checkbox-name">{field.name}</span>
                      <span className="wizard-checkbox-desc">{field.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="wizard-nav-footer">
            <Button variant="outline" size="md" leftIcon={<ArrowLeft size={16} />} onClick={handleBack}>
              Back
            </Button>
            <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />} onClick={handleNext}>
              Continue to Review
            </Button>
          </div>
        </div>
      )}

      {/* STEP 5: REVIEW & PUBLISH (Prompt Section 28) */}
      {currentStep === 5 && (
        <div className="wizard-step-card">
          <div>
            <h2 className="wizard-step-title">Step 5 — Review & Publish</h2>
            <p className="wizard-step-desc">
              Review your event configuration before publishing or saving as draft.
            </p>
          </div>

          <div className="review-preview-section">
            {/* 1. Event Information */}
            <div className="review-card">
              <div className="review-card__header">
                <span className="review-card__title">Event Information</span>
                <button type="button" className="review-card__edit-btn" onClick={() => setCurrentStep(1)}>
                  Edit
                </button>
              </div>
              <div className="review-card__grid">
                <div className="review-card__item">
                  <span className="review-card__label">Event Name</span>
                  <span className="review-card__val">{formData.name}</span>
                </div>
                <div className="review-card__item">
                  <span className="review-card__label">Category</span>
                  <span className="review-card__val">{formData.category}</span>
                </div>
                <div className="review-card__item" style={{ gridColumn: '1 / -1' }}>
                  <span className="review-card__label">Description</span>
                  <span className="review-card__val" style={{ fontWeight: 400 }}>{formData.description}</span>
                </div>
              </div>
            </div>

            {/* 2. Date & Location */}
            <div className="review-card">
              <div className="review-card__header">
                <span className="review-card__title">Date & Location</span>
                <button type="button" className="review-card__edit-btn" onClick={() => setCurrentStep(2)}>
                  Edit
                </button>
              </div>
              <div className="review-card__grid">
                <div className="review-card__item">
                  <span className="review-card__label">Dates</span>
                  <span className="review-card__val">{formData.start_date} to {formData.end_date}</span>
                </div>
                <div className="review-card__item">
                  <span className="review-card__label">Time</span>
                  <span className="review-card__val">{formData.start_time} – {formData.end_time}</span>
                </div>
                <div className="review-card__item">
                  <span className="review-card__label">Format</span>
                  <span className="review-card__val" style={{ textTransform: 'capitalize' }}>{formData.format}</span>
                </div>
                <div className="review-card__item">
                  <span className="review-card__label">Venue</span>
                  <span className="review-card__val">{formData.venue || 'Virtual Platform'}</span>
                </div>
              </div>
            </div>

            {/* 3. Registration Settings */}
            <div className="review-card">
              <div className="review-card__header">
                <span className="review-card__title">Registration Settings</span>
                <button type="button" className="review-card__edit-btn" onClick={() => setCurrentStep(3)}>
                  Edit
                </button>
              </div>
              <div className="review-card__grid">
                <div className="review-card__item">
                  <span className="review-card__label">Status</span>
                  <span className="review-card__val" style={{ textTransform: 'capitalize' }}>{formData.registration_status}</span>
                </div>
                <div className="review-card__item">
                  <span className="review-card__label">Approval Mode</span>
                  <span className="review-card__val">
                    {formData.approval_mode === 'automatic' ? 'Automatic Approval' : 'Manual Review'}
                  </span>
                </div>
                <div className="review-card__item">
                  <span className="review-card__label">Capacity Limit</span>
                  <span className="review-card__val">{formData.capacity} attendees</span>
                </div>
                <div className="review-card__item">
                  <span className="review-card__label">Deadline</span>
                  <span className="review-card__val">{formData.registration_deadline_date} ({formData.registration_deadline_time})</span>
                </div>
              </div>
            </div>

            {/* 4. Roles */}
            <div className="review-card">
              <div className="review-card__header">
                <span className="review-card__title">Configured Roles</span>
                <button type="button" className="review-card__edit-btn" onClick={() => setCurrentStep(3)}>
                  Edit
                </button>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {formData.roles.map((r) => (
                  <span
                    key={r}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    ✓ {r}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Accessibility */}
            <div className="review-card">
              <div className="review-card__header">
                <span className="review-card__title">Accessibility Summary</span>
                <button type="button" className="review-card__edit-btn" onClick={() => setCurrentStep(4)}>
                  Edit
                </button>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-main)', margin: 0 }}>
                {formData.accessibility_info || 'No specific venue notes provided.'}
              </p>
            </div>

            {/* 6. Information Collected */}
            <div className="review-card">
              <div className="review-card__header">
                <span className="review-card__title">Attendee Information Collected</span>
                <button type="button" className="review-card__edit-btn" onClick={() => setCurrentStep(4)}>
                  Edit
                </button>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {formData.collected_fields.map((f) => (
                  <span
                    key={f}
                    style={{
                      fontSize: '0.75rem',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-primary-light)',
                      color: 'var(--color-primary)',
                      fontWeight: 600
                    }}
                  >
                    {f.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons (Prompt Section 28: Save as Draft, Publish Event) */}
          <div className="wizard-nav-footer">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft size={16} />}
              onClick={handleBack}
              disabled={submitting}
            >
              Back
            </Button>
            <div className="wizard-nav-footer__right">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleSave('draft')}
                isLoading={submitting}
              >
                Save as Draft
              </Button>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Sparkles size={16} />}
                onClick={() => handleSave('published')}
                isLoading={submitting}
              >
                Publish Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
