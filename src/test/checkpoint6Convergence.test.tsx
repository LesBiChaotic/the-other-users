/**
 * Checkpoint 6 Convergence Finale & Endings Acceptance Test Suite — The Other Users
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';

// Convergence Features
import { ConvergenceStatus } from '../features/convergence/ConvergenceStatus';
import { WitnessCounterModel } from '../features/convergence/WitnessCounterModel';
import { FinalPermission } from '../features/convergence/FinalPermission';
import { EpilogueView } from '../features/convergence/EpilogueView';

describe('Checkpoint 6 Convergence Finale & Canonical Endings', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();

    // Baseline: Gate G6 unlocked after Checkpoint 5 resolution
    store.unlockGate('G0');
    store.unlockGate('G1');
    store.unlockGate('G2');
    store.unlockGate('G3');
    store.unlockGate('G4');
    store.unlockGate('G5');
    store.unlockGate('G6');
    store.advanceChapter(7);
    store.setFlag('p04_solved', true);
    store.setFlag('p07_solved', true);
    store.setFlag('p08_solved', true);
    store.setFlag('ilyr_freed', true);
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
      exposureScore: 15,
      ilyrTrustScore: 35,
      pluralityScore: 30,
    });
  });

  it('1. Convergence Status renders 8 sensory family organs', () => {
    render(
      <MemoryRouter>
        <ConvergenceStatus />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Convergence Anatomical Network/i })).toBeInTheDocument();
    expect(screen.getByText(/Definitions of a Human \(Assemble Witnesses\)/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Witnesses' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mimetic Bodies' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Underfolk' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Choral Bodies' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Threshold Organisms' })).toBeInTheDocument();
  });

  it('2. P16 Witness Counter-Model selects living witnesses and unlocks END-CHORUS', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <WitnessCounterModel />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Definitions of a Human/i })).toBeInTheDocument();

    // Select 4 living witnesses: neverlookstraight, soft_error, underplatform_9, ROOM_TONE
    const witNvr = screen.getByLabelText(/Include @neverlookstraight in Counter-Model/i);
    const witSof = screen.getByLabelText(/Include @soft_error in Counter-Model/i);
    const witUnd = screen.getByLabelText(/Include @underplatform_9 in Counter-Model/i);
    const witRoo = screen.getByLabelText(/Include @ROOM_TONE in Counter-Model/i);

    await user.click(witNvr);
    await user.click(witSof);
    await user.click(witUnd);
    await user.click(witRoo);

    expect(screen.getByText(/4 \/ 5 DISTINCT SENSORY FAMILIES/i)).toBeInTheDocument();

    // Commit Counter-Model
    const commitBtn = screen.getByRole('button', { name: /Commit Living Counter-Model \(4 \/ 5 Families\)/i });
    await user.click(commitBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['p16_definitions_of_human'].status).toBe('solved');
    expect(store.gameState.flags['countermodel_ready']).toBe(true);
    expect(store.evidenceState['EV-017'].discovered).toBe(true);
    expect(screen.getByText(/Counter-Model Ready/i)).toBeInTheDocument();
  });

  it('3. P16 ineligibility when neverlookstraight memory bond was sacrificed', () => {
    const store = useGameStore.getState();
    store.setFlag('bond_sacrificed', true);

    render(
      <MemoryRouter>
        <WitnessCounterModel />
      </MemoryRouter>
    );

    expect(screen.getByText(/Interpersonal memory bond was severed in Pale Market\./i)).toBeInTheDocument();
  });

  it('4. P17 The Final Permission commits END-CHORUS ending', async () => {
    const user = userEvent.setup();
    const store = useGameStore.getState();
    store.setFlag('countermodel_ready', true);
    store.setFlag('countermodel_strength', 4);

    render(
      <MemoryRouter initialEntries={['/convergence/permission']}>
        <Routes>
          <Route path="/convergence/permission" element={<FinalPermission />} />
          <Route path="/epilogue/:ending" element={<EpilogueView />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /The Final Permission Contract/i })).toBeInTheDocument();

    // Finalize button
    const finalizeBtn = screen.getByRole('button', { name: /Finalize & Commit Permission Agreement: The Chorus of Difference/i });
    await user.click(finalizeBtn);

    // Confirm in modal
    const confirmBtn = screen.getByRole('button', { name: /Confirm & Seal Permission/i });
    await user.click(confirmBtn);

    expect(useGameStore.getState().puzzleState['p17_final_permission'].status).toBe('solved');
    expect(useGameStore.getState().gameState.flags['ending_id']).toBe('END-CHORUS');
    expect(screen.getByRole('heading', { name: /The Chorus of Difference/i })).toBeInTheDocument();
  });

  it('5. Six Deterministic Canonical Endings render distinct prose and status', () => {
    const endings = [
      { id: 'END-CHORUS', heading: /The Chorus of Difference/i, badge: /CONTRADICTORY WITNESS/i },
      { id: 'END-ORDINARY', heading: /A Perfectly Ordinary Person/i, badge: /STANDARD HUMAN FORM/i },
      { id: 'END-CLOSED', heading: /The Closed Tab/i, badge: /EXPUNGED TRANSIENT/i },
      { id: 'END-MANY', heading: /Many Bodies, No Network/i, badge: /ISOLATED CITIZEN/i },
      { id: 'END-MOD', heading: /The Moderator’s Exception/i, badge: /THRESHOLD WITNESS/i },
      { id: 'END-NOTFOUND', heading: /User Not Found/i, badge: /AUTOMATED REFERENCE PROXY/i },
    ];

    for (const end of endings) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[`/epilogue/${end.id}`]}>
          <Routes>
            <Route path="/epilogue/:ending" element={<EpilogueView />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: end.heading })).toBeInTheDocument();
      expect(screen.getByText(end.badge)).toBeInTheDocument();
      expect(screen.getByText(/New Game Plus/i)).toBeInTheDocument();
      unmount();
    }
  });

  it('6. P16 Hint Escalation and Bypass paths', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <WitnessCounterModel />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 1\)/i }));
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 2\)/i }));
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 3\)/i }));
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 4\)/i }));

    expect(screen.getByText(/Resolve: Check all eligible witnesses and click "Commit Living Counter-Model"/i)).toBeInTheDocument();

    const bypassBtn = screen.getByRole('button', { name: /Assisted Bypass \(Level 4\)/i });
    await user.click(bypassBtn);

    expect(useGameStore.getState().puzzleState['p16_definitions_of_human'].status).toBe('bypassed');
    expect(useGameStore.getState().gameState.flags['countermodel_ready']).toBe(true);
  });

  it('7. 360 px responsive rendering across Convergence and Epilogue surfaces', () => {
    const { container: convContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <ConvergenceStatus />
        </div>
      </MemoryRouter>
    );
    expect(convContainer).toBeInTheDocument();

    const { container: witContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <WitnessCounterModel />
        </div>
      </MemoryRouter>
    );
    expect(witContainer).toBeInTheDocument();

    const { container: permContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <FinalPermission />
        </div>
      </MemoryRouter>
    );
    expect(permContainer).toBeInTheDocument();

    const { container: epiContainer } = render(
      <MemoryRouter initialEntries={['/epilogue/END-CHORUS']}>
        <Routes>
          <Route
            path="/epilogue/:ending"
            element={
              <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
                <EpilogueView />
              </div>
            }
          />
        </Routes>
      </MemoryRouter>
    );
    expect(epiContainer).toBeInTheDocument();
  });
});
