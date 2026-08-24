/**
 * Application Entrypoint & Shell — The Other Users
 */

import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from './routes';
import { RootErrorBoundary } from './RootErrorBoundary';
import { useGameStore } from '../domain/state/useGameStore';
import { useSettingsStore } from '../domain/state/settingsStore';

import '../styles/tokens.css';
import '../styles/reset.css';
import '../styles/typography.css';
import '../styles/layout.css';

const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});

export const App: React.FC = () => {
  const hydrate = useGameStore((state) => state.hydrate);
  const resetSurface = useGameStore((state) => state.resetSurface);
  const applySettingsToDOM = useSettingsStore((state) => state.applyToDOM);

  useEffect(() => {
    applySettingsToDOM();
    hydrate();
  }, [hydrate, applySettingsToDOM]);

  return (
    <RootErrorBoundary onSurfaceReset={resetSurface}>
      <div className="layout-shell">
        <main style={{ flex: 1, padding: 'var(--space-4) 0' }}>
          <RouterProvider router={router} />
        </main>
      </div>
    </RootErrorBoundary>
  );
};

export default App;
