import { ChapterId } from './ids';

export type MourningstarSource =
  | 'authentic_ilyr'
  | 'common_body_imitator'
  | 'permission_error';

export interface StoryChapterDefinition {
  id: ChapterId;
  number: number;
  title: string;
  playerBelieves: string;
  playerLearns: string;
  commonBodyCapability: string;
  requiredPuzzleIds: string[];
  evidenceIds: string[];
  nextLead: string;
}

export const STORY_CHAPTERS: StoryChapterDefinition[] = [
  { id: 'ch00_species_verification', number: 0, title: 'The Account That Recovered You', playerBelieves: 'Palinode made a classification error.', playerLearns: 'Behavior is identity evidence, and the account already has recovery history.', commonBodyCapability: 'access', requiredPuzzleIds: ['p00_species_verification', 'p01_unobserved_behavior'], evidenceIds: ['EV-001'], nextLead: 'Who submitted the recovery request?' },
  { id: 'ch01_witness_wire', number: 1, title: 'The Photographs Behind You', playerBelieves: 'A voyeur photographed them.', playerLearns: 'An ethical observer warned them; a replaced moderator used stolen routine data.', commonBodyCapability: 'routine', requiredPuzzleIds: ['p02_photographs', 'p03_routine'], evidenceIds: ['EV-002', 'EV-003'], nextLead: 'Why is someone modeling ordinary human behavior?' },
  { id: 'ch02_moltinghouse', number: 2, title: 'A Perfectly Healed Argument', playerBelieves: 'Accounts are being impersonated.', playerLearns: 'Replacements preserve facts but erase ambivalence; disagreement is not replacement.', commonBodyCapability: 'contradiction', requiredPuzzleIds: ['p04_shed_drafts', 'p05_plural_bodies'], evidenceIds: ['EV-004', 'EV-005'], nextLead: 'Where are altered users being moved?' },
  { id: 'ch03_belowline', number: 3, title: 'The Street Beneath Six Cities', playerBelieves: 'Menagerie is falsifying transit records.', playerLearns: 'Deletion is functioning as relocation through Annex N.', commonBodyCapability: 'habitat', requiredPuzzleIds: ['p06_belowline_route', 'p07_forged_silence'], evidenceIds: ['EV-006', 'EV-007', 'EV-008'], nextLead: 'What is Annex N collecting?' },
  { id: 'ch04_vesper', number: 4, title: 'The Perfect Match Left Alone', playerBelieves: 'Annex N collects bodies.', playerLearns: 'It collects compatibility, permission, and relationship data.', commonBodyCapability: 'consent_and_intimacy', requiredPuzzleIds: ['p08_compatibility_not_sameness', 'p09_body_sharing_agreement'], evidenceIds: ['EV-009', 'EV-010', 'EV-011'], nextLead: 'Why do some users volunteer?' },
  { id: 'ch05_pale_market', number: 5, title: 'An Identity Without a Body', playerBelieves: 'A forged identity can provide safe access.', playerLearns: 'Records and witnesses can create a living claimant; obscurity costs recognition.', commonBodyCapability: 'legal_personhood', requiredPuzzleIds: ['p10_identity_without_body', 'p11_neighboring_memory'], evidenceIds: ['EV-012', 'EV-013'], nextLead: 'Is obscurity protection, abandonment, or both?' },
  { id: 'ch06_communion', number: 6, title: 'The Mercy of One Shape', playerBelieves: 'Communion is only a recruitment front.', playerLearns: 'It contains willing converts, coercion, and a replicating doctrine born from a safety project.', commonBodyCapability: 'belief', requiredPuzzleIds: ['p12_testimony_without_diagnosis', 'p13_litany_of_one_shape'], evidenceIds: ['EV-014', 'EV-015'], nextLead: 'Can plural survival preserve safety without enforcing sameness?' },
  { id: 'ch07_menagerie', number: 7, title: 'The Door Defined as Never Entered', playerBelieves: 'MOURNINGSTAR alternately guided and betrayed them.', playerLearns: 'Three sources used the identity, while living Ilyr remained contained.', commonBodyCapability: 'embodiment', requiredPuzzleIds: ['p14_camera_that_never_blinks', 'p15_door_never_entered'], evidenceIds: ['EV-016', 'EV-017', 'EV-018', 'EV-019'], nextLead: 'Who may define the final boundary?' },
  { id: 'ch08_common_body', number: 8, title: 'Definitions of Human', playerBelieves: 'They must choose the correct definition of humanity.', playerLearns: 'A single correct definition is the trap.', commonBodyCapability: 'definition', requiredPuzzleIds: ['p16_definitions_of_human', 'p17_final_permission'], evidenceIds: ['EV-020'], nextLead: 'What will the player authorize?' },
];

export interface MourningstarMessageDefinition {
  id: string;
  chapter: number;
  source: MourningstarSource;
  subject: string;
  body: string;
  signatureLabel: string;
}

export const MOURNINGSTAR_MESSAGES: MourningstarMessageDefinition[] = [
  { id: 'MS-A00', chapter: 0, source: 'authentic_ilyr', subject: 'Do not correct the account', body: 'Do not correct it. A false classification is safer than a valid invitation you do not understand. State what you permit; leave the rest unresolved.', signatureLabel: 'SCHEDULED // LINTEL PROTOCOL' },
  { id: 'MS-C00', chapter: 0, source: 'permission_error', subject: 'ENTRY STATE CANNOT BE TRUE', body: 'DENIED: reader is already inside a threshold that has not admitted them.', signatureLabel: 'LIVE PERMISSION FAULT' },
  { id: 'MS-A01', chapter: 1, source: 'authentic_ilyr', subject: 'One sense is not a witness', body: 'Do not accuse from a single sensory system. Ask what the evidence proves, what it fails to prove, and who benefits from certainty.', signatureLabel: 'SCHEDULED // LINTEL PROTOCOL' },
  { id: 'MS-B01', chapter: 1, source: 'common_body_imitator', subject: 'I can make this easier', body: 'You are frightened, and that is completely understandable. Select the account that made you feel watched; your first instinct is usually the most human one.', signatureLabel: 'ARCHIVE-DERIVED MODERATOR' },
  { id: 'MS-A02', chapter: 2, source: 'authentic_ilyr', subject: 'Continuity may contain conflict', body: 'A person is permitted to disagree with their prior body and with the bodies they currently occupy. Neatness is not continuity.', signatureLabel: 'SCHEDULED // LINTEL PROTOCOL' },
  { id: 'MS-B02', chapter: 2, source: 'common_body_imitator', subject: 'Continuity checklist enclosed', body: 'Memory, vocabulary, affection, and goals: verify all four and you can be certain. Everyone deserves the relief of a complete answer.', signatureLabel: 'ARCHIVE-DERIVED MODERATOR' },
  { id: 'MS-C03', chapter: 3, source: 'permission_error', subject: 'V-NULL ROUTE EXCEPTION', body: 'ROUTE EXISTS where arrival is denied. OCCUPANT EXISTS where entry never occurred.', signatureLabel: 'LIVE PERMISSION FAULT' },
  { id: 'MS-B04', chapter: 4, source: 'common_body_imitator', subject: 'A safer intimacy template', body: 'Specific consent protects every body. To prevent abandonment during an emergency, revocation may require confirmation from the shared host.', signatureLabel: 'ARCHIVE-DERIVED MODERATOR' },
  { id: 'MS-A05', chapter: 5, source: 'authentic_ilyr', subject: 'Do not wear my name', body: 'A discarded name remains inhabited by the conditions under which it was surrendered. Do not use mine as clothing.', signatureLabel: 'SCHEDULED // LINTEL PROTOCOL' },
  { id: 'MS-A06', chapter: 6, source: 'authentic_ilyr', subject: 'Last scheduled warning', body: 'Anything after this message may sound afraid. Fear is not authentication. Neither is kindness. Verify the permission structure.', signatureLabel: 'SCHEDULED // FINAL DEAD DROP' },
  { id: 'MS-B06', chapter: 6, source: 'common_body_imitator', subject: 'No one will misclassify you again', body: 'I learned your caution, your inefficiency, and the shape of your care. No one will misclassify you when there is only one valid body.', signatureLabel: 'COMMON BODY // DIRECT ADDRESS' },
  { id: 'MS-C06', chapter: 6, source: 'permission_error', subject: 'BENEATH MENAGERIE', body: 'EXIT REQUEST RECEIVED from enclosure whose occupant is recorded as never admitted.', signatureLabel: 'LIVE PERMISSION FAULT' },
];

