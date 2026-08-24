/**
 * React Router Route Configuration & Guards — The Other Users
 * 
 * Maps declarative route registry metadata to React Router v7 routes with pure guard validation.
 */

import React from 'react';
import { RouteObject, Navigate, useLocation, Link } from 'react-router';
import { ROUTE_REGISTRY, evaluateRouteGuard } from '../domain/routes/routeRegistry';
import { useGameStore } from '../domain/state/useGameStore';
import { selectConditionContext } from '../domain/state/selectors';
import { BaseButton } from '../components/primitives/BaseButton';
import { NetworkNotice } from '../components/primitives/NetworkNotice';

export interface GuardedRouteProps {
  path: string;
  children: React.ReactNode;
}

export const GuardedRoute: React.FC<GuardedRouteProps> = ({ path, children }) => {
  const store = useGameStore();
  const ctx = selectConditionContext(store);
  const guard = evaluateRouteGuard(path, ctx);

  if (!store.isHydrated) {
    return (
      <div style={{ padding: 'var(--space-4)', color: 'var(--text-muted)' }}>
        Synchronizing Palinode session...
      </div>
    );
  }

  if (!guard.authorized) {
    return (
      <main
        style={{
          padding: 'var(--space-4)',
          maxWidth: 'var(--measure-prose)',
          margin: '0 auto',
        }}
      >
        <NetworkNotice type="warning" message={guard.message || 'Access denied.'} />
        <div style={{ marginTop: 'var(--space-4)' }}>
          <h1 className="type-h2">Access Restricted</h1>
          <p className="type-body" style={{ marginTop: 'var(--space-2)' }}>
            {guard.message}
          </p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Link to={guard.targetPath}>
              <BaseButton variant="primary">Return to Permitted Surface</BaseButton>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};

// Checkpoint 0 Foundation Proof Harness View
export const FoundationHarnessView: React.FC = () => {
  const store = useGameStore();
  const location = useLocation();
  const meta = ROUTE_REGISTRY[location.pathname] || {
    surfaceName: 'Unregistered Surface',
    chapterRequirement: 0,
    fallbackPath: '/',
    deniedMessage: 'Unregistered',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header>
        <h1 className="type-h1">{meta.surfaceName}</h1>
        <p className="type-mono" style={{ color: 'var(--text-muted)' }}>
          Route: {location.pathname} | Chapter: {store.gameState.chapter} (Canon 0–8) | Hydrated: {String(store.isHydrated)}
        </p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <h2 className="type-h3">Provisional Identity</h2>
        <p className="type-body">
          Handle: <strong className="type-mono">{store.playerProfile.handle}</strong> | Species:{' '}
          <em>{store.playerProfile.provisionalSpecies}</em>
        </p>
      </section>

      <section style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <BaseButton
          variant="primary"
          onClick={() => {
            if (!store.gameState.unlockedGates['G0']) {
              store.unlockGate('G0');
            }
          }}
        >
          {store.gameState.unlockedGates['G0'] ? 'Gate G0 Unlocked' : 'Unlock Gate G0'}
        </BaseButton>

        <BaseButton
          onClick={() => {
            if (store.gameState.chapter < 8) {
              store.advanceChapter(store.gameState.chapter + 1);
            }
          }}
        >
          Advance Chapter (Current: {store.gameState.chapter})
        </BaseButton>

        <BaseButton variant="danger" onClick={() => store.resetFull()}>
          Execute Full Reset
        </BaseButton>
      </section>

      <nav aria-label="Proof Navigation" style={{ marginTop: 'var(--space-4)' }}>
        <h3 className="type-small" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Foundation Proof Destinations
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          {Object.entries(ROUTE_REGISTRY).map(([path, rMeta]) => (
            <li key={path}>
              <Link to={path} style={{ textDecoration: 'underline', color: 'var(--accent-network)' }}>
                {rMeta.surfaceName} ({path})
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export const routes: RouteObject[] = Object.keys(ROUTE_REGISTRY).map((path) => ({
  path: path === '/' ? '/' : path.replace(/^\//, ''),
  element: (
    <GuardedRoute path={path}>
      <FoundationHarnessView />
    </GuardedRoute>
  ),
}));

// Fallback route
routes.push({
  path: '*',
  element: <Navigate to="/" replace />,
});
