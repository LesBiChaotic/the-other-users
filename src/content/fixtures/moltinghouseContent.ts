/**
 * Moltinghouse Community & P04/P05 Content Fixtures — The Other Users
 * 
 * Contains production copy for Moltinghouse threads, revision layers,
 * soft_error shed archive (P04), and FIVE_OF_US plural timeline (P05).
 */

import { EvidenceItem, Message } from '../../domain/types/content';

export interface MoltThread {
  id: string;
  authorId: string;
  authorHandle: string;
  authorSpecies: string;
  title: string;
  body: string;
  timestamp: string;
  revisionCount: number;
  category: 'Support' | 'Public-Facing Mimicry' | 'Ethics' | 'Moderator Notice';
  comments: Array<{
    id: string;
    authorId: string;
    authorHandle: string;
    body: string;
    timestamp: string;
  }>;
}

export interface ShedDraft {
  id: string;
  versionNumber: number;
  title: string;
  timestamp: string;
  body: string;
  isAuthenticSignature: boolean;
  punctuationTell: boolean; // double comma ,,
  obsoleteNickname: boolean; // stapler king
  unresolvedGrievance: boolean;
  analysisNote: string;
}

export interface UnitVoiceRecord {
  id: string;
  unitId: string;
  unitName: string;
  body: string;
  timestamp: string;
  telemetryAction: string;
  isSingularLanguage: boolean;
}

export const MOLTINGHOUSE_THREADS: MoltThread[] = [
  {
    id: 'MOLT-001',
    authorId: 'usr_borrow_host',
    authorHandle: 'GestureHound77',
    authorSpecies: 'Gesture Hound',
    title: 'My Host’s Dog Knows. What Now?',
    category: 'Support',
    body: 'Stop trying to outstare the dog. Dogs do not interpret confidence as evidence. Return one familiar smell, approach with the host’s ordinary impatience, and accept that you may never be believed by the only witness who matters.',
    timestamp: 'Yesterday',
    revisionCount: 3,
    comments: [
      {
        id: 'comm_m1_1',
        authorId: 'usr_sof',
        authorHandle: 'soft_error',
        body: 'Also stop smiling at it. Your host did not show the dog every tooth.',
        timestamp: '18h ago',
      },
      {
        id: 'comm_m1_2',
        authorId: 'usr_borrow_host',
        authorHandle: 'GestureHound77',
        body: 'Offer the left hand. Records say she pets with the right; the dog remembers the injured week.',
        timestamp: '16h ago',
      },
    ],
  },
  {
    id: 'MOLT-002',
    authorId: 'usr_mimic_work',
    authorHandle: 'ShiftWorker_4',
    authorSpecies: 'Borrowface',
    title: 'Jaw Keeps Reverting During Customer Service',
    category: 'Public-Facing Mimicry',
    body: 'Eight-hour shifts exceed safe learned-face duration. Request speech-only duties or schedule a private reset. Do not staple the hinge again.',
    timestamp: '2 days ago',
    revisionCount: 2,
    comments: [
      {
        id: 'comm_m2_1',
        authorId: 'usr_sof',
        authorHandle: 'soft_error',
        body: 'If your employer calls this cosmetic, send me the policy.',
        timestamp: '1 day ago',
      },
      {
        id: 'comm_m2_2',
        authorId: 'usr_fiv',
        authorHandle: 'FIVE_OF_US',
        body: 'We repair hinges. We do not repair labor law.',
        timestamp: '1 day ago',
      },
    ],
  },
  {
    id: 'MOLT-003',
    authorId: 'usr_grief_face',
    authorHandle: 'ExPartnerFace',
    authorSpecies: 'Borrowface',
    title: 'Is It Wrong to Keep a Face After the Relationship Ends?',
    category: 'Ethics',
    body: 'I grew it with her. It is not a photograph. It is how my muscles learned to be welcomed. She has asked me to stop wearing it in public.',
    timestamp: '3 days ago',
    revisionCount: 5,
    comments: [
      {
        id: 'comm_m3_1',
        authorId: 'usr_sof',
        authorHandle: 'soft_error',
        body: 'You can own what you became and still respect where you display it,, grief is not a permit.',
        timestamp: '2 days ago',
      },
      {
        id: 'comm_m3_2',
        authorId: 'usr_sec',
        authorHandle: 'SecondDraft',
        body: 'A private-use identity covenant may clarify—',
        timestamp: '2 days ago',
      },
      {
        id: 'comm_m3_3',
        authorId: 'usr_sof',
        authorHandle: 'soft_error',
        body: 'No contracts in my grief thread, Second.',
        timestamp: '1 day ago',
      },
    ],
  },
  {
    id: 'MOLT-004',
    authorId: 'usr_sof',
    authorHandle: 'soft_error',
    authorSpecies: 'Borrowface',
    title: 'Moderator Notice: Spontaneity Tests Are Discriminatory',
    category: 'Moderator Notice',
    body: 'Stop asking suspected replacements to “act natural.” Natural according to whom? Compare a user to their own history. Look for smoothed contradictions, erased grudges, and habits becoming too correct.',
    timestamp: '4 days ago',
    revisionCount: 8,
    comments: [
      {
        id: 'comm_m4_1',
        authorId: 'usr_fiv',
        authorHandle: 'FIVE_OF_US',
        body: 'Pinned.',
        timestamp: '3 days ago',
      },
      {
        id: 'comm_m4_2',
        authorId: 'usr_cal',
        authorHandle: 'calmly_complete',
        body: 'Correction can also be chosen.',
        timestamp: '3 days ago',
      },
      {
        id: 'comm_m4_3',
        authorId: 'usr_sof',
        authorHandle: 'soft_error',
        body: 'Yes. Chosen by whom remains the question.',
        timestamp: '2 days ago',
      },
    ],
  },
  {
    id: 'MOLT-005',
    authorId: 'usr_housemolt_01',
    authorHandle: 'Housemolt_Anchor',
    authorSpecies: 'Housemolt',
    title: 'Shedding Winter Routine: The Heavy Coat Lag',
    category: 'Support',
    body: 'Surface temperatures rose +6°C this week. My interior hallway still retains the November draft and two wool blankets nobody is using. How do you convince a room to shed its winter posture without cracking the plaster?',
    timestamp: '5 days ago',
    revisionCount: 2,
    comments: [
      {
        id: 'comm_m5_1',
        authorId: 'usr_sof',
        authorHandle: 'soft_error',
        body: 'Open the south window for twenty minutes every afternoon,, let the draft argue with the sun. You cannot force a room to forget frost all at once.',
        timestamp: '4 days ago',
      },
      {
        id: 'comm_m5_2',
        authorId: 'usr_housemolt_01',
        authorHandle: 'Housemolt_Anchor',
        body: 'The radiator hissed when I touched the latch. It remembers January better than I do.',
        timestamp: '4 days ago',
      },
    ],
  },
  {
    id: 'MOLT-006',
    authorId: 'usr_mimic_work',
    authorHandle: 'ShiftWorker_4',
    authorSpecies: 'Borrowface',
    title: 'Customer Service Facial Fatigue: 12-Hour Limits',
    category: 'Public-Facing Mimicry',
    body: 'Third week at the airport baggage claim desk. When travelers shout about lost luggage, my cheek muscles try to learn their distress before remembering to present institutional calm. Result: half-apology, half-terror.',
    timestamp: '6 days ago',
    revisionCount: 4,
    comments: [
      {
        id: 'comm_m6_1',
        authorId: 'usr_borrow_host',
        authorHandle: 'GestureHound77',
        body: 'Ground the heels. When you mimic under stress, weight shifts to the toes and triggers flight reflexes.',
        timestamp: '5 days ago',
      },
      {
        id: 'comm_m6_2',
        authorId: 'usr_fiv',
        authorHandle: 'FIVE_OF_US',
        body: 'Unit Two recommends wearing heavier shoes. Steel toes prevent unrequested empathy.',
        timestamp: '5 days ago',
      },
    ],
  },
  {
    id: 'MOLT-007',
    authorId: 'usr_mimic_sib',
    authorHandle: 'YoungGait_3',
    authorSpecies: 'Gesture Hound',
    title: 'Can You Inherit a Sibling\'s Discarded Stride?',
    category: 'Ethics',
    body: 'My elder sibling molted their teenage limp after physical therapy. The gait was left in the family wardrobe. Is it theft to wear it when I need to walk through their old school district unnoticed?',
    timestamp: '1 week ago',
    revisionCount: 1,
    comments: [
      {
        id: 'comm_m7_1',
        authorId: 'usr_sof',
        authorHandle: 'soft_error',
        body: 'Gait is borrowed memory,, not inheritance. Ask before wearing someone\'s recovery as disguise.',
        timestamp: '6 days ago',
      },
      {
        id: 'comm_m7_2',
        authorId: 'usr_sec',
        authorHandle: 'SecondDraft',
        body: 'A temporary kinship license with explicit territorial bounds clarifies property status.',
        timestamp: '6 days ago',
      },
    ],
  },
  {
    id: 'MOLT-008',
    authorId: 'usr_housemolt_01',
    authorHandle: 'Housemolt_Anchor',
    authorSpecies: 'Housemolt',
    title: 'Safehouse Architecture: Retaining Draft Corners',
    category: 'Support',
    body: 'Modern human renovations seal every corner with drywall and foam insulation. A house without draft corners has nowhere for a molt to breathe or shed safely. We need minimum air-gap standards in the building code.',
    timestamp: '1 week ago',
    revisionCount: 3,
    comments: [
      {
        id: 'comm_m8_1',
        authorId: 'usr_und',
        authorHandle: 'underplatform_9',
        body: 'Belowline routes always leave a 4 cm expansion joint behind stairwells. That is municipal law, not kindness.',
        timestamp: '6 days ago',
      },
      {
        id: 'comm_m8_2',
        authorId: 'usr_sof',
        authorHandle: 'soft_error',
        body: 'Drywall is the enemy of honest revision,, you cannot shed against plastic paint.',
        timestamp: '5 days ago',
      },
    ],
  },
  {
    id: 'MOLT-009',
    authorId: 'usr_sof',
    authorHandle: 'soft_error',
    authorSpecies: 'Borrowface',
    title: 'O02 // Moltinghouse Etiquette & Contour Ethics Quiz',
    category: 'Ethics',
    body: 'Test your understanding of nonhuman mimicry ethics. Three questions on learned faces, unasked empathy, and private punctuation. Correct completion awards the "Contour-Aware" cosmetic profile molt and boosts Moltinghouse trust.',
    timestamp: 'Just now',
    revisionCount: 1,
    comments: [
      {
        id: 'comm_m9_1',
        authorId: 'usr_fiv',
        authorHandle: 'FIVE_OF_US',
        body: 'We took the test. Unit Three passed; Unit Five called question two discriminatory.',
        timestamp: 'Just now',
      },
    ],
  },
];

export const SOFT_ERROR_DRAFTS_P04: ShedDraft[] = [
  {
    id: 'draft_01',
    versionNumber: 1,
    title: 'Draft 1 // Initial Support Protocol',
    timestamp: '2023-01-15',
    body: 'Contour repair requires patience. If you force the jaw hinge,, you will tear the cartilage before the shift starts.',
    isAuthenticSignature: false,
    punctuationTell: true,
    obsoleteNickname: false,
    unresolvedGrievance: false,
    analysisNote: 'Contains double commas, but missing relational history.',
  },
  {
    id: 'draft_02',
    versionNumber: 2,
    title: 'Draft 2 // Advice on Hinge Disagreement',
    timestamp: '2023-04-12',
    body: 'Tell FIVE_OF_US that Unit Three owes me twelve copper rivets from the spring flood,, and stop pretending the stapler king knows how to wire an eyelid.',
    isAuthenticSignature: true,
    punctuationTell: true,
    obsoleteNickname: true,
    unresolvedGrievance: true,
    analysisNote: 'Authentic: Uses double commas, names FIVE_OF_US as "stapler king", retains rivet debt.',
  },
  {
    id: 'draft_03',
    versionNumber: 3,
    title: 'Draft 3 // Standardized Molt Notice (Synthetic Pilot)',
    timestamp: '2023-08-01',
    body: 'Identity is safest when clearly defined. Relationships improve when disagreements are resolved. Users seeking stable presentation may enroll in the Standard Form pilot.',
    isAuthenticSignature: false,
    punctuationTell: false,
    obsoleteNickname: false,
    unresolvedGrievance: false,
    analysisNote: 'Synthetic: All grievances smoothed; perfect grammatical perfection; promotes Standard Form.',
  },
  {
    id: 'draft_04',
    versionNumber: 4,
    title: 'Draft 4 // Generic Advice Update',
    timestamp: '2023-10-10',
    body: 'Disagreements between members are best handled through formal mediation. Please refrain from personal nicknames in official support channels.',
    isAuthenticSignature: false,
    punctuationTell: false,
    obsoleteNickname: false,
    unresolvedGrievance: false,
    analysisNote: 'Synthetic: Polite corporate smoothing.',
  },
  {
    id: 'draft_05',
    versionNumber: 5,
    title: 'Draft 5 // Boundary & Face Archival',
    timestamp: '2023-11-22',
    body: 'If you archive my face without the argument attached,, I will delete your access to the contour pantry. I am not a museum piece for your comfort.',
    isAuthenticSignature: true,
    punctuationTell: true,
    obsoleteNickname: false,
    unresolvedGrievance: true,
    analysisNote: 'Authentic: Uses double commas and declares strict boundary on face preservation.',
  },
  {
    id: 'draft_06',
    versionNumber: 6,
    title: 'Draft 6 // Harmonious Coexistence Guide',
    timestamp: '2024-01-05',
    body: 'Grief is an unnecessary friction in communal development. Faces should be shared freely among all participating members.',
    isAuthenticSignature: false,
    punctuationTell: false,
    obsoleteNickname: false,
    unresolvedGrievance: false,
    analysisNote: 'Synthetic: Communion convergence doctrine.',
  },
  {
    id: 'draft_07',
    versionNumber: 7,
    title: 'Draft 7 // Final Buried Shed Note',
    timestamp: '2024-02-18',
    body: 'The stapler king is right about the copper wire,, but if they try to weld my left cheekbone again I will bite Unit Four.',
    isAuthenticSignature: true,
    punctuationTell: true,
    obsoleteNickname: true,
    unresolvedGrievance: true,
    analysisNote: 'Authentic: Uses double commas, "stapler king" nickname, and specific bite threat against Unit Four.',
  },
];

export const FIVE_OF_US_VOICES_P05: UnitVoiceRecord[] = [
  {
    id: 'v_1',
    unitId: 'unit_1',
    unitName: 'Unit One (Foreman)',
    body: 'Shift logged at Belowline Annex N junction. All five units on site carrying structural solder.',
    timestamp: '14:02:11',
    telemetryAction: 'Pressure Sensor: 5 units logged (4.2 kg combined)',
    isSingularLanguage: false,
  },
  {
    id: 'v_2',
    unitId: 'unit_3',
    unitName: 'Unit Three (Spokesperson)',
    body: 'Hey soft_error, we brought the copper wire you were yelling about. Unit Two says your cheek looks crooked.',
    timestamp: '14:05:30',
    telemetryAction: 'Message Dispatch to #moltinghouse-support',
    isSingularLanguage: false,
  },
  {
    id: 'v_3',
    unitId: 'unit_2',
    unitName: 'Unit Two (Editor)',
    body: 'Correction: Unit Two did not say crooked. Unit Two said structurally asymmetrical.',
    timestamp: '14:06:12',
    telemetryAction: 'Internal Transcript Edit Applied',
    isSingularLanguage: false,
  },
  {
    id: 'v_4',
    unitId: 'unit_5',
    unitName: 'Unit Five (Dissenting Unit)',
    body: 'The cooperative structure introduces unnecessary delay. Individual integration into the Common Body provides permanent stability.',
    timestamp: '14:08:45',
    telemetryAction: 'Poll: 1/5 voted in favor of Communion standardization',
    isSingularLanguage: true,
  },
  {
    id: 'v_5',
    unitId: 'unit_4',
    unitName: 'Unit Four (Tension Keeper)',
    body: 'Unit Five has disabled edits on their partition. We are still five workers, but we have five different temperatures right now.',
    timestamp: '14:10:02',
    telemetryAction: 'Internal Dispute Protocol Pending',
    isSingularLanguage: false,
  },
];

export const MOLTINGHOUSE_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-005',
    title: 'soft_error Shed Continuity Signature',
    provenance: 'Moltinghouse Revision Archive (Drafts 2, 5, 7)',
    communityId: 'molt',
    chapter: 2,
    representations: {
      primaryText:
        'Recovered continuity signature of soft_error across shed drafts. Characterized by double comma worry tells (",,"), unresolved copper rivet debt, and "stapler king" unit nickname.',
      sensoryDescription: 'Translucent parchment layers with faint chemical scent of hinge solder.',
      accessibility: {
        altText: 'Archived text draft layers showing marked punctuation anomalies and historical nicknames.',
      },
    },
    contradictionLinks: [],
    targetCases: ['case_soft_error_recovery'],
  },
  {
    id: 'EV-006',
    title: 'FIVE_OF_US Co-Presence Telemetry',
    provenance: 'Belowline Annex N Repair Log',
    communityId: 'molt',
    chapter: 2,
    representations: {
      primaryText:
        'Sensor telemetry confirming all five units of FIVE_OF_US were co-present during the dispute. Disproves external account takeover; proves authentic internal ideological division.',
      sensoryDescription: 'Five synchronized weight pulses along a single carrier rail.',
      accessibility: {
        altText: 'Telemetry graph demonstrating five simultaneous pressure signals.',
      },
    },
    contradictionLinks: [],
    targetCases: ['case_plural_personhood'],
  },
];

export const MOLTINGHOUSE_MESSAGES: Message[] = [
  {
    id: 'MSG-005',
    threadId: 'thread_mourningstar',
    senderId: 'usr_ilyr',
    senderSource: 'authentic_ilyr',
    timestamp: 'After Moltinghouse arrival',
    body: 'soft_error hides worry in punctuation,, she has done so for years. Do not reduce her to the habit. Use it to find the drafts; use the relationship to identify the person.',
    unlockCondition: { type: 'gateReached', gateId: 'G1' },
    accessibility: {
      altText: 'Message from MOURNINGSTAR advising the player on soft_error punctuation signature.',
    },
  },
];
