import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserLayout } from './components/layout/UserLayout';
import { ManagerLayout } from './components/layout/ManagerLayout';
import { UserHomePage } from './pages/user/UserHomePage';
import { EventDetailsPage } from './pages/user/EventDetailsPage';
import { EventRegistrationPage } from './pages/user/EventRegistrationPage';
import { ManagerDashboardPage } from './pages/manager/ManagerDashboardPage';
import { LandingPage } from './pages/auth/LandingPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { LoginPage } from './pages/auth/LoginPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Welcome / Landing Screen (Prompt Section 4.1) */}
          <Route path="/welcome" element={<LandingPage />} />
          {/* Sign Up Screen (Prompt Section 5) */}
          <Route path="/signup" element={<SignUpPage />} />
          {/* Login Screen (Prompt Section 6) */}
          <Route path="/login" element={<LoginPage />} />

          {/* User Application Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<UserHomePage />} />
            <Route path="events" element={<UserHomePage />} />
            <Route path="events/:id" element={<EventDetailsPage />} />
            <Route path="events/:id/register" element={<EventRegistrationPage />} />
            <Route path="my-events" element={<div className="container" style={{ padding: 'var(--space-6)' }}><h2>My Events (Upcoming, Pending, Past)</h2></div>} />
            <Route path="notifications" element={<div className="container" style={{ padding: 'var(--space-6)' }}><h2>Notifications & Live Updates</h2></div>} />
            <Route path="profile" element={<div className="container" style={{ padding: 'var(--space-6)' }}><h2>User Profile</h2></div>} />
          </Route>

          {/* Event Manager Application Routes */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboardPage />} />
            <Route path="events" element={<div style={{ padding: 'var(--space-4)' }}><h2>Managed Events</h2></div>} />
            <Route path="create-event" element={<div style={{ padding: 'var(--space-4)' }}><h2>Create Event Wizard</h2></div>} />
            <Route path="notifications" element={<div style={{ padding: 'var(--space-4)' }}><h2>Manager Notifications</h2></div>} />
            <Route path="profile" element={<div style={{ padding: 'var(--space-4)' }}><h2>Organizer Profile</h2></div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
