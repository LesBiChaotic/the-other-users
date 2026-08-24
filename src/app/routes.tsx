/**
 * React Router Route Tree & Guard Integration — The Other Users
 * 
 * Binds declarative route metadata to feature surfaces wrapped in GlobalShell.
 */

import React from 'react';
import { RouteObject, Navigate, Link } from 'react-router';
import { ROUTE_REGISTRY, evaluateRouteGuard } from '../domain/routes/routeRegistry';
import { useGameStore } from '../domain/state/useGameStore';
import { selectConditionContext } from '../domain/state/selectors';
import { BaseButton } from '../components/primitives/BaseButton';
import { NetworkNotice } from '../components/primitives/NetworkNotice';
import { GlobalShell } from '../components/shell/GlobalShell';

// Checkpoint 1 & 2 Feature Surfaces
import { InvitationLanding } from '../features/public/InvitationLanding';
import { AccessibilitySettings } from '../features/public/AccessibilitySettings';
import { SpeciesVerification } from '../features/verification/SpeciesVerification';
import { PalinodeHome } from '../features/hub/PalinodeHome';
import { CorrespondenceLedger } from '../features/inbox/CorrespondenceLedger';
import { EvidenceBoard } from '../features/evidence/EvidenceBoard';
import { PlayerProfileView } from '../features/profile/PlayerProfileView';
import { CommunityDirectory } from '../features/communities/CommunityDirectory';
import { SettingsView } from '../features/settings/SettingsView';

// Checkpoint 2: Witness Wire Vertical Slice
import { WitnessWireHome } from '../features/witness-wire/WitnessWireHome';
import { WitnessThreadDetail } from '../features/witness-wire/WitnessThreadDetail';
import { WitnessUserProfile } from '../features/witness-wire/WitnessUserProfile';
import { PlayerObservationCase } from '../features/witness-wire/PlayerObservationCase';

// Checkpoint 3: Moltinghouse & Belowline Wave One
import { MoltinghouseHome } from '../features/moltinghouse/MoltinghouseHome';
import { SoftErrorArchive } from '../features/moltinghouse/SoftErrorArchive';
import { FiveOfUsThread } from '../features/moltinghouse/FiveOfUsThread';
import { BelowlineMap } from '../features/belowline/BelowlineMap';
import { ManifestLedger } from '../features/belowline/ManifestLedger';

// Checkpoint 4: Vesper, Pale Market & Communion Wave Two
import { VesperHome } from '../features/vesper/VesperHome';
import { RoomToneCase } from '../features/vesper/RoomToneCase';
import { AgreementViewer } from '../features/vesper/AgreementViewer';
import { PaleMarketHome } from '../features/pale-market/PaleMarketHome';
import { IdentityAssembly } from '../features/pale-market/IdentityAssembly';
import { MemoryRemoval } from '../features/pale-market/MemoryRemoval';
import { CommunionStream } from '../features/communion/CommunionStream';
import { TestimonyArchive } from '../features/communion/TestimonyArchive';
import { LitanyConcordance } from '../features/communion/LitanyConcordance';

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
          padding: 'var(--space-4) 0',
          maxWidth: 'var(--measure-prose)',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <NetworkNotice type="warning" message={guard.message || 'Access denied.'} />
        <div>
          <h1 className="type-h2">Access Restricted</h1>
          <p className="type-body" style={{ marginTop: 'var(--space-2)' }}>
            {guard.message}
          </p>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Link to={guard.targetPath} style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Return to Permitted Surface</BaseButton>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
};

// Component Registry Mapping
const SURFACE_COMPONENTS: Record<string, React.ReactNode> = {
  '/': <InvitationLanding />,
  '/verify': <SpeciesVerification />,
  '/accessibility': <AccessibilitySettings />,
  '/home': <PalinodeHome />,
  '/inbox': <CorrespondenceLedger />,
  '/evidence': <EvidenceBoard />,
  '/profile': <PlayerProfileView />,
  '/communities': <CommunityDirectory />,
  '/settings': <SettingsView />,
  '/wire': <WitnessWireHome />,
  '/wire/case/player': <PlayerObservationCase />,
  '/molt': <MoltinghouseHome />,
  '/molt/sheds/soft_error': <SoftErrorArchive />,
  '/molt/thread/five-of-us': <FiveOfUsThread />,
  '/below': <BelowlineMap />,
  '/below/manifests': <ManifestLedger />,
  '/vesper': <VesperHome />,
  '/vesper/profile/room-tone': <RoomToneCase />,
  '/vesper/agreements/body-sharing': <AgreementViewer />,
  '/market': <PaleMarketHome />,
  '/market/listing/access-identity': <IdentityAssembly />,
  '/market/listing/unremember-me': <MemoryRemoval />,
  '/communion': <CommunionStream />,
  '/communion/testimonies': <TestimonyArchive />,
  '/communion/litany': <LitanyConcordance />,
};

export const routes: RouteObject[] = Object.keys(ROUTE_REGISTRY).map((path) => {
  const surfaceElement = SURFACE_COMPONENTS[path] || (
    <div style={{ padding: 'var(--space-4) 0' }}>
      <h1 className="type-h1">{ROUTE_REGISTRY[path]?.surfaceName}</h1>
      <p className="type-body" style={{ marginTop: 'var(--space-2)' }}>
        Surface under active protocol containment. Unseals in later chapters.
      </p>
    </div>
  );

  return {
    path: path === '/' ? '/' : path.replace(/^\//, ''),
    element: (
      <GlobalShell>
        <GuardedRoute path={path}>{surfaceElement}</GuardedRoute>
      </GlobalShell>
    ),
  };
});

// Dynamic parameterized routes
routes.push({
  path: 'wire/thread/:id',
  element: (
    <GlobalShell>
      <GuardedRoute path="/wire">
        <WitnessThreadDetail />
      </GuardedRoute>
    </GlobalShell>
  ),
});

routes.push({
  path: 'wire/user/:handle',
  element: (
    <GlobalShell>
      <GuardedRoute path="/wire">
        <WitnessUserProfile />
      </GuardedRoute>
    </GlobalShell>
  ),
});

// Fallback route
routes.push({
  path: '*',
  element: <Navigate to="/" replace />,
});
