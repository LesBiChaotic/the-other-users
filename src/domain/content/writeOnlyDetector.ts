/**
 * Write-Only State Detector — The Other Users
 * 
 * Audits all consequence flags written across puzzles, messages, and choices
 * to guarantee that every consequential state write has at least one visible downstream consumer.
 */

import { ConditionNode } from '../types/conditions';

export interface StateWriteProducer {
  sourceId: string;
  sourceType: 'puzzle' | 'message_reply' | 'choice';
  flagsWritten: string[];
}

export interface StateConditionConsumer {
  consumerId: string;
  consumerType: 'route_gate' | 'post_availability' | 'message_unlock' | 'ending_eligibility';
  condition: ConditionNode;
}

export interface WriteOnlyAuditReport {
  valid: boolean;
  writeOnlyFlags: string[];
  orphanProducers: Array<{ sourceId: string; flag: string }>;
}

function extractFlagsFromCondition(condition: ConditionNode, flagsSet: Set<string>): void {
  if (!condition) return;

  switch (condition.type) {
    case 'all':
    case 'any':
      condition.conditions.forEach((c) => extractFlagsFromCondition(c, flagsSet));
      break;
    case 'not':
      extractFlagsFromCondition(condition.condition, flagsSet);
      break;
    case 'flagEquals':
      flagsSet.add(condition.flag);
      break;
    default:
      break;
  }
}

export function auditStateConsumers(
  producers: StateWriteProducer[],
  consumers: StateConditionConsumer[]
): WriteOnlyAuditReport {
  const consumedFlags = new Set<string>();

  for (const consumer of consumers) {
    extractFlagsFromCondition(consumer.condition, consumedFlags);
  }

  const writeOnlyFlags: string[] = [];
  const orphanProducers: Array<{ sourceId: string; flag: string }> = [];

  for (const prod of producers) {
    for (const flag of prod.flagsWritten) {
      if (!consumedFlags.has(flag)) {
        if (!writeOnlyFlags.includes(flag)) {
          writeOnlyFlags.push(flag);
        }
        orphanProducers.push({ sourceId: prod.sourceId, flag });
      }
    }
  }

  return {
    valid: writeOnlyFlags.length === 0,
    writeOnlyFlags,
    orphanProducers,
  };
}
