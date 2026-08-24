/**
 * Multi-Tier Reset Manager Unit Tests — The Other Users
 */

import { describe, it, expect } from 'vitest';
import {
  executeFullReset,
  executeChapterReset,
  executePuzzleReset,
  executeSurfaceReset,
} from '../domain/state/resetManager';
import { createInitialRootState, advanceChapterReducer, unlockGateReducer } from '../domain/state/actions';
import { createCheckpointSnapshot } from '../domain/state/snapshots';
import { UIState } from '../domain/types/state';

describe('Multi-Tier Reset Orchestration', () => {
  it('executeFullReset returns clean Chapter 0 onboarding state', () => {
    const { nextState, nextUIState, event } = executeFullReset();

    expect(nextState.gameState.chapter).toBe(0);
    expect(nextState.gameState.unlockedGates).toEqual({});
    expect(nextState.playerProfile.handle).toBe('Observer_Provisional');
    expect(nextUIState?.activeComparisonEvidenceIds).toEqual([]);
    expect(event.type).toBe('RESET_TRIGGERED');
    expect((event as any).payload.scope).toBe('full');
  });

  it('executeChapterReset restores exact chapter snapshot', () => {
    let state = createInitialRootState();
    state = unlockGateReducer(state, 'G0').nextState;

    // Capture Chapter 0 snapshot
    const snap0 = createCheckpointSnapshot(state, 'Chapter 0 Entry');

    // Advance to Chapter 1, unlock G1, set flags
    state = advanceChapterReducer(state, 1).nextState;
    state = unlockGateReducer(state, 'G1').nextState;
    const snap1 = createCheckpointSnapshot(state, 'Chapter 1 Entry');

    // Advance to Chapter 2
    state = advanceChapterReducer(state, 2).nextState;
    state = unlockGateReducer(state, 'G2').nextState;

    // Reset back to Chapter 1
    const { nextState, event } = executeChapterReset(state, 1, [snap0, snap1]);

    expect(nextState.gameState.chapter).toBe(1);
    expect(nextState.gameState.unlockedGates['G1']).toBe(true);
    expect(nextState.gameState.unlockedGates['G2']).toBeUndefined();
    expect(event.type).toBe('RESET_TRIGGERED');
    expect((event as any).payload.scope).toBe('chapter');
  });

  it('executePuzzleReset resets specific puzzle without mutating global state', () => {
    const state = createInitialRootState();
    state.gameState.chapter = 2;
    state.gameState.unlockedGates['G0'] = true;
    state.gameState.unlockedGates['G1'] = true;
    state.puzzleState['p02_geolocation'] = {
      status: 'active',
      attempts: 3,
      hintLevel: 2,
      bypassed: false,
      workingInput: { targetRef: 'window_reflection' },
      lastFeedback: 'Coordinates misaligned',
    };
    state.puzzleState['p01_other'] = {
      status: 'solved',
      attempts: 1,
      hintLevel: 0,
      bypassed: false,
      solvedAt: 12345,
    };

    const { nextState, event } = executePuzzleReset(state, 'p02_geolocation');

    // p02 is reset to clean baseline
    expect(nextState.puzzleState['p02_geolocation'].attempts).toBe(0);
    expect(nextState.puzzleState['p02_geolocation'].hintLevel).toBe(0);
    expect(nextState.puzzleState['p02_geolocation'].workingInput).toBeUndefined();

    // p01 and global state remain untouched
    expect(nextState.puzzleState['p01_other'].status).toBe('solved');
    expect(nextState.gameState.chapter).toBe(2);
    expect(nextState.gameState.unlockedGates['G1']).toBe(true);
    expect(event.type).toBe('RESET_TRIGGERED');
    expect((event as any).payload.targetId).toBe('p02_geolocation');
  });

  it('executeSurfaceReset clears ephemeral UI without affecting game progress', () => {
    const dirtyUI: UIState = {
      navigationDrawerOpen: true,
      activeComparisonEvidenceIds: ['ev_01', 'ev_02'],
      draftNotes: { wire_note: 'suspect user 4' },
      scrollRestoration: { '/wire': 450 },
    };

    const { nextUIState, event } = executeSurfaceReset(dirtyUI);

    expect(nextUIState.navigationDrawerOpen).toBe(false);
    expect(nextUIState.activeComparisonEvidenceIds).toEqual([]);
    expect(nextUIState.draftNotes).toEqual({});
    expect(event.type).toBe('RESET_TRIGGERED');
    expect((event as any).payload.scope).toBe('surface');
  });
});
