import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

export interface ThemeToggleProps {
  size?: 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const { isDark, toggleTheme } = useTheme();

  const title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  const labelText = isDark ? 'Light Mode' : 'Dark Mode';

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${size} ${showLabel ? 'theme-toggle--with-label' : ''} ${className}`}
      onClick={toggleTheme}
      title={title}
      aria-label={title}
      aria-pressed={isDark}
    >
      <span className="theme-toggle__icon-wrap" aria-hidden="true">
        {isDark ? (
          <Sun className="theme-toggle__icon theme-toggle__icon--sun" size={size === 'sm' ? 16 : 18} />
        ) : (
          <Moon className="theme-toggle__icon theme-toggle__icon--moon" size={size === 'sm' ? 16 : 18} />
        )}
      </span>
      {showLabel && <span className="theme-toggle__label">{labelText}</span>}
    </button>
  );
};
