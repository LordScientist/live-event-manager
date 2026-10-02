import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Lock,
  LogOut,
  Pencil,
  Check,
  X,
  Camera
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import type { UserProfile } from '../../types';
import decorTopRight from '../../assets/updates-decor-top-right.png';
import decorBottomRight from '../../assets/updates-decor-bottom-right.png';
import './UserProfilePage.css';

const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Nut Allergy'];
const ACCESSIBILITY_OPTIONS = [
  'None',
  'Wheelchair access',
  'Sign language / CART',
  'Front row priority seating',
  'Sensory quiet space'
];

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logout } = useAuth();

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Track which field is currently being edited inline
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState<string>('');

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    eventUpdateNotifications: true,
    reminderNotifications: true
  });

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const startEditing = (fieldKey: string, initialVal: string) => {
    setEditingField(fieldKey);
    setFieldValue(initialVal);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setFieldValue('');
  };

  const saveEditing = (fieldKey: keyof UserProfile) => {
    updateProfile({ [fieldKey]: fieldValue.trim() || undefined });
    setEditingField(null);
    setSuccessMessage('Field updated successfully.');
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  const handlePreferencesToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setSuccessMessage('Notification preference updated.');
      setTimeout(() => setSuccessMessage(null), 2000);
      return updated;
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setShowPasswordModal(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSuccessMessage('Password changed successfully.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper renderer for an inline editable field
  const renderEditableField = (
    label: string,
    fieldKey: keyof UserProfile,
    currentVal?: string,
    options?: string[]
  ) => {
    const isThisFieldEditing = editingField === fieldKey;
    const displayVal = currentVal || 'Not specified';

    return (
      <div className="profile-editable-item" key={fieldKey}>
        <div className="profile-editable-item__header">
          <span className="profile-editable-item__label">{label}</span>
          {!isThisFieldEditing && (
            <button
              type="button"
              className="profile-editable-item__pen-btn"
              onClick={() => startEditing(fieldKey, currentVal || '')}
              aria-label={`Edit ${label}`}
              title={`Edit ${label}`}
            >
              <Pencil size={14} />
            </button>
          )}
        </div>

        {isThisFieldEditing ? (
          <div className="profile-inline-form">
            {options ? (
              <select
                className="profile-inline-select"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                autoFocus
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={fieldKey === 'email' ? 'email' : fieldKey === 'phone' ? 'tel' : 'text'}
                className="profile-inline-input"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEditing(fieldKey);
                  if (e.key === 'Escape') cancelEditing();
                }}
                autoFocus
              />
            )}
            <button
              type="button"
              className="profile-inline-btn profile-inline-btn--save"
              onClick={() => saveEditing(fieldKey)}
              aria-label="Save"
              title="Save"
            >
              <Check size={14} />
            </button>
            <button
              type="button"
              className="profile-inline-btn profile-inline-btn--cancel"
              onClick={cancelEditing}
              aria-label="Cancel"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <span className="profile-editable-item__val">{displayVal}</span>
        )}
      </div>
    );
  };

  return (
    <div className="user-profile-page">
      {/* Decorative background shapes */}
      <img
        src={decorTopRight}
        alt=""
        className="profile-decor-top-right"
        aria-hidden="true"
      />
      <img
        src={decorBottomRight}
        alt=""
        className="profile-decor-bottom-right"
        aria-hidden="true"
      />

      <div className="profile-content-wrap">
        {/* Page Title */}
        <div className="profile-page-header">
          <h1 className="profile-page-title">Profile & Preferences</h1>
        </div>

      {successMessage && (
        <Alert type="success" title="Success" className="profile-alert">
          {successMessage}
        </Alert>
      )}

      <div className="profile-layout-grid">
        {/* Left Column: Personal, Event Accommodations & Academic Cards */}
        <div className="profile-main-col">
          {/* PERSONAL INFORMATION */}
          <Card className="profile-section-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Profile Photo */}
              <div className="profile-photo-row">
                <div className="profile-photo-avatar">
                  {currentUser.first_name[0]}{currentUser.last_name[0]}
                  <button type="button" className="photo-edit-badge" title="Change photo" aria-label="Change photo">
                    <Camera size={13} />
                  </button>
                </div>
                <div className="profile-photo-info">
                  <h3 className="profile-display-name">
                    {currentUser.first_name} {currentUser.last_name}
                  </h3>
                  <span className="profile-account-tag">
                    {currentUser.account_type === 'manager'
                      ? 'Event Manager & Operations'
                      : 'Participant & Attendee'}
                  </span>
                </div>
              </div>

              {/* Editable items with pen icons beside each item */}
              <div className="profile-editable-grid">
                {renderEditableField('First Name', 'first_name', currentUser.first_name)}
                {renderEditableField('Last Name', 'last_name', currentUser.last_name)}
                {renderEditableField('Email Address', 'email', currentUser.email)}
                {renderEditableField('Phone Number', 'phone', currentUser.phone)}
                {renderEditableField('Gender', 'gender', currentUser.gender, GENDER_OPTIONS)}
              </div>
            </CardContent>
          </Card>

          {/* PROFESSIONAL & ACADEMIC INFORMATION */}
          <Card className="profile-section-card">
            <CardHeader>
              <CardTitle>Professional & Academic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="profile-editable-grid">
                {renderEditableField('Organization / Institution', 'organization', currentUser.organization)}
                {renderEditableField('Job Title / Programme', 'job_title', currentUser.job_title)}
              </div>
            </CardContent>
          </Card>

          {/* EVENT REQUIREMENTS & PREFERENCES */}
          <Card className="profile-section-card">
            <CardHeader>
              <CardTitle>Event Coordination & Accommodations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="profile-editable-grid">
                {renderEditableField('Dietary Requirement', 'dietary', currentUser.dietary, DIETARY_OPTIONS)}
                {renderEditableField('Accessibility Accommodation', 'accessibility', currentUser.accessibility, ACCESSIBILITY_OPTIONS)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preferences & Security Actions */}
        <div className="profile-side-col">
          {/* PREFERENCES WITH COLOR-CHANGING TOGGLE BUTTONS */}
          <Card className="profile-section-card">
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Bell size={18} />
                <span>Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="preferences-list">
                <div className="preference-item">
                  <div className="preference-item__text">
                    <span className="preference-title">Theme appearance</span>
                    <span className="preference-desc">Switch between clean light mode and deep dark mode.</span>
                  </div>
                  <ThemeToggle size="sm" />
                </div>

                <div className="preference-item">
                  <div className="preference-item__text">
                    <span className="preference-title">Email notifications</span>
                    <span className="preference-desc">Receive registration confirmations and attendee credentials via email.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.emailNotifications}
                    className={`toggle-switch-btn ${
                      preferences.emailNotifications ? 'toggle-switch-btn--active' : ''
                    }`}
                    onClick={() => handlePreferencesToggle('emailNotifications')}
                    aria-label="Toggle email notifications"
                  >
                    <span className="toggle-switch-thumb" />
                  </button>
                </div>

                <div className="preference-item">
                  <div className="preference-item__text">
                    <span className="preference-title">Event update notifications</span>
                    <span className="preference-desc">Real-time alerts when schedules or room locations change.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.eventUpdateNotifications}
                    className={`toggle-switch-btn ${
                      preferences.eventUpdateNotifications ? 'toggle-switch-btn--active' : ''
                    }`}
                    onClick={() => handlePreferencesToggle('eventUpdateNotifications')}
                    aria-label="Toggle event update notifications"
                  >
                    <span className="toggle-switch-thumb" />
                  </button>
                </div>

                <div className="preference-item">
                  <div className="preference-item__text">
                    <span className="preference-title">Reminder notifications</span>
                    <span className="preference-desc">Notifications 1 hour before booked sessions begin.</span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={preferences.reminderNotifications}
                    className={`toggle-switch-btn ${
                      preferences.reminderNotifications ? 'toggle-switch-btn--active' : ''
                    }`}
                    onClick={() => handlePreferencesToggle('reminderNotifications')}
                    aria-label="Toggle reminder notifications"
                  >
                    <span className="toggle-switch-thumb" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ACTIONS CARD */}
          <Card className="profile-section-card">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="account-actions-content">
              <Button
                variant="outline"
                size="md"
                style={{ width: '100%' }}
                onClick={() => setShowPasswordModal(true)}
                leftIcon={<Lock size={16} />}
              >
                Change Password
              </Button>

              <Button
                variant="danger"
                size="md"
                style={{ width: '100%' }}
                onClick={handleLogout}
                leftIcon={<LogOut size={16} />}
              >
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>
              Change Password
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              Enter your current password and pick a new secure password.
            </p>

            {passwordError && (
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <Alert type="error" title="Error">
                  {passwordError}
                </Alert>
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <Input
                label="Current password"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
              <Input
                label="New password"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                helperText="Must be at least 8 characters"
                required
              />
              <Input
                label="Confirm new password"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
