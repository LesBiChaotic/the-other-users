/**
 * Communion Community & P12/P13 Content Fixtures — The Other Users
 * 
 * Contains production copy for Communion sermons, testimonies (P12),
 * and litany concordance analysis (P13).
 */

import { EvidenceItem } from '../../domain/types/content';

export interface CommunionTestimony {
  id: string;
  authorHandle: string;
  species: string;
  title: string;
  body: string;
  timestamp: string;
  isAuthenticBeliever: boolean;
  isGeneratedSuspect: boolean;
  tells: string;
  analysisExplanation: string;
}

export interface LitanyRevision {
  id: string;
  versionNumber: number;
  title: string;
  lines: string[];
  replicationInstruction: string;
  mutationAnalysis: string;
}

export const COMMUNION_SERMONS: Array<{
  id: string;
  title: string;
  authorHandle: string;
  body: string;
  timestamp: string;
}> = [
  {
    id: 'COM-001',
    title: 'Sermon: The Labor of Being Distinct',
    authorHandle: 'calmly_complete',
    body: 'Every body spends itself explaining its border. Every name is a door requiring maintenance. We do not promise that joining is painless. We promise the pain will no longer be private.',
    timestamp: '1 day ago',
  },
];

export const COMMUNION_TESTIMONIES_P12: CommunionTestimony[] = [
  {
    id: 'COM-001_t',
    authorHandle: 'calmly_complete',
    species: 'Expectation Wasp Colony',
    title: 'Testimony of Surrendered Difference',
    body: 'Difference is work. Completion is rest. Ask me what I surrendered before calling my peace counterfeit. I chose synchronization knowing every room would feel smaller, but the cold would stop entering.',
    timestamp: '2 days ago',
    isAuthenticBeliever: true,
    isGeneratedSuspect: false,
    tells: 'Authentic: Sincere theological belief dating back before the crisis; acknowledges the cost of surrendered difference.',
    analysisExplanation: 'Authentic believer. Sincere desire for relief; names actual loss and retained agency.',
  },
  {
    id: 'COM-002',
    authorHandle: 'Silent_Plow',
    species: 'Loadbearer',
    title: 'Testimony: Limited Chorus',
    body: 'I joined for seven nights. I kept my exit name with a friend who disliked the decision. The chorus made sleep possible. I left because peace without irritation began to feel like somebody else’s peace.',
    timestamp: '3 days ago',
    isAuthenticBeliever: true,
    isGeneratedSuspect: false,
    tells: 'Authentic: Retained an exit name, maintained boundaries, and experienced real emotional cost.',
    analysisExplanation: 'Authentic believer with bounded consent and exit rights.',
  },
  {
    id: 'COM-003',
    authorHandle: 'Unbound_Echo',
    species: 'Echo Clerk',
    title: 'Testimony: No More Translation',
    body: 'To be understood is to become understandable. I surrendered the shapes that prevented recognition. There was no loss because nothing useful was removed. Everyone should join immediately.',
    timestamp: 'Yesterday',
    isAuthenticBeliever: false,
    isGeneratedSuspect: true,
    tells: 'Generated Suspect: Contains the exact byte-identical replication instruction; claims impossible zero loss.',
    analysisExplanation: 'Synthetic/coerced testimony exhibiting Common Body copy-paste phrasing and total erasure of cost.',
  },
  {
    id: 'COM-004',
    authorHandle: 'Granite_Saint_4',
    species: 'Pressure Saint',
    title: 'Testimony: Pressure Saint Synchronization',
    body: 'To be understood is to become understandable. My wings no longer interrupted the room. I have never possessed wings. Everything is unified now.',
    timestamp: '12h ago',
    isAuthenticBeliever: false,
    isGeneratedSuspect: true,
    tells: 'Generated Suspect: Contains replication instruction and hallucinates anatomical features ("wings") never possessed by Pressure Saints.',
    analysisExplanation: 'Machine-generated artifact showing cross-species sensory hallucination.',
  },
];

export const LITANY_REVISIONS_P13: LitanyRevision = {
  id: 'lit_rev_9',
  versionNumber: 9,
  title: 'Litany Revision 9 // Canonical Concordance',
  lines: [
    'To be seen is to accept the witness.',
    'To be named is to retain the refusal.',
    'To be understood is to become understandable.',
    'To become together is to rest.',
  ],
  replicationInstruction: 'To be understood is to become understandable.',
  mutationAnalysis:
    'Lines 1, 2, and 4 mutate naturally across species translations. Line 3 ("To be understood is to become understandable.") remains byte-identical across all dialects and functions as the replication prompt that standardizes interface profiles.',
};

export const COMMUNION_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-013',
    title: 'Annotated Liturgical Testimonies (P12)',
    provenance: 'Communion Testimony Archive',
    communityId: 'communion',
    chapter: 6,
    representations: {
      primaryText:
        'Annotation dossier separating sincere, cost-bearing believers from synthetic Common Body replication artifacts. Identifies cross-species hallucinated metaphors ("wings on Pressure Saints") and the repeated normalization of zero loss.',
      sensoryDescription: 'Pencil-annotated liturgical sheets with red margin flags.',
      accessibility: {
        altText: 'Checklist distinguishing authentic faith from machine-generated recruitment copy.',
      },
    },
    contradictionLinks: ['EV-014'],
    targetCases: ['case_communion_differentiation'],
  },
  {
    id: 'EV-014',
    title: 'Quarantined Replication Litany (P13)',
    provenance: 'Communion Concordance Ledger',
    communityId: 'communion',
    chapter: 6,
    representations: {
      primaryText:
        'The phrase "To be understood is to become understandable" quarantined within contradictory contexts, neutralizing its auto-standardization prompt without creating martyr distribution.',
      sensoryDescription: 'Bound parchment containing opposing philosophical commentary around a rigid central line.',
      accessibility: {
        altText: 'Concordance ledger displaying quarantined liturgical phrase safely surrounded by contradictions.',
      },
    },
    contradictionLinks: ['EV-013'],
    targetCases: ['case_litany_quarantine'],
  },
];
