/**
 * Accessible Base Button Primitive — The Other Users
 * 
 * Enforces minimum 44x44px touch targets, visible focus indicators, and semantic actions.
 */

import React from 'react';
import styles from './BaseButton.module.css';

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger';
  children: React.ReactNode;
}

export const BaseButton: React.FC<BaseButtonProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  const variantClass =
    variant === 'primary'
      ? styles.primary
      : variant === 'danger'
      ? styles.danger
      : '';

  return (
    <button
      className={`${styles.button} ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
