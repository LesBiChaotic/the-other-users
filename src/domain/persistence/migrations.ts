/**
 * Save Envelope Schema Migrations & Recovery — The Other Users
 * 
 * Manages incremental schema version upgrades and corrupted UI state recovery.
 */

import { SaveEnvelope } from '../types/state';
import { SaveEnvelopeSchema } from '../schemas/save.schema';

export const CURRENT_SCHEMA_VERSION = 2;

export type MigrationStep = (rawSave: any) => any;

export const MIGRATION_CHAIN: Record<number, MigrationStep> = {
  1: (v1) => ({
    ...v1,
    narrativeState: v1.narrativeState ?? {
      choices: {},
      completedChapterIds: [],
      commonBodyCapabilities: [],
      messageState: {},
    },
    snapshots: (v1.snapshots ?? []).map((snapshot: any) => ({
      ...snapshot,
      narrativeState: snapshot.narrativeState ?? {
        choices: {},
        completedChapterIds: [],
        commonBodyCapabilities: [],
        messageState: {},
      },
    })),
  }),
};

export interface MigrationResult {
  success: boolean;
  envelope?: SaveEnvelope;
  recoveredFromSnapshot?: boolean;
  error?: string;
}

export function migrateSaveEnvelope(rawSave: any): MigrationResult {
  if (!rawSave || typeof rawSave !== 'object') {
    return {
      success: false,
      error: 'Invalid raw save object (null or non-object).',
    };
  }

  let working = JSON.parse(JSON.stringify(rawSave));

  // If missing schemaVersion, treat as legacy v0
  let version = typeof working.schemaVersion === 'number' ? working.schemaVersion : 0;

  try {
    while (version < CURRENT_SCHEMA_VERSION) {
      const step = MIGRATION_CHAIN[version];
      if (step) {
        working = step(working);
        version += 1;
        working.schemaVersion = version;
      } else {
        // Default upgrade for early mock v0
        working.schemaVersion = CURRENT_SCHEMA_VERSION;
        version = CURRENT_SCHEMA_VERSION;
      }
    }

    // Safety: If UI state is corrupted, recover safely with clean UI defaults without discarding game state
    if (!working.uiState || typeof working.uiState !== 'object') {
      working.uiState = {
        navigationDrawerOpen: false,
        activeComparisonEvidenceIds: [],
        draftNotes: {},
        scrollRestoration: {},
      };
    }

    // Narrative state became first-class in v2. Apply this recovery guard even to
    // very early saves that skipped explicit historical migration steps.
    if (!working.narrativeState || typeof working.narrativeState !== 'object') {
      working.narrativeState = {
        choices: {},
        completedChapterIds: [],
        commonBodyCapabilities: [],
        messageState: {},
      };
    }
    working.snapshots = (working.snapshots ?? []).map((snapshot: any) => ({
      ...snapshot,
      narrativeState: snapshot.narrativeState ?? {
        choices: {},
        completedChapterIds: [],
        commonBodyCapabilities: [],
        messageState: {},
      },
    }));

    // Validate through Zod
    const parsed = SaveEnvelopeSchema.safeParse(working);
    if (!parsed.success) {
      return {
        success: false,
        error: `Schema validation failed after migration: ${parsed.error.message}`,
      };
    }

    return {
      success: true,
      envelope: parsed.data as SaveEnvelope,
    };
  } catch (e: any) {
    return {
      success: false,
      error: `Migration threw unexpected exception: ${e?.message || String(e)}`,
    };
  }
}
