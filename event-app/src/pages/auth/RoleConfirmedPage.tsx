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
      {/* World Map Backdrop Graphic */}
      <div className="signup-map-backdrop" aria-hidden="true">
        <svg
          className="signup-map-svg"
          viewBox="0 0 1000 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M175,120 C185,100 220,95 240,115 C260,135 250,165 240,185 C220,195 200,210 180,200 C160,190 150,150 175,120 Z"
            fill="currentColor"
          />
          <path
            d="M190,225 C230,230 260,280 240,320 C225,350 205,385 195,430 C180,450 160,430 165,390 C170,350 160,300 175,250 Z"
            fill="currentColor"
          />
          <path
            d="M480,95 C510,80 540,90 565,115 C580,130 575,155 550,170 C520,180 500,160 480,140 Z"
            fill="currentColor"
          />
          <path
            d="M475,210 C520,200 560,220 570,265 C580,315 570,370 545,430 C530,470 500,480 480,450 C465,420 460,370 455,320 C450,265 455,225 475,210 Z"
            fill="currentColor"
          />
          <path
            d="M590,110 C650,90 730,105 780,140 C830,175 870,220 860,270 C840,320 800,325 760,310 C720,295 680,260 640,240 C600,220 580,160 590,110 Z"
            fill="currentColor"
          />
          <path
            d="M740,410 C780,390 830,410 840,450 C850,490 820,530 780,540 C745,550 720,520 720,480 C720,440 725,420 740,410 Z"
            fill="currentColor"
          />
        </svg>
      </div>

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
