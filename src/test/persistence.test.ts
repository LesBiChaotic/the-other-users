/**
 * Persistence, Migration, and Snapshot Recovery Tests — The Other Users
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../domain/persistence/db';
import { saveManager } from '../domain/persistence/saveManager';
import { migrateSaveEnvelope, CURRENT_SCHEMA_VERSION } from '../domain/persistence/migrations';
import { createInitialRootState, advanceChapterReducer, unlockGateReducer } from '../domain/state/actions';
import { createCheckpointSnapshot } from '../domain/state/snapshots';
import { SaveEnvelope } from '../domain/types/state';

describe('IndexedDB Persistence, Migration & Recovery', () => {
  beforeEach(async () => {
    await saveManager.wipeAllPersistence();
  });

  it('saves and hydrates a valid SaveEnvelope from IndexedDB', async () => {
    const state = createInitialRootState();
    state.gameState.chapter = 1;
    state.gameState.unlockedGates['G0'] = true;
    state.playerProfile.handle = 'TestUser_01';

    const envelope: SaveEnvelope = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      contentVersion: '0.1.0',
      playthroughId: 'pt_test_123',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      gameState: state.gameState,
      playerProfile: state.playerProfile,
      puzzleState: state.puzzleState,
      relationshipState: state.relationshipState,
      reputationState: state.reputationState,
      evidenceState: state.evidenceState,
      inventoryState: state.inventoryState,
      narrativeState: state.narrativeState,
      settingsState: {
        theme: 'dark',
        textScale: 120,
        reducedMotion: false,
        highContrast: false,
        soundEnabled: true,
        transcriptsEnabled: true,
        untimedPuzzles: false,
        contentWarningsEnabled: true,
      },
      uiState: {
        navigationDrawerOpen: false,
        activeComparisonEvidenceIds: [],
        draftNotes: {},
        scrollRestoration: {},
      },
      eventHistory: [],
      snapshots: [],
    };

    await saveManager.saveActiveEnvelope(envelope);

    const loaded = await saveManager.loadActiveSave();
    expect(loaded.envelope).toBeDefined();
    expect(loaded.envelope?.playthroughId).toBe('pt_test_123');
    expect(loaded.envelope?.gameState.chapter).toBe(1);
    expect(loaded.envelope?.playerProfile.handle).toBe('TestUser_01');
    expect(loaded.recoveredFromSnapshot).toBe(false);
  });

  it('migrates a concrete mock older save schema (v0/legacy) into current schema v1', () => {
    const legacySave = {
      // Missing schemaVersion
      contentVersion: '0.0.9',
      playthroughId: 'pt_legacy_001',
      createdAt: 1000000,
      updatedAt: 2000000,
      gameState: {
        chapter: 1,
        unlockedGates: { G0: true },
        flags: { intro_done: true },
        feedSeenIds: ['post_01'],
      },
      playerProfile: {
        handle: 'LegacyObserver',
        pronouns: 'it/its',
        provisionalSpecies: 'Proto-Node',
        occupancyCount: 1,
        thresholdTolerance: 'Low',
        memoryDiet: 'Noise',
        mimicryRisk: 'low',
        witnessedShape: 'Indeterminate',
        exposureScore: 10,
        legibilityScore: 5,
        pluralityScore: 15,
        complicityScore: 0,
        ilyrTrustScore: 25,
        revisions: [],
      },
      puzzleState: {},
      relationshipState: {},
      reputationState: {
        plurality_accord: 10,
        open_shape: 0,
        communion_body: 0,
        menagerie_directorate: 0,
        human_observation_guild: 0,
        pale_market_houses: 0,
      },
      evidenceState: {},
      inventoryState: {},
      settingsState: {
        theme: 'light',
        textScale: 100,
        reducedMotion: true,
        highContrast: false,
        soundEnabled: true,
        transcriptsEnabled: true,
        untimedPuzzles: false,
        contentWarningsEnabled: true,
      },
      eventHistory: [],
      snapshots: [],
    };

    const result = migrateSaveEnvelope(legacySave);
    expect(result.success).toBe(true);
    expect(result.envelope).toBeDefined();
    expect(result.envelope?.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(result.envelope?.playerProfile.handle).toBe('LegacyObserver');
    expect(result.envelope?.uiState).toBeDefined(); // Clean UI state injected
  });

  it('recovers safely from corrupted or incompatible UI-state without losing valid game progress', () => {
    const state = createInitialRootState();
    const saveWithCorruptedUI = {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      contentVersion: '0.1.0',
      playthroughId: 'pt_corrupted_ui',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      gameState: state.gameState,
      playerProfile: state.playerProfile,
      puzzleState: state.puzzleState,
      relationshipState: state.relationshipState,
      reputationState: state.reputationState,
      evidenceState: state.evidenceState,
      inventoryState: state.inventoryState,
      settingsState: {
        theme: 'dark',
        textScale: 100,
        reducedMotion: false,
        highContrast: false,
        soundEnabled: true,
        transcriptsEnabled: true,
        untimedPuzzles: false,
        contentWarningsEnabled: true,
      },
      uiState: 'corrupted_string_instead_of_object', // Corrupted
      eventHistory: [],
      snapshots: [],
    };

    const result = migrateSaveEnvelope(saveWithCorruptedUI);
    expect(result.success).toBe(true);
    expect(result.envelope?.uiState).toEqual({
      navigationDrawerOpen: false,
      activeComparisonEvidenceIds: [],
      draftNotes: {},
      scrollRestoration: {},
    });
  });

  it('recovers from last-known-good snapshot if active save is fatally corrupted', async () => {
    const playthroughId = 'pt_recover_test';
    let state = createInitialRootState();
    state = advanceChapterReducer(state, 2).nextState;
    state = unlockGateReducer(state, 'G2').nextState;

    const validSnapshot = createCheckpointSnapshot(state, 'Chapter 2 Clean Snapshot');
    await saveManager.saveSnapshot(validSnapshot, playthroughId);

    // Write a fatally corrupted save in saves table
    await db.saves.put({
      schemaVersion: 9999, // Incompatible future schema
      playthroughId,
      updatedAt: Date.now() + 1000,
      fatallyInvalid: true,
    } as any);

    const loadResult = await saveManager.loadActiveSave();
    expect(loadResult.recoveredFromSnapshot).toBe(true);
    expect(loadResult.envelope).toBeDefined();
    expect(loadResult.envelope?.gameState.chapter).toBe(2);
    expect(loadResult.envelope?.gameState.unlockedGates['G2']).toBe(true);
  });
});
