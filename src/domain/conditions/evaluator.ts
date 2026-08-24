/**
 * Pure Condition Tree Evaluator — The Other Users
 * 
 * Pure, deterministic evaluation of ConditionNode ASTs against structured game state.
 */

import { ConditionNode, ConditionPredicate, ConditionResult } from '../types/conditions';
import {
  GameState,
  PlayerProfileState,
  PuzzlePerState,
  RelationshipPerUser,
  EvidencePerItem,
  InventoryPerItem,
} from '../types/state';
import { FactionId } from '../types/content';

export interface ConditionContext {
  gameState: GameState;
  playerProfile?: PlayerProfileState;
  puzzleState?: Record<string, PuzzlePerState>;
  relationshipState?: Record<string, RelationshipPerUser>;
  reputationState?: Record<FactionId, number>;
  evidenceState?: Record<string, EvidencePerItem>;
  inventoryState?: Record<string, InventoryPerItem>;
  seenEndingIds?: string[];
}

export function evaluatePredicate(predicate: ConditionPredicate, ctx: ConditionContext): boolean {
  switch (predicate.type) {
    case 'gateReached':
      return ctx.gameState.unlockedGates[predicate.gateId] === true;

    case 'chapterReached':
      return ctx.gameState.chapter >= predicate.chapter;

    case 'puzzleStatus':
      return ctx.puzzleState?.[predicate.puzzleId]?.status === predicate.status;

    case 'flagEquals':
      return ctx.gameState.flags[predicate.flag] === predicate.value;

    case 'reputationAtLeast':
      return (ctx.reputationState?.[predicate.factionId as FactionId] ?? 0) >= predicate.value;

    case 'relationshipAtLeast':
      return (ctx.relationshipState?.[predicate.userId]?.trust ?? 0) >= predicate.trust;

    case 'itemOwned':
      return (
        ctx.inventoryState?.[predicate.itemId]?.owned === true &&
        !ctx.inventoryState?.[predicate.itemId]?.consumed
      );

    case 'evidenceMarked':
      return ctx.evidenceState?.[predicate.evidenceId]?.marked === true;

    case 'endingNotSeen':
      return !ctx.seenEndingIds?.includes(predicate.endingId);

    default:
      return false;
  }
}

export function evaluateCondition(condition: ConditionNode, ctx: ConditionContext): ConditionResult {
  if (!condition) {
    return { satisfied: true };
  }

  switch (condition.type) {
    case 'all': {
      const failing: ConditionPredicate[] = [];
      let allSatisfied = true;
      for (const child of condition.conditions) {
        const res = evaluateCondition(child, ctx);
        if (!res.satisfied) {
          allSatisfied = false;
          if (res.failingPredicates) failing.push(...res.failingPredicates);
        }
      }
      return {
        satisfied: allSatisfied,
        failingPredicates: failing.length > 0 ? failing : undefined,
      };
    }

    case 'any': {
      if (condition.conditions.length === 0) {
        return { satisfied: false, reason: 'Empty "any" condition array' };
      }
      for (const child of condition.conditions) {
        const res = evaluateCondition(child, ctx);
        if (res.satisfied) {
          return { satisfied: true };
        }
      }
      return {
        satisfied: false,
        reason: 'None of the "any" conditions were satisfied',
      };
    }

    case 'not': {
      const res = evaluateCondition(condition.condition, ctx);
      return {
        satisfied: !res.satisfied,
        reason: res.satisfied ? 'Condition was true when "not" expected false' : undefined,
      };
    }

    default: {
      const satisfied = evaluatePredicate(condition, ctx);
      return {
        satisfied,
        failingPredicates: satisfied ? undefined : [condition],
      };
    }
  }
}
