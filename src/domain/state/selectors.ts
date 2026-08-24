/**
 * State Selectors & Condition Context Builder — The Other Users
 */

import { GameStoreState } from './useGameStore';
import { ConditionContext } from '../conditions/evaluator';
import { FactionId } from '../types/content';

export const selectConditionContext = (state: GameStoreState): ConditionContext => ({
  gameState: state.gameState,
  playerProfile: state.playerProfile,
  puzzleState: state.puzzleState,
  relationshipState: state.relationshipState,
  reputationState: state.reputationState,
  evidenceState: state.evidenceState,
  inventoryState: state.inventoryState,
  seenEndingIds: state.seenEndingIds,
});

export const selectCurrentChapter = (state: GameStoreState) => state.gameState.chapter;

export const selectIsGateUnlocked = (gateId: string) => (state: GameStoreState) =>
  state.gameState.unlockedGates[gateId] === true;

export const selectPuzzle = (puzzleId: string) => (state: GameStoreState) =>
  state.puzzleState[puzzleId];

export const selectRelationship = (userId: string) => (state: GameStoreState) =>
  state.relationshipState[userId];

export const selectReputation = (factionId: FactionId) => (state: GameStoreState) =>
  state.reputationState[factionId] ?? 0;

export const selectEvidence = (evidenceId: string) => (state: GameStoreState) =>
  state.evidenceState[evidenceId];

export const selectInventoryItem = (itemId: string) => (state: GameStoreState) =>
  state.inventoryState[itemId];
