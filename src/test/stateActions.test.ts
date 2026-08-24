/**
 * State Action Transitions & Reducer Unit Tests — The Other Users
 */

import { describe, it, expect } from 'vitest';
import {
  createInitialRootState,
  unlockGateReducer,
  advanceChapterReducer,
  setFlagReducer,
  updateProfileReducer,
  updatePuzzleStatusReducer,
  requestPuzzleHintReducer,
  changeRelationshipReducer,
  changeReputationReducer,
} from '../domain/state/actions';

describe('State Machine & Action Transitions', () => {
  it('unlockGateReducer unlocks gate and emits GATE_UNLOCKED event', () => {
    const state = createInitialRootState();
    const { nextState, event } = unlockGateReducer(state, 'G0');

    expect(nextState.gameState.unlockedGates['G0']).toBe(true);
    expect(event).toBeDefined();
    expect(event?.type).toBe('GATE_UNLOCKED');
    expect((event as any).payload.gateId).toBe('G0');

    // Idempotency: Unlocking again emits no event
    const secondCall = unlockGateReducer(nextState, 'G0');
    expect(secondCall.event).toBeUndefined();
  });

  it('advanceChapterReducer advances chapter and enforces 0-8 bounds', () => {
    const state = createInitialRootState();
    const { nextState, event } = advanceChapterReducer(state, 1);

    expect(nextState.gameState.chapter).toBe(1);
    expect(event?.type).toBe('CHAPTER_TRANSITIONED');
    expect((event as any).payload.fromChapter).toBe(0);
    expect((event as any).payload.toChapter).toBe(1);

    // Invalid chapter > 8
    expect(() => advanceChapterReducer(nextState, 9)).toThrowError(
      /Canonical range is 0 to 8/
    );

    // Backward transition should throw
    expect(() => advanceChapterReducer(nextState, 0)).toThrowError(
      /Cannot advance backwards/
    );
  });

  it('updatePuzzleStatusReducer enforces legal state transitions', () => {
    const state = createInitialRootState();

    // unseen -> introduced (Legal)
    const step1 = updatePuzzleStatusReducer(state, 'p00_verification', 'introduced');
    expect(step1.nextState.puzzleState['p00_verification'].status).toBe('introduced');
    expect(step1.event?.type).toBe('PUZZLE_STATUS_CHANGED');

    // introduced -> active (Legal)
    const step2 = updatePuzzleStatusReducer(step1.nextState, 'p00_verification', 'active');
    expect(step2.nextState.puzzleState['p00_verification'].status).toBe('active');
    expect(step2.nextState.puzzleState['p00_verification'].attempts).toBe(1);

    // active -> solved (Legal)
    const step3 = updatePuzzleStatusReducer(
      step2.nextState,
      'p00_verification',
      'solved',
      { choice: 'test' },
      'Correct verification pattern'
    );
    expect(step3.nextState.puzzleState['p00_verification'].status).toBe('solved');
    expect(step3.nextState.puzzleState['p00_verification'].solvedAt).toBeDefined();

    // Illegal transition: unseen -> solved directly
    expect(() =>
      updatePuzzleStatusReducer(state, 'p01_unseen', 'solved')
    ).toThrowError(/Illegal puzzle state transition/);
  });

  it('requestPuzzleHintReducer increments hints up to maximum 4', () => {
    let state = createInitialRootState();
    state = updatePuzzleStatusReducer(state, 'p00_verification', 'introduced').nextState;

    for (let i = 1; i <= 4; i++) {
      const res = requestPuzzleHintReducer(state, 'p00_verification');
      state = res.nextState;
      expect(state.puzzleState['p00_verification'].hintLevel).toBe(i);
      expect(res.event?.type).toBe('PUZZLE_HINT_REQUESTED');
    }

    // Exceeding 4 does not increment further
    const capRes = requestPuzzleHintReducer(state, 'p00_verification');
    expect(capRes.nextState.puzzleState['p00_verification'].hintLevel).toBe(4);
    expect(capRes.event).toBeUndefined();
  });

  it('changeRelationshipReducer clamps trust between -100 and 100', () => {
    const state = createInitialRootState();
    const { nextState, events } = changeRelationshipReducer(
      state,
      'usr_ilyr',
      120,
      'protected',
      true
    );

    expect(nextState.relationshipState['usr_ilyr'].trust).toBe(100);
    expect(nextState.relationshipState['usr_ilyr'].outcome).toBe('protected');
    expect(nextState.relationshipState['usr_ilyr'].witnessEligible).toBe(true);
    expect(events.some((e) => e.type === 'RELATIONSHIP_CHANGED')).toBe(true);
    expect(events.some((e) => e.type === 'USER_OUTCOME_SET')).toBe(true);
  });

  it('setFlagReducer sets flags and emits FLAG_SET', () => {
    const state = createInitialRootState();
    const { nextState, event } = setFlagReducer(state, 'invitation_accepted', true);
    expect(nextState.gameState.flags['invitation_accepted']).toBe(true);
    expect(event?.type).toBe('FLAG_SET');
  });

  it('updateProfileReducer updates traits and emits PROFILE_UPDATED', () => {
    const state = createInitialRootState();
    const { nextState, events } = updateProfileReducer(state, {
      handle: 'Witness_Seven',
      provisionalSpecies: 'Lintel Dweller',
    });
    expect(nextState.playerProfile.handle).toBe('Witness_Seven');
    expect(nextState.playerProfile.provisionalSpecies).toBe('Lintel Dweller');
    expect(events).toHaveLength(2);
    expect(events[0].type).toBe('PROFILE_UPDATED');
  });

  it('changeReputationReducer clamps and emits REPUTATION_CHANGED', () => {
    const state = createInitialRootState();
    const { nextState, event } = changeReputationReducer(state, 'plurality_accord', 35);
    expect(nextState.reputationState['plurality_accord']).toBe(35);
    expect(event?.type).toBe('REPUTATION_CHANGED');
  });
});
