import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  AlertTriangle,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldCheck,
  Accessibility,
  Radio,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import lcIcon from '../../assets/lc-icon.png';
import decorTopRight from '../../assets/updates-decor-top-right.png';
import decorBottomRight from '../../assets/updates-decor-bottom-right.png';
import './PresentationPage.css';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  render: () => React.ReactNode;
}

export const PresentationPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountType } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleClose = useCallback(() => {
    if (accountType === 'manager') {
      navigate('/manager');
    } else {
      navigate('/');
    }
  }, [accountType, navigate]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev < 5 ? prev + 1 : prev));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, handleClose]);

  const slides: Slide[] = [
    // SLIDE 1: The Raw Problem
    {
      id: 1,
      tag: '01. THE SPARK',
      title: 'Why Live Connect Exists in the First Place',
      subtitle: 'The problem was never putting an event on a poster. The nightmare starts when things change twenty minutes to start.',
      render: () => (
        <div className="slide-layout">
          <div className="slide-content-text">
            <p className="lead-punch">
              Here is what actually happens on campus.
            </p>
            <p className="narrative-p">
              It is 1:35 PM on a Friday. Your keynote is set for 2:00 PM in Hall B. Over three hundred students and guests signed up. Suddenly the projector in Hall B dies.
            </p>
            <p className="narrative-p">
              You have twenty-five minutes to move three hundred people across campus into the Great Hall.
            </p>
            <p className="narrative-p">
              What do organizers do right now? They scramble. They drop a rushed message into three different WhatsApp groups. They post an Instagram story. They send two volunteers to stand by the door and shout at people walking in.
            </p>
            <div className="voice-pullquote">
              "Half the group chats are muted. Half the crowd has no data on. The speaker is pacing outside the wrong building. People are already sitting in a dark room."
            </div>
            <p className="narrative-p">
              Anyone can publish an event date. That part is easy. What ruins events is the communication blackout the second something changes on the ground.
            </p>
          </div>

          <div className="slide-visual-col">
            <div className="comparison-box comparison-box--old">
              <div className="comparison-box__header">
                <AlertTriangle size={18} className="warn-icon" />
                <span>The Old Way: WhatsApp Broadcast Chaos</span>
              </div>
              <ul className="comparison-box__list">
                <li>Announcements buried under random chat replies and memes</li>
                <li>Speakers and volunteers get the exact same generic blast</li>
                <li>Zero record of who actually got the room change</li>
                <li>Attendees arrive thirty minutes late to an empty room</li>
              </ul>
            </div>

            <div className="comparison-box comparison-box--new">
              <div className="comparison-box__header">
                <CheckCircle2 size={18} className="check-icon" />
                <span>With Live Connect: One Shared Reality</span>
              </div>
              <ul className="comparison-box__list">
                <li>One manager edit updates the official event page instantly</li>
                <li>Priority alert sent straight to attendees in Today's Queue</li>
                <li>Clear orange Venue Shift banner right at the top</li>
                <li>Everyone knows where to go before they even take a step</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 2: What We Chose NOT to Build
    {
      id: 2,
      tag: '02. THE BOUNDARY',
      title: 'What We Are Not Building',
      subtitle: 'Big platforms try to do tickets, credit card billing, and promotional email blasts. We chose a sharp product over a shallow one.',
      render: () => (
        <div className="slide-layout">
          <div className="slide-content-text">
            <p className="lead-punch">
              We did not want another Eventbrite copycat.
            </p>
            <p className="narrative-p">
              Eventbrite and Ticketmaster already handle payments, ticket barcodes, and ad sales. Trying to compete with them on payment processing just buries the actual job.
            </p>
            <p className="narrative-p">
              Every feature that does not help changes reach people makes the tool heavier to build and harder to use. So we stripped the fat.
            </p>
            <p className="narrative-p">
              Personal details are collected once when you sign up. After that, organizers only ask for what they genuinely need for their specific room or workshop.
            </p>
            <div className="voice-pullquote">
              "If a feature does not help an attendee reach the right room on time, we cut it."
            </div>
          </div>

          <div className="slide-visual-col">
            <div className="scope-grid">
              <div className="scope-card scope-card--out">
                <div className="scope-card__badge scope-card__badge--out">Left Out On Purpose</div>
                <h4>No Bloat</h4>
                <div className="scope-items">
                  <span className="scope-pill scope-pill--cut">Payment gateways</span>
                  <span className="scope-pill scope-pill--cut">Ticket scalping markups</span>
                  <span className="scope-pill scope-pill--cut">Marketing newsletters</span>
                  <span className="scope-pill scope-pill--cut">Twenty page intake forms</span>
                  <span className="scope-pill scope-pill--cut">Social feed algorithms</span>
                </div>
                <p className="scope-note">These distract from the single job of coordinating people on the day.</p>
              </div>

              <div className="scope-card scope-card--in">
                <div className="scope-card__badge scope-card__badge--in">Our Core Focus</div>
                <h4>The Coordination Engine</h4>
                <div className="scope-items">
                  <span className="scope-pill scope-pill--keep">Real-time room shift alerts</span>
                  <span className="scope-pill scope-pill--keep">Targeted role notifications</span>
                  <span className="scope-pill scope-pill--keep">One-tap registrations</span>
                  <span className="scope-pill scope-pill--keep">Verified accessibility facts</span>
                  <span className="scope-pill scope-pill--keep">Manager broadcast center</span>
                </div>
                <p className="scope-note">Fast. Reliable. Readable on a phone screen in full sunlight.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 3: How the System Works
    {
      id: 3,
      tag: '03. THE ARCHITECTURE',
      title: 'Two Sides, One Clean Pipeline',
      subtitle: 'Your account is who you are. Your role is what you do at a particular event.',
      render: () => (
        <div className="slide-layout">
          <div className="slide-content-text">
            <p className="lead-punch">
              A foundational decision: account role is not event role.
            </p>
            <p className="narrative-p">
              On most old systems, if you sign up as a regular user, you are stuck there forever. But in real life, roles change every weekend.
            </p>
            <p className="narrative-p">
              You could be a Keynote Speaker at the Tech Summit on Friday.
            </p>
            <p className="narrative-p">
              A Volunteer helping at the entrance on Saturday.
            </p>
            <p className="narrative-p">
              And just a curious Attendee sitting in the crowd on Sunday.
            </p>
            <p className="narrative-p">
              Live Connect keeps role tied to the registration, not locked to the user account. That means one login handles your whole campus life.
            </p>
          </div>

          <div className="slide-visual-col">
            <div className="pipeline-card">
              <div className="pipeline-header">
                <Layers size={18} className="pipeline-icon" />
                <span>The Live Connect Decoupling Model</span>
              </div>

              <div className="user-box">
                <div className="user-box__title">Single User Profile (Alex Rivera)</div>
                <div className="user-box__meta">Name, Email, Phone, Base Organization</div>
              </div>

              <div className="arrow-down">
                <div className="arrow-line"></div>
                <span>Registers into different events</span>
              </div>

              <div className="event-roles-grid">
                <div className="event-role-chip event-role-chip--speaker">
                  <span className="chip-badge">Speaker</span>
                  <strong>Tech Summit 2026</strong>
                  <p>Gets AV prep notifications</p>
                </div>
                <div className="event-role-chip event-role-chip--volunteer">
                  <span className="chip-badge">Volunteer</span>
                  <strong>Campus Hackathon</strong>
                  <p>Gets logistics check-in times</p>
                </div>
                <div className="event-role-chip event-role-chip--attendee">
                  <span className="chip-badge">Participant</span>
                  <strong>AI Career Day</strong>
                  <p>Gets room and schedule shifts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 4: What Happens When Plans Change
    {
      id: 4,
      tag: '04. THE ENGINE',
      title: 'What Happens When Details Change',
      subtitle: 'One edit by the organizer creates one audit record and delivers priority notifications to the exact people affected.',
      render: () => (
        <div className="slide-layout">
          <div className="slide-content-text">
            <p className="lead-punch">
              Here is the exact chain reaction.
            </p>
            <p className="narrative-p">
              The organizer opens the Event Hub and edits the location from Auditorium B to Central Hall.
            </p>
            <p className="narrative-p">
              They do not need to draft a long email. They do not need to forward anything to six group admins. They just tap Save.
            </p>
            <p className="narrative-p">
              The system writes an immutable log entry. Then it checks who is registered for that session.
            </p>
            <p className="narrative-p">
              Within seconds, an orange Venue Shift card appears at the top of Today's Queue on the participant screen. Unread counter updates. Direct link points straight to the new room.
            </p>
            <div className="voice-pullquote">
              "No guessing. No conflicting messages. Everyone looks at the same screen and sees the exact same truth."
            </div>
          </div>

          <div className="slide-visual-col">
            <div className="flow-steps-card">
              <div className="flow-step">
                <div className="flow-step__number">1</div>
                <div className="flow-step__content">
                  <div className="flow-step__title">Manager Updates Venue</div>
                  <div className="flow-step__desc">Single field edit inside Event Management Hub</div>
                </div>
                <Radio size={16} className="flow-step__icon" />
              </div>

              <div className="flow-connector"></div>

              <div className="flow-step">
                <div className="flow-step__number">2</div>
                <div className="flow-step__content">
                  <div className="flow-step__title">System Filters Affected Crowd</div>
                  <div className="flow-step__desc">Matches attendees, speakers, and staff registered to that slot</div>
                </div>
                <Layers size={16} className="flow-step__icon" />
              </div>

              <div className="flow-connector"></div>

              <div className="flow-step flow-step--highlight">
                <div className="flow-step__number">3</div>
                <div className="flow-step__content">
                  <div className="flow-step__title">Priority Dispatch to Today's Queue</div>
                  <div className="flow-step__desc">Orange border card lands at the very top of attendee notifications</div>
                </div>
                <Bell size={16} className="flow-step__icon" />
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 5: Inclusive by Design
    {
      id: 5,
      tag: '05. ACCESSIBILITY',
      title: 'Inclusive by Design, Not as an Afterthought',
      subtitle: 'Public clarity so nobody has to guess. Private handling so nobody has to broadcast their personal medical needs.',
      render: () => (
        <div className="slide-layout">
          <div className="slide-content-text">
            <p className="lead-punch">
              Most events treat accessibility like an optional footnote.
            </p>
            <p className="narrative-p">
              Someone in a wheelchair registers, arrives on campus, and finds three flights of stairs with no ramp in sight. Or someone who needs sign interpretation sits in the back of the room because nobody reserved a clear line of sight.
            </p>
            <p className="narrative-p">
              We split accessibility into two deliberate halves.
            </p>
            <p className="narrative-p">
              First, public venue facts. Ramp access, elevator locations, sign language availability, sound amplification, service animal policies. This is visible to everyone before they even think about registering.
            </p>
            <p className="narrative-p">
              Second, private accommodation requests. Individual needs stay strictly between the attendee and the organizer.
            </p>
            <div className="voice-pullquote">
              "You should never have to disclose personal accommodations inside a public group chat just to know if you can enter the building."
            </div>
          </div>

          <div className="slide-visual-col">
            <div className="access-duo">
              <div className="access-card access-card--public">
                <div className="access-card__top">
                  <Accessibility size={20} className="access-icon-pub" />
                  <h4>Public Venue Transparency</h4>
                </div>
                <p className="access-card__desc">Visible directly on the event details page before signup:</p>
                <div className="access-tags">
                  <span className="access-tag">Ramp access at main foyer</span>
                  <span className="access-tag">Elevator to second floor</span>
                  <span className="access-tag">Sign language interpreter</span>
                  <span className="access-tag">Wheelchair seating rows 1 to 3</span>
                </div>
              </div>

              <div className="access-card access-card--private">
                <div className="access-card__top">
                  <ShieldCheck size={20} className="access-icon-priv" />
                  <h4>Private Accommodation Gate</h4>
                </div>
                <p className="access-card__desc">Protected registration intake seen only by the organizer:</p>
                <div className="access-tags">
                  <span className="access-tag">Quiet room preferences</span>
                  <span className="access-tag">Severe dietary allergies</span>
                  <span className="access-tag">Service dog accompaniment</span>
                  <span className="access-tag">Direct organizer notes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 6: What This Helps Us Achieve (Closing)
    {
      id: 6,
      tag: '06. THE OUTCOME',
      title: 'What Live Connect Helps Us Achieve',
      subtitle: 'Organizers stop putting out fires. Attendees stop stressing about what changed and focus on being there.',
      render: () => (
        <div className="slide-layout slide-layout--closing">
          <div className="closing-hero-wrap">
            <div className="closing-badge">THE FINISH LINE</div>
            <h2 className="closing-heading">Events run better when everyone shares the same reality.</h2>
            <p className="closing-sub">
              It really comes down to this simple thing. When a schedule shifts by twenty minutes, people should not be left wandering in the heat.
            </p>

            <div className="outcome-metrics-grid">
              <div className="outcome-card">
                <div className="outcome-card__num">0</div>
                <div className="outcome-card__label">Missed Rooms</div>
                <p>No students standing outside locked doors wondering where the speaker went.</p>
              </div>

              <div className="outcome-card">
                <div className="outcome-card__num">&lt; 10s</div>
                <div className="outcome-card__label">Broadcast Speed</div>
                <p>From the manager changing the venue to the badge landing on attendee screens.</p>
              </div>

              <div className="outcome-card">
                <div className="outcome-card__num">1</div>
                <div className="outcome-card__label">Single Truth</div>
                <p>One place to look. No scrolling through thirty unread WhatsApp messages.</p>
              </div>
            </div>

            <div className="closing-action-block">
              <button
                type="button"
                className="closing-back-btn"
                onClick={handleClose}
              >
                <span>Jump Back to Live Connect</span>
                <ArrowRight size={18} />
              </button>
              <p className="closing-tagline">
                Live Connect. Stay informed. Stay coordinated.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="presentation-viewport">
      {/* Background Decors */}
      <img
        src={decorTopRight}
        alt=""
        className="pres-decor-top"
        aria-hidden="true"
      />
      <img
        src={decorBottomRight}
        alt=""
        className="pres-decor-bottom"
        aria-hidden="true"
      />

      {/* Top Deck Navigation Bar */}
      <header className="presentation-header">
        <div className="presentation-header__brand">
          <img src={lcIcon} alt="Live Connect" className="pres-logo" />
          <div className="pres-brand-info">
            <span className="pres-brand-title">LIVE CONNECT</span>
            <span className="pres-brand-deck">Product Story & Deck</span>
          </div>
        </div>

        {/* Slide jump tabs */}
        <nav className="presentation-tabs" aria-label="Slides Index">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              className={`pres-tab ${currentSlide === idx ? 'pres-tab--active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              title={s.title}
            >
              <span className="pres-tab__num">0{s.id}</span>
              <span className="pres-tab__label">{s.tag.replace(/^\d+\.\s*/, '')}</span>
            </button>
          ))}
        </nav>

        {/* Window controls */}
        <div className="presentation-header__actions">
          <button
            type="button"
            className="pres-action-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Presentation'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
          <button
            type="button"
            className="pres-action-btn pres-action-btn--close"
            onClick={handleClose}
            title="Exit Presentation"
            aria-label="Exit Presentation"
          >
            <X size={18} />
            <span className="close-text">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Slide Deck Canvas */}
      <main className="presentation-stage">
        <div className="slide-card-container">
          <div className="slide-card">
            {/* Slide Header */}
            <div className="slide-top-meta">
              <span className="slide-tag-pill">{current.tag}</span>
              <span className="slide-counter-chip">
                Slide 0{current.id} of 0{slides.length}
              </span>
            </div>

            <div className="slide-header-block">
              <h1 className="slide-title">{current.title}</h1>
              <p className="slide-subtitle">{current.subtitle}</p>
            </div>

            {/* Slide Body */}
            <div className="slide-body-viewport">
              {current.render()}
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Controls Bar */}
      <footer className="presentation-footer">
        <div className="pres-footer__left">
          <span className="pres-running-title">
            Live Connect Architecture & Purpose Walkthrough
          </span>
        </div>

        <div className="pres-footer__center">
          <div className="pres-dots">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                className={`pres-dot ${currentSlide === idx ? 'pres-dot--active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="pres-footer__right">
          <button
            type="button"
            className="pres-nav-btn"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>
          <button
            type="button"
            className="pres-nav-btn pres-nav-btn--next"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            aria-label="Next Slide"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
};
