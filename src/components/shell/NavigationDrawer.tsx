/**
 * Mobile Navigation Drawer — The Other Users
 * 
 * Accessible full-height drawer closing via backdrop tap, Close button,
 * route selection, Escape key, and browser Back popstate.
 */

import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router';
import styles from './NavigationDrawer.module.css';
import { useGameStore } from '../../domain/state/useGameStore';
import { COMMUNITIES_LIST } from '../../content/fixtures/checkpoint1Content';

export const NavigationDrawer: React.FC = () => {
  const isOpen = useGameStore((s) => s.uiState.navigationDrawerOpen);
  const setOpen = useGameStore((s) => s.setNavigationDrawerOpen);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape & popstate (browser back)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    const handlePopState = () => {
      setOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    // Focus close button upon opening
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <div
      className={styles.backdrop}
      onClick={() => setOpen(false)}
      role="presentation"
    >
      <nav
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Full Network Directory"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span className={styles.title}>Palinode Directory</span>
          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={() => setOpen(false)}
            aria-label="Close navigation drawer"
          >
            ✕
          </button>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionHeading}>Core Surfaces</span>
          <ul className={styles.linkList}>
            <li>
              <NavLink to="/home" className={styles.drawerLink} onClick={handleLinkClick}>
                <span>Home Feed</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/inbox" className={styles.drawerLink} onClick={handleLinkClick}>
                <span>Inbox & Transcripts</span>
                <span className={styles.statusTag}>1 New</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/evidence" className={styles.drawerLink} onClick={handleLinkClick}>
                <span>Evidence Board</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile" className={styles.drawerLink} onClick={handleLinkClick}>
                <span>Player Profile & Anatomy</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/communities" className={styles.drawerLink} onClick={handleLinkClick}>
                <span>All Communities</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={styles.drawerLink} onClick={handleLinkClick}>
                <span>Settings & Resets</span>
              </NavLink>
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionHeading}>Species Networks</span>
          <ul className={styles.linkList}>
            {COMMUNITIES_LIST.map((comm) => (
              <li key={comm.id}>
                <NavLink
                  to={comm.route}
                  className={styles.drawerLink}
                  onClick={handleLinkClick}
                >
                  <span>{comm.name}</span>
                  <span className={styles.statusTag}>{comm.status}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};
