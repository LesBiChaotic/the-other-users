/**
 * Multi-Tier Reset Orchestrator — The Other Users
 * 
 * Manages four distinct, independent reset scopes:
 * 1. Full Reset (wipes all gameplay, inventory, profile, endings, returns to onboarding)
 * 2. Chapter Reset (restores state to chapter entry snapshot while preserving settings)
 * 3. Puzzle Reset (resets puzzle attempts, working inputs, and hints without mutating global state)
 * 4. Surface Reset (clears ephemeral UI drafts, comparisons, and filters)
 */

import { RootState, createInitialRootState } from './actions';
import { CheckpointSnapshot, UIState } from '../types/state';
import { restoreCheckpointSnapshot } from './snapshots';
import { GameEvent } from '../types/events';
import { createGameEvent } from '../events/gameEvents';

export interface ResetResult {
  nextState: RootState;
  nextUIState?: UIState;
  event: GameEvent;
  clearedSnapshots?: boolean;
}

export function executeFullReset(): ResetResult {
  const nextState = createInitialRootState();
  const nextUIState: UIState = {
    navigationDrawerOpen: false,
    activeComparisonEvidenceIds: [],
    draftNotes: {},
    scrollRestoration: {},
  };

  const event = createGameEvent(
    'RESET_TRIGGERED',
    { scope: 'full' },
    0
  );

  return {
    nextState,
    nextUIState,
    event,
    clearedSnapshots: true,
  };
}

export function executeChapterReset(
  currentState: RootState,
  targetChapter: number,
  snapshots: CheckpointSnapshot[]
): ResetResult {
  // Find snapshot for the target chapter
  const snapshot = snapshots
    .filter((s) => s.chapter === targetChapter)
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  if (!snapshot) {
    throw new Error(
      `No snapshot found for Chapter ${targetChapter}. Cannot execute Chapter Reset.`
    );
  }

  const nextState = restoreCheckpointSnapshot(currentState, snapshot);
  const event = createGameEvent(
    'RESET_TRIGGERED',
    { scope: 'chapter', targetId: `chapter_${targetChapter}` },
    targetChapter
  );

  return {
    nextState,
    event,
  };
}

export function executePuzzleReset(
  currentState: RootState,
  puzzleId: string
): ResetResult {
  const current = currentState.puzzleState[puzzleId];
  if (!current) {
    throw new Error(`Puzzle "${puzzleId}" not found in current puzzle state.`);
  }

  const nextState: RootState = {
    ...currentState,
    puzzleState: {
      ...currentState.puzzleState,
      [puzzleId]: {
        status: current.status === 'unseen' ? 'unseen' : 'introduced',
        attempts: 0,
        hintLevel: 0,
        bypassed: false,
        workingInput: undefined,
        lastFeedback: undefined,
        solvedAt: undefined,
      },
    },
  };

  const event = createGameEvent(
    'RESET_TRIGGERED',
    { scope: 'puzzle', targetId: puzzleId },
    currentState.gameState.chapter
  );

  return {
    nextState,
    event,
  };
}

export function executeSurfaceReset(_currentUIState: UIState): {
  nextUIState: UIState;
  event: GameEvent;
} {
  const nextUIState: UIState = {
    navigationDrawerOpen: false,
    activeComparisonEvidenceIds: [],
    draftNotes: {},
    scrollRestoration: {},
  };

  const event = createGameEvent(
    'RESET_TRIGGERED',
    { scope: 'surface' },
    0
  );

  return {
    nextUIState,
    event,
  };
}
