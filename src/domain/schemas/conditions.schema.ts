/**
 * Zod Schemas for Condition Trees — The Other Users
 */

import { z } from 'zod';
import { ConditionNode, ConditionPredicate } from '../types/conditions';

export const PuzzleStatusSchema = z.enum([
  'unseen',
  'introduced',
  'active',
  'solved',
  'bypassed',
  'consequentialFailure',
  'revisitable',
]);

export const ConditionPredicateSchema: z.ZodType<ConditionPredicate> = z.discriminatedUnion('type', [
  z.object({ type: z.literal('gateReached'), gateId: z.string().min(1) }),
  z.object({ type: z.literal('chapterReached'), chapter: z.number().int().min(0).max(8) }),
  z.object({ type: z.literal('puzzleStatus'), puzzleId: z.string().min(1), status: PuzzleStatusSchema }),
  z.object({ type: z.literal('flagEquals'), flag: z.string().min(1), value: z.union([z.boolean(), z.string(), z.number()]) }),
  z.object({ type: z.literal('reputationAtLeast'), factionId: z.string().min(1), value: z.number() }),
  z.object({ type: z.literal('relationshipAtLeast'), userId: z.string().min(1), trust: z.number() }),
  z.object({ type: z.literal('itemOwned'), itemId: z.string().min(1) }),
  z.object({ type: z.literal('evidenceMarked'), evidenceId: z.string().min(1) }),
  z.object({ type: z.literal('endingNotSeen'), endingId: z.string().min(1) }),
]);

export const ConditionNodeSchema: z.ZodType<ConditionNode> = z.lazy(() =>
  z.union([
    ConditionPredicateSchema,
    z.object({
      type: z.literal('all'),
      conditions: z.array(ConditionNodeSchema),
    }),
    z.object({
      type: z.literal('any'),
      conditions: z.array(ConditionNodeSchema),
    }),
    z.object({
      type: z.literal('not'),
      condition: ConditionNodeSchema,
    }),
  ])
);
