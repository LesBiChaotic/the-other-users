/**
 * Dexie IndexedDB Database Definition — The Other Users
 */

import Dexie, { Table } from 'dexie';
import { SaveEnvelope, CheckpointSnapshot } from '../types/state';
import { GameEvent } from '../types/events';

export interface SerializedEventRecord {
  id: string;
  playthroughId: string;
  timestamp: number;
  chapter: number;
  type: string;
  eventData: GameEvent;
}

export class PalinodeDatabase extends Dexie {
  saves!: Table<SaveEnvelope, string>;
  snapshots!: Table<CheckpointSnapshot & { playthroughId: string }, string>;
  events!: Table<SerializedEventRecord, string>;

  constructor() {
    super('PalinodeDB');

    this.version(1).stores({
      saves: 'playthroughId, schemaVersion, updatedAt',
      snapshots: 'id, [playthroughId+chapter], timestamp',
      events: 'id, playthroughId, [playthroughId+chapter], timestamp',
    });
  }
}

export const db = new PalinodeDatabase();
