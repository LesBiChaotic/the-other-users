/**
 * Game and Persistence State Interfaces — The Other Users
 */

import { PuzzleStatus } from './conditions';
import { FactionId } from './content';
import { GameEvent } from './events';

export type UserOutcome = 'normal' | 'suspected' | 'accused' | 'protected' | 'replaced' | 'rescued' | 'lost' | 'absorbed';

export interface GameState {
  chapter: number; // Canonical: Chapter 0 to Chapter 8 (9 chapters total)
  unlockedGates: Record<string, boolean>;
  flags: Record<string, boolean | string | number>;
  feedSeenIds: string[];
}

export interface PlayerProfileState {
  handle: string;
  pronouns: string;
  provisionalSpecies: string;
  occupancyCount: number;
  thresholdTolerance: string;
  memoryDiet: string;
  mimicryRisk: string;
  witnessedShape: string;
  exposureScore: number;
  legibilityScore: number;
  pluralityScore: number;
  complicityScore: number;
  ilyrTrustScore: number;
  revisions: Array<{
    chapter: number;
    timestamp: number;
    summary: string;
    traits: Record<string, string>;
  }>;
}

export interface PuzzlePerState {
  status: PuzzleStatus;
  attempts: number;
  hintLevel: number; // 0 to 4
  bypassed: boolean;
  workingInput?: unknown;
  lastFeedback?: string;
  solvedAt?: number;
}

export interface RelationshipPerUser {
  trust: number;
  flags: Record<string, boolean>;
  outcome: UserOutcome;
  witnessEligible: boolean;
}

export interface EvidencePerItem {
  discovered: boolean;
  inspected: boolean;
  marked: boolean;
  compared: boolean;
  committedToCases: string[];
  userNotes?: string;
}

export interface InventoryPerItem {
  owned: boolean;
  acquiredAtChapter: number;
  consumed: boolean;
  permanence: 'permanent' | 'consumed_on_use' | 'escrowed';
}

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  fontMode?: 'palinode' | 'device';
  textScale: number; // 100 to 200 percent
  reducedMotion: boolean;
  highContrast: boolean;
  soundEnabled: boolean;
  transcriptsEnabled: boolean;
  untimedPuzzles: boolean;
  contentWarningsEnabled: boolean;
}

export interface UIState {
  navigationDrawerOpen: boolean;
  activeComparisonEvidenceIds: string[];
  draftNotes: Record<string, string>;
  scrollRestoration: Record<string, number>;
}

export interface MessagePerState {
  delivered: boolean;
  read: boolean;
  replyId?: string;
}

export interface NarrativeState {
  choices: Record<string, string>;
  completedChapterIds: string[];
  commonBodyCapabilities: string[];
  messageState: Record<string, MessagePerState>;
}

export interface CheckpointSnapshot {
  id: string;
  chapter: number;
  timestamp: number;
  label: string;
  gameState: GameState;
  playerProfile: PlayerProfileState;
  puzzleState: Record<string, PuzzlePerState>;
  relationshipState: Record<string, RelationshipPerUser>;
  reputationState: Record<FactionId, number>;
  evidenceState: Record<string, EvidencePerItem>;
  inventoryState: Record<string, InventoryPerItem>;
  narrativeState: NarrativeState;
}

export interface SaveEnvelope {
  schemaVersion: number; // Integer incremented on breaking migrations
  contentVersion: string;
  playthroughId: string;
  createdAt: number;
  updatedAt: number;
  gameState: GameState;
  playerProfile: PlayerProfileState;
  puzzleState: Record<string, PuzzlePerState>;
  relationshipState: Record<string, RelationshipPerUser>;
  reputationState: Record<FactionId, number>;
  evidenceState: Record<string, EvidencePerItem>;
  inventoryState: Record<string, InventoryPerItem>;
  narrativeState: NarrativeState;
  settingsState: SettingsState;
  uiState?: UIState;
  eventHistory: GameEvent[];
  snapshots: CheckpointSnapshot[];
}
