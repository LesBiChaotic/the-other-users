/**
 * Declarative Condition AST Types
 * 
 * Conditions are pure JSON data structures evaluated without eval or arbitrary JSX strings.
 */

export type PuzzleStatus = 'unseen' | 'introduced' | 'active' | 'solved' | 'bypassed' | 'consequentialFailure' | 'revisitable';

export type ConditionPredicate =
  | { type: 'gateReached'; gateId: string }
  | { type: 'chapterReached'; chapter: number }
  | { type: 'puzzleStatus'; puzzleId: string; status: PuzzleStatus }
  | { type: 'flagEquals'; flag: string; value: boolean | string | number }
  | { type: 'reputationAtLeast'; factionId: string; value: number }
  | { type: 'relationshipAtLeast'; userId: string; trust: number }
  | { type: 'itemOwned'; itemId: string }
  | { type: 'evidenceMarked'; evidenceId: string }
  | { type: 'endingNotSeen'; endingId: string };

export type ConditionNode =
  | ConditionPredicate
  | { type: 'all'; conditions: ConditionNode[] }
  | { type: 'any'; conditions: ConditionNode[] }
  | { type: 'not'; condition: ConditionNode };

export type ConditionResult = {
  satisfied: boolean;
  reason?: string;
  failingPredicates?: ConditionPredicate[];
};
