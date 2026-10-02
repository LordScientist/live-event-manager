import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserLayout } from './components/layout/UserLayout';
import { ManagerLayout } from './components/layout/ManagerLayout';
import { UserHomePage } from './pages/user/UserHomePage';
import { EventDetailsPage } from './pages/user/EventDetailsPage';
import { EventSchedulePage } from './pages/user/EventSchedulePage';
import { EventUpdatesPage } from './pages/user/EventUpdatesPage';
import { EventRegistrationPage } from './pages/user/EventRegistrationPage';
import { EventAccessibilityPage } from './pages/user/EventAccessibilityPage';
import { MyEventsPage } from './pages/user/MyEventsPage';
import { MyEventExperiencePage } from './pages/user/MyEventExperiencePage';
import { NotificationsPage } from './pages/user/NotificationsPage';
import { UserProfilePage } from './pages/user/UserProfilePage';
import { ManagerDashboardPage } from './pages/manager/ManagerDashboardPage';
import { ManagerEventsPage } from './pages/manager/ManagerEventsPage';
import { CreateEventPage } from './pages/manager/CreateEventPage';
import { EventManagementHubPage } from './pages/manager/EventManagementHubPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { LoginPage } from './pages/auth/LoginPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';
import { SplashScreen } from './pages/auth/SplashScreen';
import { PresentationPage } from './pages/presentation/PresentationPage';

/**
 * Route protection: Unauthenticated visitors are routed to /signup
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * Public-only auth routes: Authenticated users are redirected inside the app
 */
const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, accountType } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={accountType === 'manager' ? '/manager' : '/'} replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          {/* Welcome / Splash Screen (Public) */}
          <Route path="/welcome" element={<SplashScreen standalone />} />
          <Route path="/splash" element={<SplashScreen standalone />} />

          {/* Authentication Screens (Public only) */}
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <SignUpPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* User Application Routes (Protected) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserHomePage />} />
            <Route path="events" element={<UserHomePage />} />
            <Route path="events/:id" element={<EventDetailsPage />} />
            <Route path="events/:id/accessibility" element={<EventAccessibilityPage />} />
            <Route path="events/:id/schedule" element={<EventSchedulePage />} />
            <Route path="events/:id/updates" element={<EventUpdatesPage />} />
            <Route path="events/:id/register" element={<EventRegistrationPage />} />
            <Route path="my-events" element={<MyEventsPage />} />
            <Route path="my-events/:id" element={<MyEventExperiencePage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<UserProfilePage />} />
          </Route>

          {/* Event Manager Application Routes (Protected) */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute>
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ManagerDashboardPage />} />
            <Route path="events" element={<ManagerEventsPage />} />
            <Route path="events/:id" element={<EventManagementHubPage />} />
            <Route path="events/:id/settings" element={<EventManagementHubPage />} />
            <Route path="create-event" element={<CreateEventPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<UserProfilePage />} />
          </Route>

          {/* Product Story / Presentation Deck (Protected) */}
          <Route
            path="/presentation"
            element={
              <ProtectedRoute>
                <PresentationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/story"
            element={
              <ProtectedRoute>
                <PresentationPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
