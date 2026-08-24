/**
 * Checkpoint 7 Batch 4 Content Population Acceptance Tests — The Other Users
 * 
 * Tests expansion of Menagerie specimen logs, O07/O08 workbenches, and supporting user profiles.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';

import { MenagerieRegistry } from '../features/menagerie/MenagerieRegistry';
import { CORE_USER_PROFILES } from '../content/fixtures/checkpoint1Content';

describe('Checkpoint 7 Batch 4: Menagerie & Meta Content Population', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();
    store.unlockGate('G0');
    store.unlockGate('G5');
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
    });
  });

  it('1. Menagerie Registry renders expanded specimen logs MEN-008 to MEN-011', () => {
    render(
      <MemoryRouter>
        <MenagerieRegistry />
      </MemoryRouter>
    );

    expect(screen.getByText(/Enclosure H-03 \/\/ Habitat Triage Audit/i)).toBeInTheDocument();
    expect(screen.getByText(/Rookery Observation Log 12-B/i)).toBeInTheDocument();
    expect(screen.getByText(/Directorate Administrative Audit \/\/ Meta M01 Acrostic/i)).toBeInTheDocument();
    expect(screen.getByText(/Transit Schedule Matrix \/\/ Meta M02 Rhythm/i)).toBeInTheDocument();
  });

  it('2. O07 Menagerie Habitat Triage can be solved', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MenagerieRegistry />
      </MemoryRouter>
    );

    const triageBtn = screen.getByRole('button', { name: /Calibrate: Dampen 60Hz hum & stabilize mineral humidity/i });
    await user.click(triageBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['o07_menagerie_habitat_triage'].status).toBe('solved');
    expect(store.gameState.flags['o07_solved']).toBe(true);
    expect(screen.getByText(/Enclosure H-03 stabilized! Dampened 60Hz resonance/i)).toBeInTheDocument();
  });

  it('3. O08 Rookery Lost-Word Recovery can be solved', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MenagerieRegistry />
      </MemoryRouter>
    );

    const filterBtn = screen.getByRole('button', { name: /Side-Channel Filter: Apply peripheral acoustic de-emphasis/i });
    await user.click(filterBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['o08_rookery_lost_word'].status).toBe('solved');
    expect(store.gameState.flags['o08_solved']).toBe(true);
    expect(screen.getByText(/Lost word recovered: "REFUSAL"!/i)).toBeInTheDocument();
  });

  it('4. User registry contains 16 supporting user profiles (USR-017 to USR-032)', () => {
    const userHandles = CORE_USER_PROFILES.map((u) => u.handle);
    expect(userHandles).toContain('MothVendor_9');
    expect(userHandles).toContain('ARCHIVE_OF_TUESDAY');
    expect(userHandles).toContain('QuietVendor');
    expect(userHandles).toContain('SecondDraft');
    expect(userHandles).toContain('Silent_Plow');
    expect(userHandles).toContain('Routine_Keeper_01');
    expect(userHandles).toContain('Contour_Inspector');
    expect(userHandles).toContain('Loadbearer_7');
    expect(userHandles).toContain('threshold_patron');
    expect(userHandles).toContain('Lichen_And_Loom');
    expect(userHandles).toContain('ROOM_TONE');
    expect(userHandles).toContain('ApartmentChoir_4');
    expect(userHandles).toContain('unremember_me');
    expect(userHandles).toContain('AUNTIE_STATIC');
    expect(userHandles).toContain('red_line_red_line');
    expect(userHandles).toContain('ShiftWorker_4');
  });
});
