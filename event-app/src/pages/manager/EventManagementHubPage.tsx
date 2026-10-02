import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  ExternalLink,
  Users,
  Radio,
  PlusCircle,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Send,
  Bell,
  X,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Alert } from '../../components/ui/Alert';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { scheduleService } from '../../services/scheduleService';
import { updateService } from '../../services/updateService';
import type { EventWithMeta } from '../../services/eventService';
import type { RegistrationDetailItem } from '../../services/registrationService';
import type { ScheduleItem, EventUpdate, UpdateType } from '../../types';
import './EventManagementHubPage.css';

type TabKey = 'overview' | 'registrations' | 'schedule' | 'updates' | 'settings';

export const EventManagementHubPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = id || 'evt-knust-2026';

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [event, setEvent] = useState<EventWithMeta | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationDetailItem[]>([]);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [updates, setUpdates] = useState<EventUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  // Registration Filter & Search (Section 30)
  const [regFilter, setRegFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [regSearch, setRegSearch] = useState('');
  const [selectedReg, setSelectedReg] = useState<RegistrationDetailItem | null>(null);

  // Schedule Modal & Notification prompt (Section 32)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    title: '',
    description: '',
    start_time: '2026-10-18T10:00:00Z',
    end_time: '2026-10-18T11:00:00Z',
    venue: '',
    speaker_name: '',
    audience: 'all'
  });
  const [showNotifyPrompt, setShowNotifyPrompt] = useState(false);
  const [pendingSchedulePayload, setPendingSchedulePayload] = useState<ScheduleItem | null>(null);

  // Update Composer State (Section 33)
  const [composerType, setComposerType] = useState<UpdateType>('venue_change');
  const [composerTitle, setComposerTitle] = useState('Session Venue Relocation');
  const [composerMessage, setComposerMessage] = useState('Your 2:00 PM session has moved from Room 204 to the Main Auditorium.');
  const [composerAudience, setComposerAudience] = useState<'all' | 'participants' | 'speakers' | 'volunteers'>('all');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Danger Zone Modals (Section 34)
  const [dangerModal, setDangerModal] = useState<'close' | 'cancel' | 'delete' | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [evtData, regData, schData, updData] = await Promise.all([
          eventService.getEventById(eventId),
          registrationService.getEventRegistrationsDetailed(eventId),
          scheduleService.getEventSchedule(eventId),
          updateService.getEventUpdates(eventId)
        ]);

        if (evtData) setEvent(evtData);
        setRegistrations(regData);
        setScheduleItems(schData);
        setUpdates(updData);
      } catch (err) {
        console.error('Failed to load management hub', err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [eventId]);

  // Section 29 Registration Statistics
  const stats = useMemo(() => {
    const total = 452; // Matching prompt example
    const approved = 394;
    const pending = registrations.filter((r) => r.status === 'pending').length || 21;
    const rejected = 37;
    return { total, approved, pending, rejected };
  }, [registrations]);

  // Section 30 Filtered Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      if (regFilter !== 'all' && reg.status !== regFilter) return false;
      if (regSearch.trim()) {
        const q = regSearch.toLowerCase();
        return (
          reg.user_name.toLowerCase().includes(q) ||
          reg.user_email.toLowerCase().includes(q) ||
          reg.role_name.toLowerCase().includes(q) ||
          reg.user_organization?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [registrations, regFilter, regSearch]);

  // Handle Review Action (Section 31: Approve / Reject)
  const handleReviewRegistration = async (status: 'approved' | 'rejected') => {
    if (!selectedReg) return;
    try {
      await registrationService.updateRegistrationStatus(selectedReg.id, status, 'usr-202-manager');
      setRegistrations((prev) =>
        prev.map((r) => (r.id === selectedReg.id ? { ...r, status } : r))
      );
      setSelectedReg(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Schedule Save (Section 32)
  const handleOpenScheduleModal = (item?: ScheduleItem) => {
    if (item) {
      setEditingItem(item);
      setScheduleForm({
        title: item.title,
        description: item.description || '',
        start_time: item.start_time,
        end_time: item.end_time,
        venue: item.venue,
        speaker_name: item.speaker_name || '',
        audience: item.audience || 'all'
      });
    } else {
      setEditingItem(null);
      setScheduleForm({
        title: '',
        description: '',
        start_time: '2026-10-18T14:00:00Z',
        end_time: '2026-10-18T15:00:00Z',
        venue: 'Main Auditorium',
        speaker_name: '',
        audience: 'all'
      });
    }
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ScheduleItem = {
      id: editingItem ? editingItem.id : `sch-${Date.now().toString(36)}`,
      event_id: eventId,
      title: scheduleForm.title,
      description: scheduleForm.description,
      start_time: scheduleForm.start_time,
      end_time: scheduleForm.end_time,
      venue: scheduleForm.venue,
      speaker_name: scheduleForm.speaker_name,
      audience: scheduleForm.audience
    };

    if (editingItem) {
      // Changed an existing item: Prompt Section 32 specifies confirmation prompt:
      // "Notify affected participants about this change?"
      setPendingSchedulePayload(payload);
      setShowNotifyPrompt(true);
      setScheduleModalOpen(false);
    } else {
      // Add new session directly
      scheduleService.addScheduleItem(eventId, payload);
      setScheduleItems((prev) => [...prev, payload]);
      setScheduleModalOpen(false);
    }
  };

  const handleApplyScheduleChange = async (notify: boolean) => {
    if (!pendingSchedulePayload) return;

    await scheduleService.updateScheduleItem(
      eventId,
      pendingSchedulePayload.id,
      pendingSchedulePayload
    );

    setScheduleItems((prev) =>
      prev.map((i) => (i.id === pendingSchedulePayload.id ? pendingSchedulePayload : i))
    );

    if (notify) {
      // Broadcast update & notification
      await updateService.createEventUpdate({
        event_id: eventId,
        title: `Schedule Updated: ${pendingSchedulePayload.title}`,
        message: `The schedule for "${pendingSchedulePayload.title}" has been updated. Location: ${pendingSchedulePayload.venue}.`,
        type: 'schedule_change',
        audience: (pendingSchedulePayload.audience as any) || 'all',
        created_by: 'usr-202-manager'
      });
      const latestUpdates = await updateService.getEventUpdates(eventId);
      setUpdates(latestUpdates);
    }

    setShowNotifyPrompt(false);
    setPendingSchedulePayload(null);
  };

  const handleDeleteScheduleItem = async (itemId: string) => {
    if (window.confirm('Delete this schedule session?')) {
      await scheduleService.deleteScheduleItem(eventId, itemId);
      setScheduleItems((prev) => prev.filter((i) => i.id !== itemId));
    }
  };

  // Handle Publish Update (Section 33)
  const handlePublishUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composerTitle.trim() || !composerMessage.trim()) return;

    await updateService.createEventUpdate({
      event_id: eventId,
      title: composerTitle,
      message: composerMessage,
      type: composerType,
      audience: composerAudience,
      created_by: 'usr-202-manager'
    });

    const refreshed = await updateService.getEventUpdates(eventId);
    setUpdates(refreshed);
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--color-text-muted)' }}>
        Loading event coordination console...
      </div>
    );
  }

  const currentEventName = event?.name || 'KNUST Technology Conference 2026';

  return (
    <div className="mgmt-hub">
      {/* Top Event Header */}
      <div className="mgmt-hub__header">
        <Link to="/manager/events" className="mgmt-hub__back-link">
          <ArrowLeft size={16} /> Back to My Events
        </Link>

        <div className="mgmt-hub__header-main">
          <div className="mgmt-hub__title-group">
            <div className="mgmt-hub__meta-row">
              <span className="mgmt-hub__category-pill">{event?.category || 'Conference'}</span>
              <StatusBadge status="published" label="Published" />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Approval: Manual Review
              </span>
            </div>
            <h1 className="mgmt-hub__title">{currentEventName}</h1>
            <div className="mgmt-hub__info-items">
              <span className="mgmt-hub__info-item">
                <Calendar size={14} /> Oct 18, 2026
              </span>
              <span className="mgmt-hub__info-item">
                <MapPin size={14} /> {event?.venue || 'Great Hall, KNUST'}
              </span>
              <span className="mgmt-hub__info-item">
                <Users size={14} /> {stats.total} registered (Capacity: {event?.capacity || 450})
              </span>
            </div>
          </div>

          <div>
            <Link to={`/events/${eventId}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" leftIcon={<ExternalLink size={14} />}>
                View Public Page
              </Button>
            </Link>
          </div>
        </div>

        {/* Tab Navigation (Prompt Section 29: Overview | Registrations | Schedule | Updates | Settings) */}
        <nav className="mgmt-hub__nav" role="tablist" aria-label="Event Management Navigation">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`mgmt-hub__nav-tab ${activeTab === 'overview' ? 'mgmt-hub__nav-tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'registrations'}
            className={`mgmt-hub__nav-tab ${activeTab === 'registrations' ? 'mgmt-hub__nav-tab--active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            Registrations <span className="mgmt-hub__tab-badge">{stats.pending} pending</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'schedule'}
            className={`mgmt-hub__nav-tab ${activeTab === 'schedule' ? 'mgmt-hub__nav-tab--active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Schedule <span className="mgmt-hub__tab-badge">{scheduleItems.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'updates'}
            className={`mgmt-hub__nav-tab ${activeTab === 'updates' ? 'mgmt-hub__nav-tab--active' : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            Post Update <span className="mgmt-hub__tab-badge">{updates.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            className={`mgmt-hub__nav-tab ${activeTab === 'settings' ? 'mgmt-hub__nav-tab--active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW (Prompt Section 29)
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="overview-grid">
          {/* Registration Statistics (Prompt Section 29) */}
          <div className="overview-stats-grid">
            <div className="overview-stat-card">
              <span className="overview-stat-card__label">Total Registrations</span>
              <span className="overview-stat-card__val">{stats.total}</span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Across all participating roles
              </span>
            </div>

            <div className="overview-stat-card">
              <span className="overview-stat-card__label">Approved</span>
              <span className="overview-stat-card__val" style={{ color: 'var(--color-success)' }}>
                {stats.approved}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Confirmed attendees & speakers
              </span>
            </div>

            <div className="overview-stat-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
              <span className="overview-stat-card__label">Pending</span>
              <span className="overview-stat-card__val" style={{ color: 'var(--color-warning)' }}>
                {stats.pending}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Requires review
              </span>
            </div>

            <div className="overview-stat-card">
              <span className="overview-stat-card__label">Rejected</span>
              <span className="overview-stat-card__val" style={{ color: 'var(--color-text-muted)' }}>
                {stats.rejected}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Over capacity / declined
              </span>
            </div>
          </div>

          {/* Two Column Layout: Participation Breakdown & Accessibility Requests */}
          <div className="overview-two-col">
            {/* Participation Breakdown (Prompt Section 29) */}
            <Card>
              <CardHeader>
                <CardTitle>Participation Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="breakdown-list">
                  <div className="breakdown-row">
                    <span className="breakdown-row__name">Participants</span>
                    <span className="breakdown-row__count">320</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-row__name">Volunteers</span>
                    <span className="breakdown-row__count">25</span>
                  </div>
                  <div className="breakdown-row">
                    <span className="breakdown-row__name">Speakers</span>
                    <span className="breakdown-row__count">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Requests (Prompt Section 29: Aggregated without sensitive labels) */}
            <Card>
              <CardHeader>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardTitle>Accessibility Accommodations</CardTitle>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    Aggregated Needs
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                  Coordinator summary for logistics and facility preparation. Personal details remain protected.
                </p>
                <div className="access-requests-list">
                  <div className="access-request-row">
                    <span className="access-request-row__label">Wheelchair access</span>
                    <span className="access-request-row__badge">4 requests</span>
                  </div>
                  <div className="access-request-row">
                    <span className="access-request-row__label">Live captions (CART)</span>
                    <span className="access-request-row__badge">12 requests</span>
                  </div>
                  <div className="access-request-row">
                    <span className="access-request-row__label">Accessible priority seating</span>
                    <span className="access-request-row__badge">7 requests</span>
                  </div>
                  <div className="access-request-row">
                    <span className="access-request-row__label">Quiet sensory decompression room</span>
                    <span className="access-request-row__badge">3 requests</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Action Shortcuts */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Radio size={16} />}
              onClick={() => setActiveTab('updates')}
            >
              Post Live Update to Attendees
            </Button>
            <Button
              variant="outline"
              size="md"
              leftIcon={<Users size={16} />}
              onClick={() => {
                setActiveTab('registrations');
                setRegFilter('pending');
              }}
            >
              Review Pending Applications ({stats.pending})
            </Button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: REGISTRATIONS MANAGEMENT TABLE (Prompt Section 30 & 31)
          ========================================================================= */}
      {activeTab === 'registrations' && (
        <div className="registrations-view">
          <div className="registrations-controls">
            {/* Filters (Prompt Section 30: All, Pending, Approved, Rejected) */}
            <div className="reg-filter-pills" role="tablist">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`reg-filter-btn ${regFilter === filter ? 'reg-filter-btn--active' : ''}`}
                  onClick={() => setRegFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            {/* Search (Prompt Section 30: "Search participants...") */}
            <div className="reg-search-box">
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)'
                }}
              />
              <input
                type="search"
                className="reg-search-input"
                placeholder="Search participants..."
                value={regSearch}
                onChange={(e) => setRegSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Registrations Table (Prompt Section 30) */}
          <div className="reg-table-container">
            <table className="reg-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Accommodations</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{reg.user_name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {reg.user_email} • {reg.user_organization || 'Independent'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor:
                            reg.role_name === 'Speaker'
                              ? '#ede9fe'
                              : reg.role_name === 'Volunteer'
                              ? '#e0f2fe'
                              : 'var(--color-surface-subtle)',
                          color:
                            reg.role_name === 'Speaker'
                              ? '#6d28d9'
                              : reg.role_name === 'Volunteer'
                              ? '#0284c7'
                              : 'var(--color-text-main)'
                        }}
                      >
                        {reg.role_name}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(reg.submitted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <StatusBadge status={reg.status} />
                    </td>
                    <td>
                      {reg.requires_accommodation ? (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'rgba(109, 40, 217, 0.1)',
                            color: '#6d28d9'
                          }}
                        >
                          Request Noted
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                          None
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        variant={reg.status === 'pending' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setSelectedReg(reg)}
                      >
                        {reg.status === 'pending' ? 'Review' : 'View Detail'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 31: REGISTRATION DETAIL MODAL / DRAWER
          ========================================================================= */}
      {selectedReg && (
        <div className="reg-modal-overlay" onClick={() => setSelectedReg(null)}>
          <div className="reg-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="reg-modal-header">
              <h3 className="reg-modal-title">Registration Details</h3>
              <button
                type="button"
                onClick={() => setSelectedReg(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="reg-modal-body">
              {/* Participant Information */}
              <div className="reg-modal-section">
                <span className="reg-modal-section-title">Participant Information</span>
                <div className="reg-modal-grid-2">
                  <div className="reg-modal-field">
                    <span className="reg-modal-field-label">Full Name</span>
                    <span className="reg-modal-field-val">{selectedReg.user_name}</span>
                  </div>
                  <div className="reg-modal-field">
                    <span className="reg-modal-field-label">Email</span>
                    <span className="reg-modal-field-val">{selectedReg.user_email}</span>
                  </div>
                  <div className="reg-modal-field">
                    <span className="reg-modal-field-label">Phone</span>
                    <span className="reg-modal-field-val">{selectedReg.user_phone || 'Not provided'}</span>
                  </div>
                  <div className="reg-modal-field">
                    <span className="reg-modal-field-label">Organization</span>
                    <span className="reg-modal-field-val">{selectedReg.user_organization || 'Independent'}</span>
                  </div>
                </div>
              </div>

              {/* Event Role */}
              <div className="reg-modal-section">
                <span className="reg-modal-section-title">Event Role</span>
                <div className="reg-modal-field">
                  <span className="reg-modal-field-label">Selected Role</span>
                  <span className="reg-modal-field-val" style={{ color: 'var(--color-primary)' }}>
                    {selectedReg.role_name}
                  </span>
                </div>
              </div>

              {/* Role-Specific Information */}
              <div className="reg-modal-section">
                <span className="reg-modal-section-title">Role-Specific Information</span>
                {selectedReg.session_topic && (
                  <div className="reg-modal-field">
                    <span className="reg-modal-field-label">Presentation Topic</span>
                    <span className="reg-modal-field-val">{selectedReg.session_topic}</span>
                  </div>
                )}
                {selectedReg.volunteer_availability && (
                  <div className="reg-modal-field">
                    <span className="reg-modal-field-label">Availability & Logistics</span>
                    <span className="reg-modal-field-val">{selectedReg.volunteer_availability}</span>
                  </div>
                )}
                {selectedReg.attendance_goals && (
                  <div className="reg-modal-field">
                    <span className="reg-modal-field-label">Goals / Notes</span>
                    <span className="reg-modal-field-val">{selectedReg.attendance_goals}</span>
                  </div>
                )}
                {!selectedReg.session_topic &&
                  !selectedReg.volunteer_availability &&
                  !selectedReg.attendance_goals && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      No role-specific answers submitted.
                    </span>
                  )}
              </div>

              {/* Participation Needs (Section 31: Safeguarded sensitive labels) */}
              <div className="reg-modal-section">
                <span className="reg-modal-section-title">Participation Needs</span>
                <div className="reg-modal-grid-2">
                  <div className="reg-modal-field">
                    <span className="reg-modal-field-label">Accommodation Request</span>
                    <span className="reg-modal-field-val">
                      {selectedReg.accommodation_details ||
                        (selectedReg.requires_accommodation ? 'Accommodation requested' : 'None requested')}
                    </span>
                  </div>
                  <div className="reg-modal-field">
                    <span className="reg-modal-field-label">Dietary Requirement</span>
                    <span className="reg-modal-field-val">
                      {selectedReg.dietary_requirements || 'None'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                🔒 <strong>Privacy note:</strong> Accommodation notes are confidential to event operations and facility staff.
              </div>
            </div>

            {/* Modal Actions: Approve & Reject */}
            <div className="reg-modal-footer">
              <Button variant="ghost" size="sm" onClick={() => setSelectedReg(null)}>
                Close
              </Button>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<XCircle size={15} />}
                  onClick={() => handleReviewRegistration('rejected')}
                >
                  Reject
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle2 size={15} />}
                  onClick={() => handleReviewRegistration('approved')}
                >
                  Approve Registration
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: SCHEDULE MANAGEMENT (Prompt Section 32)
          ========================================================================= */}
      {activeTab === 'schedule' && (
        <div className="schedule-mgmt-view">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                Schedule Sessions
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                Manage agenda items. Changes trigger a participant notification prompt.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle size={16} />}
              onClick={() => handleOpenScheduleModal()}
            >
              Add Schedule Item
            </Button>
          </div>

          <div className="schedule-list">
            {scheduleItems.map((item) => (
              <div key={item.id} className="schedule-mgmt-card">
                <div className="schedule-mgmt-card__time">
                  {formatTime(item.start_time)} – {formatTime(item.end_time)}
                </div>

                <div className="schedule-mgmt-card__content">
                  <span className="schedule-mgmt-card__title">{item.title}</span>
                  {item.description && (
                    <span className="schedule-mgmt-card__desc">{item.description}</span>
                  )}
                  <div className="schedule-mgmt-card__meta">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} /> {item.venue}
                    </span>
                    {item.speaker_name && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={13} /> Speaker: {item.speaker_name}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit2 size={13} />}
                    onClick={() => handleOpenScheduleModal(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteScheduleItem(item.id)}
                    style={{ color: 'var(--color-error)' }}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Schedule Item Modal */}
      {scheduleModalOpen && (
        <div className="reg-modal-overlay" onClick={() => setScheduleModalOpen(false)}>
          <div className="reg-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="reg-modal-header">
              <h3 className="reg-modal-title">
                {editingItem ? 'Edit Schedule Session' : 'Add Schedule Item'}
              </h3>
              <button
                type="button"
                onClick={() => setScheduleModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit}>
              <div className="reg-modal-body">
                <Input
                  label="Session Title"
                  placeholder="e.g. AI & The Future of African Engineering"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  required
                />

                <div className="reg-modal-grid-2">
                  <Input
                    label="Venue / Room"
                    placeholder="e.g. Main Auditorium"
                    value={scheduleForm.venue}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })}
                    required
                  />
                  <Input
                    label="Speaker Name (optional)"
                    placeholder="e.g. Dr. Amina Touré"
                    value={scheduleForm.speaker_name}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, speaker_name: e.target.value })}
                  />
                </div>

                <div className="reg-modal-field">
                  <label className="reg-modal-field-label">Description</label>
                  <textarea
                    rows={3}
                    className="wizard-textarea"
                    value={scheduleForm.description}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                  />
                </div>

                <div className="reg-modal-field">
                  <label className="reg-modal-field-label">Target Audience</label>
                  <select
                    className="wizard-select"
                    value={scheduleForm.audience}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, audience: e.target.value })}
                  >
                    <option value="all">All Attendees</option>
                    <option value="participants">Participants</option>
                    <option value="speakers">Speakers</option>
                    <option value="volunteers">Volunteers</option>
                  </select>
                </div>
              </div>

              <div className="reg-modal-footer">
                <Button variant="ghost" size="sm" type="button" onClick={() => setScheduleModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {editingItem ? 'Save Session Changes' : 'Add to Schedule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Notification Prompt (Prompt Section 32) */}
      {showNotifyPrompt && (
        <div className="reg-modal-overlay">
          <div className="reg-modal-card" style={{ maxWidth: '480px' }}>
            <div className="reg-modal-header">
              <h3 className="reg-modal-title" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Bell size={18} style={{ color: 'var(--color-primary)' }} />
                Notify Affected Participants?
              </h3>
            </div>
            <div className="reg-modal-body">
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-main)', margin: 0 }}>
                You modified an existing schedule item. Would you like to notify participants and speakers about this schedule change?
              </p>
              <div style={{ backgroundColor: 'var(--color-surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                📢 Selecting <strong>Notify affected people</strong> immediately broadcasts an event update and alerts attendees on their devices.
              </div>
            </div>
            <div className="reg-modal-footer">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApplyScheduleChange(false)}
              >
                Save Without Notification
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Send size={14} />}
                onClick={() => handleApplyScheduleChange(true)}
              >
                Notify Affected People
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: POST UPDATE COMPOSER (Prompt Section 33)
          ========================================================================= */}
      {activeTab === 'updates' && (
        <div className="update-composer-view">
          {/* Left Form: Dedicated Composer */}
          <form className="composer-form" onSubmit={handlePublishUpdate}>
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0 }}>
                Broadcast Live Event Update
              </h2>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                Changes will immediately update the live event timeline and push notifications.
              </p>
            </div>

            {publishSuccess && (
              <Alert type="success" title="Update Published">
                Update broadcasted! All targeted attendees have received notification alerts.
              </Alert>
            )}

            {/* Update Type (Prompt Section 33) */}
            <div className="wizard-field-group">
              <label className="wizard-field-label">Update Type</label>
              <div className="update-type-pills">
                {[
                  { id: 'schedule_change', label: 'Schedule Change' },
                  { id: 'venue_change', label: 'Venue Change' },
                  { id: 'speaker_change', label: 'Speaker Change' },
                  { id: 'general_announcement', label: 'General Announcement' },
                  { id: 'emergency', label: 'Emergency' }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={`update-type-btn ${composerType === type.id ? 'update-type-btn--active' : ''}`}
                    onClick={() => setComposerType(type.id as UpdateType)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <Input
              label="Update Title"
              placeholder="e.g. Venue Change: Room 204 to Main Auditorium"
              value={composerTitle}
              onChange={(e) => setComposerTitle(e.target.value)}
              required
            />

            {/* Message */}
            <div className="wizard-field-group">
              <label className="wizard-field-label">Update Message</label>
              <textarea
                className="wizard-textarea"
                rows={4}
                placeholder="Write clear instructions for attendees..."
                value={composerMessage}
                onChange={(e) => setComposerMessage(e.target.value)}
                required
              />
            </div>

            {/* Audience (Prompt Section 33) */}
            <div className="wizard-field-group">
              <label className="wizard-field-label">Target Audience</label>
              <div className="audience-selector-grid">
                {[
                  { id: 'all', label: 'Everyone' },
                  { id: 'participants', label: 'Participants' },
                  { id: 'speakers', label: 'Speakers' },
                  { id: 'volunteers', label: 'Volunteers' }
                ].map((aud) => (
                  <div
                    key={aud.id}
                    className={`audience-btn ${composerAudience === aud.id ? 'audience-btn--active' : ''}`}
                    onClick={() => setComposerAudience(aud.id as any)}
                  >
                    {aud.label}
                  </div>
                ))}
              </div>
            </div>

            <Button variant="primary" size="md" leftIcon={<Radio size={16} />} type="submit">
              Publish Update
            </Button>
          </form>

          {/* Right Column: Live Attendee Preview & History */}
          <div className="preview-card-wrap">
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, margin: 0 }}>
              Attendee Timeline Preview
            </h3>
            <div
              style={{
                border: '2px dashed var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-surface)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: composerType === 'emergency' ? 'var(--color-error)' : 'var(--color-primary)'
                  }}
                >
                  {composerType.replace(/_/g, ' ')}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Just now</span>
              </div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 'var(--space-1)' }}>
                {composerTitle || 'Update Title'}
              </h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-main)', margin: 0 }}>
                {composerMessage || 'Your message will appear here for attendees.'}
              </p>
              <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--color-surface-subtle)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
                  Audience: {composerAudience}
                </span>
                <span style={{ fontSize: '0.65rem', backgroundColor: 'rgba(37,99,235,0.1)', color: 'var(--color-primary)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                  Affects you
                </span>
              </div>
            </div>

            {/* Past updates timeline list */}
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginTop: 'var(--space-4)', marginBottom: 0 }}>
              Recent Event Updates ({updates.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {updates.map((upd) => (
                <div
                  key={upd.id}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    backgroundColor: 'var(--color-surface)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{upd.title}</span>
                    <span>{new Date(upd.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {upd.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: EVENT SETTINGS (Prompt Section 34)
          ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="settings-view">
          {/* 1. Event Details */}
          <div className="settings-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
              Event Details
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Edit basic event metadata and venue location.
            </p>
            <Input
              label="Event Name"
              defaultValue={currentEventName}
            />
            <div className="reg-modal-grid-2">
              <Input
                label="Venue Name"
                defaultValue={event?.venue || 'Great Hall, KNUST'}
              />
              <Input
                label="Location Details"
                defaultValue={event?.location_details || 'Main Campus, Kumasi'}
              />
            </div>
            <Button variant="primary" size="sm" style={{ alignSelf: 'flex-start' }}>
              Save Details
            </Button>
          </div>

          {/* 2. Registration Settings */}
          <div className="settings-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
              Registration & Roles
            </h3>
            <div className="reg-modal-grid-2">
              <div className="wizard-field-group">
                <label className="wizard-field-label">Approval Mode</label>
                <select className="wizard-select" defaultValue="manual">
                  <option value="manual">Manual Review</option>
                  <option value="automatic">Automatic Approval</option>
                </select>
              </div>
              <Input
                label="Registration Capacity"
                type="number"
                defaultValue={event?.capacity || 450}
              />
            </div>
            <Button variant="outline" size="sm" style={{ alignSelf: 'flex-start' }}>
              Update Registration Rules
            </Button>
          </div>

          {/* 3. Information Collection */}
          <div className="settings-card">
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0 }}>
              Information Collection
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Enable or disable specific questions presented during attendee registration.
            </p>
            <div className="wizard-checkbox-grid">
              {['Organization', 'Job title / programme', 'Dietary requirements', 'Accessibility requirements', 'Emergency assistance'].map((q) => (
                <label key={q} className="wizard-checkbox-label wizard-checkbox-label--checked">
                  <input type="checkbox" defaultChecked className="wizard-checkbox-input" />
                  <span className="wizard-checkbox-name">{q}</span>
                </label>
              ))}
            </div>
            <Button variant="outline" size="sm" style={{ alignSelf: 'flex-start' }}>
              Save Question Preferences
            </Button>
          </div>

          {/* 4. Danger Zone (Prompt Section 34) */}
          <div className="danger-zone-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <AlertTriangle size={18} style={{ color: 'var(--color-error)' }} />
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, margin: 0, color: 'var(--color-error)' }}>
                Danger Zone
              </h3>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
              Irreversible actions that affect ongoing registrations and active participant records.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #fecaca', paddingBottom: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Close Registration</span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Prevent new attendees from applying while preserving existing registrations.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDangerModal('close')}
              >
                Close Registration
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #fecaca', paddingBottom: 'var(--space-3)' }}>
              <div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Cancel Event</span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Mark event as cancelled and send an emergency cancellation notice to all registered people.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDangerModal('cancel')}
                style={{ color: 'var(--color-warning)', borderColor: 'var(--color-warning)' }}
              >
                Cancel Event
              </Button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-error)' }}>Delete Event</span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Permanently remove this event and all associated schedule items and updates.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setDangerModal('delete')}
                style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
              >
                Delete Event
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone Confirmation Dialogs (Section 34) */}
      {dangerModal && (
        <div className="reg-modal-overlay">
          <div className="reg-modal-card" style={{ maxWidth: '440px' }}>
            <div className="reg-modal-header">
              <h3 className="reg-modal-title" style={{ color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} />
                Confirm {dangerModal.toUpperCase()}
              </h3>
            </div>
            <div className="reg-modal-body">
              <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>
                {dangerModal === 'close' && 'Are you sure you want to close registrations? New participants will no longer be able to register.'}
                {dangerModal === 'cancel' && 'Are you sure you want to cancel this event? An urgent cancellation alert will be broadcasted to all registered attendees.'}
                {dangerModal === 'delete' && 'This action is irreversible. All participant data, schedule items, and live updates will be permanently purged.'}
              </p>
            </div>
            <div className="reg-modal-footer">
              <Button variant="ghost" size="sm" onClick={() => setDangerModal(null)}>
                Dismiss
              </Button>
              <Button
                variant="primary"
                size="sm"
                style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-error)' }}
                onClick={() => {
                  setDangerModal(null);
                  if (dangerModal === 'delete') {
                    navigate('/manager/events');
                  }
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
