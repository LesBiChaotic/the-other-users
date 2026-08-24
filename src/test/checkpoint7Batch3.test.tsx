/**
 * Checkpoint 7 Batch 3 Content Population Acceptance Tests — The Other Users
 * 
 * Tests expansion of Pale Market & Communion ordinary-life content and O05 / O06 workbenches.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';

import { PaleMarketHome } from '../features/pale-market/PaleMarketHome';
import { CommunionStream } from '../features/communion/CommunionStream';

describe('Checkpoint 7 Batch 3: Pale Market & Communion Content Population', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();
    store.unlockGate('G0');
    store.unlockGate('G4');
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
    });
  });

  it('1. Pale Market Home renders expanded nonmaterial listings MKT-011 to MKT-017', () => {
    render(
      <MemoryRouter>
        <PaleMarketHome />
      </MemoryRouter>
    );

    expect(screen.getByText(/Unopened Letter from an Abandoned Address/i)).toBeInTheDocument();
    expect(screen.getByText(/Twenty Seconds of Perfect Silence in a Crowded Train/i)).toBeInTheDocument();
    expect(screen.getByText(/Habitual Step Rhythm: Old Apartment Staircase/i)).toBeInTheDocument();
    expect(screen.getByText(/A Grudge Kept in Good Condition for Nine Years/i)).toBeInTheDocument();
    expect(screen.getByText(/Second-Hand Apology, Never Delivered/i)).toBeInTheDocument();
    expect(screen.getByText(/O05 \/\/ Pale Market Provenance Audit Workbench/i)).toBeInTheDocument();
  });

  it('2. O05 Pale Market Provenance Audit can be solved', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <PaleMarketHome />
      </MemoryRouter>
    );

    const auditBtn = screen.getByRole('button', { name: /Audit Only: Record provenance trail without adopting the name-fragment/i });
    await user.click(auditBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['o05_pale_market_provenance'].status).toBe('solved');
    expect(store.gameState.flags['o05_solved']).toBe(true);
    expect(screen.getByText(/Provenance audit validated! Traced Ilyr’s fragment without trapping their legal self/i)).toBeInTheDocument();
  });

  it('3. Communion Stream renders expanded sermons COM-006 to COM-009', () => {
    render(
      <MemoryRouter>
        <CommunionStream />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sermon: The Geometry of Surrender/i)).toBeInTheDocument();
    expect(screen.getByText(/Testimony: Seasonal Participation Without Ownership/i)).toBeInTheDocument();
    expect(screen.getByText(/Doctrinal Debate: Accessibility vs Elimination of Dialect/i)).toBeInTheDocument();
    expect(screen.getByText(/O06 \/\/ Communion Comment Moderation Workbench/i)).toBeInTheDocument();
  });

  it('4. O06 Communion Comment Moderation can be solved', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CommunionStream />
      </MemoryRouter>
    );

    const flagBtn = screen.getByRole('button', { name: /Flag as Predatory Replication Instruction/i });
    await user.click(flagBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['o06_communion_moderation'].status).toBe('solved');
    expect(store.gameState.flags['o06_solved']).toBe(true);
    expect(screen.getByText(/Moderation decision ratified! Flagged synthetic replication instruction/i)).toBeInTheDocument();
  });
});
