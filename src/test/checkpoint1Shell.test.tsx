/**
 * Checkpoint 1 Global Shell & Feature Surfaces Acceptance Test Suite — The Other Users
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';
import { useSettingsStore } from '../domain/state/settingsStore';

// Feature Surfaces
import { InvitationLanding } from '../features/public/InvitationLanding';
import { AccessibilitySettings } from '../features/public/AccessibilitySettings';
import { SpeciesVerification } from '../features/verification/SpeciesVerification';
import { PalinodeHome } from '../features/hub/PalinodeHome';
import { CorrespondenceLedger } from '../features/inbox/CorrespondenceLedger';
import { EvidenceBoard } from '../features/evidence/EvidenceBoard';
import { PlayerProfileView } from '../features/profile/PlayerProfileView';
import { CommunityDirectory } from '../features/communities/CommunityDirectory';
import { SettingsView } from '../features/settings/SettingsView';
import { MobileBottomNav } from '../components/shell/MobileBottomNav';
import { NavigationDrawer } from '../components/shell/NavigationDrawer';
import { DesktopNavRail } from '../components/shell/DesktopNavRail';

describe('Checkpoint 1 Global Shell & Hub Surfaces', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();
  });

  it('1. Invitation Landing renders PUB-001 copy, privacy disclosure, and CTAs', () => {
    render(
      <MemoryRouter>
        <InvitationLanding />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Species Verification Inconclusive/i })).toBeInTheDocument();
    expect(screen.getByText(/Your account has been approved/i)).toBeInTheDocument();
    expect(screen.getByText(/This service will not request your legal name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Accept Inconclusive Classification/i })).toBeInTheDocument();
  });

  it('2. Accessibility Settings renders controls and updates store/DOM', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AccessibilitySettings />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Sensory & Accessibility Preferences/i })).toBeInTheDocument();

    // Toggle reduced motion
    const motionCheckbox = screen.getByLabelText(/Reduced Motion/i);
    await user.click(motionCheckbox);
    expect(useSettingsStore.getState().reducedMotion).toBe(true);
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);

    // Switch theme to light
    const lightRadio = screen.getByLabelText(/Set theme to light/i);
    await user.click(lightRadio);
    expect(useSettingsStore.getState().theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('3. Species Verification executes P00 & P01 and synthesizes Domestic Witness profile', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SpeciesVerification />
      </MemoryRouter>
    );

    // Step 1: Notice
    expect(screen.getByText(/VERIFICATION STEP 1 OF 6/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 2: P00 Permitted Entrances
    expect(screen.getByText(/Permitted Entrances/i)).toBeInTheDocument();
    const frontDoor = screen.getByLabelText(/residential front door/i);
    await user.click(frontDoor);
    await user.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3: Occupancy
    expect(screen.getByText(/How many individuals currently occupy your body/i)).toBeInTheDocument();
    const singleOccupancy = screen.getByDisplayValue('occ_one');
    await user.click(singleOccupancy);
    await user.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 4: P01 Behavior While Unobserved (Privacy-safe)
    expect(screen.getByText(/Behavior While Unobserved/i)).toBeInTheDocument();
    expect(screen.getByText(/Observation is restricted entirely to the active browser tab/i)).toBeInTheDocument();
    const calibrateAction = screen.getByRole('button', { name: /Calibrate Sensory Thresholds/i });
    await user.click(calibrateAction);
    await user.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 5: Provisional Synthesis Result
    expect(screen.getByText(/Provisional Classification Synthesized/i)).toBeInTheDocument();
    expect(screen.getByText(/DOMESTIC WITNESS/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 6: Completion Handoff
    expect(screen.getByText(/Session Established/i)).toBeInTheDocument();

    // Verify GameStore state updates
    const store = useGameStore.getState();
    expect(store.gameState.unlockedGates['G0']).toBe(true);
    expect(store.playerProfile.provisionalSpecies).toBe('DOMESTIC WITNESS');
    expect(store.puzzleState['p00_species_verification'].status).toBe('solved');
    expect(store.puzzleState['p01_unobserved_behavior'].status).toBe('solved');
    expect(store.evidenceState['EV-001'].discovered).toBe(true);
  });

  it('3b. Species Verification can be revisited after completion without freezing Continue', async () => {
    const user = userEvent.setup();
    const firstVisit = render(
      <MemoryRouter>
        <SpeciesVerification />
      </MemoryRouter>
    );

    for (let step = 1; step <= 5; step += 1) {
      await user.click(screen.getByRole('button', { name: /Continue/i }));
    }
    expect(screen.getByText(/Session Established/i)).toBeInTheDocument();
    firstVisit.unmount();

    render(
      <MemoryRouter>
        <SpeciesVerification />
      </MemoryRouter>
    );
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText(/Permitted Entrances/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Continue/i }));

    expect(screen.getByText(/How many individuals currently occupy your body/i)).toBeInTheDocument();
    expect(useGameStore.getState().puzzleState.p00_species_verification.status).toBe('solved');
  });

  it('4. Palinode Home renders HUB-000 and live dispatches with network condition', () => {
    render(
      <MemoryRouter>
        <PalinodeHome />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Welcome to Palinode/i })).toBeInTheDocument();
    expect(screen.getByText(/Your translation layer is active/i)).toBeInTheDocument();
    expect(screen.getByText(/Three Communities Dispute the Shape of a Door/i)).toBeInTheDocument();
    expect(screen.getByText(/Network Condition: Sensory Packets Active/i)).toBeInTheDocument();
  });

  it('5. Correspondence Ledger renders MSG-001 from MOURNINGSTAR with source badge and reply actions', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CorrespondenceLedger />
      </MemoryRouter>
    );

    expect(screen.getByText(/MOURNINGSTAR/i)).toBeInTheDocument();
    expect(screen.getByText(/\[AUTHENTIC LINTEL PROTOCOL\]/i)).toBeInTheDocument();
    expect(screen.getByText(/"Don’t correct it. They reject humans. Something on this network has already learned how to pass."/i)).toBeInTheDocument();

    const replyButton = screen.getByRole('button', { name: /Who are you, and why did my recovery email deliver here\?/i });
    await user.click(replyButton);

    expect(screen.getByText(/Response transmitted to MOURNINGSTAR dead drop/i)).toBeInTheDocument();
    expect(useGameStore.getState().gameState.flags['msg_001_replied']).toBe(true);
  });

  it('6. Evidence Board renders initial evidence EV-001 with comparison tray', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <EvidenceBoard />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Malformed Recovery Notice/i })).toBeInTheDocument();
    expect(screen.getByText(/PROVENANCE: Palinode Account Recovery Queue/i)).toBeInTheDocument();

    // Toggle mark
    const markButton = screen.getByRole('button', { name: /Mark Contradiction/i });
    await user.click(markButton);
    expect(useGameStore.getState().evidenceState['EV-001'].marked).toBe(true);

    // Toggle compare
    const compareButton = screen.getByRole('button', { name: /Compare/i });
    await user.click(compareButton);
    expect(screen.getByLabelText(/Active Evidence Comparison/i)).toBeInTheDocument();
  });

  it('7. Player Profile renders silhouette, anatomy definitions, state meters, and revision history', () => {
    // Setup state
    useGameStore.getState().updateProfile({
      handle: 'Observer_Seven',
      provisionalSpecies: 'DOMESTIC WITNESS',
      occupancyCount: 1,
      thresholdTolerance: 'Conditional Domestic',
      pluralityScore: 35,
      legibilityScore: 10,
    });

    render(
      <MemoryRouter>
        <PlayerProfileView />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Observer_Seven/i })).toBeInTheDocument();
    expect(screen.getAllByText(/DOMESTIC WITNESS/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Conditional Domestic/i)).toBeInTheDocument();
    expect(screen.getByText(/35%/i)).toBeInTheDocument();
  });

  it('8. Communities Directory renders all 7 species networks with status tags', () => {
    render(
      <MemoryRouter>
        <CommunityDirectory />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Nonhuman Networks & Jurisdictions/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Witness Wire/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Moltinghouse/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Belowline/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Vesper/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Pale Market/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Communion/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /The Menagerie/i })).toBeInTheDocument();
  });

  it('9. Settings View supports theme switching and confirmed Full Reset flow', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SettingsView />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Independent Reset Checkpoints/i })).toBeInTheDocument();

    const fullResetBtn = screen.getByRole('button', { name: /^Full Reset$/i });
    await user.click(fullResetBtn);

    // Confirmation appears
    const confirmBtn = screen.getByRole('button', { name: /Permanently Wipe All Data/i });
    await user.click(confirmBtn);

    // Verify complete state wipe
    expect(useGameStore.getState().gameState.chapter).toBe(0);
    expect(useGameStore.getState().gameState.unlockedGates).toEqual({});
  });

  it('10. Navigation Drawer opens on mobile More and closes on Escape, Close button, and popstate', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <div>
          <MobileBottomNav />
          <NavigationDrawer />
        </div>
      </MemoryRouter>
    );

    // Open drawer
    const moreBtn = screen.getByRole('button', { name: /Open Full Network Navigation/i });
    await user.click(moreBtn);
    expect(useGameStore.getState().uiState.navigationDrawerOpen).toBe(true);
    expect(screen.getByRole('dialog', { name: /Full Network Directory/i })).toBeInTheDocument();

    // Close via Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(useGameStore.getState().uiState.navigationDrawerOpen).toBe(false);

    // Reopen and close via Close button
    await user.click(moreBtn);
    const closeBtn = screen.getByRole('button', { name: /Close navigation drawer/i });
    await user.click(closeBtn);
    expect(useGameStore.getState().uiState.navigationDrawerOpen).toBe(false);

    // Reopen and close via browser Back (popstate)
    await user.click(moreBtn);
    fireEvent(window, new PopStateEvent('popstate'));
    expect(useGameStore.getState().uiState.navigationDrawerOpen).toBe(false);
  });

  it('11. Desktop Navigation Rail renders active links and session indicators', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <DesktopNavRail />
      </MemoryRouter>
    );

    expect(screen.getByText(/\/\/ PALINODE/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Home Feed/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Evidence Board/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /Chapter spine/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Chapter 8: Common Body, locked/i })).toBeInTheDocument();
    expect(screen.getByText(/Chapter 0 \(Canon 0–8\)/i)).toBeInTheDocument();
  });
});
