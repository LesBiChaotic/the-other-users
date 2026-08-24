import { describe, expect, it } from 'vitest';
import { CHAPTER_IDS, PUZZLE_IDS } from '../domain/canon/ids';
import { MOURNINGSTAR_MESSAGES, STORY_CHAPTERS } from '../domain/canon/storyRegistry';
import { commitNarrativeChoiceReducer, NARRATIVE_CHOICES, setMessageStateReducer } from '../domain/narrative/consequenceEngine';
import { createInitialRootState } from '../domain/state/actions';

describe('S0–S1 narrative foundation', () => {
  it('locks nine chapters and all eighteen primary puzzles to stable IDs', () => {
    expect(CHAPTER_IDS).toHaveLength(9);
    expect(PUZZLE_IDS).toHaveLength(18);
    expect(STORY_CHAPTERS.map((chapter) => chapter.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    expect(new Set(STORY_CHAPTERS.flatMap((chapter) => chapter.requiredPuzzleIds)).size).toBe(18);
  });

  it('keeps all three MOURNINGSTAR sources distinct and scheduled', () => {
    expect(new Set(MOURNINGSTAR_MESSAGES.map((message) => message.source))).toEqual(
      new Set(['authentic_ilyr', 'common_body_imitator', 'permission_error'])
    );
    expect(MOURNINGSTAR_MESSAGES.some((message) => message.chapter === 0 && message.source === 'permission_error')).toBe(true);
    expect(MOURNINGSTAR_MESSAGES.some((message) => message.chapter === 6 && message.source === 'common_body_imitator')).toBe(true);
  });

  it('commits the cautious Chapter 1 route without forcing an accusation', () => {
    const initial = createInitialRootState();
    const result = commitNarrativeChoiceReducer(initial, 'choice_ch01_photograph_judgment', 'ch01_not_enough_evidence');

    expect(result.nextState.narrativeState.choices.choice_ch01_photograph_judgment).toBe('ch01_not_enough_evidence');
    expect(result.nextState.gameState.flags.ch01_account_history_unlocked).toBe(true);
    expect(result.nextState.relationshipState.usr_nvr).toBeUndefined();
    expect(result.events[0].type).toBe('NARRATIVE_CHOICE_COMMITTED');
  });

  it('writes social, evidence, and antagonist-learning consequences atomically', () => {
    const initial = createInitialRootState();
    const result = commitNarrativeChoiceReducer(initial, 'choice_ch01_photograph_judgment', 'ch01_trust_nvr_accuse_auntie');

    expect(result.nextState.relationshipState.usr_nvr).toMatchObject({ trust: 20, outcome: 'protected', witnessEligible: true });
    expect(result.nextState.evidenceState['EV-003'].discovered).toBe(true);
    expect(result.nextState.narrativeState.commonBodyCapabilities).toContain('routine');
    expect(result.events.map((event) => event.type)).toEqual(['NARRATIVE_CHOICE_COMMITTED', 'COMMON_BODY_LEARNED']);
  });

  it('allows deferred judgment to be revised but prevents silent committed-choice replacement', () => {
    const initial = createInitialRootState();
    const deferred = commitNarrativeChoiceReducer(initial, 'choice_ch01_photograph_judgment', 'ch01_not_enough_evidence').nextState;
    const revised = commitNarrativeChoiceReducer(deferred, 'choice_ch01_photograph_judgment', 'ch01_trust_nvr_accuse_auntie').nextState;
    expect(revised.relationshipState.usr_nvr.trust).toBe(20);
    expect(() => commitNarrativeChoiceReducer(revised, 'choice_ch01_photograph_judgment', 'ch01_accuse_nvr')).toThrow(/already been committed/);
  });

  it('persists read state for source-authentication messages', () => {
    const initial = createInitialRootState();
    const result = setMessageStateReducer(initial, 'MS-C00', 'read');
    expect(result.nextState.narrativeState.messageState['MS-C00']).toEqual({ delivered: true, read: true });
    expect(result.event?.type).toBe('MESSAGE_READ');
  });

  it('declares later consequence surfaces for every implemented narrative choice', () => {
    expect(NARRATIVE_CHOICES.every((choice) => choice.laterSurfaces.length >= 3)).toBe(true);
  });
});

