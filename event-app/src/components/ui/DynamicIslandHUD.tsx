import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Megaphone,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  ChevronUp,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import './DynamicIslandHUD.css';

export interface BroadcastPayload {
  id: string;
  eventName: string;
  oldVenue: string;
  newVenue: string;
  reason: string;
  timestamp: string;
  urgency: 'high' | 'normal';
}

const DEFAULT_BROADCAST: BroadcastPayload = {
  id: 'shift-knust-101',
  eventName: 'KNUST Tech Conference 2026',
  oldVenue: 'Room 102 (Great Hall)',
  newVenue: 'Main Amphitheater • Hall A',
  reason: 'Room 102 reached 115% capacity. All keynote attendees and speakers shift immediately to Main Amphitheater.',
  timestamp: 'Just now (12s ago)',
  urgency: 'high'
};

/**
 * Web Audio Synthetic Broadcast Chime
 * Zero dependencies, works 100% offline
 */
function playBroadcastChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.2, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch {
    // Ignore audio autoplay restrictions
  }
}

export const DynamicIslandHUD: React.FC = () => {
  const [islandState, setIslandState] = useState<'compact' | 'alert' | 'expanded'>('compact');
  const [activeBroadcast, setActiveBroadcast] = useState<BroadcastPayload | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Listen for global custom events from anywhere in the app
  useEffect(() => {
    const handleBroadcastEvent = (e: CustomEvent<BroadcastPayload>) => {
      const payload = e.detail || DEFAULT_BROADCAST;
      setActiveBroadcast(payload);
      setHasAcknowledged(false);
      setIslandState('alert');

      if (soundEnabled) {
        playBroadcastChime();
      }
    };

    window.addEventListener('live-broadcast-alert', handleBroadcastEvent as EventListener);
    return () => {
      window.removeEventListener('live-broadcast-alert', handleBroadcastEvent as EventListener);
    };
  }, [soundEnabled]);

  // Click outside listener to collapse expanded card back to compact
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (islandState === 'expanded' && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIslandState(activeBroadcast && !hasAcknowledged ? 'alert' : 'compact');
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [islandState, activeBroadcast, hasAcknowledged]);

  const handleSimulateShift = () => {
    const samplePayloads: BroadcastPayload[] = [
      {
        id: 'shift-knust-101',
        eventName: 'KNUST Tech Conference 2026',
        oldVenue: 'Room 102 (Great Hall)',
        newVenue: 'Main Amphitheater • Hall A',
        reason: 'Overcapacity alert: Keynote relocated to Main Amphitheater. Verified organizer broadcast.',
        timestamp: 'Just now (12s ago)',
        urgency: 'high'
      },
      {
        id: 'shift-gas-202',
        eventName: 'Global Accessibility Summit',
        oldVenue: 'Hall C • Ground Floor',
        newVenue: 'Plenary Auditorium • Ramp 1',
        reason: 'Audio induction loop relocated to Plenary Auditorium for enhanced assistive listening.',
        timestamp: 'Just now (8s ago)',
        urgency: 'high'
      }
    ];

    const nextPayload = samplePayloads[Math.floor(Math.random() * samplePayloads.length)];
    setActiveBroadcast(nextPayload);
    setHasAcknowledged(false);
    setIslandState('alert');

    if (soundEnabled) {
      playBroadcastChime();
    }
  };

  const handleAcknowledge = () => {
    setHasAcknowledged(true);
    setIslandState('compact');
  };

  return (
    <aside
      ref={containerRef}
      className={`dynamic-island dynamic-island--${islandState}`}
      role="region"
      aria-label="Live Event Dynamic Broadcast HUD"
    >
      {/* ── State 1: COMPACT PILL (Ambient Live Indicator) ── */}
      {islandState === 'compact' && (
        <button
          type="button"
          className="island-compact-wrap"
          onClick={() => {
            if (activeBroadcast && !hasAcknowledged) {
              setIslandState('alert');
            } else {
              setIslandState('expanded');
            }
          }}
          aria-label="Open Live Broadcast HUD"
          title="Live Connect Broadcast Radar"
        >
          <div className="island-compact-leading">
            <span className="beacon-pulse" aria-hidden="true" />
            <Radio size={14} className="island-radio-icon" aria-hidden="true" />
          </div>
          <span className="island-compact-title">
            {activeBroadcast && !hasAcknowledged
              ? 'Shift Alert • Tap to view'
              : 'Live Radar • Zero Blackouts'}
          </span>
          <div className="island-compact-trailing">
            <span className="island-live-chip">LIVE</span>
          </div>
        </button>
      )}

      {/* ── State 2: ALERT PILL (Sudden Room Shift Incoming) ── */}
      {islandState === 'alert' && (
        <div className="island-alert-wrap" onClick={() => setIslandState('expanded')}>
          <div className="island-alert-leading">
            <div className="island-alert-icon-pulse">
              <Megaphone size={16} aria-hidden="true" />
            </div>
            <span className="island-alert-urgency-chip">ROOM SHIFT</span>
          </div>

          <div className="island-alert-text">
            <span className="island-alert-diff">
              <span className="island-venue-old">{activeBroadcast?.oldVenue || 'Room 102'}</span>
              <ArrowRight size={13} className="island-arrow-icon" aria-hidden="true" />
              <span className="island-venue-new">{activeBroadcast?.newVenue || 'Main Amphitheater'}</span>
            </span>
          </div>

          <div className="island-alert-trailing">
            <span className="island-alert-tap-hint">Tap for Diff</span>
          </div>
        </div>
      )}

      {/* ── State 3: EXPANDED CARD (3D Tactile Broadcast Modal) ── */}
      {islandState === 'expanded' && (
        <div className="island-expanded-card" role="dialog" aria-modal="true">
          {/* Header Bar */}
          <div className="island-card-header">
            <div className="island-card-header-left">
              <div className="island-card-badge">
                <Radio size={13} aria-hidden="true" />
                <span>LIVE BROADCAST HUD</span>
              </div>
              <span className="island-sync-chip">
                <span className="beacon-pulse" aria-hidden="true" />
                <span>Synchronized</span>
              </span>
            </div>

            <div className="island-card-header-actions">
              <button
                type="button"
                className="island-card-tool-btn"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Alert Chimes' : 'Unmute Alert Chimes'}
                aria-label={soundEnabled ? 'Mute Alert Chimes' : 'Unmute Alert Chimes'}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                type="button"
                className="island-card-close-btn"
                onClick={() => setIslandState(activeBroadcast && !hasAcknowledged ? 'alert' : 'compact')}
                aria-label="Collapse HUD"
                title="Collapse HUD"
              >
                <ChevronUp size={16} />
              </button>
            </div>
          </div>

          {/* Event Context & Broadcast Diff */}
          <div className="island-card-body">
            <h4 className="island-event-title">
              {activeBroadcast?.eventName || 'KNUST Tech Conference 2026'}
            </h4>

            {/* Room Transition Visual Diff */}
            <div className="island-diff-box">
              <div className="island-diff-node island-diff-node--old">
                <div className="island-diff-node-label">PREVIOUS ROOM</div>
                <div className="island-diff-node-venue">
                  <MapPin size={13} aria-hidden="true" />
                  <span>{activeBroadcast?.oldVenue || 'Room 102 (Great Hall)'}</span>
                </div>
                <span className="island-diff-status-tag island-diff-status-tag--relocated">
                  RELOCATED
                </span>
              </div>

              <div className="island-diff-connector" aria-hidden="true">
                <ArrowRight size={18} />
              </div>

              <div className="island-diff-node island-diff-node--new">
                <div className="island-diff-node-label">NEW VENUE NOW</div>
                <div className="island-diff-node-venue">
                  <MapPin size={13} aria-hidden="true" />
                  <span>{activeBroadcast?.newVenue || 'Main Amphitheater • Hall A'}</span>
                </div>
                <span className="island-diff-status-tag island-diff-status-tag--live">
                  <span className="beacon-pulse" />
                  <span>NOW LIVE</span>
                </span>
              </div>
            </div>

            {/* Organizer Rationale Note */}
            <div className="island-note-card">
              <p className="island-note-text">
                {activeBroadcast?.reason ||
                  'Overcapacity detected: Keynote audience relocated to Main Amphitheater. Digital wayfinding walking path synchronized.'}
              </p>
              <div className="island-note-meta">
                <Clock size={12} aria-hidden="true" />
                <span>{activeBroadcast?.timestamp || 'Just now (14s ago)'} • Zero Blackouts Engine</span>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="island-card-footer">
            <button
              type="button"
              className="island-btn island-btn--simulate"
              onClick={handleSimulateShift}
              title="Test real-time shift broadcast animation"
            >
              <Sparkles size={14} aria-hidden="true" />
              <span>Simulate Shift</span>
            </button>

            <button
              type="button"
              className="island-btn island-btn--acknowledge luminous-bloom"
              onClick={handleAcknowledge}
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>Acknowledge & Sync</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
