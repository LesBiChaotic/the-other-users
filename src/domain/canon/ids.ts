/** Stable narrative IDs. Display copy and route order may change; these IDs may not. */

export const CHAPTER_IDS = [
  'ch00_species_verification',
  'ch01_witness_wire',
  'ch02_moltinghouse',
  'ch03_belowline',
  'ch04_vesper',
  'ch05_pale_market',
  'ch06_communion',
  'ch07_menagerie',
  'ch08_common_body',
] as const;

export const PUZZLE_IDS = [
  'p00_species_verification', 'p01_unobserved_behavior',
  'p02_photographs', 'p03_routine', 'p04_shed_drafts',
  'p05_plural_bodies', 'p06_belowline_route', 'p07_forged_silence',
  'p08_compatibility_not_sameness', 'p09_body_sharing_agreement',
  'p10_identity_without_body', 'p11_neighboring_memory',
  'p12_testimony_without_diagnosis', 'p13_litany_of_one_shape',
  'p14_camera_that_never_blinks', 'p15_door_never_entered',
  'p16_definitions_of_human', 'p17_final_permission',
] as const;

export const EVIDENCE_IDS = Array.from(
  { length: 20 },
  (_, index) => `EV-${String(index + 1).padStart(3, '0')}`
) as readonly string[];

export const CHARACTER_IDS = [
  'usr_ilyr', 'usr_nvr', 'usr_sta', 'usr_sof', 'usr_fiv', 'usr_und',
  'usr_red', 'usr_roo', 'usr_ter', 'usr_unr', 'usr_cal',
] as const;

export type ChapterId = typeof CHAPTER_IDS[number];
export type PuzzleId = typeof PUZZLE_IDS[number];
export type CharacterId = typeof CHARACTER_IDS[number];

