/**
 * Pure State Action Reducers — The Other Users
 * 
 * Enforces valid state machine transitions, pure state mutations via Immer,
 * and deterministic GameEvent emissions.
 */

import { produce } from 'immer';
import {
  GameState,
  PlayerProfileState,
  PuzzlePerState,
  RelationshipPerUser,
  EvidencePerItem,
  InventoryPerItem,
  UserOutcome,
} from '../types/state';
import { FactionId } from '../types/content';
import { GameEvent } from '../types/events';
import { createGameEvent } from '../events/gameEvents';
import { PuzzleStatus } from '../types/conditions';

export interface RootState {
  gameState: GameState;
  playerProfile: PlayerProfileState;
  puzzleState: Record<string, PuzzlePerState>;
  relationshipState: Record<string, RelationshipPerUser>;
  reputationState: Record<FactionId, number>;
  evidenceState: Record<string, EvidencePerItem>;
  inventoryState: Record<string, InventoryPerItem>;
  seenEndingIds: string[];
}

export function createInitialRootState(): RootState {
  return {
    gameState: {
      chapter: 0,
      unlockedGates: {},
      flags: {},
      feedSeenIds: [],
    },
    playerProfile: {
      handle: 'Observer_Provisional',
      pronouns: 'they/them',
      provisionalSpecies: 'Unclassified Organic Node',
      occupancyCount: 1,
      thresholdTolerance: 'Unverified',
      memoryDiet: 'Atmospheric Noise',
      mimicryRisk: 'low',
      witnessedShape: 'Indeterminate',
      exposureScore: 0,
      legibilityScore: 0,
      pluralityScore: 0,
      complicityScore: 0,
      ilyrTrustScore: 0,
      revisions: [],
    },
    puzzleState: {},
    relationshipState: {},
    reputationState: {
      plurality_accord: 0,
      open_shape: 0,
      communion_body: 0,
      menagerie_directorate: 0,
      human_observation_guild: 0,
      pale_market_houses: 0,
    },
    evidenceState: {},
    inventoryState: {},
    seenEndingIds: [],
  };
}

// Legal Puzzle Transitions
const LEGAL_PUZZLE_TRANSITIONS: Record<PuzzleStatus, PuzzleStatus[]> = {
  unseen: ['introduced', 'active'],
  introduced: ['active', 'bypassed'],
  active: ['solved', 'bypassed', 'consequentialFailure'],
  solved: ['revisitable'],
  bypassed: ['revisitable'],
  consequentialFailure: ['revisitable', 'active'],
  revisitable: ['active', 'solved', 'bypassed'],
};

export function unlockGateReducer(
  state: RootState,
  gateId: string
): { nextState: RootState; event?: GameEvent } {
  if (state.gameState.unlockedGates[gateId]) {
    return { nextState: state };
  }

  const nextState = produce(state, (draft) => {
    draft.gameState.unlockedGates[gateId] = true;
  });

  const event = createGameEvent(
    'GATE_UNLOCKED',
    { gateId, priorState: false },
    state.gameState.chapter
  );

  return { nextState, event };
}

export function advanceChapterReducer(
  state: RootState,
  toChapter: number
): { nextState: RootState; event?: GameEvent } {
  if (toChapter < 0 || toChapter > 8) {
    throw new Error(`Invalid chapter transition to ${toChapter}. Canonical range is 0 to 8.`);
  }

  if (toChapter < state.gameState.chapter) {
    throw new Error(
      `Cannot advance backwards from Chapter ${state.gameState.chapter} to Chapter ${toChapter}. Use Chapter Reset instead.`
    );
  }

  if (toChapter === state.gameState.chapter) {
    return { nextState: state };
  }

  const fromChapter = state.gameState.chapter;
  const nextState = produce(state, (draft) => {
    draft.gameState.chapter = toChapter;
  });

  const event = createGameEvent(
    'CHAPTER_TRANSITIONED',
    { fromChapter, toChapter },
    toChapter
  );

  return { nextState, event };
}

export function setFlagReducer(
  state: RootState,
  flag: string,
  value: boolean | string | number
): { nextState: RootState; event?: GameEvent } {
  const oldValue = state.gameState.flags[flag];
  if (oldValue === value) {
    return { nextState: state };
  }

  const nextState = produce(state, (draft) => {
    draft.gameState.flags[flag] = value;
  });

  const event = createGameEvent(
    'FLAG_SET',
    { flag, oldValue, newValue: value },
    state.gameState.chapter
  );

  return { nextState, event };
}

export function updateProfileReducer(
  state: RootState,
  updates: Partial<PlayerProfileState>
): { nextState: RootState; events: GameEvent[] } {
  const events: GameEvent[] = [];

  const nextState = produce(state, (draft) => {
    for (const [key, value] of Object.entries(updates)) {
      if (key in draft.playerProfile) {
        const fieldKey = key as keyof PlayerProfileState;
        const oldVal = draft.playerProfile[fieldKey];
        if (oldVal !== value) {
          (draft.playerProfile as any)[fieldKey] = value;
          events.push(
            createGameEvent(
              'PROFILE_UPDATED',
              { field: key, oldValue: oldVal, newValue: value },
              state.gameState.chapter
            )
          );
        }
      }
    }
  });

  return { nextState, events };
}

export function updatePuzzleStatusReducer(
  state: RootState,
  puzzleId: string,
  newStatus: PuzzleStatus,
  workingInput?: unknown,
  lastFeedback?: string
): { nextState: RootState; event?: GameEvent } {
  const current = state.puzzleState[puzzleId] ?? {
    status: 'unseen',
    attempts: 0,
    hintLevel: 0,
    bypassed: false,
  };

  const oldStatus = current.status;
  if (oldStatus !== newStatus) {
    const allowed = LEGAL_PUZZLE_TRANSITIONS[oldStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new Error(
        `Illegal puzzle state transition for "${puzzleId}" from "${oldStatus}" to "${newStatus}".`
      );
    }
  }

  const nextState = produce(state, (draft) => {
    const p = draft.puzzleState[puzzleId] ?? {
      status: 'unseen',
      attempts: 0,
      hintLevel: 0,
      bypassed: false,
    };
    p.status = newStatus;
    if (newStatus === 'active') {
      p.attempts += 1;
    }
    if (newStatus === 'bypassed') {
      p.bypassed = true;
    }
    if (newStatus === 'solved') {
      p.solvedAt = Date.now();
    }
    if (workingInput !== undefined) {
      p.workingInput = workingInput;
    }
    if (lastFeedback !== undefined) {
      p.lastFeedback = lastFeedback;
    }
    draft.puzzleState[puzzleId] = p;
  });

  const event = createGameEvent(
    'PUZZLE_STATUS_CHANGED',
    {
      puzzleId,
      oldStatus,
      newStatus,
      attempts: nextState.puzzleState[puzzleId].attempts,
      hintLevel: nextState.puzzleState[puzzleId].hintLevel,
    },
    state.gameState.chapter
  );

  return { nextState, event };
}

export function requestPuzzleHintReducer(
  state: RootState,
  puzzleId: string
): { nextState: RootState; event?: GameEvent } {
  const current = state.puzzleState[puzzleId];
  if (!current || current.hintLevel >= 4) {
    return { nextState: state };
  }

  const newHintLevel = current.hintLevel + 1;
  const nextState = produce(state, (draft) => {
    draft.puzzleState[puzzleId].hintLevel = newHintLevel;
  });

  const event = createGameEvent(
    'PUZZLE_HINT_REQUESTED',
    { puzzleId, hintLevel: newHintLevel },
    state.gameState.chapter
  );

  return { nextState, event };
}

export function discoverEvidenceReducer(
  state: RootState,
  evidenceId: string,
  provenance: string
): { nextState: RootState; event?: GameEvent } {
  if (state.evidenceState[evidenceId]?.discovered) {
    return { nextState: state };
  }

  const nextState = produce(state, (draft) => {
    const existing = draft.evidenceState[evidenceId] ?? {
      discovered: false,
      inspected: false,
      marked: false,
      compared: false,
      committedToCases: [],
    };
    existing.discovered = true;
    draft.evidenceState[evidenceId] = existing;
  });

  const event = createGameEvent(
    'EVIDENCE_DISCOVERED',
    { evidenceId, provenance },
    state.gameState.chapter
  );

  return { nextState, event };
}

export function markEvidenceReducer(
  state: RootState,
  evidenceId: string,
  marked: boolean
): { nextState: RootState; event?: GameEvent } {
  const current = state.evidenceState[evidenceId];
  if (current && current.marked === marked) {
    return { nextState: state };
  }

  const nextState = produce(state, (draft) => {
    const existing = draft.evidenceState[evidenceId] ?? {
      discovered: true,
      inspected: true,
      marked: false,
      compared: false,
      committedToCases: [],
    };
    existing.marked = marked;
    draft.evidenceState[evidenceId] = existing;
  });

  const event = createGameEvent(
    'EVIDENCE_MARKED',
    { evidenceId, marked },
    state.gameState.chapter
  );

  return { nextState, event };
}

export function changeRelationshipReducer(
  state: RootState,
  userId: string,
  deltaTrust: number,
  outcome?: UserOutcome,
  witnessEligible?: boolean
): { nextState: RootState; events: GameEvent[] } {
  const events: GameEvent[] = [];
  const current = state.relationshipState[userId] ?? {
    trust: 0,
    flags: {},
    outcome: 'normal',
    witnessEligible: false,
  };

  const oldTrust = current.trust;
  const newTrust = Math.max(-100, Math.min(100, oldTrust + deltaTrust));

  const nextState = produce(state, (draft) => {
    const u = draft.relationshipState[userId] ?? {
      trust: 0,
      flags: {},
      outcome: 'normal',
      witnessEligible: false,
    };
    u.trust = newTrust;
    if (outcome) {
      u.outcome = outcome;
    }
    if (witnessEligible !== undefined) {
      u.witnessEligible = witnessEligible;
    }
    draft.relationshipState[userId] = u;
  });

  if (oldTrust !== newTrust) {
    events.push(
      createGameEvent(
        'RELATIONSHIP_CHANGED',
        { userId, oldTrust, newTrust },
        state.gameState.chapter
      )
    );
  }

  if (outcome && outcome !== current.outcome) {
    events.push(
      createGameEvent(
        'USER_OUTCOME_SET',
        { userId, outcome },
        state.gameState.chapter
      )
    );
  }

  return { nextState, events };
}

export function changeReputationReducer(
  state: RootState,
  factionId: FactionId,
  deltaScore: number
): { nextState: RootState; event?: GameEvent } {
  const oldScore = state.reputationState[factionId] ?? 0;
  const newScore = Math.max(-100, Math.min(100, oldScore + deltaScore));
  if (oldScore === newScore) {
    return { nextState: state };
  }

  const nextState = produce(state, (draft) => {
    draft.reputationState[factionId] = newScore;
  });

  const event = createGameEvent(
    'REPUTATION_CHANGED',
    { factionId, oldScore, newScore },
    state.gameState.chapter
  );

  return { nextState, event };
}

export function acquireItemReducer(
  state: RootState,
  itemId: string,
  permanence: 'permanent' | 'consumed_on_use' | 'escrowed',
  provenance: string
): { nextState: RootState; event?: GameEvent } {
  if (state.inventoryState[itemId]?.owned) {
    return { nextState: state };
  }

  const nextState = produce(state, (draft) => {
    draft.inventoryState[itemId] = {
      owned: true,
      acquiredAtChapter: draft.gameState.chapter,
      consumed: false,
      permanence,
    };
  });

  const event = createGameEvent(
    'ITEM_ACQUIRED',
    { itemId, provenance },
    state.gameState.chapter
  );

  return { nextState, event };
}

export function commitEndingReducer(
  state: RootState,
  endingId: string,
  terms: Record<string, unknown>
): { nextState: RootState; event?: GameEvent } {
  const nextState = produce(state, (draft) => {
    if (!draft.seenEndingIds.includes(endingId)) {
      draft.seenEndingIds.push(endingId);
    }
  });

  const event = createGameEvent(
    'ENDING_COMMITTED',
    { endingId, terms },
    state.gameState.chapter
  );

  return { nextState, event };
}
