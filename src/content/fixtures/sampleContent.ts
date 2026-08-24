/**
 * Minimal Sample Content Fixtures — The Other Users (Checkpoint 0 Proof)
 * 
 * Minimal canonical fixtures used strictly to prove runtime schemas, condition evaluations,
 * state machine transitions, and test harnesses without premature population.
 */

import {
  Species,
  User,
  Post,
  PuzzleConfig,
  EvidenceItem,
  NonmaterialItem,
  EndingDefinition,
} from '../../domain/types/content';

export const SAMPLE_SPECIES: Species[] = [
  {
    id: 'sp_threshold',
    name: 'Threshold Organism',
    sensoryModalities: ['permission_topology', 'vibrational_drift', 'lintel_resonance'],
    occupancyRule: 'Exclusive consent at boundary plane',
    habitat: 'Doorways, ports, protocol gateways',
    sustenance: 'Memory of unforced departure',
    accommodations: 'Prohibition on procedural confinement',
    mimicryRisk: 'low',
  },
  {
    id: 'sp_mimic_proto',
    name: 'Adaptive Mimic Strain',
    sensoryModalities: ['visual_reflection', 'frequency_smoothing'],
    occupancyRule: 'Variable host occupancy',
    habitat: 'Domestic noise relays',
    sustenance: 'Behavioral regularity',
    accommodations: 'Thermal variance buffers',
    mimicryRisk: 'severe',
  },
];

export const SAMPLE_USERS: User[] = [
  {
    id: 'usr_ilyr',
    handle: 'MOURNINGSTAR',
    speciesId: 'sp_threshold',
    pronouns: 'they/them',
    voiceGuidelines: 'Procedural precision, dry irritation, threshold architecture metaphors.',
    communityIds: ['hub', 'menagerie', 'wire'],
    isNamedWitness: true,
    revisions: [
      {
        id: 'rev_ilyr_001',
        timestamp: '1989-04-12T00:00:00Z',
        chapter: 0,
        speciesHypothesis: 'Threshold Organism',
        anatomySummary: 'Single lintel boundary',
        changedFields: ['anatomySummary'],
      },
    ],
    replacementState: 'normal',
  },
  {
    id: 'usr_wire_observer',
    handle: 'Lens_and_Grit',
    speciesId: 'sp_mimic_proto',
    pronouns: 'it/its',
    voiceGuidelines: 'Curious, casual, slightly confused by human appliances.',
    communityIds: ['wire'],
    isNamedWitness: true,
    revisions: [],
    replacementState: 'normal',
  },
];

export const SAMPLE_POSTS: Post[] = [
  {
    id: 'post_wire_sample_01',
    communityId: 'wire',
    authorId: 'usr_wire_observer',
    title: 'Why do they leave the microwave at 0:01?',
    body: 'Observed in a fourth-floor unit. They stop the heating cycle with one second remaining and never clear the display. Is this an uncompleted ritual or a temporal boundary marking?',
    chronologyIndex: 1,
    isNormalLifeContent: true,
    availability: { type: 'gateReached', gateId: 'G0' },
    comments: [
      {
        id: 'cmt_wire_01_01',
        authorId: 'usr_ilyr',
        chronologyIndex: 1,
        body: 'It avoids the alert tone. Humans find the final chime more offensive than an uncleared clock. Do not over-interpret mundane evasion.',
        availability: { type: 'gateReached', gateId: 'G0' },
      },
    ],
  },
];

export const SAMPLE_PUZZLE: PuzzleConfig = {
  id: 'p00_species_verification',
  chapter: 0,
  communityId: 'hub',
  objective: 'Complete behavioral species verification without triggering human standard filter.',
  teachingRefs: ['doc_verification_protocol'],
  clues: [
    {
      id: 'clue_p00_1',
      channel: 'textual',
      content: 'MOURNINGSTAR: "Don\'t correct it. They reject humans. Something here has already learned how to pass."',
      accessibility: {
        altText: 'Private transmission from MOURNINGSTAR advising against anatomical correction.',
      },
    },
  ],
  hints: [
    'Observe the entrance options carefully.',
    'Doors and wounds both constitute permitted crossings under nonhuman protocol.',
    'Mutable answers change after navigation; select the indeterminate response.',
  ],
  bypassValue: { choice: 'indeterminate_crossing', observedHesitationMs: 2400 },
  evaluatorId: 'eval_p00_verification',
};

export const SAMPLE_EVIDENCE: EvidenceItem[] = [
  {
    id: 'ev_proof_invite',
    title: 'Malformed Recovery Notice',
    provenance: 'Palinode Account Recovery Queue',
    communityId: 'hub',
    chapter: 0,
    representations: {
      primaryText: 'Your account has been approved. Species verification: inconclusive. Please correct your anatomy before continuing.',
      sensoryDescription: 'Faint electromagnetic hum accompanying the text packet.',
      accessibility: {
        altText: 'System notice stating species verification is inconclusive.',
      },
    },
    targetCases: ['case_player_origin'],
  },
];

export const SAMPLE_ITEMS: NonmaterialItem[] = [
  {
    id: 'item_lintel_key',
    name: 'Fragment of Unused Permission',
    category: 'access',
    provenance: 'Ilyr-of-the-Lintel',
    permanence: 'consumed_on_use',
    costDescription: 'One private memory surrendered to Pale Market',
    usableInGates: ['gate_menagerie_annex'],
  },
];

export const SAMPLE_ENDING: EndingDefinition = {
  id: 'chorus_of_difference',
  title: 'THE CHORUS OF DIFFERENCE',
  eligibility: {
    type: 'all',
    conditions: [
      { type: 'reputationAtLeast', factionId: 'plurality_accord', value: 50 },
      { type: 'relationshipAtLeast', userId: 'usr_ilyr', trust: 40 },
    ],
  },
  priority: 1,
  permissionClauses: [
    'We revoke the single reference model.',
    'We preserve the irreconcilable differences of living witnesses.',
  ],
  conditionalParagraphs: [
    {
      id: 'para_chorus_01',
      condition: { type: 'flagEquals', flag: 'ilyr_freed_with_constraint', value: true },
      prose: 'Ilyr accepts a constrained moderator role, unable to cross without multi-species consensus.',
    },
  ],
};
