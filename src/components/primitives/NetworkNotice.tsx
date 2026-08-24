/**
 * Network Notice Bar — The Other Users
 * 
 * Full-width slim network status band reserved for meaningful state changes.
 */

import React from 'react';
import styles from './NetworkNotice.module.css';

export interface NetworkNoticeProps {
  type?: 'warning' | 'permission' | 'network';
  message: string;
  onDismiss?: () => void;
}

export const NetworkNotice: React.FC<NetworkNoticeProps> = ({
  type = 'network',
  message,
  onDismiss,
}) => {
  const typeClass =
    type === 'warning'
      ? styles.warning
      : type === 'permission'
      ? styles.permission
      : styles.network;

  return (
    <aside
      className={`${styles.notice} ${typeClass}`}
      role="status"
      aria-live="polite"
    >
      <span className={styles.message}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          className={styles.dismissButton}
          onClick={onDismiss}
          aria-label="Dismiss network notice"
        >
          ✕
        </button>
      )}
    </aside>
  );
};
