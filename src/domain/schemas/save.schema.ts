/**
 * Zod Validation Schemas for Saves & Persistence — The Other Users
 */

import { z } from 'zod';
import { PuzzleStatusSchema } from './conditions.schema';
import { FactionIdSchema } from './content.schema';

export const UserOutcomeSchema = z.enum([
  'normal',
  'suspected',
  'accused',
  'protected',
  'replaced',
  'rescued',
  'lost',
  'absorbed',
]);

export const GameStateSchema = z.object({
  chapter: z.number().int().min(0).max(8),
  unlockedGates: z.record(z.boolean()),
  flags: z.record(z.union([z.boolean(), z.string(), z.number()])),
  feedSeenIds: z.array(z.string()),
});

export const PlayerProfileStateSchema = z.object({
  handle: z.string(),
  pronouns: z.string(),
  provisionalSpecies: z.string(),
  occupancyCount: z.number().int(),
  thresholdTolerance: z.string(),
  memoryDiet: z.string(),
  mimicryRisk: z.string(),
  witnessedShape: z.string(),
  exposureScore: z.number(),
  legibilityScore: z.number(),
  pluralityScore: z.number(),
  complicityScore: z.number(),
  ilyrTrustScore: z.number(),
  revisions: z.array(
    z.object({
      chapter: z.number().int().min(0).max(8),
      timestamp: z.number(),
      summary: z.string(),
      traits: z.record(z.string()),
    })
  ),
});

export const PuzzlePerStateSchema = z.object({
  status: PuzzleStatusSchema,
  attempts: z.number().int().nonnegative(),
  hintLevel: z.number().int().min(0).max(4),
  bypassed: z.boolean(),
  workingInput: z.unknown().optional(),
  lastFeedback: z.string().optional(),
  solvedAt: z.number().optional(),
});

export const RelationshipPerUserSchema = z.object({
  trust: z.number(),
  flags: z.record(z.boolean()),
  outcome: UserOutcomeSchema,
  witnessEligible: z.boolean(),
});

export const EvidencePerItemSchema = z.object({
  discovered: z.boolean(),
  inspected: z.boolean(),
  marked: z.boolean(),
  compared: z.boolean(),
  committedToCases: z.array(z.string()),
  userNotes: z.string().optional(),
});

export const InventoryPerItemSchema = z.object({
  owned: z.boolean(),
  acquiredAtChapter: z.number().int().min(0).max(8),
  consumed: z.boolean(),
  permanence: z.enum(['permanent', 'consumed_on_use', 'escrowed']),
});

export const SettingsStateSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  textScale: z.number().min(100).max(200),
  reducedMotion: z.boolean(),
  highContrast: z.boolean(),
  soundEnabled: z.boolean(),
  transcriptsEnabled: z.boolean(),
  untimedPuzzles: z.boolean(),
  contentWarningsEnabled: z.boolean(),
});

export const UIStateSchema = z.object({
  navigationDrawerOpen: z.boolean().default(false),
  activeComparisonEvidenceIds: z.array(z.string()).default([]),
  draftNotes: z.record(z.string()).default({}),
  scrollRestoration: z.record(z.number()).default({}),
});

export const CheckpointSnapshotSchema = z.object({
  id: z.string().min(1),
  chapter: z.number().int().min(0).max(8),
  timestamp: z.number(),
  label: z.string(),
  gameState: GameStateSchema,
  playerProfile: PlayerProfileStateSchema,
  puzzleState: z.record(PuzzlePerStateSchema),
  relationshipState: z.record(RelationshipPerUserSchema),
  reputationState: z.record(FactionIdSchema, z.number()),
  evidenceState: z.record(EvidencePerItemSchema),
  inventoryState: z.record(InventoryPerItemSchema),
});

export const SaveEnvelopeSchema = z.object({
  schemaVersion: z.number().int().min(1),
  contentVersion: z.string(),
  playthroughId: z.string().min(1),
  createdAt: z.number(),
  updatedAt: z.number(),
  gameState: GameStateSchema,
  playerProfile: PlayerProfileStateSchema,
  puzzleState: z.record(PuzzlePerStateSchema),
  relationshipState: z.record(RelationshipPerUserSchema),
  reputationState: z.record(FactionIdSchema, z.number()),
  evidenceState: z.record(EvidencePerItemSchema),
  inventoryState: z.record(InventoryPerItemSchema),
  settingsState: SettingsStateSchema,
  uiState: UIStateSchema.optional(),
  eventHistory: z.array(z.any()), // GameEvent array validated dynamically
  snapshots: z.array(CheckpointSnapshotSchema),
});
