/**
 * Checkpoint Snapshot Manager — The Other Users
 * 
 * Captures and restores immutable snapshots of game state at chapter gates and key milestones.
 */

import { CheckpointSnapshot } from '../types/state';
import { RootState } from './actions';

export function createCheckpointSnapshot(
  state: RootState,
  label: string
): CheckpointSnapshot {
  return {
    id: `snap_ch${state.gameState.chapter}_${Date.now()}`,
    chapter: state.gameState.chapter,
    timestamp: Date.now(),
    label,
    gameState: JSON.parse(JSON.stringify(state.gameState)),
    playerProfile: JSON.parse(JSON.stringify(state.playerProfile)),
    puzzleState: JSON.parse(JSON.stringify(state.puzzleState)),
    relationshipState: JSON.parse(JSON.stringify(state.relationshipState)),
    reputationState: JSON.parse(JSON.stringify(state.reputationState)),
    evidenceState: JSON.parse(JSON.stringify(state.evidenceState)),
    inventoryState: JSON.parse(JSON.stringify(state.inventoryState)),
    narrativeState: JSON.parse(JSON.stringify(state.narrativeState)),
  };
}

export function restoreCheckpointSnapshot(
  currentState: RootState,
  snapshot: CheckpointSnapshot
): RootState {
  return {
    ...currentState,
    gameState: JSON.parse(JSON.stringify(snapshot.gameState)),
    playerProfile: JSON.parse(JSON.stringify(snapshot.playerProfile)),
    puzzleState: JSON.parse(JSON.stringify(snapshot.puzzleState)),
    relationshipState: JSON.parse(JSON.stringify(snapshot.relationshipState)),
    reputationState: JSON.parse(JSON.stringify(snapshot.reputationState)),
    evidenceState: JSON.parse(JSON.stringify(snapshot.evidenceState)),
    inventoryState: JSON.parse(JSON.stringify(snapshot.inventoryState)),
    narrativeState: JSON.parse(JSON.stringify(snapshot.narrativeState)),
  };
}
