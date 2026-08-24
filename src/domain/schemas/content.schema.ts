/**
 * Zod Validation Schemas for Domain Content — The Other Users
 */

import { z } from 'zod';
import { ConditionNodeSchema } from './conditions.schema';

export const CommunityIdSchema = z.enum([
  'hub',
  'wire',
  'molt',
  'below',
  'vesper',
  'market',
  'communion',
  'menagerie',
  'convergence',
]);

export const FactionIdSchema = z.enum([
  'plurality_accord',
  'open_shape',
  'communion_body',
  'menagerie_directorate',
  'human_observation_guild',
  'pale_market_houses',
]);

export const AccessibilityRepresentationSchema = z.object({
  altText: z.string().min(1),
  transcript: z.string().optional(),
  patternDescription: z.string().optional(),
  nonColorAlternative: z.string().optional(),
});

export const UserProfileRevisionSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().min(1),
  chapter: z.number().int().min(0).max(8),
  speciesHypothesis: z.string().min(1),
  anatomySummary: z.string().min(1),
  changedFields: z.array(z.string()),
});

export const UserSchema = z.object({
  id: z.string().min(1),
  handle: z.string().min(1),
  speciesId: z.string().min(1),
  pronouns: z.string().min(1),
  voiceGuidelines: z.string().min(1),
  communityIds: z.array(CommunityIdSchema),
  isNamedWitness: z.boolean(),
  revisions: z.array(UserProfileRevisionSchema),
  replacementState: z.enum([
    'normal',
    'suspected',
    'accused',
    'protected',
    'replaced',
    'rescued',
    'lost',
    'absorbed',
  ]),
});

export const SpeciesSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  sensoryModalities: z.array(z.string()).min(1),
  occupancyRule: z.string().min(1),
  habitat: z.string().min(1),
  sustenance: z.string().min(1),
  accommodations: z.string().min(1),
  mimicryRisk: z.enum(['low', 'moderate', 'severe', 'incompatible']),
});

export const PostAttachmentSchema = z.object({
  id: z.string().min(1),
  type: z.enum(['image', 'audio', 'diagram', 'sensor_log', 'waveform']),
  url: z.string().min(1),
  accessibility: AccessibilityRepresentationSchema,
});

export const PostCommentSchema = z.object({
  id: z.string().min(1),
  authorId: z.string().min(1),
  parentId: z.string().optional(),
  chronologyIndex: z.number().int().nonnegative(),
  body: z.string().min(1),
  availability: ConditionNodeSchema,
  attachments: z.array(PostAttachmentSchema).optional(),
});

export const PostSchema = z.object({
  id: z.string().min(1),
  communityId: CommunityIdSchema,
  authorId: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  chronologyIndex: z.number().int().nonnegative(),
  isNormalLifeContent: z.boolean(),
  availability: ConditionNodeSchema,
  comments: z.array(PostCommentSchema),
  attachments: z.array(PostAttachmentSchema).optional(),
});

export const MessageReplyOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  stateWrites: z.object({
    flags: z.record(z.union([z.boolean(), z.string(), z.number()])).optional(),
    relationshipChange: z
      .object({
        userId: z.string(),
        delta: z.number(),
      })
      .optional(),
    reputationChange: z
      .object({
        factionId: FactionIdSchema,
        delta: z.number(),
      })
      .optional(),
  }),
});

export const MessageSchema = z.object({
  id: z.string().min(1),
  threadId: z.string().min(1),
  senderId: z.string().min(1),
  senderSource: z.enum([
    'authentic_ilyr',
    'common_body_imitator',
    'permission_error',
    'user',
    'faction',
  ]),
  body: z.string().min(1),
  timestamp: z.string().min(1),
  unlockCondition: ConditionNodeSchema,
  replies: z.array(MessageReplyOptionSchema).optional(),
  accessibility: AccessibilityRepresentationSchema.optional(),
});

export const PuzzleClueSchema = z.object({
  id: z.string().min(1),
  channel: z.enum(['textual', 'visual_spatial', 'relational_behavioral']),
  content: z.string().min(1),
  accessibility: AccessibilityRepresentationSchema,
});

export const PuzzleConfigSchema = z.object({
  id: z.string().min(1),
  chapter: z.number().int().min(0).max(8),
  communityId: CommunityIdSchema,
  objective: z.string().min(1),
  teachingRefs: z.array(z.string()),
  clues: z.array(PuzzleClueSchema).min(1),
  hints: z.array(z.string()),
  bypassValue: z.unknown(),
  evaluatorId: z.string().min(1),
});

export const EvidenceItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  provenance: z.string().min(1),
  communityId: CommunityIdSchema,
  chapter: z.number().int().min(0).max(8),
  representations: z.object({
    primaryText: z.string().min(1),
    sensoryDescription: z.string().optional(),
    mediaUrl: z.string().optional(),
    accessibility: AccessibilityRepresentationSchema,
  }),
  contradictionLinks: z.array(z.string()).optional(),
  targetCases: z.array(z.string()),
});

export const NonmaterialItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['identity', 'access', 'evidence']),
  provenance: z.string().min(1),
  permanence: z.enum(['permanent', 'consumed_on_use', 'escrowed']),
  costDescription: z.string().min(1),
  usableInGates: z.array(z.string()),
});

export const EndingDefinitionSchema = z.object({
  id: z.enum([
    'chorus_of_difference',
    'perfectly_ordinary_person',
    'the_closed_tab',
    'many_bodies_no_network',
    'the_moderators_exception',
    'user_not_found',
  ]),
  title: z.string().min(1),
  eligibility: ConditionNodeSchema,
  priority: z.number().int(),
  permissionClauses: z.array(z.string()).min(1),
  conditionalParagraphs: z.array(
    z.object({
      id: z.string().min(1),
      condition: ConditionNodeSchema,
      prose: z.string().min(1),
    })
  ),
});
