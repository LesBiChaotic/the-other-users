/**
 * Global Application Shell — The Other Users
 * 
 * Orchestrates AppHeader, DesktopNavRail, MobileBottomNav, NavigationDrawer,
 * and the main content viewport slot.
 */

import React from 'react';
import { useLocation } from 'react-router';
import styles from './GlobalShell.module.css';
import { AppHeader } from './AppHeader';
import { DesktopNavRail } from './DesktopNavRail';
import { MobileBottomNav } from './MobileBottomNav';
import { NavigationDrawer } from './NavigationDrawer';

export interface GlobalShellProps {
  children: React.ReactNode;
}

export const GlobalShell: React.FC<GlobalShellProps> = ({ children }) => {
  const location = useLocation();
  // On public invitation landing (/), show a clean distraction-free frame without bottom nav/rail
  const isPublicLanding = ['/', '/verify', '/accessibility'].includes(location.pathname);

  if (isPublicLanding) {
    return (
      <div className={styles.shellContainer}>
        <div className={styles.mainColumn}>
          <AppHeader />
          <main className={styles.contentWrapper}>{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shellContainer}>
      <DesktopNavRail />
      <div className={styles.mainColumn}>
        <AppHeader />
        <main className={styles.contentWrapper}>{children}</main>
        <MobileBottomNav />
        <NavigationDrawer />
      </div>
    </div>
  );
};
