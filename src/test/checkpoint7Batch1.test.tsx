/**
 * Checkpoint 7 Batch 1 Content Population Acceptance Tests — The Other Users
 * 
 * Tests expansion of Witness Wire & Moltinghouse ordinary-life content and O02 Quiz.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';

import { WitnessWireHome } from '../features/witness-wire/WitnessWireHome';
import { MoltinghouseHome } from '../features/moltinghouse/MoltinghouseHome';

describe('Checkpoint 7 Batch 1: Witness Wire & Moltinghouse Content Population', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();
    store.unlockGate('G0');
    store.unlockGate('G1');
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
    });
  });

  it('1. Witness Wire renders expanded ordinary-life threads WIRE-006 to WIRE-010', () => {
    render(
      <MemoryRouter>
        <WitnessWireHome />
      </MemoryRouter>
    );

    expect(screen.getByText(/Human Whispers to Houseplant, Expects Compliance/i)).toBeInTheDocument();
    expect(screen.getByText(/Subject Stares at Loading Spinner for 14 Minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/The "Just Looking" Lie in Surface Retail/i)).toBeInTheDocument();
    expect(screen.getByText(/Human Re-reads Sent Email 8 Times Post-Delivery/i)).toBeInTheDocument();
    expect(screen.getByText(/Subject Apologizes to Furniture After Collision/i)).toBeInTheDocument();
  });

  it('2. Moltinghouse renders expanded ordinary-life threads MOLT-005 to MOLT-008', () => {
    render(
      <MemoryRouter>
        <MoltinghouseHome />
      </MemoryRouter>
    );

    expect(screen.getByText(/Shedding Winter Routine: The Heavy Coat Lag/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Service Facial Fatigue: 12-Hour Limits/i)).toBeInTheDocument();
    expect(screen.getByText(/Can You Inherit a Sibling's Discarded Stride\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Safehouse Architecture: Retaining Draft Corners/i)).toBeInTheDocument();
  });

  it('3. O02 Moltinghouse Etiquette Quiz can be completed and awards cosmetic profile trait', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MoltinghouseHome />
      </MemoryRouter>
    );

    expect(screen.getByText(/O02 \/\/ Moltinghouse Etiquette & Contour Ethics Quiz/i)).toBeInTheDocument();

    // Answer Q1: Request speech-only duties
    const q1Radio = screen.getByLabelText(/Request speech-only duties or schedule a private muscle reset/i);
    await user.click(q1Radio);

    // Answer Q2: Because natural is subjective
    const q2Radio = screen.getByLabelText(/Because "natural" is subjective; authentic identity requires comparison to private history/i);
    await user.click(q2Radio);

    // Answer Q3: Double commas when worried
    const q3Radio = screen.getByLabelText(/Double commas when worried and unresolved private grievances/i);
    await user.click(q3Radio);

    const submitBtn = screen.getByRole('button', { name: /Submit Quiz Answers/i });
    await user.click(submitBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['o02_moltinghouse_quiz'].status).toBe('solved');
    expect(store.gameState.flags['o02_solved']).toBe(true);
    expect(store.playerProfile.provisionalSpecies).toBe('DOMESTIC WITNESS (CONTOUR-AWARE)');
    expect(screen.getByText(/Quiz passed! Awarded "Contour-Aware" cosmetic profile molt/i)).toBeInTheDocument();
  });
});
