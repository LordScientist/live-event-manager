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
  ArrowRight,
  ShieldCheck,
  Accessibility,
  Radio,
  Layers,
  Play,
  Pause,
  Sparkles,
  Volume2,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MascotGuide } from '../../components/presentation/MascotGuide';
import { DynamicIslandHUD } from '../../components/ui/DynamicIslandHUD';
import {
  triggerLiveBroadcastShift,
  DYNAMIC_ISLAND_STATES
} from '../../services/presentationService';
import lcIcon from '../../assets/lc-icon.png';
import './PresentationPage.css';

interface Slide {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  render: () => React.ReactNode;
}

const SLIDE_MASCOT_COMMENTS = [
  "Ever tried moving 300 students when a room changes 20 minutes before start through 6 muted group chats? Pure chaos! Live Connect stops the blackout.",
  "No ticket scalpers, no 20-page forms, no payment spam. We built a laser-focused coordination engine for the actual day.",
  "Floating Dynamic Island HUD + Role Decoupling! The HUD floats persistently with 3 spring physics states while your login seamlessly handles Speaker, Volunteer, or Attendee passes.",
  "Watch this: Organizer shifts Room 102 to Main Amphitheater, and BAM—Dynamic Island fires a Web Audio chime and reveals the before/after room diff in under 10 seconds!",
  "Public venue specs so nobody guesses ramps. Private intake so nobody has to broadcast medical needs to group chats.",
  "0 missed rooms, 0 confused speakers, and 1 single shared truth. That's how we run flawless campus events!"
];

export const PresentationPage: React.FC = () => {
  const navigate = useNavigate();
  const { accountType } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [selectedIslandState, setSelectedIslandState] = useState<'compact' | 'alert' | 'expanded'>('alert');
  const [broadcastSimulated, setBroadcastSimulated] = useState(false);

  const handleTestBroadcast = (source: string) => {
    setBroadcastSimulated(true);
    triggerLiveBroadcastShift({
      id: `shift-demo-${Date.now()}`,
      eventName: 'KNUST Tech Conference 2026',
      oldVenue: 'Room 102 (Great Hall)',
      newVenue: 'Main Amphitheater • Hall A',
      reason: `Presentation Demo (${source}): Keynote shifted to Main Amphitheater due to 115% capacity. Web Audio chime & venue diff active.`,
      timestamp: 'Just now (live keynote demo)',
      urgency: 'high'
    });
  };

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

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  }, []);

  // Autoplay slideshow timer
  useEffect(() => {
    if (!isAutoplay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev < 5 ? prev + 1 : 0));
    }, 7500);
    return () => clearInterval(timer);
  }, [isAutoplay]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === ' ' && (e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault();
        setIsAutoplay((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f' && (e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape') {
        if (!document.fullscreenElement) {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, handleClose, toggleFullscreen]);

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

    // SLIDE 3: Zero Blackouts Architecture
    {
      id: 3,
      tag: '03. ZERO BLACKOUTS',
      title: 'Zero Blackouts Architecture: Dynamic Island HUD & Role Decoupling',
      subtitle: 'Floating real-time broadcast HUD with spring physics & decoupled identity. Your account is who you are, your role is what you do.',
      render: () => (
        <div className="slide-layout">
          <div className="slide-content-text">
            <p className="lead-punch">
              Zero blackouts requires an ambient broadcast surface that cannot be muted or missed.
            </p>
            <p className="narrative-p">
              Traditional campus notifications fail when it matters most: announcements get muted in six different WhatsApp groups, buried under memes, or sent to unread email inboxes.
            </p>
            <p className="narrative-p">
              Live Connect eliminates blackouts through the <strong>Dynamic Island Live Broadcast HUD</strong>: an ambient top-docked capsule powered by Emil Kowalski-style spring physics. It operates across <strong>3 distinct states</strong>:
            </p>
            <ul className="narrative-list">
              <li>
                <strong>1. Compact Ambient:</strong> A silent pill under 40px height with a pulsing live beacon that monitors campus feeds with zero idle battery drain.
              </li>
              <li>
                <strong>2. Sudden Alert:</strong> Springs open with <code>cubic-bezier(0.175, 0.885, 0.32, 1.275)</code> and fires a synthetic Web Audio chime when an auditorium relocates.
              </li>
              <li>
                <strong>3. 3D Expanded Diff:</strong> Expands with one tap into a full interactive glass modal showing side-by-side previous vs new venue diffs and walking routes.
              </li>
            </ul>
            <p className="narrative-p">
              Coupled with our decoupled identity architecture, a single user profile fluidly handles Speaker, Volunteer, or Attendee roles across different events without account lock-in.
            </p>
            <div className="voice-pullquote">
              "The Dynamic Island provides a single shared source of live truth—broadcasts arrive in under 10 seconds."
            </div>
          </div>

          <div className="slide-visual-col">
            {/* 3-State Interactive Dynamic Island Architecture Showcase */}
            <div className="pres-island-states-card">
              <div className="pres-card-header">
                <Radio size={18} className="pipeline-icon" />
                <span>Dynamic Island Live HUD • 3-State Engine</span>
              </div>

              {/* State Tab Switcher */}
              <div className="pres-island-states-nav" role="tablist">
                {DYNAMIC_ISLAND_STATES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    role="tab"
                    aria-selected={selectedIslandState === st.id}
                    className={`pres-island-state-tab ${selectedIslandState === st.id ? 'pres-island-state-tab--active' : ''}`}
                    onClick={() => setSelectedIslandState(st.id)}
                  >
                    <span>{st.name}</span>
                  </button>
                ))}
              </div>

              {/* State Interactive Preview */}
              {(() => {
                const activeSpec = DYNAMIC_ISLAND_STATES.find((s) => s.id === selectedIslandState) || DYNAMIC_ISLAND_STATES[0];
                return (
                  <div className="pres-island-state-detail">
                    {/* Visual Mockup of the State */}
                    <div className="pres-island-visual-mockup">
                      {activeSpec.id === 'compact' && (
                        <div className="mockup-compact-pill">
                          <Radio size={14} className="mockup-icon-live" />
                          <span className="mockup-text">Live Connect Broadcast Radar</span>
                          <span className="mockup-live-chip">LIVE</span>
                        </div>
                      )}
                      {activeSpec.id === 'alert' && (
                        <div className="mockup-alert-pill">
                          <span className="mockup-urgency-chip">ROOM SHIFT</span>
                          <span className="mockup-diff-text">
                            Room 102 → <span className="mockup-highlight">Main Amphitheater</span>
                          </span>
                          <span className="mockup-tap-chip">Tap for Diff</span>
                        </div>
                      )}
                      {activeSpec.id === 'expanded' && (
                        <div className="mockup-expanded-card">
                          <div className="mockup-diff-header">
                            <span className="mockup-sync-badge">AUDITORIUM RELOCATED</span>
                            <span className="mockup-sub10s">&lt; 10s SYNC</span>
                          </div>
                          <div className="mockup-diff-row">
                            <div className="mockup-diff-node mockup-diff-node--old">
                              <span className="node-label">PREVIOUS ROOM</span>
                              <span className="node-venue">Room 102 (Great Hall)</span>
                              <span className="node-tag node-tag--relocated">RELOCATED</span>
                            </div>
                            <div className="mockup-diff-arrow">→</div>
                            <div className="mockup-diff-node mockup-diff-node--new">
                              <span className="node-label">NEW VENUE NOW</span>
                              <span className="node-venue">Main Amphitheater</span>
                              <span className="node-tag node-tag--live">LIVE NOW</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pres-island-meta">
                      <div className="pres-meta-row">
                        <span className="pres-meta-label">Spring Physics:</span>
                        <code className="pres-meta-code">{activeSpec.springPhysics}</code>
                      </div>
                      <div className="pres-meta-row">
                        <span className="pres-meta-label">Campus Delivery:</span>
                        <span className="pres-meta-val">{activeSpec.latency}</span>
                      </div>
                    </div>

                    <ul className="pres-spec-bullets">
                      {activeSpec.techHighlights.map((hl, i) => (
                        <li key={i}>
                          <CheckCircle2 size={13} className="bullet-check" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {/* Live Test Trigger Button */}
              <div className="pres-test-trigger-wrapper">
                <button
                  type="button"
                  className="pres-test-trigger-btn luminous-bloom"
                  onClick={() => handleTestBroadcast('Chapter 3 Showcase')}
                >
                  <Radio size={15} className="animate-pulse" />
                  <span>Broadcast Room Shift (Test Live HUD)</span>
                </button>
                {broadcastSimulated && (
                  <div className="pres-test-feedback">
                    <Sparkles size={13} className="feedback-sparkle" />
                    <span>Live broadcast dispatched! Look at the top Dynamic Island HUD bouncing & chiming ⬆️</span>
                  </div>
                )}
              </div>
            </div>

            {/* Compact Decoupling Architecture Card */}
            <div className="pres-decoupling-mini-card">
              <div className="pres-decoupling-header">
                <Layers size={15} />
                <span>Decoupled Role Pipeline: Single Profile (Alex Rivera)</span>
              </div>
              <div className="pres-decoupling-badges">
                <span className="pres-role-badge pres-role-badge--speaker">Speaker: Tech Summit 2026</span>
                <span className="pres-role-badge pres-role-badge--volunteer">Volunteer: Campus Hackathon</span>
                <span className="pres-role-badge pres-role-badge--attendee">Participant: AI Career Day</span>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // SLIDE 4: Day-Of Companion Experience & Room Diff Engine
    {
      id: 4,
      tag: '04. DAY-OF EXPERIENCE',
      title: 'Day-Of Companion Experience & Room Diff Engine',
      subtitle: 'Sub-10s room shift alerts, synthetic Web Audio chime, and instant before/after venue diffs.',
      render: () => (
        <div className="slide-layout">
          <div className="slide-content-text">
            <p className="lead-punch">
              On event day, three questions must be answered in under five seconds.
            </p>
            <p className="narrative-p">
              Participants do not have time to dig through 10-page PDF schedules. They need instant answers to three things:
              <em> 1) What is live right now? 2) Where do I need to be? 3) Did anything shift?</em>
            </p>
            <p className="narrative-p">
              When an organizer edits a location from <strong>Room 102</strong> to <strong>Main Amphitheater</strong>, the <strong>Live Connect Room Diff Engine</strong> springs into action:
            </p>
            <ul className="narrative-list">
              <li>
                <strong>Immutable Audit Diff:</strong> Computes the structural delta between previous room and new venue, highlighting exact walking transitions and capacity notes.
              </li>
              <li>
                <strong>Sub-10s Dispatch:</strong> Dispatches priority broadcasts directly to attendee viewports before anyone wanders in the heat.
              </li>
              <li>
                <strong>Synthetic Web Audio Chime:</strong> Zero audio downloads or network buffers. Synthesizes a crisp dual-tone sine wave (D5 587.33 Hz → A5 880 Hz) completely offline.
              </li>
            </ul>
            <div className="voice-pullquote">
              "Traditional campus group chats and buried emails fail during live events. The Dynamic Island provides a single shared source of live truth."
            </div>
          </div>

          <div className="slide-visual-col">
            {/* Visual Room Diff Engine Card */}
            <div className="pres-room-diff-showcase-card">
              <div className="pres-card-header">
                <MapPin size={18} className="pipeline-icon" />
                <span>Live Room Diff Engine • Relocation Radar</span>
              </div>

              {/* Before vs After Diff Nodes */}
              <div className="pres-diff-node-container">
                <div className="pres-diff-box pres-diff-box--old">
                  <span className="pres-diff-sub">PREVIOUS ROOM</span>
                  <strong className="pres-diff-title">Room 102 (Great Hall)</strong>
                  <span className="pres-diff-status pres-diff-status--relocated">RELOCATED • 115% CAP</span>
                </div>

                <div className="pres-diff-arrow-col">
                  <ArrowRight size={20} className="pres-diff-arrow-icon" />
                  <span className="pres-diff-arrow-label">&lt; 10s DIFF</span>
                </div>

                <div className="pres-diff-box pres-diff-box--new">
                  <span className="pres-diff-sub">NEW VENUE NOW</span>
                  <strong className="pres-diff-title">Main Amphitheater • Hall A</strong>
                  <span className="pres-diff-status pres-diff-status--live">LIVE NOW • VERIFIED</span>
                </div>
              </div>

              {/* Relocation Justification Card */}
              <div className="pres-diff-rationale-box">
                <span className="pres-diff-rationale-tag">Verified Organizer Rationale:</span>
                <p className="pres-diff-rationale-text">
                  "Room 102 reached 115% capacity. All keynote attendees and speakers shift immediately to Main Amphitheater. Induction audio loop active."
                </p>
              </div>

              {/* Synthetic Web Audio Chime Engine Visualizer */}
              <div className="pres-chime-visualizer-card">
                <div className="pres-chime-header">
                  <Volume2 size={16} className="pres-chime-icon" />
                  <span>Synthetic Web Audio Chime Engine (100% Offline)</span>
                </div>
                <div className="pres-chime-waveform">
                  <span className="chime-freq-chip">Tone 1: 587.33 Hz (D5)</span>
                  <div className="chime-bars" aria-hidden="true">
                    <span className="chime-bar chime-bar--1" />
                    <span className="chime-bar chime-bar--2" />
                    <span className="chime-bar chime-bar--3" />
                    <span className="chime-bar chime-bar--4" />
                    <span className="chime-bar chime-bar--5" />
                  </div>
                  <span className="chime-freq-chip">Tone 2: 880.00 Hz (A5)</span>
                </div>
                <p className="pres-chime-spec-text">
                  Zero MP3/WAV assets • &lt; 4ms latency • Synthesized via Web Audio API oscillators
                </p>
              </div>

              {/* Live Test Broadcast Trigger */}
              <div className="pres-test-trigger-wrapper">
                <button
                  type="button"
                  className="pres-test-trigger-btn luminous-bloom"
                  onClick={() => handleTestBroadcast('Chapter 4 Room Diff Engine')}
                >
                  <Radio size={15} className="animate-pulse" />
                  <span>Fire Room Diff Shift & Audio Chime</span>
                </button>
                {broadcastSimulated && (
                  <div className="pres-test-feedback">
                    <Sparkles size={13} className="feedback-sparkle" />
                    <span>Broadcast dispatched! Dual-tone chime sounded & Dynamic Island updated ⬆️</span>
                  </div>
                )}
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
      {/* Floating Dynamic Island Live Broadcast HUD for real-time presentation demos */}
      <DynamicIslandHUD />

      {/* macOS Fluid Aurora Mesh Background for dynamic refraction */}
      <div className="macos-mesh-bg" aria-hidden="true">
        <div className="macos-mesh-blob macos-mesh-blob--blue" />
        <div className="macos-mesh-blob macos-mesh-blob--amber" />
        <div className="macos-mesh-blob macos-mesh-blob--purple" />
        <div className="macos-mesh-blob macos-mesh-blob--cyan" />
      </div>


      {/* macOS Frosted Glass Titlebar Header */}
      <header className="presentation-header macos-glass-header">
        <div className="macos-header-left">
          {/* macOS Traffic Lights */}
          <div className="macos-traffic-lights" aria-label="macOS Window Controls">
            <button
              type="button"
              className="macos-traffic-dot macos-traffic-dot--close"
              onClick={handleClose}
              title="Close Presentation (Esc)"
              aria-label="Close Presentation"
            >
              <span className="macos-traffic-glyph">✕</span>
            </button>
            <button
              type="button"
              className="macos-traffic-dot macos-traffic-dot--minimize"
              onClick={() => setIsAutoplay((prev) => !prev)}
              title={isAutoplay ? 'Pause Slideshow (Space)' : 'Play Slideshow (Space)'}
              aria-label="Minimize / Toggle Autoplay"
            >
              <span className="macos-traffic-glyph">−</span>
            </button>
            <button
              type="button"
              className="macos-traffic-dot macos-traffic-dot--zoom"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
              aria-label="Toggle Fullscreen"
            >
              <span className="macos-traffic-glyph">⤢</span>
            </button>
          </div>

          <div className="presentation-header__brand">
            <img src={lcIcon} alt="Live Connect" className="pres-logo" />
            <div className="pres-brand-info">
              <span className="pres-brand-title">LIVE CONNECT</span>
              <span className="pres-brand-deck">Keynote Deck</span>
            </div>
          </div>
        </div>

        {/* macOS Segmented Tab Capsule */}
        <nav className="presentation-tabs macos-segmented-tabs" aria-label="Slides Index">
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
            className={`pres-action-btn macos-glass-btn ${isAutoplay ? 'pres-action-btn--autoplay-active' : ''}`}
            onClick={() => setIsAutoplay((prev) => !prev)}
            title={isAutoplay ? 'Pause Slideshow (Space)' : 'Play Slideshow (Space)'}
            aria-label="Toggle Autoplay Slideshow"
          >
            {isAutoplay ? <Pause size={14} /> : <Play size={14} />}
            <span className="autoplay-label">{isAutoplay ? 'Pause' : 'Autoplay'}</span>
          </button>
          <button
            type="button"
            className="pres-action-btn macos-glass-btn"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen Presentation (F)'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
          <button
            type="button"
            className="pres-action-btn pres-action-btn--close macos-glass-btn macos-glass-btn--close"
            onClick={handleClose}
            title="Exit Presentation (Esc)"
            aria-label="Exit Presentation"
          >
            <X size={15} />
            <span className="close-text">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Slide Deck Canvas with Cinematic Ambient Lighting */}
      <main className="presentation-stage">
        <div className="stage-spotlight" aria-hidden="true" />
        <div className="slide-card-container">
          <div className="slide-card slide-card--macos" key={currentSlide}>
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
              <div className="slide-mascot-comment-bar">
                <span className="mascot-comment-pill">
                  <Sparkles size={12} className="mascot-bar-sparkle" />
                  <span>Codi says</span>
                </span>
                <span className="mascot-bar-text">"{SLIDE_MASCOT_COMMENTS[currentSlide]}"</span>
              </div>
            </div>

            {/* Slide Body */}
            <div className="slide-body-viewport">
              {current.render()}
            </div>
          </div>
        </div>
      </main>

      {/* Codi the Animated Toy Mascot Companion */}
      <MascotGuide currentSlide={currentSlide} />

      {/* Bottom Controls Bar with Keyboard HUD */}
      <footer className="presentation-footer macos-glass-dock">
        <div className="pres-footer__left">
          <span className="pres-running-title">
            Live Connect Architecture & Purpose Walkthrough
          </span>
          <div className="pres-keyboard-hud desktop-only">
            <span>[ ← / → Navigate ]</span>
            <span>[ Space {isAutoplay ? 'Pause' : 'Play'} ]</span>
            <span>[ F Fullscreen ]</span>
          </div>
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
