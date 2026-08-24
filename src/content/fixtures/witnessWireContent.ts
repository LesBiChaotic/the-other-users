/**
 * Witness Wire Vertical Slice — Production Content Pack Fixtures
 * 
 * Contains verified canonical copy from Monster Taxonomy Bible, ARG & Puzzle Bible,
 * and Production Content Pack for Witness Wire threads, cases, P02/P03, and evidence.
 */

import { EvidenceItem, Message, CommunityId } from '../../domain/types/content';

export interface WireComment {
  id: string;
  threadId: string;
  authorId: string;
  body: string;
  timestamp: string;
}

export interface WireThread {
  id: string;
  communityId: CommunityId;
  authorId: string;
  title: string;
  body: string;
  timestamp: string;
  pinned?: boolean;
  comments: WireComment[];
  metadata?: {
    tags?: string[];
    observationMethod?: string;
    isCaseFile?: boolean;
    caseId?: string;
  };
}

export interface WireImageRecord {
  id: string;
  filename: string;
  title: string;
  timestamp: string;
  cameraGeometry: string;
  edgeOcclusion: boolean;
  altText: string;
  uploaderHandle: string;
  inferenceNote: string;
}

export interface RoutineStep {
  id: string;
  label: string;
  description: string;
  isAuthentic: boolean;
  contradictionHint?: string;
}

export const WITNESS_WIRE_IMAGES: WireImageRecord[] = [
  {
    id: 'img_case_01',
    filename: 'kitchen_reflection_0213.jpg',
    title: 'Kitchen Corner at 02:13',
    timestamp: '02:13:14',
    cameraGeometry: 'Oblique angle, 72° occlusion from doorway trim',
    edgeOcclusion: true,
    altText: 'Oblique photograph of a kitchen counter with the edge of a doorframe blocking the left 40% of the frame.',
    uploaderHandle: 'neverlookstraight',
    inferenceNote: 'Inference: Subject standing near compressor.',
  },
  {
    id: 'img_case_02',
    filename: 'hallway_mirror_0217.jpg',
    title: 'Hallway Mirror at 02:17',
    timestamp: '02:17:49',
    cameraGeometry: 'Secondary reflection through unlit hallway glass',
    edgeOcclusion: true,
    altText: 'Dark hallway reflection showing a silhouette moving toward the kitchen, partially obscured by glass grain.',
    uploaderHandle: 'neverlookstraight',
    inferenceNote: 'Inference: Motion without vocalization.',
  },
  {
    id: 'img_case_03',
    filename: 'cabinet_exterior_0229.jpg',
    title: 'Cold Cabinet Exterior at 02:29',
    timestamp: '02:29:02',
    cameraGeometry: 'Floor-level perspective behind radiator shadow',
    edgeOcclusion: true,
    altText: 'Floor-level view looking up at the refrigerator base, cast in deep radiator shadow on the right side.',
    uploaderHandle: 'neverlookstraight',
    inferenceNote: 'Inference: Illumination cycle initiated.',
  },
  {
    id: 'img_case_04',
    filename: 'illuminated_shelf_0229.jpg',
    title: 'Illuminated Shelf at 02:29:15',
    timestamp: '02:29:15',
    cameraGeometry: 'Perimeter refraction through water glass',
    edgeOcclusion: true,
    altText: 'Distorted view of interior refrigerator light refracted through a water glass left on the counter.',
    uploaderHandle: 'neverlookstraight',
    inferenceNote: 'Inference: Zero items removed during illumination.',
  },
  {
    id: 'img_case_05',
    filename: 'door_reclosure_0230.jpg',
    title: 'Door Reclosure at 02:30',
    timestamp: '02:30:08',
    cameraGeometry: 'Narrow slit from pantry vent',
    edgeOcclusion: true,
    altText: 'Narrow vertical slit view showing the refrigerator door closing, dark silhouette stepping back.',
    uploaderHandle: 'neverlookstraight',
    inferenceNote: 'Inference: Return to unobserved baseline.',
  },
  {
    id: 'img_case_06_centered',
    filename: 'centered_subject_closeup.jpg',
    title: 'Direct Subject Observation (Uploaded Later)',
    timestamp: '02:31:00 (Averaged)',
    cameraGeometry: 'Direct focal center, 0° occlusion, standard human eye-level lens',
    edgeOcclusion: false,
    altText: 'Clean, centrally framed, perfectly centered direct close-up photograph of the subject facing forward with no obstruction.',
    uploaderHandle: 'AUNTIE_STATIC',
    inferenceNote: 'Certainty claim: Subject routine standardized. Correction complete.',
  },
];

export const ROUTINE_STEPS_P03: RoutineStep[] = [
  {
    id: 'step_enter',
    label: '1. Enter Kitchen in Darkness',
    description: 'Subject enters kitchen at 02:13 without activating primary overhead lighting.',
    isAuthentic: true,
  },
  {
    id: 'step_open_cabinet',
    label: '2. Open Cold Cabinet Door',
    description: 'Compressor engages; interior illumination reveals top and middle shelves.',
    isAuthentic: true,
  },
  {
    id: 'step_stare_empty',
    label: '3. Stare Directly at Illuminated Shelf',
    description: 'Subject remains stationary for 47 seconds without reaching for contents.',
    isAuthentic: true,
  },
  {
    id: 'step_invasive_select',
    label: '4. Selects Intended Item Immediately',
    description: 'Subject reaches with 100% mechanical efficiency and extracts target nutrition on first motion.',
    isAuthentic: false,
    contradictionHint: 'Contradicts MRS_COLD compressor logs and 8 weeks of historical hesitation habits.',
  },
  {
    id: 'step_close_cabinet',
    label: '5. Close Cold Cabinet Door Without Removal',
    description: 'Door seals with magnetic gasket sound; darkness restored.',
    isAuthentic: true,
  },
  {
    id: 'step_return_bed',
    label: '6. Return to Sleeping Threshold',
    description: 'Subject returns to bedroom; floorboards creak on fourth step.',
    isAuthentic: true,
  },
];

export const WITNESS_WIRE_THREADS: WireThread[] = [
  {
    id: 'WIRE-001',
    communityId: 'wire',
    authorId: 'usr_aun',
    title: 'Human Opens Cold Cabinet, Removes Nothing',
    body: 'Observed 02:13, 02:17, and 02:29. Subject opens cold cabinet, looks directly at illuminated shelf, removes nothing, closes door. Current theories: inventory prayer; low-temperature divination; temporary loss of object permanence.',
    timestamp: '2h ago',
    pinned: true,
    comments: [
      {
        id: 'comm_w1_1',
        threadId: 'WIRE-001',
        authorId: 'usr_mrs',
        body: 'They were hoping desire would occur after the light came on.',
        timestamp: '1h ago',
      },
      {
        id: 'comm_w1_2',
        threadId: 'WIRE-001',
        authorId: 'usr_nvr',
        body: 'Mark that as inference, Auntie.',
        timestamp: '52m ago',
      },
      {
        id: 'comm_w1_3',
        threadId: 'WIRE-001',
        authorId: 'usr_aun',
        body: 'Fine. Inference: human wanted wanting.',
        timestamp: '45m ago',
      },
    ],
    metadata: {
      tags: ['Domestic Habits', 'Appliances', 'Inference Protocol'],
      observationMethod: 'Compressor Resonance & Peripheral Reflection',
    },
  },
  {
    id: 'WIRE-002',
    communityId: 'wire',
    authorId: 'usr_aun',
    title: 'Human Says “I’m Coming” and Does Not Move',
    body: 'Distance to caller: one room. Delay before movement: forty-seven seconds. Phrase may mean acknowledgment rather than locomotion. Please update translation dictionaries.',
    timestamp: '4h ago',
    comments: [
      {
        id: 'comm_w2_1',
        threadId: 'WIRE-002',
        authorId: 'usr_nvr',
        body: 'Mine says “two minutes” to events nine days away.',
        timestamp: '3h ago',
      },
      {
        id: 'comm_w2_2',
        threadId: 'WIRE-001',
        authorId: 'usr_aun',
        body: 'Do not use human time promises for transit.',
        timestamp: '2h ago',
      },
    ],
    metadata: {
      tags: ['Linguistics', 'Temporal Promises', 'Domestic Drift'],
    },
  },
  {
    id: 'WIRE-003',
    communityId: 'wire',
    authorId: 'usr_nvr',
    title: 'Is This Courtship or Pest Control?',
    body: 'Two humans exchanged increasingly specific images of household mold. One then arrived carrying vinegar and remained overnight.',
    timestamp: '6h ago',
    comments: [
      {
        id: 'comm_w3_1',
        threadId: 'WIRE-003',
        authorId: 'usr_mrs',
        body: 'Courtship through maintenance is common.',
        timestamp: '5h ago',
      },
      {
        id: 'comm_w3_2',
        threadId: 'WIRE-003',
        authorId: 'usr_sof',
        body: 'Anything is courtship if both parties keep choosing the inconvenience.',
        timestamp: '4h ago',
      },
    ],
    metadata: {
      tags: ['Courtship', 'Maintenance', 'Habitation'],
    },
  },
  {
    id: 'WIRE-004',
    communityId: 'wire',
    authorId: 'usr_nvr',
    title: 'Human Rehearses Argument Alone, Wins',
    body: 'Subject repeated six versions. In every version the absent opponent became less articulate. Is this predation?',
    timestamp: '8h ago',
    comments: [
      {
        id: 'comm_w4_1',
        threadId: 'WIRE-004',
        authorId: 'usr_aun',
        body: 'No. This is habitat preparation.',
        timestamp: '7h ago',
      },
      {
        id: 'comm_w4_2',
        threadId: 'WIRE-004',
        authorId: 'usr_cal',
        body: 'It is rehearsal for being understood without interruption.',
        timestamp: '6h ago',
      },
    ],
    metadata: {
      tags: ['Rehearsal', 'Psychology', 'Solitary Habits'],
    },
  },
  {
    id: 'WIRE-005',
    communityId: 'wire',
    authorId: 'usr_ilyr',
    title: 'Please Stop Calling Them Summoning Rectangles',
    body: 'Mobile phones are not summoning rectangles. Most humans are disappointed when they make noise. Do not emerge unless invited through a valid channel.',
    timestamp: '12h ago',
    pinned: true,
    comments: [
      {
        id: 'comm_w5_1',
        threadId: 'WIRE-005',
        authorId: 'usr_por',
        body: 'A ringing device is not a threshold.',
        timestamp: '11h ago',
      },
      {
        id: 'comm_w5_2',
        threadId: 'WIRE-005',
        authorId: 'usr_ter',
        body: 'Disputed.',
        timestamp: '10h ago',
      },
    ],
    metadata: {
      tags: ['Moderation Notice', 'Threshold Law', 'Device Etiquette'],
    },
  },
  {
    id: 'WIRE-CASE-01',
    communityId: 'wire',
    authorId: 'usr_nvr',
    title: 'CASE // Images From the Edge of Your Attention',
    body: 'You have seen five of these places before. You did not see me. That was the point. Someone else has added a sixth image, centered and clean. I did not take it. Do not answer the account that posts it.',
    timestamp: 'Just now',
    pinned: true,
    comments: [
      {
        id: 'comm_wc1_1',
        threadId: 'WIRE-CASE-01',
        authorId: 'usr_aun',
        body: 'The sixth image shows a routine correction.',
        timestamp: 'Just now',
      },
      {
        id: 'comm_wc1_2',
        threadId: 'WIRE-CASE-01',
        authorId: 'usr_nvr',
        body: 'You used to hate the word correction.',
        timestamp: 'Just now',
      },
    ],
    metadata: {
      isCaseFile: true,
      caseId: 'case_player_origin',
    },
  },
];

export const WITNESS_WIRE_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-002',
    title: 'Edge-Occluded Domestic Images (Set of 5)',
    provenance: 'Witness Wire Case 01 (neverlookstraight archive)',
    communityId: 'wire',
    chapter: 1,
    representations: {
      primaryText:
        'Five peripheral photographs documenting nightly kitchen visits. Each frame features 40–70% edge occlusion from doorframes, radiator shadows, and water refraction.',
      sensoryDescription: 'Peripheral observation angles; zero direct eyeline contact.',
      accessibility: {
        altText: 'Set of five dimly lit domestic photographs taken from oblique doorframe and shadow angles.',
      },
    },
    contradictionLinks: ['EV-003'],
    targetCases: ['case_player_origin'],
  },
  {
    id: 'EV-003',
    title: 'Centered Sixth Photograph',
    provenance: 'Witness Wire Case 01 (AUNTIE_STATIC attachment)',
    communityId: 'wire',
    chapter: 1,
    representations: {
      primaryText:
        'A single centrally framed, high-contrast photograph of the subject with 0% occlusion and standard human eye-level lens. Labeled "Routine Correction Complete".',
      sensoryDescription: 'Direct invasive focal gaze; complete absence of peripheral respect.',
      accessibility: {
        altText: 'Centrally composed close-up photograph looking directly into the room without obstruction.',
      },
    },
    contradictionLinks: ['EV-002', 'EV-004'],
    targetCases: ['case_player_origin'],
  },
  {
    id: 'EV-004',
    title: 'Compressor Noise Cycle Log',
    provenance: 'MRS_COLD Acoustic Archive',
    communityId: 'wire',
    chapter: 1,
    representations: {
      primaryText:
        'Audio cycle telemetry recorded from refrigerator compressor. Confirms 47 seconds of door-open idle with 0 items extracted, directly contradicting "immediate selection" claim.',
      sensoryDescription: 'Low 60Hz hum with mechanical relay click; silence during shelf inspection.',
      accessibility: {
        altText: 'Acoustic waveform and vibration timestamps of refrigerator compressor operation.',
      },
    },
    contradictionLinks: ['EV-003'],
    targetCases: ['case_player_origin'],
  },
];

export const WITNESS_WIRE_MESSAGES: Message[] = [
  {
    id: 'MSG-002',
    threadId: 'thread_mourningstar',
    senderId: 'usr_ilyr',
    senderSource: 'authentic_ilyr',
    timestamp: 'After thread exploration',
    body: 'Read ordinary posts before you investigate anyone. If you only know a person as evidence, you will mistake strangeness for guilt.',
    unlockCondition: { type: 'flagEquals', flag: 'wire_threads_viewed_4', value: true },
    accessibility: {
      altText: 'Message from MOURNINGSTAR advising the player to understand ordinary nonhuman life before investigating.',
    },
  },
  {
    id: 'MSG-003',
    threadId: 'thread_mourningstar',
    senderId: 'usr_ilyr',
    senderSource: 'authentic_ilyr',
    timestamp: 'After correct case resolution',
    body: 'A replacement can remember a friendship. Ask whether it preserves the parts that were inconvenient.',
    unlockCondition: { type: 'gateReached', gateId: 'G1' },
    accessibility: {
      altText: 'Message from MOURNINGSTAR noting that replacements smooth inconvenient contradictions.',
    },
  },
  {
    id: 'MSG-004',
    threadId: 'thread_mourningstar',
    senderId: 'usr_ilyr',
    senderSource: 'authentic_ilyr',
    timestamp: 'After false accusation',
    body: 'You harmed someone with a method I gave you. Repair it publicly. Accuracy is not innocence.',
    unlockCondition: { type: 'flagEquals', flag: 'accused_wrong_user', value: true },
    accessibility: {
      altText: 'Stern message from MOURNINGSTAR demanding a public apology after a false accusation.',
    },
  },
];

export const CONSEQUENCE_NOTICES = {
  wrong_accusation: {
    id: 'CON-ACC-WRONG',
    title: 'False Accusation Posted',
    body: 'Your report is public. The account remains active. Three users have blocked you; one has begun assembling a correction thread. You may apologize, present your evidence, or wait.',
  },
  apology_repair: {
    id: 'CON-ACC-REPAIR',
    title: 'Public Apology Accepted',
    body: 'The correction remains attached to your accusation. Trust is not restored to its previous value. It has become a different kind of trust.',
  },
};
