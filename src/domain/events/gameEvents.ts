/**
 * GameEvent Factories and Deterministic Event Dispatcher — The Other Users
 * 
 * Factory functions to create strongly-typed GameEvents.
 * Dispatches events deterministically to state handlers without a global mutable event bus.
 */

import { GameEvent, GameEventSource } from '../types/events';

let eventCounter = 0;

export function createEventId(): string {
  eventCounter += 1;
  return `evt_${Date.now()}_${eventCounter}`;
}

export function createGameEvent<T extends GameEvent['type']>(
  type: T,
  payload: Extract<GameEvent, { type: T }>['payload'],
  chapter: number,
  source: GameEventSource = 'user_action'
): Extract<GameEvent, { type: T }> {
  return {
    id: createEventId(),
    timestamp: Date.now(),
    source,
    chapter,
    type,
    payload,
  } as Extract<GameEvent, { type: T }>;
}

export type GameEventListener = (event: GameEvent) => void;

export class DeterministicEventDispatcher {
  private listeners: Set<GameEventListener> = new Set();

  public subscribe(listener: GameEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public dispatch(event: GameEvent): void {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
