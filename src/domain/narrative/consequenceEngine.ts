import { produce } from 'immer';
import { createGameEvent } from '../events/gameEvents';
import { GameEvent } from '../types/events';
import { UserOutcome } from '../types/state';
import { RootState } from '../state/actions';
import { MOURNINGSTAR_MESSAGES } from '../canon/storyRegistry';

export interface NarrativeOptionWrites {
  flags?: Record<string, boolean | string | number>;
  profileDeltas?: Partial<Record<'exposureScore' | 'legibilityScore' | 'pluralityScore' | 'complicityScore' | 'ilyrTrustScore', number>>;
  relationships?: Array<{ userId: string; trustDelta: number; outcome?: UserOutcome; witnessEligible?: boolean }>;
  discoverEvidenceIds?: string[];
  commonBodyCapability?: string;
}

export interface NarrativeChoiceOption {
  id: string;
  label: string;
  consequencePreview: string;
  writes: NarrativeOptionWrites;
}

export interface NarrativeChoiceDefinition {
  id: string;
  chapter: number;
  prompt: string;
  revisableFrom?: string[];
  laterSurfaces: string[];
  options: NarrativeChoiceOption[];
}

export const NARRATIVE_CHOICES: NarrativeChoiceDefinition[] = [
  {
    id: 'choice_ch01_photograph_judgment',
    chapter: 1,
    prompt: 'Who does the evidence justify acting against?',
    revisableFrom: ['ch01_not_enough_evidence'],
    laterSurfaces: ['Ch2 inbox', 'AUNTIE_STATIC archive', 'Ch8 witness pool'],
    options: [
      {
        id: 'ch01_trust_nvr_accuse_auntie',
        label: 'Protect neverlookstraight; flag current AUNTIE_STATIC',
        consequencePreview: 'The observer remains in contact. The moderator account is placed under review.',
        writes: {
          flags: { ch01_auntie_case_open: true, ch01_neverlookstraight_protected: true },
          relationships: [
            { userId: 'usr_nvr', trustDelta: 20, outcome: 'protected', witnessEligible: true },
            { userId: 'usr_sta', trustDelta: -10, outcome: 'suspected' },
          ],
          discoverEvidenceIds: ['EV-002', 'EV-003'],
          commonBodyCapability: 'routine',
        },
      },
      {
        id: 'ch01_accuse_nvr',
        label: 'Accuse neverlookstraight',
        consequencePreview: 'The observer withdraws. An apology route remains available if later evidence changes your judgment.',
        writes: {
          flags: { ch01_neverlookstraight_accused: true, o01_apology_available: true },
          profileDeltas: { complicityScore: 1 },
          relationships: [{ userId: 'usr_nvr', trustDelta: -25, outcome: 'accused', witnessEligible: false }],
          discoverEvidenceIds: ['EV-002'],
          commonBodyCapability: 'routine',
        },
      },
      {
        id: 'ch01_not_enough_evidence',
        label: 'I do not know yet',
        consequencePreview: 'No accusation is recorded. The case remains open and additional account history becomes available.',
        writes: {
          flags: { ch01_case_deferred: true, ch01_account_history_unlocked: true },
          discoverEvidenceIds: ['EV-002'],
        },
      },
    ],
  },
];

export function commitNarrativeChoiceReducer(
  state: RootState,
  choiceId: string,
  optionId: string
): { nextState: RootState; events: GameEvent[] } {
  const definition = NARRATIVE_CHOICES.find((choice) => choice.id === choiceId);
  if (!definition) throw new Error(`Unknown narrative choice: ${choiceId}`);
  const option = definition.options.find((candidate) => candidate.id === optionId);
  if (!option) throw new Error(`Unknown option "${optionId}" for narrative choice "${choiceId}".`);

  const priorOptionId = state.narrativeState.choices[choiceId];
  if (priorOptionId === optionId) return { nextState: state, events: [] };
  if (priorOptionId && !definition.revisableFrom?.includes(priorOptionId)) {
    throw new Error(`Narrative choice "${choiceId}" has already been committed as "${priorOptionId}".`);
  }

  const nextState = produce(state, (draft) => {
    draft.narrativeState.choices[choiceId] = optionId;

    for (const [flag, value] of Object.entries(option.writes.flags ?? {})) {
      draft.gameState.flags[flag] = value;
    }
    for (const [field, delta] of Object.entries(option.writes.profileDeltas ?? {})) {
      (draft.playerProfile as any)[field] += delta;
    }
    for (const write of option.writes.relationships ?? []) {
      const relationship = draft.relationshipState[write.userId] ?? {
        trust: 0, flags: {}, outcome: 'normal' as const, witnessEligible: false,
      };
      relationship.trust = Math.max(-100, Math.min(100, relationship.trust + write.trustDelta));
      if (write.outcome) relationship.outcome = write.outcome;
      if (write.witnessEligible !== undefined) relationship.witnessEligible = write.witnessEligible;
      draft.relationshipState[write.userId] = relationship;
    }
    for (const evidenceId of option.writes.discoverEvidenceIds ?? []) {
      const evidence = draft.evidenceState[evidenceId] ?? {
        discovered: false, inspected: false, marked: false, compared: false, committedToCases: [],
      };
      evidence.discovered = true;
      draft.evidenceState[evidenceId] = evidence;
    }
    const capability = option.writes.commonBodyCapability;
    if (capability && !draft.narrativeState.commonBodyCapabilities.includes(capability)) {
      draft.narrativeState.commonBodyCapabilities.push(capability);
    }
  });

  const events: GameEvent[] = [
    createGameEvent('NARRATIVE_CHOICE_COMMITTED', { choiceId, optionId, priorOptionId }, definition.chapter),
  ];
  if (option.writes.commonBodyCapability && !state.narrativeState.commonBodyCapabilities.includes(option.writes.commonBodyCapability)) {
    events.push(createGameEvent('COMMON_BODY_LEARNED', { capability: option.writes.commonBodyCapability, sourceChoiceId: choiceId }, definition.chapter, 'system'));
  }
  return { nextState, events };
}

export function setMessageStateReducer(
  state: RootState,
  messageId: string,
  action: 'deliver' | 'read' | 'reply',
  replyId?: string
): { nextState: RootState; event?: GameEvent } {
  const current = state.narrativeState.messageState[messageId] ?? { delivered: false, read: false };
  if (action === 'deliver' && current.delivered) return { nextState: state };
  if (action === 'read' && current.read) return { nextState: state };
  if (action === 'reply' && current.replyId === replyId) return { nextState: state };

  const nextState = produce(state, (draft) => {
    const message = draft.narrativeState.messageState[messageId] ?? { delivered: false, read: false };
    if (action === 'deliver') message.delivered = true;
    if (action === 'read') { message.delivered = true; message.read = true; }
    if (action === 'reply') { message.delivered = true; message.read = true; message.replyId = replyId; }
    draft.narrativeState.messageState[messageId] = message;
  });

  const senderSource = messageId === 'MSG-001'
    ? 'authentic_ilyr'
    : MOURNINGSTAR_MESSAGES.find((message) => message.id === messageId)?.source ?? 'permission_error';
  const event = action === 'deliver'
    ? createGameEvent('MESSAGE_DELIVERED', { messageId, threadId: 'thread_mourningstar', senderSource }, state.gameState.chapter, 'system')
    : action === 'read'
      ? createGameEvent('MESSAGE_READ', { messageId }, state.gameState.chapter)
      : createGameEvent('MESSAGE_REPLIED', { messageId, replyId: replyId ?? 'no_reply' }, state.gameState.chapter);
  return { nextState, event };
}
