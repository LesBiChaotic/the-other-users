/**
 * Route Registry Metadata Interfaces — The Other Users
 * 
 * Declarative route definitions separated from component rendering.
 */

import { ConditionNode } from './conditions';
import { CommunityId } from './content';

export interface RouteMetadata {
  path: string;
  surfaceName: string;
  chapterRequirement: number;
  communityId?: CommunityId;
  gateId?: string;
  unlockCondition?: ConditionNode;
  fallbackPath: string;
  deniedMessage: string;
}

export type RouteGuardEvaluation = {
  authorized: boolean;
  targetPath: string;
  message?: string;
};
