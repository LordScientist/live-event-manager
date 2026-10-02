import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, CalendarCheck, Bell, User, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import lcIcon from '../../assets/lc-icon.png';
import './UserLayout.css';

export const UserLayout: React.FC = () => {
  const { currentUser, switchAccountType } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToManager = () => {
    switchAccountType('manager');
    navigate('/manager');
  };

  return (
    <div className="user-layout">
      {/* Top Header */}
      <header className="user-header">
        <div className="container user-header__inner">
          <Link to="/" className="user-header__brand" aria-label="Live Connect Home">
            <img src={lcIcon} alt="Live Connect" className="brand-logo-img" />
            <div className="brand-text">
              <span className="brand-title">Live Connect</span>
              <span className="brand-subtitle">Participant Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="user-header__nav desktop-only" aria-label="Main Navigation">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              <Home size={18} aria-hidden="true" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/my-events"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              <CalendarCheck size={18} aria-hidden="true" />
              <span>My Events</span>
            </NavLink>
            <NavLink
              to="/notifications"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              <Bell size={18} aria-hidden="true" />
              <span>Notifications</span>
              <span className="nav-badge">2</span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              <User size={18} aria-hidden="true" />
              <span>Profile</span>
            </NavLink>
          </nav>

          {/* Actions & Role Switcher */}
          <div className="user-header__actions">
            <ThemeToggle size="sm" />
            <button
              type="button"
              onClick={handleSwitchToManager}
              className="role-switch-btn"
              title="Switch to Manager Portal"
            >
              <ArrowRightLeft size={16} aria-hidden="true" />
              <span className="role-switch-btn__text">Manager Mode</span>
            </button>
            <div className="user-avatar" title={`${currentUser.first_name} ${currentUser.last_name}`}>
              {currentUser.first_name[0]}{currentUser.last_name[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="user-layout__main">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (Home | My Events | Notifications | Profile) */}
      <nav className="mobile-bottom-nav mobile-only" aria-label="Mobile Navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`}
        >
          <Home size={20} aria-hidden="true" />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/my-events"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`}
        >
          <CalendarCheck size={20} aria-hidden="true" />
          <span>My Events</span>
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`}
        >
          <div className="mobile-nav-item__icon-wrapper">
            <Bell size={20} aria-hidden="true" />
            <span className="mobile-nav-badge">2</span>
          </div>
          <span>Notifications</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-item--active' : ''}`}
        >
          <User size={20} aria-hidden="true" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
};
