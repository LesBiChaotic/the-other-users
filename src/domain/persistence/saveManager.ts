/**
 * Save Manager & Persistence Pipeline — The Other Users
 * 
 * Orchestrates IndexedDB save serialization, autosave debouncing,
 * snapshot management, and last-known-good recovery.
 */

import { db } from './db';
import { SaveEnvelope, CheckpointSnapshot } from '../types/state';
import { CURRENT_SCHEMA_VERSION, migrateSaveEnvelope } from './migrations';

export class SaveManager {
  private autosaveTimer: any = null;
  private pendingEnvelope: SaveEnvelope | null = null;
  private lastKnownGoodSnapshot: CheckpointSnapshot | null = null;

  public async loadActiveSave(): Promise<{
    envelope: SaveEnvelope | null;
    recoveredFromSnapshot: boolean;
    error?: string;
  }> {
    try {
      const allSaves = await db.saves.toArray();
      if (allSaves.length === 0) {
        return { envelope: null, recoveredFromSnapshot: false };
      }

      // Sort by updatedAt descending
      const latestRaw = allSaves.sort((a, b) => b.updatedAt - a.updatedAt)[0];
      const migrationResult = migrateSaveEnvelope(latestRaw);

      if (migrationResult.success && migrationResult.envelope) {
        // Cache last snapshot
        if (migrationResult.envelope.snapshots.length > 0) {
          this.lastKnownGoodSnapshot =
            migrationResult.envelope.snapshots[migrationResult.envelope.snapshots.length - 1];
        }
        return { envelope: migrationResult.envelope, recoveredFromSnapshot: false };
      }

      // If migration or parsing failed, attempt last-known-good snapshot recovery
      console.warn('Save corrupted, attempting snapshot recovery:', migrationResult.error);
      const snapshots = await db.snapshots.where({ playthroughId: latestRaw.playthroughId }).toArray();
      if (snapshots.length > 0) {
        const latestSnap = snapshots.sort((a, b) => b.timestamp - a.timestamp)[0];
        const recoveredEnvelope = this.reconstructEnvelopeFromSnapshot(latestSnap, latestRaw.playthroughId);
        return {
          envelope: recoveredEnvelope,
          recoveredFromSnapshot: true,
          error: `Corrupted save recovered from Chapter ${latestSnap.chapter} snapshot.`,
        };
      }

      return {
        envelope: null,
        recoveredFromSnapshot: false,
        error: migrationResult.error,
      };
    } catch (e: any) {
      console.error('Fatal loadActiveSave error:', e);
      return {
        envelope: null,
        recoveredFromSnapshot: false,
        error: e?.message || 'Unknown persistence error',
      };
    }
  }

  public async saveActiveEnvelope(envelope: SaveEnvelope): Promise<void> {
    this.pendingEnvelope = envelope;
    try {
      await db.saves.put(envelope);
      // Cache last snapshot
      if (envelope.snapshots && envelope.snapshots.length > 0) {
        this.lastKnownGoodSnapshot = envelope.snapshots[envelope.snapshots.length - 1];
      }
    } catch (e) {
      console.error('Failed to write save envelope to IndexedDB', e);
      throw e;
    }
  }

  public async saveSnapshot(snapshot: CheckpointSnapshot, playthroughId: string): Promise<void> {
    try {
      await db.snapshots.put({
        ...snapshot,
        playthroughId,
      });
      this.lastKnownGoodSnapshot = snapshot;
    } catch (e) {
      console.error('Failed to save snapshot to IndexedDB', e);
    }
  }

  public scheduleAutosave(envelope: SaveEnvelope, delayMs: number = 300): void {
    this.pendingEnvelope = envelope;
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
    }
    this.autosaveTimer = setTimeout(() => {
      if (this.pendingEnvelope) {
        this.saveActiveEnvelope(this.pendingEnvelope).catch(console.error);
      }
    }, delayMs);
  }

  public async flush(): Promise<void> {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
      this.autosaveTimer = null;
    }
    if (this.pendingEnvelope) {
      await this.saveActiveEnvelope(this.pendingEnvelope);
    }
  }

  public async wipeAllPersistence(): Promise<void> {
    if (this.autosaveTimer) {
      clearTimeout(this.autosaveTimer);
      this.autosaveTimer = null;
    }
    this.pendingEnvelope = null;
    this.lastKnownGoodGoodSnapshot = null;
    await db.saves.clear();
    await db.snapshots.clear();
    await db.events.clear();
    try {
      localStorage.removeItem('palinode_settings');
      localStorage.removeItem('palinode_theme');
      localStorage.removeItem('palinode_motion');
    } catch {}
  }

  public getLastKnownGoodSnapshot(): CheckpointSnapshot | null {
    return this.lastKnownGoodSnapshot;
  }

  private set lastKnownGoodGoodSnapshot(s: CheckpointSnapshot | null) {
    this.lastKnownGoodSnapshot = s;
  }

  private reconstructEnvelopeFromSnapshot(
    snapshot: CheckpointSnapshot,
    playthroughId: string
  ): SaveEnvelope {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      contentVersion: '0.1.0',
      playthroughId,
      createdAt: snapshot.timestamp,
      updatedAt: Date.now(),
      gameState: snapshot.gameState,
      playerProfile: snapshot.playerProfile,
      puzzleState: snapshot.puzzleState,
      relationshipState: snapshot.relationshipState,
      reputationState: snapshot.reputationState,
      evidenceState: snapshot.evidenceState,
      inventoryState: snapshot.inventoryState,
      settingsState: {
        theme: 'dark',
        fontMode: 'palinode',
        textScale: 100,
        reducedMotion: false,
        highContrast: false,
        soundEnabled: true,
        transcriptsEnabled: true,
        untimedPuzzles: false,
        contentWarningsEnabled: true,
      },
      uiState: {
        navigationDrawerOpen: false,
        activeComparisonEvidenceIds: [],
        draftNotes: {},
        scrollRestoration: {},
      },
      eventHistory: [],
      snapshots: [snapshot],
    };
  }
}

export const saveManager = new SaveManager();
