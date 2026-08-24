/**
 * Condition Tree Evaluator Unit Tests — The Other Users
 */

import { describe, it, expect } from 'vitest';
import { evaluateCondition, ConditionContext } from '../domain/conditions/evaluator';
import { ConditionNode } from '../domain/types/conditions';
import { createInitialRootState } from '../domain/state/actions';

describe('Condition Tree Evaluator', () => {
  const baseContext: ConditionContext = {
    ...createInitialRootState(),
  };

  it('evaluates gateReached predicate accurately', () => {
    const condition: ConditionNode = { type: 'gateReached', gateId: 'G0' };

    expect(evaluateCondition(condition, baseContext).satisfied).toBe(false);

    const unlockedContext: ConditionContext = {
      ...baseContext,
      gameState: {
        ...baseContext.gameState,
        unlockedGates: { G0: true },
      },
    };

    expect(evaluateCondition(condition, unlockedContext).satisfied).toBe(true);
  });

  it('evaluates chapterReached predicate accurately (0-8 scale)', () => {
    const condition: ConditionNode = { type: 'chapterReached', chapter: 3 };

    expect(evaluateCondition(condition, baseContext).satisfied).toBe(false);

    const ch3Context: ConditionContext = {
      ...baseContext,
      gameState: {
        ...baseContext.gameState,
        chapter: 3,
      },
    };

    expect(evaluateCondition(condition, ch3Context).satisfied).toBe(true);
  });

  it('evaluates flagEquals predicate accurately', () => {
    const condition: ConditionNode = {
      type: 'flagEquals',
      flag: 'invitation_accepted',
      value: true,
    };

    expect(evaluateCondition(condition, baseContext).satisfied).toBe(false);

    const flagContext: ConditionContext = {
      ...baseContext,
      gameState: {
        ...baseContext.gameState,
        flags: { invitation_accepted: true },
      },
    };

    expect(evaluateCondition(condition, flagContext).satisfied).toBe(true);
  });

  it('evaluates compound "all", "any", and "not" trees correctly', () => {
    const complexCondition: ConditionNode = {
      type: 'all',
      conditions: [
        { type: 'gateReached', gateId: 'G0' },
        {
          type: 'any',
          conditions: [
            { type: 'reputationAtLeast', factionId: 'plurality_accord', value: 20 },
            { type: 'relationshipAtLeast', userId: 'usr_ilyr', trust: 15 },
          ],
        },
        {
          type: 'not',
          condition: { type: 'flagEquals', flag: 'player_absorbed', value: true },
        },
      ],
    };

    // Missing G0 and reputation
    expect(evaluateCondition(complexCondition, baseContext).satisfied).toBe(false);

    // Provide G0 and relationship trust, but no absorption flag
    const satisfyingContext: ConditionContext = {
      ...baseContext,
      gameState: {
        ...baseContext.gameState,
        unlockedGates: { G0: true },
        flags: {},
      },
      relationshipState: {
        usr_ilyr: {
          trust: 20,
          flags: {},
          outcome: 'normal',
          witnessEligible: true,
        },
      },
    };

    expect(evaluateCondition(complexCondition, satisfyingContext).satisfied).toBe(true);

    // If player_absorbed becomes true, condition fails via "not"
    const absorbedContext: ConditionContext = {
      ...satisfyingContext,
      gameState: {
        ...satisfyingContext.gameState,
        flags: { player_absorbed: true },
      },
    };

    expect(evaluateCondition(complexCondition, absorbedContext).satisfied).toBe(false);
  });
});
