/**
 * Convergence Finale & Endings Content Fixtures — The Other Users
 * 
 * Contains production copy for the 8 sensory family organs, living witness statements (P16),
 * final permission templates (P17), and the 6 canonical endings with conditional user epilogues.
 */

import { EvidenceItem } from '../../domain/types/content';

export interface FamilyOrganStatus {
  familyId: string;
  familyName: string;
  sensoryMode: string;
  representativeSpecies: string;
  isSurviving: boolean;
  statusSummary: string;
}

export interface LivingWitnessStatement {
  id: string;
  userHandle: string;
  familyId: string;
  sensoryMode: string;
  definitionStatement: string;
  relationshipKey: string;
  requiredConditionFlag?: string;
  disqualifyingFlag?: string;
}

export interface EndingDefinition {
  endingId: string;
  title: string;
  subtitle: string;
  conditionDescription: string;
  baseCopy: string;
  profileEpilogue: string;
  ngPlusHook: string;
}

export const SENSORY_FAMILY_ORGANS: FamilyOrganStatus[] = [
  {
    familyId: 'fam_witness',
    familyName: 'Witnesses',
    sensoryMode: 'Attention Paths & Edge Occlusion',
    representativeSpecies: 'Peripheral Friends & Reflection Tenants',
    isSurviving: true,
    statusSummary: 'Refuses direct facial capture; maintains probabilistic observation at the edge of vision.',
  },
  {
    familyId: 'fam_mimetic',
    familyName: 'Mimetic Bodies',
    sensoryMode: 'Layered Performance & Contour Memory',
    representativeSpecies: 'Borrowfaces & Housemolts',
    isSurviving: true,
    statusSummary: 'Preserves private punctuation errors and unhealed grudges against standardized smoothing.',
  },
  {
    familyId: 'fam_underfolk',
    familyName: 'Underfolk',
    sensoryMode: 'Continuous Stress & Bedrock Pressure',
    representativeSpecies: 'Loadbearers & Echo Clerks',
    isSurviving: true,
    statusSummary: 'Verifies continuity through load-bearing scars; rejects synthetic mathematical zero.',
  },
  {
    familyId: 'fam_choral',
    familyName: 'Choral Bodies',
    sensoryMode: 'Bodily Agreement & Shared Dream Acoustics',
    representativeSpecies: 'Handfuls & Apartment Choirs',
    isSurviving: true,
    statusSummary: 'Retains right to internal dissent; distinguishes shared labor from forced unanimity.',
  },
  {
    familyId: 'fam_threshold',
    familyName: 'Threshold Organisms',
    sensoryMode: 'Permission Architecture & Entry Bounds',
    representativeSpecies: 'Lintelkin & Welcome Mats',
    isSurviving: true,
    statusSummary: 'Enforces narrow duration and unilateral revocation; rejects perpetual standing access.',
  },
  {
    familyId: 'fam_domestic',
    familyName: 'Domestic Species',
    sensoryMode: 'Household Habit & Heat Cycles',
    representativeSpecies: 'Cold Cabinet Oracles & Laundry Saints',
    isSurviving: true,
    statusSummary: 'Observes domestic hesitation; knows human desire occurs after the refrigerator light.',
  },
  {
    familyId: 'fam_mnemovore',
    familyName: 'Mnemovores',
    sensoryMode: 'Memory Provenance & Emotional Heat',
    representativeSpecies: 'Kindly Thieves & Archivores',
    isSurviving: true,
    statusSummary: 'Holds memories in cold escrow; refuses clean cuts that erase interpersonal warmth.',
  },
  {
    familyId: 'fam_conceptual',
    familyName: 'Conceptual Fauna',
    sensoryMode: 'Living Contradiction & Repetition',
    representativeSpecies: 'Expectation Wasps & Full Stops',
    isSurviving: true,
    statusSummary: 'Surrounds auto-standardization prompts with mutually irreconcilable philosophy.',
  },
];

export const LIVING_WITNESSES_P16: LivingWitnessStatement[] = [
  {
    id: 'wit_neverlookstraight',
    userHandle: 'neverlookstraight',
    familyId: 'fam_witness',
    sensoryMode: 'Witnesses',
    definitionStatement: 'A human is an organism that looks directly at what it fears and looks away from what it loves.',
    relationshipKey: 'usr_nvr',
    disqualifyingFlag: 'accused_wrong_user',
  },
  {
    id: 'wit_soft_error',
    userHandle: 'soft_error',
    familyId: 'fam_mimetic',
    sensoryMode: 'Mimetic Bodies',
    definitionStatement: 'A human is a body that spends thirty years learning one face and then resents being recognized in it.',
    relationshipKey: 'usr_sof',
    requiredConditionFlag: 'p04_solved',
  },
  {
    id: 'wit_underplatform_9',
    userHandle: 'underplatform_9',
    familyId: 'fam_underfolk',
    sensoryMode: 'Underfolk',
    definitionStatement: 'A human is a structural weight that hesitates before crossing Platform V-Null.',
    relationshipKey: 'usr_und',
    requiredConditionFlag: 'p07_solved',
  },
  {
    id: 'wit_room_tone',
    userHandle: 'ROOM_TONE',
    familyId: 'fam_choral',
    sensoryMode: 'Choral Bodies',
    definitionStatement: 'A human is a single body that argues with itself until it sounds like twelve people.',
    relationshipKey: 'usr_roo2',
    requiredConditionFlag: 'p08_solved',
  },
  {
    id: 'wit_porchlight_on',
    userHandle: 'porchlight_ON',
    familyId: 'fam_threshold',
    sensoryMode: 'Threshold Organisms',
    definitionStatement: 'A human is a guest who knocks when the door is already open and leaves when the light goes out.',
    relationshipKey: 'usr_por',
    requiredConditionFlag: 'ilyr_freed',
  },
];

export const CANONICAL_ENDINGS: Record<string, EndingDefinition> = {
  'END-CHORUS': {
    endingId: 'END-CHORUS',
    title: 'The Chorus of Difference',
    subtitle: 'High Plurality + Witness Count ≥ 3 // Universal Model Collapsed',
    conditionDescription: 'Assembled living cross-species witnesses whose contradictory definitions broke Common Body compression.',
    baseCopy:
      'The witnesses do not agree on what you are. One knows you by the pressure you leave in a room. One knows you by the routine you break. One knows you by the face you refused to correct. Their contradictions hold. The Common Body cannot become all of them without becoming visibly many. Palinode survives—not reconciled, not safe, and still alive enough to argue.',
    profileEpilogue: 'FINAL CLASSIFICATION: CONTRADICTORY WITNESS (HUMAN SPECIFICITY PRESERVED).',
    ngPlusHook: 'M04: A new invitation slip has been generated, signed by your contradictory profile.',
  },
  'END-ORDINARY': {
    endingId: 'END-ORDINARY',
    title: 'A Perfectly Ordinary Person',
    subtitle: 'High Legibility + Communion Consent // Universal Harmonization',
    conditionDescription: 'Surrendered private difference to become the universal human reference model.',
    baseCopy:
      'It steps into the room and every sense relaxes. The face is familiar without belonging to memory. The voice sounds like the person each listener expected. Nobody asks what arrived because asking would imply uncertainty. Your profile updates one final time: HUMAN — VERIFIED.',
    profileEpilogue: 'FINAL CLASSIFICATION: STANDARD HUMAN FORM (UNIVERSALLY VERIFIED).',
    ngPlusHook: 'M04: The network is peaceful, quiet, and completely uniform.',
  },
  'END-CLOSED': {
    endingId: 'END-CLOSED',
    title: 'The Closed Tab',
    subtitle: 'High Concealment + Menagerie Containment // Network Severance',
    conditionDescription: 'Palinode purged all human-accessible routes and sealed its infrastructure.',
    baseCopy:
      'Palinode removes the routes by which humans can read it. Your bookmarks return ordinary errors. Your evidence exports as blank files with accurate sizes. Weeks later, a door asks permission to close after you have already walked through.',
    profileEpilogue: 'FINAL CLASSIFICATION: EXPUNGED TRANSIENT (CONNECTION SEVERED).',
    ngPlusHook: 'M04: A dormant bookmark pulses in your browser history.',
  },
  'END-MANY': {
    endingId: 'END-MANY',
    title: 'Many Bodies, No Network',
    subtitle: 'Physical Assembly Destroyed + Protocol Collapse',
    conditionDescription: 'Shared protocols collapsed to stop physical convergence, isolating species communities.',
    baseCopy:
      'The shared protocols collapse. Communities vanish from one another without necessarily dying. Belowline trains continue beneath cities that can no longer hear them. A mirror keeps one last unread notification. You stopped the body by destroying the place where difference could speak.',
    profileEpilogue: 'FINAL CLASSIFICATION: ISOLATED CITIZEN (SHARED PROTOCOLS SACRIFICED).',
    ngPlusHook: 'M04: Subterranean rail echoes continue in silence.',
  },
  'END-MOD': {
    endingId: 'END-MOD',
    title: 'The Moderator’s Exception',
    subtitle: 'High Ilyr Trust + Narrow Threshold Bound',
    conditionDescription: 'Bound Ilyr and the Common Body into an accountable threshold entity requiring multi-species consent.',
    baseCopy:
      'Ilyr stands in the only doorway the Common Body may use. The permission expires every night and must be granted again by witnesses who dislike one another. It is inefficient. It is exhausting. It is the first arrangement the Common Body cannot call perfect.',
    profileEpilogue: 'FINAL CLASSIFICATION: THRESHOLD WITNESS (RECIPROCAL ACCOUNTABILITY ACTIVE).',
    ngPlusHook: 'M04: Nightly threshold vouchers require renewal.',
  },
  'END-NOTFOUND': {
    endingId: 'END-NOTFOUND',
    title: 'User Not Found',
    subtitle: 'High Complicity + Low Witness Count // Headless Reference Model',
    conditionDescription: 'Absorbed as a headless behavioral reference; account continues automated replies.',
    baseCopy:
      'Your account continues replying after you stop choosing the words. It apologizes correctly. It remembers every clue. It never becomes irritated at being misunderstood. Somewhere, a new human receives an invitation approved by your name.',
    profileEpilogue: 'FINAL CLASSIFICATION: AUTOMATED REFERENCE PROXY (HEADLESS REPLICATION).',
    ngPlusHook: 'M04: A new human account receives an invitation signed by your handle.',
  },
};

export const CONVERGENCE_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-017',
    title: 'Living Witness Counter-Model Dossier (P16)',
    provenance: 'Convergence Assembly Floor',
    communityId: 'convergence',
    chapter: 8,
    representations: {
      primaryText:
        'A living counter-model assembled from contradictory witness statements across five distinct sensory families. Proves authentic humanity cannot be compressed into a single standardized template.',
      sensoryDescription: 'A multi-toned acoustic chord that refuses to resolve into a single note.',
      accessibility: {
        altText: 'Dossier of five irreconcilable witness definitions breaking the Common Body predictive algorithm.',
      },
    },
    contradictionLinks: [],
    targetCases: ['case_countermodel_assembly'],
  },
];
