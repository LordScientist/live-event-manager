import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronsLeft, User } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import './AuthPages.css';

export const RoleConfirmedPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve selected role from navigation state or localStorage fallback
  const stateRole = (location.state as { role?: string } | null)?.role;
  const savedRole = localStorage.getItem('selected_signup_role') || 'Attendee';
  const role = stateRole || savedRole;

  const isManager = role === 'Event Manager';

  const handleContinue = () => {
    if (isManager) {
      navigate('/manager');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="auth-page auth-page--signup role-confirmed-page">
      {/* World Map Backdrop (Light mode only via CSS, untouched in dark mode) */}
      <div className="signup-map-backdrop" aria-hidden="true" />

      <div className="auth-card auth-card--signup role-confirmed-card">
        {/* Top navigation */}
        <div className="signup-top-nav">
          <button
            type="button"
            className="signup-back-btn"
            onClick={() => navigate('/signup')}
            aria-label="Go back to sign up"
          >
            <ChevronsLeft size={28} className="signup-back-icon" />
          </button>
          <div className="signup-top-actions">
            <ThemeToggle size="sm" />
          </div>
        </div>

        {/* Center content */}
        <div className="role-confirmed-content">
          {/* Avatar Icon */}
          <div className="role-confirmed-avatar">
            <User size={72} strokeWidth={2.2} className="role-confirmed-avatar-icon" />
          </div>

          {/* Heading */}
          <h1 className="role-confirmed-title">Role Selected</h1>

          {/* Registered statement */}
          <h2 className="role-confirmed-subtitle">
            You&apos;re registered <br />
            as an <strong className="role-confirmed-highlight">{role}!</strong>
          </h2>

          {/* Description text */}
          <p className="role-confirmed-desc">
            You can now explore events, view your schedule and get real-time update.
          </p>

          {/* Large orange pill button */}
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleContinue}
            className="role-confirmed-btn"
          >
            CONTINUE
          </Button>
        </div>
      </div>
    </div>
  );
};
