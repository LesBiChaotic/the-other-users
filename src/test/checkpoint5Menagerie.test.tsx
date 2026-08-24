/**
 * Checkpoint 5 Menagerie Directorate Acceptance Test Suite — The Other Users
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';

// Menagerie Features
import { MenagerieRegistry } from '../features/menagerie/MenagerieRegistry';
import { MenagerieOps } from '../features/menagerie/MenagerieOps';
import { EnclosureDetail } from '../features/menagerie/EnclosureDetail';
import { IlyrThresholdProcedure } from '../features/menagerie/IlyrThresholdProcedure';

describe('Checkpoint 5 Menagerie Directorate', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();

    // Baseline: Gate G5 unlocked after Checkpoint 4 resolution
    store.unlockGate('G0');
    store.unlockGate('G1');
    store.unlockGate('G2');
    store.unlockGate('G3');
    store.unlockGate('G4');
    store.unlockGate('G5');
    store.advanceChapter(6);
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
      exposureScore: 15,
      ilyrTrustScore: 35,
      pluralityScore: 30,
    });
  });

  it('1. Public Registry renders specimen records and resident rebuttals', () => {
    render(
      <MemoryRouter>
        <MenagerieRegistry />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Annex N Public Specimen Ledger/i })).toBeInTheDocument();
    expect(screen.getByText(/Registry N-04 \/\/ Threshold Hazard/i)).toBeInTheDocument();
    expect(screen.getByText(/You cannot call the room empty and charge it rent\./i)).toBeInTheDocument();
    expect(screen.getByText(/Enclosure C-12 \/\/ Structural Anchor/i)).toBeInTheDocument();
    expect(screen.getByText(/The camera shows it sleeping while its back holds up the floor you walk on\./i)).toBeInTheDocument();
  });

  it('2. Operations Console renders facility section elevation and enclosure stations', () => {
    render(
      <MemoryRouter>
        <MenagerieOps />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Annex N Operations Console/i })).toBeInTheDocument();
    expect(screen.getByText(/Annex N Structural Section Elevation \(Depth: 145m\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Enclosure N-04 \(MOURNINGSTAR Threshold Enclosure\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Enclosure C-12 \(Pressure Saint Habitat\)/i)).toBeInTheDocument();
  });

  it('3. P14 The Camera That Never Blinks identifies live sensor pair (Pressure + Permission) and unlocks P15', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/menagerie/enclosure/encl_n04']}>
        <Routes>
          <Route path="/menagerie/enclosure/:id" element={<EnclosureDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Enclosure N-04 \(MOURNINGSTAR Threshold Enclosure\)/i })).toBeInTheDocument();
    expect(screen.getByText(/Looping feed \(43\.0s repeat cycle\)/i)).toBeInTheDocument();

    // Flag Pressure Sensor and Permission Log as live
    const pressureCheckbox = screen.getByLabelText(/Flag Pressure Sensor as Live/i);
    const permissionCheckbox = screen.getByLabelText(/Flag Permission Log as Live/i);

    await user.click(pressureCheckbox);
    await user.click(permissionCheckbox);

    // Commit power diversion
    const auditBtn = screen.getByRole('button', { name: /Divert Power to Live Sensors/i });
    await user.click(auditBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['p14_camera_that_never_blinks'].status).toBe('solved');
    expect(store.evidenceState['EV-015'].discovered).toBe(true);
    expect(store.gameState.chapter).toBe(7);
    expect(screen.getByText(/Synthetic Loop Exposed & Live Sensor Pair Confirmed/i)).toBeInTheDocument();
  });

  it('4. P15 Door Never Entered executes corrective admission to free Ilyr cleanly and unlocks G6', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <IlyrThresholdProcedure />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /A Door Defined as Never Entered/i })).toBeInTheDocument();

    const executeButtons = screen.getAllByRole('button', { name: /Execute This Exit Protocol/i });
    // Correct protocol is Option 1
    await user.click(executeButtons[0]);

    const store = useGameStore.getState();
    expect(store.gameState.unlockedGates['G6']).toBe(true);
    expect(store.puzzleState['p15_door_never_entered'].status).toBe('solved');
    expect(store.gameState.flags['ilyr_freed']).toBe(true);
    expect(store.gameState.flags['ilyr_ownership_compromised']).toBe(false);
    expect(store.evidenceState['EV-016'].discovered).toBe(true);
    expect(screen.getByText(/MOURNINGSTAR Released from Enclosure N-04/i)).toBeInTheDocument();
  });

  it('5. P15 Compromised Terms route sets ilyr_ownership_compromised: true', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <IlyrThresholdProcedure />
      </MemoryRouter>
    );

    const executeButtons = screen.getAllByRole('button', { name: /Execute This Exit Protocol/i });
    // Compromised Terms protocol is Option 2
    await user.click(executeButtons[1]);

    const store = useGameStore.getState();
    expect(store.puzzleState['p15_door_never_entered'].status).toBe('solved');
    expect(store.gameState.flags['ilyr_ownership_compromised']).toBe(true);
    expect(store.relationshipState['usr_ilyr'].trust).toBe(-10);
  });

  it('6. P14 / P15 Hint Escalation and Bypass paths', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <IlyrThresholdProcedure />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 1\)/i }));
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 2\)/i }));
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 3\)/i }));
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 4\)/i }));

    expect(screen.getByText(/Resolve: Select "Acknowledge Unlawful Occupancy & Corrective Admission"/i)).toBeInTheDocument();

    const bypassBtn = screen.getByRole('button', { name: /Assisted Bypass \(Level 4\)/i });
    await user.click(bypassBtn);

    expect(useGameStore.getState().puzzleState['p15_door_never_entered'].status).toBe('bypassed');
    expect(useGameStore.getState().gameState.unlockedGates['G6']).toBe(true);
  });

  it('7. 360 px responsive rendering across Menagerie surfaces', () => {
    const { container: registryContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <MenagerieRegistry />
        </div>
      </MemoryRouter>
    );
    expect(registryContainer).toBeInTheDocument();

    const { container: opsContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <MenagerieOps />
        </div>
      </MemoryRouter>
    );
    expect(opsContainer).toBeInTheDocument();

    const { container: procContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <IlyrThresholdProcedure />
        </div>
      </MemoryRouter>
    );
    expect(procContainer).toBeInTheDocument();
  });
});
