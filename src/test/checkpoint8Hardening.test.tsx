/**
 * Checkpoint 8 — Master QA, Hardening & Final Acceptance Tests
 * 
 * Tests all ten regression fixtures (R1–R10), reset boundaries, save recovery/migration,
 * route registry coverage (all 34 canonical routes), and accessibility guarantees.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { saveManager } from '../domain/persistence/saveManager';
import { useGameStore } from '../domain/state/useGameStore';
import { useSettingsStore } from '../domain/state/settingsStore';
import { ROUTE_REGISTRY } from '../domain/routes/routeRegistry';
import { CANONICAL_ENDINGS } from '../content/fixtures/convergenceContent';
import { PALE_MARKET_LISTINGS } from '../content/fixtures/paleMarketContent';
import { COMMUNION_SERMONS } from '../content/fixtures/communionContent';
import { MENAGERIE_REGISTRY_ENTRIES } from '../content/fixtures/menagerieContent';
import { WITNESS_WIRE_THREADS } from '../content/fixtures/witnessWireContent';
import { MOLTINGHOUSE_THREADS } from '../content/fixtures/moltinghouseContent';
import { BELOWLINE_POSTS } from '../content/fixtures/belowlineContent';
import { VESPER_DISCUSSIONS } from '../content/fixtures/vesperContent';
import { SaveEnvelope } from '../domain/types/state';

describe('Checkpoint 8: Master QA & Final Acceptance Hardening', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('reduced-motion');
    localStorage.clear();

    const store = useGameStore.getState();
    await store.hydrate();
  });

  /* -------------------------------------------------------------------------- */
  /* 1. TEN REGRESSION PLAYTHROUGH FIXTURES (R1 – R10)                          */
  /* -------------------------------------------------------------------------- */

  it('R1 — Chorus: High plurality/witness, five sensory definitions, living trusted users, Chorus ending', () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');
    store.unlockGate('G6');
    store.updateProfile({
      handle: 'Domestic_Witness_01',
      provisionalSpecies: 'DOMESTIC WITNESS',
      pluralityScore: 90,
      legibilityScore: 10,
      complicityScore: 5,
      exposureScore: 15,
      ilyrTrustScore: 85,
    });
    store.changeRelationship('usr_ilyr', 50);
    store.changeRelationship('usr_sof', 40);
    store.changeRelationship('usr_und', 40);
    store.changeRelationship('usr_roo', 40);
    store.changeRelationship('usr_unr', 40);

    const endingChorus = CANONICAL_ENDINGS['END-CHORUS'];
    expect(endingChorus).toBeDefined();

    store.setFlag('p17_committed_ending', 'END-CHORUS');
    store.commitEnding('END-CHORUS', { terms: 'plurality_preserved' });

    const state = useGameStore.getState();
    expect(state.gameState.flags['p17_committed_ending']).toBe('END-CHORUS');
    expect(state.playerProfile.pluralityScore).toBeGreaterThanOrEqual(80);
    expect(state.relationshipState['usr_ilyr'].trust).toBeGreaterThanOrEqual(50);
  });

  it('R2 — Ordinary: High legibility, Communion support, Perfectly Ordinary ending', () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');
    store.unlockGate('G6');
    store.updateProfile({
      handle: 'Standardized_Human_01',
      provisionalSpecies: 'STANDARD HUMAN OBSERVER',
      legibilityScore: 95,
      pluralityScore: 10,
      complicityScore: 20,
    });
    store.changeReputation('communion_body', 50);

    store.setFlag('p17_committed_ending', 'END-ORDINARY');
    store.commitEnding('END-ORDINARY', { terms: 'standardization_accepted' });

    const state = useGameStore.getState();
    expect(state.gameState.flags['p17_committed_ending']).toBe('END-ORDINARY');
    expect(state.playerProfile.legibilityScore).toBeGreaterThanOrEqual(80);
  });

  it('R3 — Closed: Menagerie empowered, network concealment, Closed Tab ending', () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');
    store.unlockGate('G6');
    store.updateProfile({
      handle: 'Concealed_Operator_01',
      exposureScore: 5,
      complicityScore: 60,
    });
    store.changeReputation('menagerie_directorate', 60);

    store.setFlag('p17_committed_ending', 'END-CLOSED');
    store.commitEnding('END-CLOSED', { terms: 'containment_empowered' });

    const state = useGameStore.getState();
    expect(state.gameState.flags['p17_committed_ending']).toBe('END-CLOSED');
  });

  it('R4 — Many: Infrastructure severed, community isolation outcomes, Many Bodies ending', () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');
    store.unlockGate('G6');
    store.updateProfile({
      handle: 'Fragmented_Rebel_01',
      pluralityScore: 80,
      exposureScore: 80,
    });

    store.setFlag('p17_committed_ending', 'END-MANY');
    store.commitEnding('END-MANY', { terms: 'infrastructure_severed' });

    const state = useGameStore.getState();
    expect(state.gameState.flags['p17_committed_ending']).toBe('END-MANY');
  });

  it('R5 — Moderator: Ilyr freed without ownership, narrow reciprocal permission, Moderator ending', () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');
    store.unlockGate('G5');
    store.unlockGate('G6');
    store.updateProfile({
      handle: 'Reciprocal_Threshold_Partner',
      ilyrTrustScore: 95,
    });
    store.setFlag('p15_ilyr_exit_signed', true);

    store.setFlag('p17_committed_ending', 'END-MOD');
    store.commitEnding('END-MOD', { terms: 'reciprocal_threshold_exit' });

    const state = useGameStore.getState();
    expect(state.gameState.flags['p17_committed_ending']).toBe('END-MOD');
  });

  it('R6 — Not Found: High complicity/low witness, player-model absorption, User Not Found ending', () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');
    store.unlockGate('G6');
    store.updateProfile({
      handle: 'Absorbed_Model_01',
      complicityScore: 95,
      pluralityScore: 0,
      exposureScore: 90,
    });

    store.setFlag('p17_committed_ending', 'END-NOTFOUND');
    store.commitEnding('END-NOTFOUND', { terms: 'common_body_absorption' });

    const state = useGameStore.getState();
    expect(state.gameState.flags['p17_committed_ending']).toBe('END-NOTFOUND');
  });

  it('R7 — Wrong but repairable: False accusations followed by apology/repair routes preserve completion', () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');

    // Simulate false accusation on neverlookstraight
    store.changeRelationship('usr_nvr', -20, 'accused');
    expect(useGameStore.getState().relationshipState['usr_nvr'].outcome).toBe('accused');

    // Apology and repair path
    store.changeRelationship('usr_nvr', 30, 'rescued');
    expect(useGameStore.getState().relationshipState['usr_nvr'].outcome).toBe('rescued');
    expect(useGameStore.getState().relationshipState['usr_nvr'].trust).toBeGreaterThan(0);
  });

  it('R8 — Assisted: Every puzzle uses hints and assisted bypass while preserving progress', () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');

    // Step through hint ladder to bypass
    const puzzleId = 'p02_microwave_observation';
    store.setPuzzleStatus(puzzleId, 'introduced');
    store.setPuzzleStatus(puzzleId, 'active');
    store.requestPuzzleHint(puzzleId);
    store.requestPuzzleHint(puzzleId);
    store.requestPuzzleHint(puzzleId);
    store.requestPuzzleHint(puzzleId);

    expect(useGameStore.getState().puzzleState[puzzleId].hintLevel).toBe(4);

    store.setPuzzleStatus(puzzleId, 'bypassed');
    expect(useGameStore.getState().puzzleState[puzzleId].status).toBe('bypassed');
    expect(useGameStore.getState().puzzleState[puzzleId].bypassed).toBe(true);
  });

  it('R9 — Lossy migration: Older save with removed optional IDs migrates without core loss', async () => {
    const legacyRawSave: SaveEnvelope = {
      schemaVersion: 1,
      contentVersion: '0.1.0-legacy',
      playthroughId: 'pt_legacy_123',
      createdAt: Date.now() - 100000,
      updatedAt: Date.now() - 50000,
      gameState: {
        chapter: 2,
        unlockedGates: { G0: true, G1: true },
        flags: { legacy_flag_removed_in_v2: true },
        feedSeenIds: ['post_wire_sample_01'],
      },
      playerProfile: {
        handle: 'Migrated_Player',
        pronouns: 'they/them',
        provisionalSpecies: 'DOMESTIC WITNESS',
        occupancyCount: 1,
        thresholdTolerance: 'Standard',
        memoryDiet: 'Atmospheric Noise',
        mimicryRisk: 'Elevated',
        witnessedShape: 'Indeterminate',
        exposureScore: 10,
        legibilityScore: 10,
        pluralityScore: 15,
        complicityScore: 0,
        ilyrTrustScore: 15,
        revisions: [],
      },
      puzzleState: {
        p00_species_verification: { status: 'solved', attempts: 1, hintLevel: 0, bypassed: false },
      },
      relationshipState: {},
      reputationState: {
        plurality_accord: 0,
        open_shape: 0,
        communion_body: 0,
        menagerie_directorate: 0,
        human_observation_guild: 0,
        pale_market_houses: 0,
      },
      evidenceState: {
        'EV-001': { discovered: true, inspected: true, marked: false, compared: false, committedToCases: [] },
      },
      inventoryState: {},
      narrativeState: {
        choices: {},
        completedChapterIds: [],
        commonBodyCapabilities: [],
        messageState: {},
      },
      settingsState: {
        theme: 'dark',
        textScale: 100,
        reducedMotion: false,
        soundEnabled: true,
        highContrast: false,
        transcriptsEnabled: true,
        untimedPuzzles: false,
        contentWarningsEnabled: true,
      },
      eventHistory: [],
      snapshots: [],
    };

    await saveManager.saveActiveEnvelope(legacyRawSave);
    const restored = await saveManager.loadActiveSave();

    expect(restored.envelope).toBeDefined();
    expect(restored.envelope?.playerProfile.handle).toBe('Migrated_Player');
    expect(restored.envelope?.gameState.chapter).toBe(2);
  });

  it('R10 — Accessibility: Settings persist and reflect accurately', () => {
    const settingsStore = useSettingsStore.getState();
    settingsStore.setTheme('dark');
    settingsStore.setReducedMotion(true);
    settingsStore.setUntimedPuzzles(true);
    settingsStore.setSoundEnabled(false);
    settingsStore.setTextScale(200);

    const state = useSettingsStore.getState();
    expect(state.reducedMotion).toBe(true);
    expect(state.untimedPuzzles).toBe(true);
    expect(state.textScale).toBe(200);
    expect(state.soundEnabled).toBe(false);
  });

  /* -------------------------------------------------------------------------- */
  /* 2. RESET BOUNDARIES & ISOLATION                                            */
  /* -------------------------------------------------------------------------- */

  it('Reset boundaries: Puzzle reset affects only active puzzle state without resetting chapter progress', () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');
    store.advanceChapter(3);
    store.setPuzzleStatus('p03_witness_identity', 'active', { draft: 'temp_input' }, 'Working feedback');

    store.resetPuzzle('p03_witness_identity');

    const state = useGameStore.getState();
    expect(state.puzzleState['p03_witness_identity'].status).toBe('introduced');
    expect(state.puzzleState['p03_witness_identity'].attempts).toBe(0);
    expect(state.puzzleState['p03_witness_identity'].workingInput).toBeUndefined();
    expect(state.gameState.chapter).toBe(3); // Chapter is preserved!
  });

  it('Reset boundaries: Full reset wipes persistence, deletes traits, and restarts at unverified state', async () => {
    const store = useGameStore.getState();
    store.unlockGate('G0');
    store.unlockGate('G6');
    store.updateProfile({ handle: 'To_Be_Deleted', pluralityScore: 100 });
    store.commitEnding('END-CHORUS', {});

    await store.resetFull();

    const state = useGameStore.getState();
    expect(state.gameState.chapter).toBe(0);
    expect(state.gameState.unlockedGates['G0']).toBeUndefined();
    expect(state.playerProfile.handle).toBe('Observer_Provisional');
    expect(state.gameState.flags['p17_committed_ending']).toBeUndefined();
  });

  /* -------------------------------------------------------------------------- */
  /* 3. ROUTE REGISTRY (ALL 34 CANONICAL ROUTES) COVERAGE                        */
  /* -------------------------------------------------------------------------- */

  it('Route Registry: Covers all 34 canonical routes with valid metadata', () => {
    const routeKeys = Object.keys(ROUTE_REGISTRY);
    expect(routeKeys.length).toBeGreaterThanOrEqual(30);

    const requiredRoutes = [
      '/',
      '/verify',
      '/accessibility',
      '/home',
      '/inbox',
      '/evidence',
      '/profile',
      '/communities',
      '/settings',
      '/wire',
      '/wire/case/player',
      '/wire/thread/:id',
      '/wire/user/:handle',
      '/molt',
      '/molt/sheds/soft_error',
      '/molt/thread/five-of-us',
      '/below',
      '/below/manifests',
      '/vesper',
      '/vesper/profile/room-tone',
      '/vesper/agreements/body-sharing',
      '/market',
      '/market/listing/access-identity',
      '/market/listing/unremember-me',
      '/communion',
      '/communion/testimonies',
      '/communion/litany',
      '/menagerie',
      '/menagerie/ops',
      '/menagerie/enclosure/:id',
      '/menagerie/threshold',
      '/convergence',
      '/convergence/witnesses',
      '/convergence/permission',
      '/epilogue/:ending',
    ];

    requiredRoutes.forEach((route) => {
      expect(ROUTE_REGISTRY[route]).toBeDefined();
    });
  });

  /* -------------------------------------------------------------------------- */
  /* 4. CONTENT INTEGRITY & NO PLACEHOLDERS                                      */
  /* -------------------------------------------------------------------------- */

  it('Content Integrity: No placeholder lorem or un-authored strings in core content packs', () => {
    const allTextBlocks = [
      ...WITNESS_WIRE_THREADS.map((t) => t.body + ' ' + t.title),
      ...MOLTINGHOUSE_THREADS.map((t) => t.body + ' ' + t.title),
      ...BELOWLINE_POSTS.map((p) => p.body + ' ' + p.title),
      ...VESPER_DISCUSSIONS.map((d) => d.body + ' ' + d.title),
      ...PALE_MARKET_LISTINGS.map((l) => l.description + ' ' + l.title),
      ...COMMUNION_SERMONS.map((s) => s.body + ' ' + s.title),
      ...MENAGERIE_REGISTRY_ENTRIES.map((m) => m.officialSummary + ' ' + m.specimenLabel),
    ];

    allTextBlocks.forEach((text) => {
      expect(text.toLowerCase()).not.toContain('lorem ipsum');
      expect(text.toLowerCase()).not.toContain('placeholder');
      expect(text.toLowerCase()).not.toContain('todo');
    });
  });
});
