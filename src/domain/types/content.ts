/**
 * Domain Content Entity Interfaces — The Other Users
 * 
 * Declares domain entity shapes that content fixtures must satisfy.
 */

import { ConditionNode } from './conditions';

export type CommunityId =
  | 'hub'
  | 'wire'
  | 'molt'
  | 'below'
  | 'vesper'
  | 'market'
  | 'communion'
  | 'menagerie'
  | 'convergence';

export type FactionId =
  | 'plurality_accord'
  | 'open_shape'
  | 'communion_body'
  | 'menagerie_directorate'
  | 'human_observation_guild'
  | 'pale_market_houses';

export interface AccessibilityRepresentation {
  altText: string;
  transcript?: string;
  patternDescription?: string;
  nonColorAlternative?: string;
}

export interface ContentRecord {
  id: string;
  type: 'post' | 'comment' | 'message' | 'evidence' | 'listing' | 'profile' | 'testimony' | 'manifest';
  version: string;
  communityId: CommunityId;
  title: string;
  body: string;
  availability: ConditionNode;
  accessibility?: AccessibilityRepresentation;
}

export interface UserProfileRevision {
  id: string;
  timestamp: string;
  chapter: number;
  speciesHypothesis: string;
  anatomySummary: string;
  changedFields: string[];
}

export interface User {
  id: string;
  handle: string;
  speciesId: string;
  pronouns: string;
  voiceGuidelines: string;
  communityIds: CommunityId[];
  isNamedWitness: boolean;
  revisions: UserProfileRevision[];
  replacementState: 'normal' | 'suspected' | 'accused' | 'protected' | 'replaced' | 'rescued' | 'lost' | 'absorbed';
}

export interface Species {
  id: string;
  name: string;
  sensoryModalities: string[];
  occupancyRule: string;
  habitat: string;
  sustenance: string;
  accommodations: string;
  mimicryRisk: 'low' | 'moderate' | 'severe' | 'incompatible';
}

export interface PostAttachment {
  id: string;
  type: 'image' | 'audio' | 'diagram' | 'sensor_log' | 'waveform';
  url: string;
  accessibility: AccessibilityRepresentation;
}

export interface PostComment {
  id: string;
  authorId: string;
  parentId?: string;
  chronologyIndex: number;
  body: string;
  availability: ConditionNode;
  attachments?: PostAttachment[];
}

export interface Post {
  id: string;
  communityId: CommunityId;
  authorId: string;
  title: string;
  body: string;
  chronologyIndex: number;
  isNormalLifeContent: boolean; // Tag for 3:1 density audit
  availability: ConditionNode;
  comments: PostComment[];
  attachments?: PostAttachment[];
}

export interface MessageReplyOption {
  id: string;
  text: string;
  stateWrites: {
    flags?: Record<string, boolean | string | number>;
    relationshipChange?: { userId: string; delta: number };
    reputationChange?: { factionId: FactionId; delta: number };
  };
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderSource: 'authentic_ilyr' | 'common_body_imitator' | 'permission_error' | 'user' | 'faction';
  body: string;
  timestamp: string;
  unlockCondition: ConditionNode;
  replies?: MessageReplyOption[];
  accessibility?: AccessibilityRepresentation;
}

export interface PuzzleClue {
  id: string;
  channel: 'textual' | 'visual_spatial' | 'relational_behavioral';
  content: string;
  accessibility: AccessibilityRepresentation;
}

export interface PuzzleEvaluationResult {
  correct: boolean;
  feedback: string;
  evidenceUnlocked?: string[];
  stateWrites?: {
    flags?: Record<string, boolean | string | number>;
    relationshipUpdates?: Array<{ userId: string; delta: number; note?: string }>;
    reputationUpdates?: Array<{ factionId: FactionId; delta: number }>;
    gateUnlocks?: string[];
  };
}

export interface PuzzleConfig {
  id: string;
  chapter: number;
  communityId: CommunityId;
  objective: string;
  teachingRefs: string[];
  clues: PuzzleClue[];
  hints: string[]; // progressive: 0 to 4
  bypassValue: unknown;
  evaluatorId: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  provenance: string;
  communityId: CommunityId;
  chapter: number;
  representations: {
    primaryText: string;
    sensoryDescription?: string;
    mediaUrl?: string;
    accessibility: AccessibilityRepresentation;
  };
  contradictionLinks?: string[]; // IDs of conflicting evidence
  targetCases: string[];
}

export interface NonmaterialItem {
  id: string;
  name: string;
  category: 'identity' | 'access' | 'evidence';
  provenance: string;
  permanence: 'permanent' | 'consumed_on_use' | 'escrowed';
  costDescription: string;
  usableInGates: string[];
}

export interface EndingDefinition {
  id: 'chorus_of_difference' | 'perfectly_ordinary_person' | 'the_closed_tab' | 'many_bodies_no_network' | 'the_moderators_exception' | 'user_not_found';
  title: string;
  eligibility: ConditionNode;
  priority: number;
  permissionClauses: string[];
  conditionalParagraphs: Array<{
    id: string;
    condition: ConditionNode;
    prose: string;
  }>;
}
