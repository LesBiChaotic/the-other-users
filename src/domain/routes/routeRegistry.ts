/**
 * Declarative Route Registry — The Other Users
 * 
 * Central declarative registry of route access gates, chapter requirements, fallback destinations,
 * and in-world denial responses. Separated completely from React component rendering.
 */

import { RouteMetadata, RouteGuardEvaluation } from '../types/routes';
import { ConditionContext, evaluateCondition } from '../conditions/evaluator';

export const ROUTE_REGISTRY: Record<string, RouteMetadata> = {
  '/': {
    path: '/',
    surfaceName: 'Invitation Landing',
    chapterRequirement: 0,
    fallbackPath: '/',
    deniedMessage: 'Palinode connection unavailable.',
  },
  '/verify': {
    path: '/verify',
    surfaceName: 'Species Verification',
    chapterRequirement: 0,
    gateId: 'invitation_accepted',
    unlockCondition: { type: 'flagEquals', flag: 'invitation_accepted', value: true },
    fallbackPath: '/',
    deniedMessage: 'Species verification queue requires an accepted invitation.',
  },
  '/accessibility': {
    path: '/accessibility',
    surfaceName: 'Sensory & Accessibility Settings',
    chapterRequirement: 0,
    fallbackPath: '/',
    deniedMessage: 'System settings unavailable.',
  },
  '/home': {
    path: '/home',
    surfaceName: 'Palinode Home Feed',
    chapterRequirement: 0,
    gateId: 'G0',
    unlockCondition: { type: 'gateReached', gateId: 'G0' },
    fallbackPath: '/verify',
    deniedMessage: 'Access denied: Provisional species profile not verified.',
  },
  '/inbox': {
    path: '/inbox',
    surfaceName: 'Palinode Correspondence Ledger',
    chapterRequirement: 0,
    gateId: 'G0',
    unlockCondition: { type: 'gateReached', gateId: 'G0' },
    fallbackPath: '/home',
    deniedMessage: 'Message queue unavailable: Permission record missing.',
  },
  '/evidence': {
    path: '/evidence',
    surfaceName: 'Evidence & Contradiction Board',
    chapterRequirement: 1,
    gateId: 'G1',
    unlockCondition: { type: 'gateReached', gateId: 'G1' },
    fallbackPath: '/home',
    deniedMessage: 'Evidence ledger unsealed only after initial witness contact.',
  },
  '/profile': {
    path: '/profile',
    surfaceName: 'Player Profile & Anatomy',
    chapterRequirement: 0,
    gateId: 'G0',
    unlockCondition: { type: 'gateReached', gateId: 'G0' },
    fallbackPath: '/verify',
    deniedMessage: 'Profile record unallocated.',
  },
  '/communities': {
    path: '/communities',
    surfaceName: 'Palinode Community Directory',
    chapterRequirement: 0,
    gateId: 'G0',
    unlockCondition: { type: 'gateReached', gateId: 'G0' },
    fallbackPath: '/home',
    deniedMessage: 'Directory restricted to verified accounts.',
  },
  '/settings': {
    path: '/settings',
    surfaceName: 'Palinode Settings & Resets',
    chapterRequirement: 0,
    fallbackPath: '/',
    deniedMessage: 'Preferences unavailable.',
  },
  '/wire': {
    path: '/wire',
    surfaceName: 'Witness Wire Stream',
    chapterRequirement: 0,
    gateId: 'G0',
    unlockCondition: { type: 'gateReached', gateId: 'G0' },
    fallbackPath: '/home',
    deniedMessage: 'Observation stream requires active network session.',
  },
  '/wire/case/player': {
    path: '/wire/case/player',
    surfaceName: 'Player Observation Case',
    chapterRequirement: 0,
    unlockCondition: {
      type: 'all',
      conditions: [
        { type: 'gateReached', gateId: 'G0' },
        { type: 'flagEquals', flag: 'wire_intro_threshold_met', value: true },
      ],
    },
    fallbackPath: '/wire',
    deniedMessage: 'Case dossier restricted: Insufficient observation baseline.',
  },
  '/molt': {
    path: '/molt',
    surfaceName: 'Moltinghouse Revisions',
    chapterRequirement: 1,
    gateId: 'G1',
    unlockCondition: { type: 'gateReached', gateId: 'G1' },
    fallbackPath: '/home',
    deniedMessage: 'Shed archive sealed: Requires first observation resolution.',
  },
  '/below': {
    path: '/below',
    surfaceName: 'Belowline Pressure Map',
    chapterRequirement: 2,
    gateId: 'G2',
    unlockCondition: { type: 'gateReached', gateId: 'G2' },
    fallbackPath: '/home',
    deniedMessage: 'Transit line pressurized: Structural permission required.',
  },
  '/vesper': {
    path: '/vesper',
    surfaceName: 'Vesper Compatibility Field',
    chapterRequirement: 3,
    gateId: 'G3',
    unlockCondition: { type: 'gateReached', gateId: 'G3' },
    fallbackPath: '/home',
    deniedMessage: 'Compatibility network requires active boundary credentials.',
  },
  '/market': {
    path: '/market',
    surfaceName: 'Pale Market Street Ledger',
    chapterRequirement: 4,
    gateId: 'G4',
    unlockCondition: { type: 'gateReached', gateId: 'G4' },
    fallbackPath: '/home',
    deniedMessage: 'Market ledger unreadable without recognized trade stake.',
  },
  '/communion': {
    path: '/communion',
    surfaceName: 'Communion Liturgical Stream',
    chapterRequirement: 4,
    gateId: 'G4',
    unlockCondition: { type: 'gateReached', gateId: 'G4' },
    fallbackPath: '/home',
    deniedMessage: 'Communion stream requires open convergence invitation.',
  },
  '/menagerie': {
    path: '/menagerie',
    surfaceName: 'Menagerie Public Registry',
    chapterRequirement: 3,
    gateId: 'G3',
    unlockCondition: { type: 'gateReached', gateId: 'G3' },
    fallbackPath: '/home',
    deniedMessage: 'Registry records classified under institutional protocol.',
  },
  '/menagerie/ops': {
    path: '/menagerie/ops',
    surfaceName: 'Menagerie Operations Console',
    chapterRequirement: 5,
    gateId: 'G5',
    unlockCondition: { type: 'gateReached', gateId: 'G5' },
    fallbackPath: '/menagerie',
    deniedMessage: 'Containment operations require certified administrative clearance.',
  },
  '/convergence': {
    path: '/convergence',
    surfaceName: 'Convergence Anatomical Assembly',
    chapterRequirement: 6,
    gateId: 'G6',
    unlockCondition: { type: 'gateReached', gateId: 'G6' },
    fallbackPath: '/home',
    deniedMessage: 'Assembly status unavailable: Final convergence not initiated.',
  },
};

export function evaluateRouteGuard(path: string, ctx: ConditionContext): RouteGuardEvaluation {
  const meta = ROUTE_REGISTRY[path];
  if (!meta) {
    return {
      authorized: true,
      targetPath: path,
    };
  }

  if (meta.unlockCondition) {
    const result = evaluateCondition(meta.unlockCondition, ctx);
    if (!result.satisfied) {
      return {
        authorized: false,
        targetPath: meta.fallbackPath,
        message: meta.deniedMessage,
      };
    }
  }

  return {
    authorized: true,
    targetPath: path,
  };
}
