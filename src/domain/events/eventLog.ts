/**
 * Event History & Log Manager — The Other Users
 * 
 * Manages the chronological stream of GameEvents for deterministic replay, save serialization, and auditing.
 */

import { GameEvent, GameEventType } from '../types/events';

export class EventLog {
  private events: GameEvent[] = [];

  constructor(initialEvents: GameEvent[] = []) {
    this.events = [...initialEvents];
  }

  public record(event: GameEvent): void {
    this.events.push(event);
  }

  public getAll(): GameEvent[] {
    return [...this.events];
  }

  public getByChapter(chapter: number): GameEvent[] {
    return this.events.filter((e) => e.chapter === chapter);
  }

  public getByType<T extends GameEventType>(type: T): Array<Extract<GameEvent, { type: T }>> {
    return this.events.filter((e) => e.type === type) as Array<Extract<GameEvent, { type: T }>>;
  }

  public count(): number {
    return this.events.length;
  }

  public clear(): void {
    this.events = [];
  }

  public truncateToSnapshot(timestamp: number): void {
    this.events = this.events.filter((e) => e.timestamp <= timestamp);
  }
}
