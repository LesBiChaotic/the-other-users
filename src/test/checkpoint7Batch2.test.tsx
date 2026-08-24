/**
 * Checkpoint 7 Batch 2 Content Population Acceptance Tests — The Other Users
 * 
 * Tests expansion of Belowline & Vesper ordinary-life content and O03 / O04 workbenches.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';

import { BelowlineMap } from '../features/belowline/BelowlineMap';
import { VesperHome } from '../features/vesper/VesperHome';

describe('Checkpoint 7 Batch 2: Belowline & Vesper Content Population', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();
    store.unlockGate('G0');
    store.unlockGate('G2');
    store.unlockGate('G3');
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
    });
  });

  it('1. Belowline Map renders expanded union dispatches BELOW-006 to BELOW-010', () => {
    render(
      <MemoryRouter>
        <BelowlineMap />
      </MemoryRouter>
    );

    expect(screen.getByText(/Service Notice: Bedrock Acoustic Dampening along Loop 4/i)).toBeInTheDocument();
    expect(screen.getByText(/Union Grievance 89-D: Freight Vibration in Residential Strata/i)).toBeInTheDocument();
    expect(screen.getByText(/Lost Station Etiquette: Platform V-Null Memory Protocol/i)).toBeInTheDocument();
    expect(screen.getByText(/Conduit Warning: Steam Line Pressure Fluctuations/i)).toBeInTheDocument();
    expect(screen.getByText(/O03 \/\/ Belowline Union Route Optimization Workbench/i)).toBeInTheDocument();
  });

  it('2. O03 Belowline Union Route Optimization can be solved', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <BelowlineMap />
      </MemoryRouter>
    );

    const bypassBtn = screen.getByRole('button', { name: /Protected Bypass: Lower Conduit 14 Seepage Channel/i });
    await user.click(bypassBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['o03_belowline_route_optimization'].status).toBe('solved');
    expect(store.gameState.flags['o03_solved']).toBe(true);
    expect(screen.getByText(/red_line_red_line saved from union discipline/i)).toBeInTheDocument();
  });

  it('3. Vesper Home renders expanded discussions VESP-005 to VESP-008', () => {
    render(
      <MemoryRouter>
        <VesperHome />
      </MemoryRouter>
    );

    expect(screen.getByText(/Would You Date a Human\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Is Dream Acoustic Sharing Considered Cohabitation\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Safety Notice: Why "Perfect Overlap" Is a Danger Sign/i)).toBeInTheDocument();
    expect(screen.getByText(/O04 \/\/ Provisional Compatibility Profile Alignment/i)).toBeInTheDocument();
  });

  it('4. O04 Vesper Profile Alignment can be solved', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <VesperHome />
      </MemoryRouter>
    );

    const sepBtn = screen.getByRole('button', { name: /Unilateral Threshold Exit/i });
    await user.click(sepBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['o04_vesper_compatibility_profile'].status).toBe('solved');
    expect(store.gameState.flags['o04_solved']).toBe(true);
    expect(screen.getByText(/Profile parameters ratified! Declared unilateral threshold exit/i)).toBeInTheDocument();
  });
});
