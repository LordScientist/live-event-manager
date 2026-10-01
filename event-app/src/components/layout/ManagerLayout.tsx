import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Bell,
  User,
  ArrowRightLeft,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ManagerLayout.css';

export const ManagerLayout: React.FC = () => {
  const { currentUser, switchAccountType } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSwitchToUser = () => {
    switchAccountType('user');
    navigate('/');
  };

  const navItems = [
    { to: '/manager', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/manager/events', label: 'My Events', icon: Calendar },
    { to: '/manager/create-event', label: 'Create Event', icon: PlusCircle },
    { to: '/manager/notifications', label: 'Notifications', icon: Bell, badge: 3 },
    { to: '/manager/profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="manager-layout">
      {/* Top Header */}
      <header className="manager-header">
        <div className="manager-header__inner container">
          <div className="manager-header__left">
            <button
              type="button"
              className="manager-hamburger mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="manager-header__brand">
              <span className="brand-logo" aria-hidden="true">🛠️</span>
              <div className="brand-text">
                <span className="brand-title">EventCoord</span>
                <span className="brand-tag">Organizer Console</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
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
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* Actions & Role Switcher */}
          <div className="manager-header__actions">
            <button
              type="button"
              onClick={handleSwitchToUser}
              className="role-switch-btn"
              title="Switch to Participant Portal"
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

      {/* Mobile Drawer Menu (Prompt requirement: collapse navigation into a menu) */}
      {mobileMenuOpen && (
        <div className="manager-mobile-menu mobile-only">
          <nav className="manager-mobile-menu__nav" aria-label="Mobile Navigation Drawer">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `manager-mobile-nav-link ${isActive ? 'manager-mobile-nav-link--active' : ''}`
                  }
                >
                  <Icon size={20} aria-hidden="true" />
                  <span>{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="manager-layout__main container">
        <Outlet />
      </main>
    </div>
  );
};
