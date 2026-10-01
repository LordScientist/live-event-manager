import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlusCircle, Calendar, Users, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ManagerDashboardPage: React.FC = () => {
  return (
    <div>
      {/* Top Welcome & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ marginBottom: 'var(--space-1)' }}>Organizer Dashboard</h1>
          <p>Coordinate schedules, track registrations, and publish live event updates.</p>
        </div>
        <Link to="/manager/create-event">
          <Button variant="primary" leftIcon={<PlusCircle size={18} />}>
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <Card>
          <CardContent style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)', color: 'var(--color-primary)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700' }}>3</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Active Events</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)', color: 'var(--color-success)' }}>
              <Users size={24} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700' }}>148</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Total Registrations</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-warning-bg)', borderRadius: 'var(--radius-md)', color: 'var(--color-warning)' }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700' }}>12</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Pending Approvals</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Events Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Event Coordination</CardTitle>
        </CardHeader>
        <CardContent>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            Select an event from the events menu to edit schedules, review role-based registrations, and post real-time updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
