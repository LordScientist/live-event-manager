import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import {
  Calendar,
  Search,
  PlusCircle,
  Bell,
  Clock,
  MapPin,
  CheckCircle2,
  Users
} from 'lucide-react';
import './LandingPage.css';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Top Simple Header */}
      <header className="landing-header">
        <div className="container landing-header__inner">
          <div className="landing-header__brand">
            <span className="brand-logo" aria-hidden="true" style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'Georgia, serif' }}>
              <span style={{ color: '#1B2559' }}>L</span><span style={{ color: '#E8720C' }}>C</span>
            </span>
            <div className="brand-text">
              <span className="brand-title">Live Connect</span>
              <span className="brand-subtitle">Event Coordination System</span>
            </div>
          </div>
          <div className="landing-header__auth">
            <ThemeToggle size="sm" />
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-main">
        <div className="container landing-hero">
          <div className="landing-hero__content">
            <div className="landing-pill">
              <span className="landing-pill__dot" />
              <span>Live updates when details change</span>
            </div>
            <h1 className="landing-hero__title">
              Stay informed. <br />
              Stay coordinated.
            </h1>
            <p className="landing-hero__description">
              Manage events and keep everyone updated when schedules, venues, speakers, or responsibilities change.
            </p>
            <div className="landing-hero__actions">
              <Link to="/events">
                <Button variant="primary" size="lg" leftIcon={<Search size={18} />}>
                  Find an Event
                </Button>
              </Link>
              <Link to="/manager/create-event">
                <Button variant="outline" size="lg" leftIcon={<PlusCircle size={18} />}>
                  Create an Event
                </Button>
              </Link>
            </div>
          </div>

          {/* Simple Visual: Event Update Sent to Participants */}
          <div className="landing-hero__visual" aria-label="Illustration of an event update sent to participants">
            <div className="visual-container">
              {/* Event Manager Broadcast Card */}
              <Card className="visual-card visual-card--broadcast">
                <div className="visual-card__header">
                  <div className="visual-card__badge-row">
                    <StatusBadge status="warning" label="Venue Change" />
                    <span className="visual-time"><Clock size={12} /> Just now</span>
                  </div>
                  <h4 className="visual-update-title">Keynote Shifted to Auditorium B</h4>
                </div>
                <div className="visual-card__body">
                  <div className="visual-row">
                    <MapPin size={15} className="visual-icon" />
                    <span>Moved from <strong>Hall A</strong> to <strong>Auditorium B</strong></span>
                  </div>
                  <div className="visual-row">
                    <Users size={15} className="visual-icon" />
                    <span>Target Audience: <strong>All Approved Attendees & Speakers</strong></span>
                  </div>
                </div>
              </Card>

              {/* Connecting Flow Lines */}
              <div className="visual-connection" aria-hidden="true">
                <div className="visual-connection__line"></div>
                <div className="visual-connection__beacon">
                  <Bell size={16} />
                  <span>Instant Push Delivered</span>
                </div>
              </div>

              {/* Received Notification Screen on Participant Mobile */}
              <div className="visual-receivers">
                <div className="receiver-badge">
                  <CheckCircle2 size={14} className="receiver-badge__icon" />
                  <span>Speakers notified</span>
                </div>
                <div className="receiver-badge">
                  <CheckCircle2 size={14} className="receiver-badge__icon" />
                  <span>Volunteers notified</span>
                </div>
                <div className="receiver-badge">
                  <CheckCircle2 size={14} className="receiver-badge__icon" />
                  <span>Attendees notified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supporting Pillars (Lightweight, non-marketing) */}
        <section className="landing-pillars container">
          <div className="pillar-item">
            <div className="pillar-icon"><Calendar size={22} /></div>
            <h3>Unified Schedule</h3>
            <p>One source of truth for sessions, speakers, and venue details without stale handouts.</p>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon"><Bell size={22} /></div>
            <h3>Targeted Updates</h3>
            <p>Send urgent schedule or room changes directly to the specific roles affected.</p>
          </div>
          <div className="pillar-item">
            <div className="pillar-icon"><Users size={22} /></div>
            <h3>Inclusive By Design</h3>
            <p>Privately capture accessibility and accommodation needs for every participant.</p>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="landing-footer">
        <div className="container landing-footer__inner">
          <p>© {new Date().getFullYear()} Event Coordination & Management System. Group 3 Project.</p>
          <div className="landing-footer__links">
            <Link to="/login">Sign In</Link>
            <Link to="/events">Browse Events</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
