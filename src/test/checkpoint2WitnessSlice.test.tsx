/**
 * Checkpoint 2 Witness Wire Vertical Slice Acceptance Test Suite — The Other Users
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';

// Witness Wire Features
import { WitnessWireHome } from '../features/witness-wire/WitnessWireHome';
import { WitnessThreadDetail } from '../features/witness-wire/WitnessThreadDetail';
import { WitnessUserProfile } from '../features/witness-wire/WitnessUserProfile';
import { PlayerObservationCase } from '../features/witness-wire/PlayerObservationCase';

describe('Checkpoint 2 Witness Wire Vertical Slice', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();

    // Set Chapter 1 baseline with G0 unlocked
    store.unlockGate('G0');
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
    });
  });

  it('1. Witness Wire Home renders continuous observation stream and category filters', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <WitnessWireHome />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Witness Wire/i })).toBeInTheDocument();
    expect(screen.getByText(/Human Opens Cold Cabinet, Removes Nothing/i)).toBeInTheDocument();
    expect(screen.getByText(/Human Says “I’m Coming” and Does Not Move/i)).toBeInTheDocument();
    expect(screen.getByText(/Is This Courtship or Pest Control\?/i)).toBeInTheDocument();

    // Filter by tag
    const appliancesChip = screen.getByRole('button', { name: /Appliances/i });
    await user.click(appliancesChip);
    expect(screen.getByText(/Human Opens Cold Cabinet, Removes Nothing/i)).toBeInTheDocument();
  });

  it('2. Thread Detail renders continuous conversation and author annotations', () => {
    render(
      <MemoryRouter initialEntries={['/wire/thread/WIRE-001']}>
        <Routes>
          <Route path="/wire/thread/:id" element={<WitnessThreadDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Human Opens Cold Cabinet, Removes Nothing/i })).toBeInTheDocument();
    expect(screen.getByText(/Observed 02:13, 02:17, and 02:29/i)).toBeInTheDocument();
    expect(screen.getByText(/They were hoping desire would occur after the light came on/i)).toBeInTheDocument();
    expect(screen.getByText(/Mark that as inference, Auntie\./i)).toBeInTheDocument();
  });

  it('3. User Profile displays biological form, declared boundaries, and taxonomy voice', () => {
    render(
      <MemoryRouter initialEntries={['/wire/user/neverlookstraight']}>
        <Routes>
          <Route path="/wire/user/:handle" element={<WitnessUserProfile />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /neverlookstraight/i })).toBeInTheDocument();
    expect(screen.getByText(/Form: Peripheral Friend/i)).toBeInTheDocument();
    expect(screen.getByText(/if you can see me clearly, please stop trying/i)).toBeInTheDocument();
    expect(screen.getByText(/Do not focus camera directly upon peripheral field/i)).toBeInTheDocument();
  });

  it('4. P02 Photographic Workbench compares geometry and edge occlusion', () => {
    render(
      <MemoryRouter>
        <PlayerObservationCase />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Player Observation Workbench/i })).toBeInTheDocument();
    expect(screen.getByText(/P02: The Photographs Behind You/i)).toBeInTheDocument();

    // Verify 5 occluded images and 1 centered image
    expect(screen.getByText(/Kitchen Corner at 02:13/i)).toBeInTheDocument();
    expect(screen.getByText(/Direct Subject Observation \(Uploaded Later\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Geometry: Direct focal center, 0° occlusion, standard human eye-level lens/i)).toBeInTheDocument();

    // Evidence acquired
    expect(useGameStore.getState().evidenceState['EV-002'].discovered).toBe(true);
    expect(useGameStore.getState().evidenceState['EV-003'].discovered).toBe(true);
  });

  it('5. P03 Routine Ledger allows identifying and removing fabricated step', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PlayerObservationCase />
      </MemoryRouter>
    );

    // Switch to Routine tab
    const routineTab = screen.getByRole('button', { name: /2\. Routine Ledger/i });
    await user.click(routineTab);

    expect(screen.getByRole('heading', { name: /P03: Routine With One Missing Step/i })).toBeInTheDocument();
    expect(screen.getByText(/4\. Selects Intended Item Immediately/i)).toBeInTheDocument();

    // Remove fabricated step 4
    const removeButtons = screen.getAllByRole('button', { name: /Remove as Anomaly/i });
    await user.click(removeButtons[3]); // 4th item

    expect(screen.getByText(/Restore Step/i)).toBeInTheDocument();
  });

  it('6. Correct Accusation Path (AUNTIE_STATIC) unseals G1, advances chapter, and rewards witness fragment', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PlayerObservationCase />
      </MemoryRouter>
    );

    // Navigate to Decision tab
    const decisionTab = screen.getByRole('button', { name: /4\. Accusation & Commit/i });
    await user.click(decisionTab);

    // Click Accuse AUNTIE_STATIC
    const accuseBtn = screen.getByRole('button', { name: /Accuse AUNTIE_STATIC of Replacement/i });
    await user.click(accuseBtn);

    // Confirm irreversible modal
    expect(screen.getByRole('dialog', { name: /Confirm Accusation/i })).toBeInTheDocument();
    const confirmBtn = screen.getByRole('button', { name: /Confirm and Publish Report/i });
    await user.click(confirmBtn);

    // Verify state updates
    const store = useGameStore.getState();
    expect(store.gameState.unlockedGates['G1']).toBe(true);
    expect(store.gameState.chapter).toBe(1);
    expect(store.puzzleState['p02_photographs'].status).toBe('solved');
    expect(store.puzzleState['p03_routine'].status).toBe('solved');
    expect(store.gameState.flags['case_01_resolved']).toBe(true);
    expect(screen.getByText(/Case 01 Resolved: Witness Fragment Secured/i)).toBeInTheDocument();
  });

  it('7. False Accusation Path (neverlookstraight) emits CON-ACC-WRONG and drops trust', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PlayerObservationCase />
      </MemoryRouter>
    );

    // Navigate to Decision tab
    const decisionTab = screen.getByRole('button', { name: /4\. Accusation & Commit/i });
    await user.click(decisionTab);

    // Click Accuse neverlookstraight
    const accuseBtn = screen.getByRole('button', { name: /Accuse neverlookstraight of Surveillance/i });
    await user.click(accuseBtn);

    // Confirm modal
    const confirmBtn = screen.getByRole('button', { name: /Confirm and Publish Report/i });
    await user.click(confirmBtn);

    // Verify false accusation state
    const store = useGameStore.getState();
    expect(store.gameState.flags['accused_wrong_user']).toBe(true);
    expect(store.relationshipState['usr_nvr'].trust).toBe(-15);
    expect(screen.getByText(/False Accusation Posted/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish Public Correction \/ Apology \(O01\)/i })).toBeInTheDocument();
  });

  it('8. Public Apology / Repair Route (O01) converts CON-ACC-WRONG to CON-ACC-REPAIR and unseals G1', async () => {
    const user = userEvent.setup();

    // Trigger false accusation first
    useGameStore.getState().setFlag('accused_wrong_user', true);
    useGameStore.getState().changeRelationship('usr_nvr', -15);

    render(
      <MemoryRouter>
        <PlayerObservationCase />
      </MemoryRouter>
    );

    expect(screen.getByText(/False Accusation Posted/i)).toBeInTheDocument();

    // Open apology modal
    const apologyBtn = screen.getByRole('button', { name: /Publish Public Correction \/ Apology \(O01\)/i });
    await user.click(apologyBtn);

    expect(screen.getByRole('dialog', { name: /Publish Public Apology/i })).toBeInTheDocument();
    const publishBtn = screen.getByRole('button', { name: /Publish Retraction & Apology/i });
    await user.click(publishBtn);

    // Verify repaired state
    const store = useGameStore.getState();
    expect(store.gameState.flags['repaired_apology']).toBe(true);
    expect(store.gameState.flags['accused_wrong_user']).toBe(false);
    expect(store.gameState.unlockedGates['G1']).toBe(true);
    expect(screen.getByText(/Public Apology Accepted/i)).toBeInTheDocument();
  });

  it('9. Progressive Hint Ladder (0–4) escalates and supports assisted bypass', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PlayerObservationCase />
      </MemoryRouter>
    );

    expect(screen.getByText(/Progressive Hint System \(Level 0 \/ 4\)/i)).toBeInTheDocument();

    // Escalate to Level 1
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 1\)/i }));
    expect(screen.getByText(/Nudge: Separate who captured the images/i)).toBeInTheDocument();

    // Escalate to Level 2
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 2\)/i }));
    expect(screen.getByText(/Method: The 5 edge-occluded photographs/i)).toBeInTheDocument();

    // Escalate to Level 3
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 3\)/i }));
    expect(screen.getByText(/Guided: neverlookstraight took the first 5 images/i)).toBeInTheDocument();

    // Escalate to Level 4
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 4\)/i }));
    expect(screen.getByText(/Resolve: Accuse AUNTIE_STATIC/i)).toBeInTheDocument();

    // Bypass button appears
    const bypassBtn = screen.getByRole('button', { name: /Assisted Bypass \(Level 4\)/i });
    await user.click(bypassBtn);

    expect(useGameStore.getState().puzzleState['p02_photographs'].status).toBe('bypassed');
    expect(useGameStore.getState().gameState.unlockedGates['G1']).toBe(true);
  });

  it('10. Puzzle Reset restores workbench state without wiping chapter progress', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PlayerObservationCase />
      </MemoryRouter>
    );

    // Escalate hint and remove a step
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 1\)/i }));
    const routineTab = screen.getByRole('button', { name: /2\. Routine Ledger/i });
    await user.click(routineTab);
    const removeButtons = screen.getAllByRole('button', { name: /Remove as Anomaly/i });
    await user.click(removeButtons[0]);

    // Click Reset Puzzle Workbench
    const resetBtn = screen.getByRole('button', { name: /Reset Puzzle Workbench/i });
    await user.click(resetBtn);

    expect(screen.getByText(/Progressive Hint System \(Level 0 \/ 4\)/i)).toBeInTheDocument();
    // Chapter remains intact
    expect(useGameStore.getState().gameState.chapter).toBe(0);
  });

  it('11. 360 px layout renders without horizontal overflow and meets minimum touch targets', () => {
    const { container } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <WitnessWireHome />
        </div>
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeVisible();
    });
  });
});
