/**
 * Checkpoint 3 Moltinghouse & Belowline (Wave One) Acceptance Test Suite — The Other Users
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';

// Moltinghouse Features
import { MoltinghouseHome } from '../features/moltinghouse/MoltinghouseHome';
import { SoftErrorArchive } from '../features/moltinghouse/SoftErrorArchive';
import { FiveOfUsThread } from '../features/moltinghouse/FiveOfUsThread';

// Belowline Features
import { BelowlineMap } from '../features/belowline/BelowlineMap';
import { ManifestLedger } from '../features/belowline/ManifestLedger';

describe('Checkpoint 3 Moltinghouse & Belowline Wave One', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();

    // Baseline: Gate G1 unlocked after Checkpoint 2 resolution
    store.unlockGate('G0');
    store.unlockGate('G1');
    store.advanceChapter(1);
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
      exposureScore: 15,
      ilyrTrustScore: 35,
      pluralityScore: 15,
    });
  });

  it('1. Moltinghouse Home renders layered revision streams and investigation banners', () => {
    render(
      <MemoryRouter>
        <MoltinghouseHome />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Moltinghouse', level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/soft_error Shed Drafts & Revision Layers/i)).toBeInTheDocument();
    expect(screen.getByText(/FIVE_OF_US: One Moderator, Several Bodies/i)).toBeInTheDocument();
    expect(screen.getByText(/My Host’s Dog Knows\. What Now\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Jaw Keeps Reverting During Customer Service/i)).toBeInTheDocument();
  });

  it('2. P04 Shed Drafts recovers authentic signature but keeps G2 closed until P05', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <SoftErrorArchive />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /soft_error Revision Sheds/i })).toBeInTheDocument();

    // Switch between drafts in revision spine
    const draft2Spine = screen.getByRole('button', { name: /Draft 2/i });
    await user.click(draft2Spine);
    expect(screen.getByText(/stop pretending the stapler king knows how to wire an eyelid/i)).toBeInTheDocument();

    // Check Drafts 2, 5, and 7 in selection checklist
    const markDraft2 = screen.getByLabelText(/Mark Draft 2.*as authentic/i);
    const markDraft5 = screen.getByLabelText(/Mark Draft 5.*as authentic/i);
    const markDraft7 = screen.getByLabelText(/Mark Draft 7.*as authentic/i);

    await user.click(markDraft2);
    await user.click(markDraft5);
    await user.click(markDraft7);

    // Verify signature
    const verifyBtn = screen.getByRole('button', { name: /Verify Authentic Continuity Signature/i });
    await user.click(verifyBtn);

    // State Assertions
    const store = useGameStore.getState();
    expect(store.gameState.unlockedGates['G2']).not.toBe(true);
    expect(store.gameState.chapter).toBe(1);
    expect(store.puzzleState['p04_shed_drafts'].status).toBe('solved');
    expect(store.evidenceState['EV-005'].discovered).toBe(true);
    expect(screen.getByText(/soft_error Signature Recovered/i)).toBeInTheDocument();
  });

  it('3. P05 Plural Timeline affirms personhood via Internal Consent Protocol', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FiveOfUsThread />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /FIVE_OF_US: One Moderator, Several Bodies/i })).toBeInTheDocument();
    expect(screen.getByText(/All five units on site carrying structural solder/i)).toBeInTheDocument();

    // Filter by Unit 5
    const unit5Btn = screen.getByRole('button', { name: /Unit 5/i });
    await user.click(unit5Btn);
    expect(screen.getByText(/The cooperative structure introduces unnecessary delay/i)).toBeInTheDocument();

    // Select Consent Protocol
    const consentBtn = screen.getByRole('button', { name: /Request Internal Consent Protocol/i });
    await user.click(consentBtn);

    // State Assertions
    const store = useGameStore.getState();
    expect(store.puzzleState['p05_plural_bodies'].status).toBe('solved');
    expect(store.playerProfile.pluralityScore).toBe(30); // 15 + 15
    expect(store.evidenceState['EV-006'].discovered).toBe(true);
    expect(screen.getByText(/Plural Personhood Affirmed/i)).toBeInTheDocument();
  });

  it('3b. Chapter 2 opens Belowline only after both investigations are complete', async () => {
    const user = userEvent.setup();
    useGameStore.getState().setFlag('p04_solved', true);

    render(
      <MemoryRouter>
        <FiveOfUsThread />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: /Request Internal Consent Protocol/i }));

    const store = useGameStore.getState();
    expect(store.gameState.unlockedGates['G2']).toBe(true);
    expect(store.gameState.chapter).toBe(2);
  });

  it('3c. Moltinghouse investigations require three ordinary threads first', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MoltinghouseHome />
      </MemoryRouter>
    );

    const archiveLink = screen.getByRole('link', { name: /Investigate soft_error Shed Drafts/i });
    expect(archiveLink).toHaveAttribute('aria-disabled', 'true');

    const annotationButtons = screen.getAllByRole('button', { name: /View Annotations/i });
    await user.click(annotationButtons[0]);
    await user.click(annotationButtons[1]);
    await user.click(annotationButtons[2]);

    expect(useGameStore.getState().gameState.flags['molt_threads_viewed_count']).toBe(3);
    expect(archiveLink).toHaveAttribute('aria-disabled', 'false');
  });

  it('4. P05 False Report penalizes plural trust', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <FiveOfUsThread />
      </MemoryRouter>
    );

    const falseReportBtn = screen.getByRole('button', { name: /Report Account Replacement/i });
    await user.click(falseReportBtn);

    const store = useGameStore.getState();
    expect(store.gameState.flags['p05_false_report']).toBe(true);
    expect(store.relationshipState['usr_fiv'].trust).toBe(-15);
    expect(screen.getByText(/Harmful Misclassification/i)).toBeInTheDocument();
  });

  it('5. Belowline Map renders zoomable pressure visualizer and synchronized station register', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <BelowlineMap />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Belowline Subterranean Grid/i })).toBeInTheDocument();
    expect(screen.getByText(/Central Arch Junction/i)).toBeInTheDocument();
    expect(screen.getByText(/Platform V-Null \(Deleted Station\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Annex N Maintenance Spur/i)).toBeInTheDocument();

    // Zoom Controls
    const zoomInBtn = screen.getByRole('button', { name: /Zoom In/i });
    await user.click(zoomInBtn);
    expect(screen.getByText(/Pressure Vector Visualizer \(120%\)/i)).toBeInTheDocument();
  });

  it('6. P06 Pressure Diagram Alignment aligns load paths to Annex N and records route sharing', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ManifestLedger />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Manifest Ledger & Pressure Topology/i })).toBeInTheDocument();
    expect(screen.getByText(/P06: Align Structural Load Paths/i)).toBeInTheDocument();

    const rotateButtons = screen.getAllByRole('button', { name: /Rotate \+90°/i });

    // Rotate City 1 by 90° (1 click)
    await user.click(rotateButtons[0]);

    // Rotate City 2 by 180° (2 clicks)
    await user.click(rotateButtons[1]);
    await user.click(rotateButtons[1]);

    // Rotate City 3 by 270° (3 clicks)
    await user.click(rotateButtons[2]);
    await user.click(rotateButtons[2]);
    await user.click(rotateButtons[2]);

    // Commit alignment and share with Plurality Accord
    const shareAccordBtn = screen.getByRole('button', { name: /Align & Share with Plurality Accord/i });
    await user.click(shareAccordBtn);

    const store = useGameStore.getState();
    expect(store.puzzleState['p06_belowline_route'].status).toBe('solved');
    expect(store.gameState.flags['p06_route_shared_with']).toBe('accord');
    expect(store.evidenceState['EV-007'].discovered).toBe(true);
    expect(screen.getByText(/Route aligned and shared with: ACCORD/i)).toBeInTheDocument();
  });

  it('7. P07 Forged Silence Audit identifies Manifest 44 synthetic zero and unlocks G3 (Annex N)', async () => {
    const user = userEvent.setup();
    useGameStore.getState().setFlag('p06_solved', true);
    render(
      <MemoryRouter>
        <ManifestLedger />
      </MemoryRouter>
    );

    // Switch to P07 tab
    const p07Tab = screen.getByRole('button', { name: /2\. Forged Silence Audit/i });
    await user.click(p07Tab);

    expect(screen.getByRole('heading', { name: /P07: Identify Altered Silence in Manifests/i })).toBeInTheDocument();
    expect(screen.getByText(/Manifest #44/i)).toBeInTheDocument();
    expect(screen.getByText(/Clean zero \(0\.000 dB \/ Absolute mathematical silence\)/i)).toBeInTheDocument();

    // Flag Manifest 44
    const flagButtons = screen.getAllByRole('button', { name: /Flag as Altered Record/i });
    await user.click(flagButtons[2]); // Manifest 44 is 3rd in list

    // State Assertions
    const store = useGameStore.getState();
    expect(store.gameState.unlockedGates['G3']).toBe(true);
    expect(store.gameState.chapter).toBe(3);
    expect(store.puzzleState['p07_forged_silence'].status).toBe('solved');
    expect(store.evidenceState['EV-008'].discovered).toBe(true);
    expect(screen.getByText(/Annex N Discovery Confirmed/i)).toBeInTheDocument();
  });

  it('8. P04 / P06 / P07 Hint Escalation and Bypass paths', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ManifestLedger />
      </MemoryRouter>
    );

    // Request hints to level 4
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 1\)/i }));
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 2\)/i }));
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 3\)/i }));
    await user.click(screen.getByRole('button', { name: /Request Hint \(Level 4\)/i }));

    expect(screen.getByText(/Resolve: In P06, align all 3 diagrams/i)).toBeInTheDocument();

    // Bypass
    const bypassBtn = screen.getByRole('button', { name: /Assisted Bypass \(Level 4\)/i });
    await user.click(bypassBtn);

    expect(useGameStore.getState().puzzleState['p06_belowline_route'].status).toBe('bypassed');
    expect(useGameStore.getState().puzzleState['p07_forged_silence'].status).toBe('bypassed');
    expect(useGameStore.getState().gameState.unlockedGates['G3']).toBe(true);
  });

  it('9. 360 px responsive rendering in Moltinghouse and Belowline', () => {
    const { container: moltContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <MoltinghouseHome />
        </div>
      </MemoryRouter>
    );
    expect(moltContainer).toBeInTheDocument();

    const { container: belowContainer } = render(
      <MemoryRouter>
        <div style={{ width: '360px', padding: '16px', boxSizing: 'border-box' }}>
          <BelowlineMap />
        </div>
      </MemoryRouter>
    );
    expect(belowContainer).toBeInTheDocument();
  });
});
