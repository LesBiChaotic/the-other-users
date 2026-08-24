/**
 * Content Validation, Schema Parsing & Static Analysis Tests — The Other Users
 */

import { describe, it, expect } from 'vitest';
import {
  SpeciesSchema,
  UserSchema,
  PostSchema,
  PuzzleConfigSchema,
  EvidenceItemSchema,
  NonmaterialItemSchema,
  EndingDefinitionSchema,
} from '../domain/schemas/content.schema';
import {
  SAMPLE_SPECIES,
  SAMPLE_USERS,
  SAMPLE_POSTS,
  SAMPLE_PUZZLE,
  SAMPLE_EVIDENCE,
  SAMPLE_ITEMS,
  SAMPLE_ENDING,
} from '../content/fixtures/sampleContent';
import { validateContentGraph, GraphNode } from '../domain/content/graphValidator';
import { analyzeContentIntegrity } from '../domain/content/contentAnalyzer';
import { auditStateConsumers } from '../domain/content/writeOnlyDetector';

describe('Content Schema Validation & Static Analysis', () => {
  it('validates minimal sample fixtures against Zod domain schemas', () => {
    SAMPLE_SPECIES.forEach((s) => expect(SpeciesSchema.safeParse(s).success).toBe(true));
    SAMPLE_USERS.forEach((u) => expect(UserSchema.safeParse(u).success).toBe(true));
    SAMPLE_POSTS.forEach((p) => expect(PostSchema.safeParse(p).success).toBe(true));
    expect(PuzzleConfigSchema.safeParse(SAMPLE_PUZZLE).success).toBe(true);
    SAMPLE_EVIDENCE.forEach((e) => expect(EvidenceItemSchema.safeParse(e).success).toBe(true));
    SAMPLE_ITEMS.forEach((i) => expect(NonmaterialItemSchema.safeParse(i).success).toBe(true));
    expect(EndingDefinitionSchema.safeParse(SAMPLE_ENDING).success).toBe(true);
  });

  it('validateContentGraph detects circular locks and orphaned unreachable nodes', () => {
    const acyclicNodes: GraphNode[] = [
      { id: 'gate_G0', type: 'gate', dependencies: ['root'] },
      { id: 'puzzle_p02', type: 'puzzle', dependencies: ['gate_G0'] },
      { id: 'gate_G1', type: 'gate', dependencies: ['puzzle_p02'] },
    ];

    const validReport = validateContentGraph(acyclicNodes, ['root']);
    expect(validReport.valid).toBe(true);
    expect(validReport.cycles).toHaveLength(0);
    expect(validReport.orphans).toHaveLength(0);

    // Circular nodes
    const cyclicNodes: GraphNode[] = [
      { id: 'node_A', type: 'gate', dependencies: ['node_B'] },
      { id: 'node_B', type: 'gate', dependencies: ['node_A'] },
    ];

    const cyclicReport = validateContentGraph(cyclicNodes, ['root']);
    expect(cyclicReport.valid).toBe(false);
    expect(cyclicReport.cycles.length).toBeGreaterThan(0);

    // Orphaned node
    const orphanNodes: GraphNode[] = [
      { id: 'gate_G0', type: 'gate', dependencies: ['root'] },
      { id: 'isolated_node', type: 'puzzle', dependencies: ['non_existent_parent'] },
    ];

    const orphanReport = validateContentGraph(orphanNodes, ['root']);
    expect(orphanReport.valid).toBe(false);
    expect(orphanReport.orphans).toContain('isolated_node');
  });

  it('analyzeContentIntegrity detects missing foreign keys across entities', () => {
    const validReport = analyzeContentIntegrity({
      users: SAMPLE_USERS,
      species: SAMPLE_SPECIES,
      posts: SAMPLE_POSTS,
      evidence: SAMPLE_EVIDENCE,
      puzzles: [SAMPLE_PUZZLE],
    });

    expect(validReport.valid).toBe(true);
    expect(validReport.missingAuthors).toHaveLength(0);
    expect(validReport.missingSpecies).toHaveLength(0);

    // Corrupted user with missing species
    const corruptedReport = analyzeContentIntegrity({
      users: [
        {
          ...SAMPLE_USERS[0],
          speciesId: 'non_existent_species',
        },
      ],
      species: SAMPLE_SPECIES,
      posts: SAMPLE_POSTS,
      evidence: SAMPLE_EVIDENCE,
      puzzles: [SAMPLE_PUZZLE],
    });

    expect(corruptedReport.valid).toBe(false);
    expect(corruptedReport.missingSpecies).toHaveLength(1);
    expect(corruptedReport.missingSpecies[0].speciesId).toBe('non_existent_species');
  });

  it('auditStateConsumers catches consequence flags written without consumers', () => {
    const producers = [
      {
        sourceId: 'p02_decision',
        sourceType: 'puzzle' as const,
        flagsWritten: ['observer_accused', 'abandoned_unused_flag'],
      },
    ];

    const consumers = [
      {
        consumerId: 'inbox_msg_05',
        consumerType: 'message_unlock' as const,
        condition: { type: 'flagEquals' as const, flag: 'observer_accused', value: true },
      },
    ];

    const audit = auditStateConsumers(producers, consumers);
    expect(audit.valid).toBe(false);
    expect(audit.writeOnlyFlags).toContain('abandoned_unused_flag');
    expect(audit.writeOnlyFlags).not.toContain('observer_accused');
  });
});
