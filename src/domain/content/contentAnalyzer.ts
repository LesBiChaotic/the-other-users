/**
 * Content Reference Integrity Analyzer — The Other Users
 * 
 * Verifies foreign keys across users, species, posts, comments, evidence, and communities.
 */

import { Post, User, Species, EvidenceItem, PuzzleConfig } from '../types/content';

export interface ContentFixtureRegistry {
  users: User[];
  species: Species[];
  posts: Post[];
  evidence: EvidenceItem[];
  puzzles: PuzzleConfig[];
}

export interface IntegrityErrorReport {
  valid: boolean;
  missingAuthors: Array<{ postId: string; authorId: string }>;
  missingSpecies: Array<{ userId: string; speciesId: string }>;
  missingEvidenceRefs: Array<{ puzzleId: string; evidenceId: string }>;
}

export function analyzeContentIntegrity(registry: ContentFixtureRegistry): IntegrityErrorReport {
  const userIds = new Set(registry.users.map((u) => u.id));
  const speciesIds = new Set(registry.species.map((s) => s.id));
  const evidenceIds = new Set(registry.evidence.map((e) => e.id));

  const missingAuthors: Array<{ postId: string; authorId: string }> = [];
  const missingSpecies: Array<{ userId: string; speciesId: string }> = [];
  const missingEvidenceRefs: Array<{ puzzleId: string; evidenceId: string }> = [];

  // Verify Species references in Users
  for (const user of registry.users) {
    if (!speciesIds.has(user.speciesId)) {
      missingSpecies.push({ userId: user.id, speciesId: user.speciesId });
    }
  }

  // Verify Authors in Posts & Comments
  for (const post of registry.posts) {
    if (!userIds.has(post.authorId)) {
      missingAuthors.push({ postId: post.id, authorId: post.authorId });
    }
    for (const comment of post.comments) {
      if (!userIds.has(comment.authorId)) {
        missingAuthors.push({ postId: `${post.id}#${comment.id}`, authorId: comment.authorId });
      }
    }
  }

  // Verify Evidence references in Puzzles
  for (const puzzle of registry.puzzles) {
    for (const clue of puzzle.clues) {
      // If clue references an evidence ID in its content or ID
      if (clue.id.startsWith('ev_') && !evidenceIds.has(clue.id)) {
        missingEvidenceRefs.push({ puzzleId: puzzle.id, evidenceId: clue.id });
      }
    }
  }

  return {
    valid:
      missingAuthors.length === 0 &&
      missingSpecies.length === 0 &&
      missingEvidenceRefs.length === 0,
    missingAuthors,
    missingSpecies,
    missingEvidenceRefs,
  };
}
