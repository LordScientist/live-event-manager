import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Lock,
  LogOut,
  Edit2,
  Check,
  Camera
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import './UserProfilePage.css';

export const UserProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateProfile, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
    email: currentUser.email,
    phone: currentUser.phone || '',
    organization: currentUser.organization || '',
    jobTitle: currentUser.job_title || ''
  });

  // Preferences State (Prompt Section 20)
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

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      job_title: formData.jobTitle
    });
    setIsEditing(false);
    setSuccessMessage('Profile updated successfully.');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handlePreferencesToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setSuccessMessage('Notification preferences saved.');
      setTimeout(() => setSuccessMessage(null), 2500);
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

  return (
    <div className="container user-profile-page">
      {/* Page Title */}
      <div className="profile-page-header">
        <h1>Profile & Preferences</h1>
        <p>Manage your personal contact details, organizational affiliations, and update notifications.</p>
      </div>

      {successMessage && (
        <Alert type="success" title="Success" className="profile-alert">
          {successMessage}
        </Alert>
      )}

      <div className="profile-layout-grid">
        {/* Left Column: Personal & Academic Cards */}
        <div className="profile-main-col">
          {/* PERSONAL INFORMATION (Prompt Section 20) */}
          <Card className="profile-section-card">
            <CardHeader className="profile-card-header">
              <div className="header-title-row">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    leftIcon={<Edit2 size={14} />}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
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
                  <h3 className="profile-display-name">{currentUser.first_name} {currentUser.last_name}</h3>
                  <span className="profile-account-tag">Registered Account (Participant & Attendee)</span>
                </div>
              </div>

              {!isEditing ? (
                <div className="profile-info-fields">
                  <div className="info-field-item">
                    <span className="info-field-label">First Name</span>
                    <span className="info-field-val">{currentUser.first_name}</span>
                  </div>
                  <div className="info-field-item">
                    <span className="info-field-label">Last Name</span>
                    <span className="info-field-val">{currentUser.last_name}</span>
                  </div>
                  <div className="info-field-item">
                    <span className="info-field-label">Email Address</span>
                    <span className="info-field-val">{currentUser.email}</span>
                  </div>
                  <div className="info-field-item">
                    <span className="info-field-label">Phone Number</span>
                    <span className="info-field-val">{currentUser.phone || 'Not specified'}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSave} className="profile-edit-form">
                  <div className="edit-form-grid">
                    <Input
                      label="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                    <Input
                      label="Last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Email address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    helperText="Used for SMS and urgent live updates"
                  />
                  <div className="form-action-buttons">
                    <Button type="submit" variant="primary" size="sm" leftIcon={<Check size={14} />}>
                      Save Changes
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* PROFESSIONAL / ACADEMIC INFORMATION (Prompt Section 20) */}
          <Card className="profile-section-card">
            <CardHeader>
              <CardTitle>Professional & Academic Information</CardTitle>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="profile-info-fields">
                  <div className="info-field-item">
                    <span className="info-field-label">Organization / Institution</span>
                    <span className="info-field-val">{currentUser.organization || 'Not provided'}</span>
                  </div>
                  <div className="info-field-item">
                    <span className="info-field-label">Job Title / Programme</span>
                    <span className="info-field-val">{currentUser.job_title || 'Not provided'}</span>
                  </div>
                </div>
              ) : (
                <div className="edit-form-grid">
                  <Input
                    label="Organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                  <Input
                    label="Job title / Programme"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preferences & Security Actions */}
        <div className="profile-side-col">
          {/* PREFERENCES (Prompt Section 20) */}
          <Card className="profile-section-card">
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Bell size={18} />
                <span>Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="preferences-list">
                <label className="preference-item">
                  <div className="preference-item__text">
                    <span className="preference-title">Email notifications</span>
                    <span className="preference-desc">Receive registration confirmations and event tickets via email.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={() => handlePreferencesToggle('emailNotifications')}
                    className="preference-toggle"
                  />
                </label>

                <label className="preference-item">
                  <div className="preference-item__text">
                    <span className="preference-title">Event update notifications</span>
                    <span className="preference-desc">Real-time alerts when schedules or room locations change.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.eventUpdateNotifications}
                    onChange={() => handlePreferencesToggle('eventUpdateNotifications')}
                    className="preference-toggle"
                  />
                </label>

                <label className="preference-item">
                  <div className="preference-item__text">
                    <span className="preference-title">Reminder notifications</span>
                    <span className="preference-desc">Notifications 1 hour before booked sessions begin.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.reminderNotifications}
                    onChange={() => handlePreferencesToggle('reminderNotifications')}
                    className="preference-toggle"
                  />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* ACTIONS CARD (Prompt Section 20) */}
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
  );
};
