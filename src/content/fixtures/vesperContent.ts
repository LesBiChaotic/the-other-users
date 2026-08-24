/**
 * Vesper Community & P08/P09 Content Fixtures — The Other Users
 * 
 * Contains production copy for Vesper compatibility profiles, ROOM_TONE case (P08),
 * and Body-Sharing consent agreement reconstruction (P09).
 */

import { EvidenceItem } from '../../domain/types/content';

export interface VesperProfile {
  id: string;
  handle: string;
  species: string;
  occupancy: string;
  lightTolerance: string;
  feedingArrangement: string;
  separationProtocol: string;
  dealBreaker: string;
  bio: string;
  isDateC?: boolean;
}

export interface ConsentClause {
  id: string;
  category: 'Scope' | 'Duration' | 'Revocation' | 'Emergency Separation' | 'Data Retention';
  plainSummary: string;
  safeClauseText: string;
  alteredPredatoryText: string;
  isAltered: boolean;
  explanation: string;
}

export const VESPER_PROFILES: VesperProfile[] = [
  {
    id: 'VESP-001',
    handle: 'ROOM_TONE',
    species: 'Apartment Choir',
    occupancy: 'Nine residents (disputed, lease started at twelve)',
    lightTolerance: 'Low, except Resident Six who tolerates amber streetlamps',
    feedingArrangement: 'Shared dream acoustics and low-frequency resonance',
    separationProtocol: 'Temporary, witnessed by porch organism, with verified return route',
    dealBreaker: 'Being called harmonious when we are only trapped together',
    bio: 'Twelve residents when the lease began. Nine at last chorus. Our music contains the rooms we cannot afford.',
  },
  {
    id: 'VESP-002',
    handle: 'Date C / "calmly_complete_venue"',
    species: 'Expectation Wasp Colony / Communion Liaison',
    occupancy: 'Universal (hosts accepted: all)',
    lightTolerance: 'Any condition without resistance',
    feedingArrangement: 'Total emotional synchronization without dispute',
    separationProtocol: 'Unnecessary (permanent integration promised)',
    dealBreaker: 'Retained private contradiction',
    bio: 'Identity boundaries: optimized after arrival. Universal compatibility without the exhaustion of negotiation.',
    isDateC: true,
  },
  {
    id: 'VESP-003',
    handle: 'Lichen_And_Loom',
    species: 'Laundry Saint Colony',
    occupancy: 'Distributed thread collective',
    lightTolerance: 'Dark closet or low-humidity pantry',
    feedingArrangement: 'Preserved family scent and forgotten cotton fibers',
    separationProtocol: 'Seasonal unwinding; requires gentle spooling',
    dealBreaker: 'Bleach or industrial dry-cleaning chemicals',
    bio: 'We mend worn collars while you sleep. We do not judge what you dropped behind the dryer.',
  },
  {
    id: 'VESP-004',
    handle: 'threshold_patron',
    species: 'Lintelkin',
    occupancy: 'One body, door-anchored',
    lightTolerance: 'Threshold gradient (sunrise/sunset)',
    feedingArrangement: 'Witnessed entry promises',
    separationProtocol: 'Instant upon departure from porch',
    dealBreaker: 'Entering without explicit invitation',
    bio: 'Ask for the door, the purpose, and the duration. I will hold the frame open as long as agreed.',
  },
];

export const BODY_SHARING_CLAUSES_P09: ConsentClause[] = [
  {
    id: 'clause_scope',
    category: 'Scope',
    plainSummary: 'This physical body only; no copies or secondary hosts.',
    safeClauseText: 'Occupancy is granted exclusively to the undersigned parties within the primary physical form and does not extend to replicated digital models or derivative avatars.',
    alteredPredatoryText: 'Occupancy is granted across this body and any synchronized network models or secondary host vessels as deemed efficient by platform administrators.',
    isAltered: false,
    explanation: 'Must restrict permission strictly to the physical body without allowing Common Body network cloning.',
  },
  {
    id: 'clause_duration',
    category: 'Duration',
    plainSummary: 'One night only, terminating at agreed waking.',
    safeClauseText: 'Agreement commences at 22:00 and automatically expires upon confirmed morning waking or after 8 consecutive hours, whichever occurs first.',
    alteredPredatoryText: 'Agreement commences at 22:00 and continues indefinitely until mutual consensus of all past and future occupants is ratified.',
    isAltered: false,
    explanation: 'Must specify an exact terminating timestamp or automatic expiry without requiring perpetual consensus.',
  },
  {
    id: 'clause_revocation',
    category: 'Revocation',
    plainSummary: 'Either party may revoke consent independently at any moment.',
    safeClauseText: 'Either participant retains the non-negotiable right to terminate occupancy immediately and unilaterally without explanation or penalty.',
    alteredPredatoryText: 'Revocation requires 30 days written notice and approval from TermsMayApply arbitration services.',
    isAltered: false,
    explanation: 'Revocation must be unilateral and immediate; conditional revocation is predatory entrapment.',
  },
  {
    id: 'clause_emergency',
    category: 'Emergency Separation',
    plainSummary: 'Immediate physical separation at the porch threshold.',
    safeClauseText: 'In the event of distress, both bodies shall immediately decouple at the designated porch threshold under the witness of porchlight_ON.',
    alteredPredatoryText: 'In the event of distress, occupants shall be sedated into seamless harmonic equilibrium to prevent physical agitation.',
    isAltered: false,
    explanation: 'Emergency separation must physically decouple parties rather than enforcing sedation.',
  },
  {
    id: 'clause_retention',
    category: 'Data Retention',
    plainSummary: 'Zero sensory copies or behavioral profiles retained after exit.',
    safeClauseText: 'Upon departure, all sensory impressions, gait recordings, and behavioral metrics must be permanently expunged without archival retention.',
    alteredPredatoryText: 'Upon departure, all behavioral telemetry and neural contour impressions become the irrevocable property of the Menagerie Directorate.',
    isAltered: false,
    explanation: 'Sensory impressions must not be harvested to train replacement models.',
  },
];

export const VESPER_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-009',
    title: 'Vesper Compatibility Constellation (ROOM_TONE Missing Residents)',
    provenance: 'Vesper Compatibility Registry & Venue Exit Logs',
    communityId: 'vesper',
    chapter: 4,
    representations: {
      primaryText:
        'Proof that ROOM_TONE was fragmented at Date C ("calmly_complete_venue"). Date C promised universal harmony with zero boundaries, concealing the capture of three choir residents into Communion synchronization.',
      sensoryDescription: 'Dissonant choral harmonies thinning into a single synthesized tone.',
      accessibility: {
        altText: 'Profile revision line showing choir occupancy dropping from 12 to 9 immediately following Date C match.',
      },
    },
    contradictionLinks: ['EV-010'],
    targetCases: ['case_room_tone_recovery'],
  },
  {
    id: 'EV-010',
    title: 'Repaired Body-Sharing Consent Contract',
    provenance: 'Vesper Safety Template Archive',
    communityId: 'vesper',
    chapter: 4,
    representations: {
      primaryText:
        'Fully restored plain-language consent agreement establishing unilateral revocation, strict duration, and data deletion. Exposes TermsMayApply circular exception clause.',
      sensoryDescription: 'Crisp paper with verified wax seal and clear threshold marks.',
      accessibility: {
        altText: 'Contract document displaying five restored safe clauses protecting bodily sovereignty.',
      },
    },
    contradictionLinks: ['EV-009'],
    targetCases: ['case_terms_may_apply_clause'],
  },
];

export const VESPER_DISCUSSIONS = [
  {
    id: 'VESP-005',
    title: 'Would You Date a Human?',
    authorHandle: 'ROOM_TONE',
    body: 'They are warm, structurally singular in theory, and culturally incapable of stating what they want before being asked where they want to eat. We would date one human or twelve. We would not date "whatever you want."',
    timestamp: '1 day ago',
    comments: [
      {
        id: 'comm_v5_1',
        authorHandle: 'soft_error',
        body: 'Humans molt verbally,, "I don\'t mind" often means the skin is not ready.',
        timestamp: '18h ago',
      },
      {
        id: 'comm_v5_2',
        authorHandle: 'AUNTIE_STATIC',
        body: 'Observe the refrigerator stare. They wait for desire to arrive after the door opens.',
        timestamp: '16h ago',
      },
    ],
  },
  {
    id: 'VESP-006',
    title: 'Is Dream Acoustic Sharing Considered Cohabitation?',
    authorHandle: 'ApartmentChoir_4',
    body: 'If two choirs harmonize nocturnal dream frequencies across adjacent buildings, does that create shared tenancy obligations? Our landlord heard the bass resonance in the floorboards.',
    timestamp: '2 days ago',
    comments: [
      {
        id: 'comm_v6_1',
        authorHandle: 'ROOM_TONE',
        body: 'Harmonizing is not lease assumption. Retain separate exit routes.',
        timestamp: '1 day ago',
      },
      {
        id: 'comm_v6_2',
        authorHandle: 'TermsMayApply',
        body: 'Acoustic vibration exceeding 40 Hz constitutes constructive occupancy in three wards.',
        timestamp: '1 day ago',
      },
    ],
  },
  {
    id: 'VESP-007',
    title: 'Safety Notice: Why "Perfect Overlap" Is a Danger Sign',
    authorHandle: 'VesperSafety_Admin',
    body: 'Compatibility describes negotiated coexistence across different bodies. A profile claiming zero conflict and universal agreement has either omitted a body or omitted consent.',
    timestamp: '3 days ago',
    comments: [
      {
        id: 'comm_v7_1',
        authorHandle: 'calmly_complete',
        body: 'Peace does not require suspicion.',
        timestamp: '2 days ago',
      },
      {
        id: 'comm_v7_2',
        authorHandle: 'ROOM_TONE',
        body: 'Peace without irritation is just someone else\'s peace.',
        timestamp: '2 days ago',
      },
    ],
  },
  {
    id: 'VESP-008',
    title: 'O04 // Provisional Compatibility Profile Alignment',
    authorHandle: 'VesperSafety_Admin',
    body: 'Authored matching exercise: Define explicit boundaries, light tolerance, occupancy, and unilateral exit protocols for your provisional species profile. Proves that difference is safe when negotiated honestly.',
    timestamp: 'Just now',
    comments: [
      {
        id: 'comm_v8_1',
        authorHandle: 'threshold_patron',
        body: 'Name the door and the return path. That is all intimacy requires.',
        timestamp: 'Just now',
      },
    ],
  },
];
