/**
 * Main Game Store (Zustand) — The Other Users
 * 
 * Binds typed state reducers, deterministic GameEvents, snapshot management,
 * and save persistence to React.
 */

import { create } from 'zustand';
import {
  RootState,
  createInitialRootState,
  unlockGateReducer,
  advanceChapterReducer,
  setFlagReducer,
  updateProfileReducer,
  updatePuzzleStatusReducer,
  requestPuzzleHintReducer,
  discoverEvidenceReducer,
  markEvidenceReducer,
  changeRelationshipReducer,
  changeReputationReducer,
  acquireItemReducer,
  commitEndingReducer,
} from './actions';
import { CheckpointSnapshot, PlayerProfileState, SaveEnvelope, UIState, UserOutcome } from '../types/state';
import { FactionId } from '../types/content';
import { PuzzleStatus } from '../types/conditions';
import { EventLog } from '../events/eventLog';
import { createCheckpointSnapshot } from './snapshots';
import {
  executeFullReset,
  executeChapterReset,
  executePuzzleReset,
  executeSurfaceReset,
} from './resetManager';
import { saveManager } from '../persistence/saveManager';
import { CURRENT_SCHEMA_VERSION } from '../persistence/migrations';
import { useSettingsStore } from './settingsStore';

export interface GameStoreState extends RootState {
  playthroughId: string;
  createdAt: number;
  updatedAt: number;
  snapshots: CheckpointSnapshot[];
  eventLog: EventLog;
  uiState: UIState;
  isHydrated: boolean;
  hydrationError: string | null;

  // Typed Action Dispatchers
  hydrate: () => Promise<void>;
  unlockGate: (gateId: string) => void;
  advanceChapter: (nextChapter: number, snapshotLabel?: string) => void;
  setFlag: (flag: string, value: boolean | string | number) => void;
  updateProfile: (updates: Partial<PlayerProfileState>) => void;
  setPuzzleStatus: (puzzleId: string, status: PuzzleStatus, workingInput?: unknown, lastFeedback?: string) => void;
  requestPuzzleHint: (puzzleId: string) => void;
  discoverEvidence: (evidenceId: string, provenance: string) => void;
  markEvidence: (evidenceId: string, marked: boolean) => void;
  changeRelationship: (userId: string, deltaTrust: number, outcome?: UserOutcome, witnessEligible?: boolean) => void;
  changeReputation: (factionId: FactionId, deltaScore: number) => void;
  acquireItem: (itemId: string, permanence: 'permanent' | 'consumed_on_use' | 'escrowed', provenance: string) => void;
  commitEnding: (endingId: string, terms: Record<string, unknown>) => void;

  // UI ephemeral actions
  setNavigationDrawerOpen: (open: boolean) => void;
  toggleEvidenceComparison: (evidenceId: string) => void;
  setDraftNote: (key: string, note: string) => void;

  // Multi-tier reset actions
  resetFull: () => Promise<void>;
  resetChapter: (targetChapter: number) => void;
  resetPuzzle: (puzzleId: string) => void;
  resetSurface: () => void;
}

function generatePlaythroughId(): string {
  return `pt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  ...createInitialRootState(),
  playthroughId: generatePlaythroughId(),
  createdAt: Date.now(),
  updatedAt: Date.now(),
  snapshots: [],
  eventLog: new EventLog(),
  uiState: {
    navigationDrawerOpen: false,
    activeComparisonEvidenceIds: [],
    draftNotes: {},
    scrollRestoration: {},
  },
  isHydrated: false,
  hydrationError: null,

  hydrate: async () => {
    try {
      const result = await saveManager.loadActiveSave();
      if (result.envelope) {
        const env = result.envelope;
        set({
          gameState: env.gameState,
          playerProfile: env.playerProfile,
          puzzleState: env.puzzleState,
          relationshipState: env.relationshipState,
          reputationState: env.reputationState,
          evidenceState: env.evidenceState,
          inventoryState: env.inventoryState,
          snapshots: env.snapshots || [],
          eventLog: new EventLog(env.eventHistory || []),
          uiState: env.uiState || {
            navigationDrawerOpen: false,
            activeComparisonEvidenceIds: [],
            draftNotes: {},
            scrollRestoration: {},
          },
          playthroughId: env.playthroughId,
          createdAt: env.createdAt,
          updatedAt: env.updatedAt,
          isHydrated: true,
          hydrationError: result.error || null,
        });
      } else {
        // Fresh start: capture initial Chapter 0 snapshot
        const rootState = createInitialRootState();
        const initialSnapshot = createCheckpointSnapshot(rootState, 'Chapter 0 Inception');
        set({
          ...rootState,
          snapshots: [initialSnapshot],
          eventLog: new EventLog(),
          uiState: {
            navigationDrawerOpen: false,
            activeComparisonEvidenceIds: [],
            draftNotes: {},
            scrollRestoration: {},
          },
          isHydrated: true,
          hydrationError: null,
        });
      }
    } catch (e: any) {
      set({
        isHydrated: true,
        hydrationError: e?.message || 'Failed to hydrate game state from persistence',
      });
    }
  },

  unlockGate: (gateId) => {
    const { nextState, event } = unlockGateReducer(get(), gateId);
    if (event) {
      get().eventLog.record(event);
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  advanceChapter: (nextChapter, snapshotLabel) => {
    // Community chapters can be revisited and Chapters 5–6 may be completed in either order.
    // Treat already-reached chapter requests as idempotent at the UI dispatcher boundary while
    // preserving the reducer's strict backward-transition invariant for state restoration code.
    if (nextChapter <= get().gameState.chapter) return;
    const { nextState, event } = advanceChapterReducer(get(), nextChapter);
    if (event) {
      get().eventLog.record(event);
      // Capture snapshot before/at chapter advance
      const snapshot = createCheckpointSnapshot(
        nextState,
        snapshotLabel || `Chapter ${nextChapter} Entry`
      );
      const updatedSnapshots = [...get().snapshots, snapshot];
      set({
        ...nextState,
        snapshots: updatedSnapshots,
        updatedAt: Date.now(),
      });
      saveManager.saveSnapshot(snapshot, get().playthroughId).catch(console.error);
      triggerAutosave(get());
    }
  },

  setFlag: (flag, value) => {
    const { nextState, event } = setFlagReducer(get(), flag, value);
    if (event) {
      get().eventLog.record(event);
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  updateProfile: (updates) => {
    const { nextState, events } = updateProfileReducer(get(), updates);
    if (events.length > 0) {
      events.forEach((evt) => get().eventLog.record(evt));
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  setPuzzleStatus: (puzzleId, status, workingInput, lastFeedback) => {
    const { nextState, event } = updatePuzzleStatusReducer(
      get(),
      puzzleId,
      status,
      workingInput,
      lastFeedback
    );
    if (event) {
      get().eventLog.record(event);
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  requestPuzzleHint: (puzzleId) => {
    const { nextState, event } = requestPuzzleHintReducer(get(), puzzleId);
    if (event) {
      get().eventLog.record(event);
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  discoverEvidence: (evidenceId, provenance) => {
    const { nextState, event } = discoverEvidenceReducer(get(), evidenceId, provenance);
    if (event) {
      get().eventLog.record(event);
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  markEvidence: (evidenceId, marked) => {
    const { nextState, event } = markEvidenceReducer(get(), evidenceId, marked);
    if (event) {
      get().eventLog.record(event);
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  changeRelationship: (userId, deltaTrust, outcome, witnessEligible) => {
    const { nextState, events } = changeRelationshipReducer(
      get(),
      userId,
      deltaTrust,
      outcome,
      witnessEligible
    );
    if (events.length > 0) {
      events.forEach((evt) => get().eventLog.record(evt));
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  changeReputation: (factionId, deltaScore) => {
    const { nextState, event } = changeReputationReducer(get(), factionId, deltaScore);
    if (event) {
      get().eventLog.record(event);
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  acquireItem: (itemId, permanence, provenance) => {
    const { nextState, event } = acquireItemReducer(get(), itemId, permanence, provenance);
    if (event) {
      get().eventLog.record(event);
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  commitEnding: (endingId, terms) => {
    const { nextState, event } = commitEndingReducer(get(), endingId, terms);
    if (event) {
      get().eventLog.record(event);
      set({ ...nextState, updatedAt: Date.now() });
      triggerAutosave(get());
    }
  },

  setNavigationDrawerOpen: (open) => {
    set((state) => ({
      uiState: {
        ...state.uiState,
        navigationDrawerOpen: open,
      },
    }));
  },

  toggleEvidenceComparison: (evidenceId) => {
    set((state) => {
      const current = state.uiState.activeComparisonEvidenceIds;
      const next = current.includes(evidenceId)
        ? current.filter((id) => id !== evidenceId)
        : [...current, evidenceId];
      return {
        uiState: {
          ...state.uiState,
          activeComparisonEvidenceIds: next,
        },
      };
    });
  },

  setDraftNote: (key, note) => {
    set((state) => ({
      uiState: {
        ...state.uiState,
        draftNotes: {
          ...state.uiState.draftNotes,
          [key]: note,
        },
      },
    }));
  },

  resetFull: async () => {
    await saveManager.wipeAllPersistence();
    const { nextState, nextUIState, event } = executeFullReset();
    const newPlaythrough = generatePlaythroughId();
    const log = new EventLog();
    log.record(event);

    const initialSnapshot = createCheckpointSnapshot(nextState, 'Chapter 0 Inception');

    set({
      ...nextState,
      playthroughId: newPlaythrough,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      snapshots: [initialSnapshot],
      eventLog: log,
      uiState: nextUIState!,
    });

    triggerAutosave(get());
  },

  resetChapter: (targetChapter) => {
    const { nextState, event } = executeChapterReset(get(), targetChapter, get().snapshots);
    get().eventLog.record(event);
    set({ ...nextState, updatedAt: Date.now() });
    triggerAutosave(get());
  },

  resetPuzzle: (puzzleId) => {
    const { nextState, event } = executePuzzleReset(get(), puzzleId);
    get().eventLog.record(event);
    set({ ...nextState, updatedAt: Date.now() });
    triggerAutosave(get());
  },

  resetSurface: () => {
    const { nextUIState, event } = executeSurfaceReset(get().uiState);
    get().eventLog.record(event);
    set({ uiState: nextUIState, updatedAt: Date.now() });
  },
}));

function triggerAutosave(store: GameStoreState) {
  const settings = useSettingsStore.getState();
  const envelope: SaveEnvelope = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    contentVersion: '0.1.0',
    playthroughId: store.playthroughId,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
    gameState: store.gameState,
    playerProfile: store.playerProfile,
    puzzleState: store.puzzleState,
    relationshipState: store.relationshipState,
    reputationState: store.reputationState,
    evidenceState: store.evidenceState,
    inventoryState: store.inventoryState,
    settingsState: {
      theme: settings.theme,
      fontMode: settings.fontMode ?? 'palinode',
      textScale: settings.textScale,
      reducedMotion: settings.reducedMotion,
      highContrast: settings.highContrast,
      soundEnabled: settings.soundEnabled,
      transcriptsEnabled: settings.transcriptsEnabled,
      untimedPuzzles: settings.untimedPuzzles,
      contentWarningsEnabled: settings.contentWarningsEnabled,
    },
    uiState: store.uiState,
    eventHistory: store.eventLog.getAll(),
    snapshots: store.snapshots,
  };

  saveManager.scheduleAutosave(envelope);
}
