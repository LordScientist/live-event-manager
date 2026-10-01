import React from 'react';
import './Alert.css';

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  icon,
  className = ''
}) => {
  return (
    <div
      role="alert"
      className={`alert alert--${type} ${className}`.trim()}
    >
      {icon && <div className="alert__icon" aria-hidden="true">{icon}</div>}
      <div className="alert__body">
        {title && <h4 className="alert__title">{title}</h4>}
        <div className="alert__content">{children}</div>
      </div>
    </div>
  );
};
