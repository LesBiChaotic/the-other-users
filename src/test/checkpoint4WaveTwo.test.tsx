/**
 * Checkpoint 4 Vesper, Pale Market & Communion (Wave Two) Acceptance Test Suite — The Other Users
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';

// Vesper Features
import { VesperHome } from '../features/vesper/VesperHome';
import { RoomToneCase } from '../features/vesper/RoomToneCase';
import { AgreementViewer } from '../features/vesper/AgreementViewer';

// Pale Market Features
import { PaleMarketHome } from '../features/pale-market/PaleMarketHome';
import { IdentityAssembly } from '../features/pale-market/IdentityAssembly';
import { MemoryRemoval } from '../features/pale-market/MemoryRemoval';

// Communion Features
import { CommunionStream } from '../features/communion/CommunionStream';
import { TestimonyArchive } from '../features/communion/TestimonyArchive';
import { LitanyConcordance } from '../features/communion/LitanyConcordance';

describe('Checkpoint 4 Vesper, Pale Market & Communion Wave Two', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();

    // Baseline: Gate G3 unlocked after Checkpoint 3 resolution
    store.unlockGate('G0');
    store.unlockGate('G1');
    store.unlockGate('G2');
    store.unlockGate('G3');
    store.advanceChapter(3);
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
      exposureScore: 15,
      ilyrTrustScore: 35,
      pluralityScore: 30,
    });
  });

  it('1. Vesper Home renders compatibility constellation and boundary disclosures', () => {
    render(
      <MemoryRouter>
        <VesperHome />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Vesper Compatibility Constellation/i })).toBeInTheDocument();
    expect(screen.getByText(/ROOM_TONE: Compatibility Is Not Sameness/i)).toBeInTheDocument();
    expect(screen.getByText(/The Body-Sharing Agreement/i)).toBeInTheDocument();
    expect(screen.getByText(/@ROOM_TONE/i)).toBeInTheDocument();
    expect(screen.getByText(/@Lichen_And_Loom/i)).toBeInTheDocument();
  });

  it('2. P08 ROOM_TONE Case identifies Date C collection event and secures EV-009', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RoomToneCase />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /ROOM_TONE: Compatibility Is Not Sameness/i })).toBeInTheDocument();
    expect(screen.getByText(/Date C \/\/ "Universal Harmonic Resonance"/i)).toBeInTheDocument();

    const flagButtons = screen.getAllByRole('button', { name: /Flag as Collection Event/i });
    // Date C is the 3rd card (index 2)
    await user.click(flagButtons[2]);

    const store = useGameStore.getState();
    expect(store.puzzleState['p08_compatibility_not_sameness'].status).toBe('solved');
    expect(store.evidenceState['EV-009'].discovered).toBe(true);
    expect(screen.getByText(/Date C Collection Event Identified/i)).toBeInTheDocument();
  });

  it('3. P09 Body-Sharing Agreement restores 5 safe clauses and unlocks G4', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AgreementViewer />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Body-Sharing Consent Agreement/i })).toBeInTheDocument();

    // Click all 5 restore buttons
    const restoreButtons = screen.getAllByRole('button', { name: /Restore Safe Plain Clause/i });
    expect(restoreButtons.length).toBe(5);

    for (const btn of restoreButtons) {
      await user.click(btn);
    }

    // Commit repaired agreement
    const commitBtn = screen.getByRole('button', { name: /Commit Repaired Consent Agreement/i });
    await user.click(commitBtn);

    const store = useGameStore.getState();
    expect(store.gameState.unlockedGates['G4']).toBe(true);
    expect(store.puzzleState['p09_body_sharing_agreement'].status).toBe('solved');
    expect(store.evidenceState['EV-010'].discovered).toBe(true);
    expect(store.gameState.flags['terms_exposed']).toBe(true);
    expect(screen.getByText(/Body-Sharing Agreement Repaired & Gate G4 Unsealed/i)).toBeInTheDocument();
  });

  it('4. Pale Market Home renders street ledger with 10 canonical listings', () => {
    render(
      <MemoryRouter>
        <PaleMarketHome />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Pale Market Street Ledger/i })).toBeInTheDocument();
    expect(screen.getByText(/Unused Name, Never Called/i)).toBeInTheDocument();
    expect(screen.getByText(/Thirty Minutes of Privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/Voice, Adult, Regionally Unremarkable/i)).toBeInTheDocument();
    expect(screen.getByText(/One-Use Institutional Invitation/i)).toBeInTheDocument();
    expect(screen.getByText(/Removal of One Named Memory/i)).toBeInTheDocument();
  });

  it('5. P10 Identity Assembly builds sterile action pass (weight = 0) and secures EV-011', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <IdentityAssembly />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Assemble an Identity Without a Body/i })).toBeInTheDocument();
    expect(screen.getByText(/0 \(STERILE ACTION PASS\)/i)).toBeInTheDocument();

    const assembleBtn = screen.getByRole('button', { name: /Finalize Access Pass Assembly/i });
    await user.click(assembleBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['p10_identity_without_body'].status).toBe('solved');
    expect(store.gameState.flags['recordborn_created']).toBe(false);
    expect(store.evidenceState['EV-011'].discovered).toBe(true);
  });

  it('6. P11 Memory Removal authorizes Archivore Escrow route and secures EV-012', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MemoryRemoval />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /The Neighboring Memory/i })).toBeInTheDocument();

    const escrowBtn = screen.getByRole('button', { name: /Authorize Archivore Escrow/i });
    await user.click(escrowBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['p11_neighboring_memory'].status).toBe('solved');
    expect(store.gameState.flags['archive_escrow']).toBe(true);
    expect(store.evidenceState['EV-012'].discovered).toBe(true);
  });

  it('7. Communion Stream renders liturgical sermon without mocking believers', () => {
    render(
      <MemoryRouter>
        <CommunionStream />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Communion Liturgical Stream/i })).toBeInTheDocument();
    expect(screen.getByText(/Sermon: The Labor of Being Distinct/i)).toBeInTheDocument();
    expect(screen.getByText(/Every body spends itself explaining its border/i)).toBeInTheDocument();
  });

  it('8. P12 Testimony Archive accurately separates authentic faith from generated artifacts', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <TestimonyArchive />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Testimony Without Diagnosis/i })).toBeInTheDocument();

    const authenticButtons = screen.getAllByRole('button', { name: /Authentic Believer \(Cost-Bearing\)/i });
    const generatedButtons = screen.getAllByRole('button', { name: /Generated Suspect \(Replication Artifact\)/i });

    // Testimony 1 & 2: Authentic
    await user.click(authenticButtons[0]);
    await user.click(authenticButtons[1]);

    // Testimony 3 & 4: Generated
    await user.click(generatedButtons[2]);
    await user.click(generatedButtons[3]);

    const verifyBtn = screen.getByRole('button', { name: /Verify Testimony Annotations/i });
    await user.click(verifyBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['p12_testimony_without_diagnosis'].status).toBe('solved');
    expect(store.evidenceState['EV-013'].discovered).toBe(true);
    expect(screen.getByText(/Testimony Analysis Verified/i)).toBeInTheDocument();
  });

  it('9. P13 Litany Concordance quarantines Line 3 and unlocks G5', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LitanyConcordance />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /The Litany of One Shape/i })).toBeInTheDocument();

    // Select Line 3: "To be understood is to become understandable."
    const line3 = screen.getByText(/Line 3:/i);
    await user.click(line3);

    // Quarantine phrase
    const quarantineBtn = screen.getByRole('button', { name: /Quarantine Phrase via Living Contradiction/i });
    await user.click(quarantineBtn);

    const store = useGameStore.getState();
    expect(store.gameState.unlockedGates['G5']).toBe(true);
    expect(store.puzzleState['p13_litany_of_one_shape'].status).toBe('solved');
    expect(store.gameState.flags['litany_quarantined']).toBe(true);
    expect(store.evidenceState['EV-014'].discovered).toBe(true);
    expect(screen.getByText(/Replication Litany Quarantined & Gate G5 Unsealed/i)).toBeInTheDocument();
  });

  it('10. 360 px responsive rendering across Vesper, Pale Market, and Communion', () => {
    const { container: vesperContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <VesperHome />
        </div>
      </MemoryRouter>
    );
    expect(vesperContainer).toBeInTheDocument();

    const { container: marketContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <PaleMarketHome />
        </div>
      </MemoryRouter>
    );
    expect(marketContainer).toBeInTheDocument();

    const { container: communionContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <CommunionStream />
        </div>
      </MemoryRouter>
    );
    expect(communionContainer).toBeInTheDocument();
  });
});
