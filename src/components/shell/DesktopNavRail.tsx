/**
 * Desktop Navigation Rail — The Other Users
 * 
 * 240–280px left rail for tablet/desktop viewports.
 */

import React from 'react';
import { NavLink, Link } from 'react-router';
import styles from './DesktopNavRail.module.css';
import { useGameStore } from '../../domain/state/useGameStore';

const CHAPTERS = [
  { number: 0, name: 'Species Verification', path: '/verify', gate: 'G0' },
  { number: 1, name: 'Witness Wire', path: '/wire', gate: 'G0' },
  { number: 2, name: 'Moltinghouse', path: '/molt', gate: 'G1' },
  { number: 3, name: 'Belowline', path: '/below', gate: 'G2' },
  { number: 4, name: 'Vesper', path: '/vesper', gate: 'G3' },
  { number: 5, name: 'Pale Market', path: '/market', gate: 'G4' },
  { number: 6, name: 'Communion', path: '/communion', gate: 'G4' },
  { number: 7, name: 'Menagerie', path: '/menagerie', gate: 'G5' },
  { number: 8, name: 'Common Body', path: '/convergence', gate: 'G6' },
] as const;

export const DesktopNavRail: React.FC = () => {
  const chapter = useGameStore((s) => s.gameState.chapter);
  const unlockedGates = useGameStore((s) => s.gameState.unlockedGates);
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
            <span className={styles.icon} aria-hidden="true">01</span>
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
            <span className={styles.icon} aria-hidden="true">02</span>
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
            <span className={styles.icon} aria-hidden="true">03</span>
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
            <span className={styles.icon} aria-hidden="true">04</span>
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
            <span className={styles.icon} aria-hidden="true">05</span>
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
            <span className={styles.icon} aria-hidden="true">06</span>
            <span>Settings & Resets</span>
          </NavLink>
        </li>
      </ul>

      <nav className={styles.chapterNav} aria-label="Chapter spine">
        <div className={styles.chapterHeading}>
          <span>CHAPTER SPINE</span>
          <span>0—8</span>
        </div>
        <ol className={styles.chapterList}>
          {CHAPTERS.map((item) => {
            const isCurrent = chapter === item.number;
            const isUnlocked = Boolean(unlockedGates[item.gate]);
            return (
              <li key={item.number} className={styles.chapterItem}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.chapterLink} ${(isActive || isCurrent) ? styles.currentChapter : ''} ${!isUnlocked ? styles.lockedChapter : ''}`
                  }
                  aria-label={`Chapter ${item.number}: ${item.name}${isUnlocked ? '' : ', locked'}`}
                >
                  <span className={styles.chapterNumber}>{String(item.number).padStart(2, '0')}</span>
                  <span className={styles.chapterName}>{item.name}</span>
                  <span className={styles.chapterState} aria-hidden="true">
                    {isCurrent ? 'NOW' : isUnlocked ? 'OPEN' : 'LOCK'}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ol>
      </nav>

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
