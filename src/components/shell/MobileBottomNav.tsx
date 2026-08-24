/**
 * Mobile Bottom Navigation Bar — The Other Users
 * 
 * Persistent thumb-zone navigation: Home, Inbox, Evidence, Profile, More Drawer.
 */

import React from 'react';
import { NavLink } from 'react-router';
import styles from './MobileBottomNav.module.css';
import { useGameStore } from '../../domain/state/useGameStore';

export const MobileBottomNav: React.FC = () => {
  const setNavigationDrawerOpen = useGameStore((s) => s.setNavigationDrawerOpen);
  const isDrawerOpen = useGameStore((s) => s.uiState.navigationDrawerOpen);

  return (
    <nav className={styles.navBar} aria-label="Primary Mobile Navigation">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.icon} aria-hidden="true">⌂</span>
        <span>Feed</span>
      </NavLink>

      <NavLink
        to="/inbox"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.icon} aria-hidden="true">↘</span>
        <span>Inbox</span>
        <span className={styles.badge} aria-label="1 unread transmission">
          1
        </span>
      </NavLink>

      <NavLink
        to="/evidence"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.icon} aria-hidden="true">◇</span>
        <span>Evidence</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `${styles.navItem} ${isActive ? styles.active : ''}`
        }
      >
        <span className={styles.icon} aria-hidden="true">◎</span>
        <span>Profile</span>
      </NavLink>

      <button
        type="button"
        className={`${styles.navItem} ${isDrawerOpen ? styles.active : ''}`}
        onClick={() => setNavigationDrawerOpen(true)}
        aria-label="Open Full Network Navigation"
        aria-haspopup="dialog"
      >
        <span className={styles.icon} aria-hidden="true">≡</span>
        <span>More</span>
      </button>
    </nav>
  );
};
