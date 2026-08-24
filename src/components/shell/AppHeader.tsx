/**
 * Global App Header — The Other Users
 * 
 * 44–52px sticky header displaying network brand, current surface title,
 * network condition badge, and quick accessibility shortcut.
 */

import React from 'react';
import { Link, useLocation } from 'react-router';
import styles from './AppHeader.module.css';
import { ROUTE_REGISTRY } from '../../domain/routes/routeRegistry';
import { useSettingsStore } from '../../domain/state/settingsStore';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);

  const routeMeta = ROUTE_REGISTRY[location.pathname];
  const surfaceTitle = routeMeta ? routeMeta.surfaceName : 'Palinode Network';

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className={styles.header} role="banner">
      <Link to="/home" className={styles.brandGroup} aria-label="Palinode Network Home">
        <span className={styles.logoMark}><i aria-hidden="true" />PALINODE</span>
        <span className={styles.surfaceTitle} title={surfaceTitle}>
          {surfaceTitle}
        </span>
      </Link>

      <div className={styles.actionsGroup}>
        <span className={styles.conditionBadge} aria-label="Network state">
          <i aria-hidden="true" /> CH-0 · TRANSLATION ACTIVE
        </span>

        <Link
          to="/accessibility"
          className={styles.iconButton}
          aria-label="Sensory & Accessibility Preferences"
          title="Preferences"
        >
          <span aria-hidden="true">SENSORY</span>
        </Link>

        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label={`Toggle theme (currently ${theme})`}
          title="Toggle Light/Dark Theme"
        >
          <span aria-hidden="true">{theme === 'light' ? 'DARK' : 'LIGHT'}</span>
        </button>
      </div>
    </header>
  );
};
