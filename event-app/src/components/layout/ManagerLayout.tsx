import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Bell,
  User,
  ArrowRightLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import lcIcon from '../../assets/lc-icon.png';
import './ManagerLayout.css';

export const ManagerLayout: React.FC = () => {
  const { currentUser, switchAccountType } = useAuth();
  const navigate = useNavigate();

  const handleSwitchToUser = () => {
    switchAccountType('user');
    navigate('/');
  };

  const navItems = [
    { to: '/manager', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/manager/events', label: 'Events', icon: Calendar },
    { to: '/manager/create-event', label: 'Create', icon: PlusCircle, isCreate: true },
    { to: '/manager/notifications', label: 'Alerts', icon: Bell, badge: 3 },
    { to: '/manager/profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="manager-layout">
      {/* Top Header */}
      <header className="manager-header">
        <div className="manager-header__inner container">
          <Link to="/manager" className="manager-header__brand" aria-label="Live Connect Organizer Console">
            <img src={lcIcon} alt="Live Connect" className="brand-logo-img" />
            <div className="brand-text">
              <span className="brand-title">Live Connect</span>
              <span className="brand-tag">Organizer Console</span>
            </div>
          </Link>

          {/* Desktop Navigation (visible on tablet/desktop only) */}
          <nav className="manager-header__nav desktop-only" aria-label="Manager Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `manager-nav-link ${isActive ? 'manager-nav-link--active' : ''}`
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>{item.isCreate ? 'Create Event' : item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* Actions & Role Switcher */}
          <div className="manager-header__actions">
            <ThemeToggle size="sm" />
            <button
              type="button"
              onClick={handleSwitchToUser}
              className="role-switch-btn role-switch-btn--manager"
              title="Switch to Participant Portal"
              aria-label="Switch to Participant Portal"
            >
              <ArrowRightLeft size={16} aria-hidden="true" />
              <span className="role-switch-btn__text">Participant Mode</span>
            </button>
            <div className="user-avatar user-avatar--manager" title={`${currentUser.first_name} ${currentUser.last_name}`}>
              {currentUser.first_name[0]}{currentUser.last_name[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="manager-layout__main container">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (Section 35: Dashboard | Events | Create | Notifications | Profile) */}
      <nav className="manager-bottom-nav mobile-only" aria-label="Manager Mobile Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `manager-bottom-nav-item ${item.isCreate ? 'manager-bottom-nav-item--create' : ''} ${
                  isActive ? 'manager-bottom-nav-item--active' : ''
                }`
              }
            >
              <div className="manager-bottom-nav-icon-wrapper">
                <Icon size={item.isCreate ? 22 : 20} aria-hidden="true" />
                {item.badge && <span className="manager-bottom-badge">{item.badge}</span>}
              </div>
              <span className="manager-bottom-nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
