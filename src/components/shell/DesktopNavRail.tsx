/**
 * Desktop Navigation Rail — The Other Users
 * 
 * 240–280px left rail for tablet/desktop viewports.
 */

import React from 'react';
import { NavLink, Link } from 'react-router';
import styles from './DesktopNavRail.module.css';
import { useGameStore } from '../../domain/state/useGameStore';

export const DesktopNavRail: React.FC = () => {
  const chapter = useGameStore((s) => s.gameState.chapter);
  const handle = useGameStore((s) => s.playerProfile.handle);

  return (
    <aside className={styles.rail} aria-label="Palinode Rail Navigation">
      <Link to="/home" className={styles.brand}>
        <span className={styles.brandMark}>// PALINODE</span>
        <span className={styles.brandTagline}>Unobserved Nonhuman Relay</span>
      </Link>

      <ul className={styles.navList}>
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon} aria-hidden="true">⌂</span>
            <span>Home Feed</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/inbox"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon} aria-hidden="true">✉</span>
            <span>Inbox</span>
            <span className={styles.badge} aria-label="1 transmission">1</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/evidence"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon} aria-hidden="true">☍</span>
            <span>Evidence Board</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon} aria-hidden="true">👤</span>
            <span>Profile & Anatomy</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/communities"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon} aria-hidden="true">❖</span>
            <span>Communities</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.icon} aria-hidden="true">⚙</span>
            <span>Settings & Resets</span>
          </NavLink>
        </li>
      </ul>

      <div className={styles.footer}>
        <div className={styles.statusIndicator}>
          <strong>SESSION:</strong> {handle}
        </div>
        <div className={styles.statusIndicator}>
          <strong>PROGRESSION:</strong> Chapter {chapter} (Canon 0–8)
        </div>
      </div>
    </aside>
  );
};
