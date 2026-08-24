/**
 * GameEvent Type Definitions — The Other Users
 * 
 * Single source of truth for all GameEvent discriminated unions, event names, and payload shapes.
 */

import { PuzzleStatus } from './conditions';

export type GameEventSource = 'user_action' | 'puzzle_engine' | 'system' | 'route_guard' | 'migration';

export interface BaseGameEvent {
  id: string;
  timestamp: number; // relative playthrough timestamp or epoch
  source: GameEventSource;
  chapter: number;
}

export type GameEvent =
  | (BaseGameEvent & {
      type: 'APP_BOOTED';
      payload: { version: string; schemaVersion: number };
    })
  | (BaseGameEvent & {
      type: 'STATE_HYDRATED';
      payload: { playthroughId: string; contentVersion: string };
    })
  | (BaseGameEvent & {
      type: 'GATE_UNLOCKED';
      payload: { gateId: string; priorState: boolean };
    })
  | (BaseGameEvent & {
      type: 'CHAPTER_TRANSITIONED';
      payload: { fromChapter: number; toChapter: number };
    })
  | (BaseGameEvent & {
      type: 'FLAG_SET';
      payload: { flag: string; oldValue: boolean | string | number | undefined; newValue: boolean | string | number };
    })
  | (BaseGameEvent & {
      type: 'PROFILE_UPDATED';
      payload: { field: string; oldValue: unknown; newValue: unknown };
    })
  | (BaseGameEvent & {
      type: 'PUZZLE_STATUS_CHANGED';
      payload: { puzzleId: string; oldStatus: PuzzleStatus; newStatus: PuzzleStatus; attempts: number; hintLevel: number };
    })
  | (BaseGameEvent & {
      type: 'PUZZLE_HINT_REQUESTED';
      payload: { puzzleId: string; hintLevel: number };
    })
  | (BaseGameEvent & {
      type: 'EVIDENCE_DISCOVERED';
      payload: { evidenceId: string; provenance: string };
    })
  | (BaseGameEvent & {
      type: 'EVIDENCE_MARKED';
      payload: { evidenceId: string; marked: boolean };
    })
  | (BaseGameEvent & {
      type: 'EVIDENCE_COMMITTED';
      payload: { evidenceId: string; targetCaseId: string; interpretation: string };
    })
  | (BaseGameEvent & {
      type: 'RELATIONSHIP_CHANGED';
      payload: { userId: string; oldTrust: number; newTrust: number; note?: string };
    })
  | (BaseGameEvent & {
      type: 'USER_OUTCOME_SET';
      payload: { userId: string; outcome: 'normal' | 'suspected' | 'accused' | 'protected' | 'replaced' | 'rescued' | 'lost' | 'absorbed' };
    })
  | (BaseGameEvent & {
      type: 'REPUTATION_CHANGED';
      payload: { factionId: string; oldScore: number; newScore: number };
    })
  | (BaseGameEvent & {
      type: 'NARRATIVE_CHOICE_COMMITTED';
      payload: { choiceId: string; optionId: string; priorOptionId?: string };
    })
  | (BaseGameEvent & {
      type: 'COMMON_BODY_LEARNED';
      payload: { capability: string; sourceChoiceId?: string };
    })
  | (BaseGameEvent & {
      type: 'MESSAGE_DELIVERED';
      payload: { messageId: string; threadId: string; senderSource: 'authentic_ilyr' | 'common_body_imitator' | 'permission_error' | 'user' | 'faction' };
    })
  | (BaseGameEvent & {
      type: 'MESSAGE_READ';
      payload: { messageId: string };
    })
  | (BaseGameEvent & {
      type: 'MESSAGE_REPLIED';
      payload: { messageId: string; replyId: string };
    })
  | (BaseGameEvent & {
      type: 'ITEM_ACQUIRED';
      payload: { itemId: string; provenance: string; cost?: string };
    })
  | (BaseGameEvent & {
      type: 'ITEM_CONSUMED';
      payload: { itemId: string; target: string };
    })
  | (BaseGameEvent & {
      type: 'SNAPSHOT_RECORDED';
      payload: { snapshotId: string; chapter: number; reason: string };
    })
  | (BaseGameEvent & {
      type: 'RESET_TRIGGERED';
      payload: { scope: 'full' | 'chapter' | 'puzzle' | 'surface'; targetId?: string };
    })
  | (BaseGameEvent & {
      type: 'ENDING_COMMITTED';
      payload: { endingId: string; terms: Record<string, unknown> };
    });

export type GameEventType = GameEvent['type'];
