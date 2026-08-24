/**
 * Pale Market Community & P10/P11 Content Fixtures — The Other Users
 * 
 * Contains production copy for Pale Market listings, provenance chains,
 * Identity Assembly workbench (P10), and Memory Removal decision (P11).
 */

import { EvidenceItem } from '../../domain/types/content';

export interface MarketListing {
  id: string;
  title: string;
  priceText: string;
  priceCost: string;
  description: string;
  provenance: string;
  permanence: 'Ephemeral (1-use)' | 'Persistent (Creates Record)' | 'Permanent (Ontological Shift)';
  vendorHandle: string;
  isPlotCritical?: boolean;
}

export interface IdentityComponent {
  id: string;
  type: 'name' | 'invitation' | 'witness_mark' | 'expiry';
  label: string;
  provenance: string;
  ontologicalWeight: number; // 0 for safe ephemeral, >0 for creating living claimant
  isSafeChoice: boolean;
  description: string;
}

export const PALE_MARKET_LISTINGS: MarketListing[] = [
  {
    id: 'MKT-001',
    title: 'Unused Name, Never Called',
    priceText: 'One remembered introduction',
    priceCost: 'A past introduction becomes difficult to recall',
    description: 'Legally clean. No living witnesses. Suitable for reservations, deliveries, and temporary grief. Repetition may produce claimant.',
    provenance: 'Surplus civilian register, City Sector 4',
    permanence: 'Persistent (Creates Record)',
    vendorHandle: 'SecondDraft',
  },
  {
    id: 'MKT-002',
    title: 'Thirty Minutes of Privacy',
    priceText: 'The seller learns when you used it',
    priceCost: 'Timestamp disclosed to vendor',
    description: 'Works against mirrors, Routine Keepers, household appliances, and most family group chats. Does not conceal you from yourself.',
    provenance: 'Distilled from an unmonitored storm cellar',
    permanence: 'Ephemeral (1-use)',
    vendorHandle: 'QuietVendor',
  },
  {
    id: 'MKT-003',
    title: 'Voice, Adult, Regionally Unremarkable',
    priceText: 'One accent you can no longer imitate',
    priceCost: 'Loss of one regional inflection',
    description: 'Never used to confess, threaten, propose marriage, or speak to a dog. Mild irritation included.',
    provenance: 'Public switchboard operator archive (1988)',
    permanence: 'Persistent (Creates Record)',
    vendorHandle: 'SecondDraft',
  },
  {
    id: 'MKT-004',
    title: 'Permission to Enter One Particular House',
    priceText: 'Leave when first asked',
    priceCost: 'Compliance with host curfew',
    description: 'Invitation expires at sunrise or upon hostile intent. Porch organism witnesses both entry and departure.',
    provenance: 'Signed porch voucher, Welcome Mat #12',
    permanence: 'Ephemeral (1-use)',
    vendorHandle: 'porchlight_ON',
  },
  {
    id: 'MKT-005',
    title: 'Memory of Being Believed',
    priceText: 'Seller retains the doubt',
    priceCost: 'Mild lingering uncertainty',
    description: 'Warm, brief, no identifying face. Recommended for testimony recovery. Not valid as legal witness.',
    provenance: 'Private deposition room residue',
    permanence: 'Ephemeral (1-use)',
    vendorHandle: 'unremember_me',
  },
  {
    id: 'MKT-006',
    title: 'Childhood Smell: Rain on Concrete',
    priceText: 'One location loses emotional weather',
    priceCost: 'A childhood street becomes emotionally flat',
    description: 'Provenance incomplete. Buyer warned that nostalgia moth activity may improve details beyond authenticity.',
    provenance: 'Nostalgia moth cocoon harvesting',
    permanence: 'Ephemeral (1-use)',
    vendorHandle: 'MothVendor_9',
  },
  {
    id: 'MKT-007',
    title: 'One-Use Institutional Invitation',
    priceText: 'Temporary witness mark',
    priceCost: 'One fleeting observation record',
    description: 'Authenticates an action, not a person. No name required. Must specify purpose and immediate expiry.',
    provenance: 'Menagerie Directorate logistics manifest slip',
    permanence: 'Ephemeral (1-use)',
    vendorHandle: 'unremember_me',
    isPlotCritical: true,
  },
  {
    id: 'MKT-008',
    title: 'Removal of One Named Memory',
    priceText: 'One neighboring association',
    priceCost: 'Inevitable collateral erasure of an adjacent memory bond',
    description: 'Vendor documents collateral before purchase. Refusal after preview costs nothing.',
    provenance: 'Kindly Thief consent shears',
    permanence: 'Permanent (Ontological Shift)',
    vendorHandle: 'unremember_me',
    isPlotCritical: true,
  },
  {
    id: 'MKT-009',
    title: 'Photograph From a Life You Did Not Live',
    priceText: 'One true photograph becomes difficult to recognize',
    priceCost: 'Loss of visual recognition of one family photo',
    description: 'Two adults smiling beside an ocean neither remembers. Frame not included; tide may continue.',
    provenance: 'Estate closure sale, Salt Marsh district',
    permanence: 'Persistent (Creates Record)',
    vendorHandle: 'SecondDraft',
  },
  {
    id: 'MKT-010',
    title: 'Legal Death, Lightly Used',
    priceText: 'All unfinished subscriptions',
    priceCost: 'All recurring digital accounts terminated',
    description: 'Valid in three surface jurisdictions and one undercity. Resurrection fees remain buyer responsibility.',
    provenance: 'Probate court cancellation ledger (1994)',
    permanence: 'Permanent (Ontological Shift)',
    vendorHandle: 'SecondDraft',
  },
  {
    id: 'MKT-011',
    title: 'Unopened Letter from an Abandoned Address',
    priceText: 'One forgotten postal code',
    priceCost: 'You forget the exact postal code of your second childhood home',
    description: 'Postmarked November 1989. The envelope remains sealed with blue paraffin wax. Contains news from someone who did not realize the house was being demolished.',
    provenance: 'Foundation Widow nesting salvage, Station V-Null',
    permanence: 'Persistent (Creates Record)',
    vendorHandle: 'ARCHIVE_OF_TUESDAY',
  },
  {
    id: 'MKT-012',
    title: 'Twenty Seconds of Perfect Silence in a Crowded Train',
    priceText: 'The vendor hears your next hesitation',
    priceCost: 'Vendor is notified the next time you pause before speaking',
    description: 'Acoustic pocket distilled from a broken subway car damper. All wheel screech and passenger coughing drops to 0.0 dB for twenty elapsed seconds.',
    provenance: 'Belowline Loop 4 acoustic extraction',
    permanence: 'Ephemeral (1-use)',
    vendorHandle: 'QuietVendor',
  },
  {
    id: 'MKT-013',
    title: 'Habitual Step Rhythm: Old Apartment Staircase',
    priceText: 'One familiar floorboard creak',
    priceCost: 'Your stairs at home lose their characteristic acoustic tone',
    description: 'The exact ascending rhythm (two fast steps, hesitation on fourth riser) of an occupant who lived above a bakery for thirty-four years.',
    provenance: 'Stairweight domestic residue deposit',
    permanence: 'Persistent (Creates Record)',
    vendorHandle: 'unremember_me',
  },
  {
    id: 'MKT-014',
    title: 'A Grudge Kept in Good Condition for Nine Years',
    priceText: 'The name of who originally caused it',
    priceCost: 'You must disclose the true name of the initial offender',
    description: 'Preserved with sharp edges and excellent factual recall. Suitable for maintaining moral clarity during difficult family arbitrations. Never watered down by forgiveness.',
    provenance: 'Kindly Thief dispute archive',
    permanence: 'Permanent (Ontological Shift)',
    vendorHandle: 'unremember_me',
  },
  {
    id: 'MKT-015',
    title: 'Second-Hand Apology, Never Delivered',
    priceText: 'One current unresolved regret',
    priceCost: 'One current grievance loses its emotional urgency',
    description: 'Phrased with precise accountability and no defensive subordinate clauses. Spoken into a bathroom mirror in 2004 and never mailed.',
    provenance: 'Reflection Tenant discarded audio trace',
    permanence: 'Ephemeral (1-use)',
    vendorHandle: 'SecondDraft',
  },
  {
    id: 'MKT-016',
    title: 'Permission to Rest on a Protected Window Sill',
    priceText: 'Departure before sunrise',
    priceCost: 'Strict curfew compliance',
    description: 'One night of uninterrupted sleep on a warm granite sill overlooking the lower canal. Shielded from Routine Keepers and nocturnal census sweeps.',
    provenance: 'Signed threshold permit #441',
    permanence: 'Ephemeral (1-use)',
    vendorHandle: 'porchlight_ON',
  },
  {
    id: 'MKT-017',
    title: 'O05 // Pale Market Provenance Audit Workbench',
    priceText: 'Trace Ilyr’s discarded name-fragment',
    priceCost: 'Review legal provenance chain',
    description: 'Audit the provenance of MOURNINGSTAR’s discarded identity fragment. Confirm that authenticating entry with this fragment would legally trap Ilyr inside the player’s profile.',
    provenance: 'Pale Market Consent Ledger (Case O05)',
    permanence: 'Ephemeral (1-use)',
    vendorHandle: 'SecondDraft',
  },
];

export const IDENTITY_COMPONENTS_P10: IdentityComponent[] = [
  // 1. Name Component
  {
    id: 'comp_name_none',
    type: 'name',
    label: 'No Name (Action-Only Authentication)',
    provenance: 'One-use logistics voucher',
    ontologicalWeight: 0,
    isSafeChoice: true,
    description: 'Authenticates the crossing of a threshold without assigning personhood or creating an account.',
  },
  {
    id: 'comp_name_permanent',
    type: 'name',
    label: 'Registered Name: "Arthur Finch (Deceased 1991)"',
    provenance: 'Municipal Probate Archive',
    ontologicalWeight: 3,
    isSafeChoice: false,
    description: 'Binds a permanent name to the pass. May awaken a Recordborn claimant if scrutinized.',
  },

  // 2. Invitation Component
  {
    id: 'comp_inv_action',
    type: 'invitation',
    label: 'One-Use Action Invitation',
    provenance: 'Directorate Logistics Slip MKT-007',
    ontologicalWeight: 0,
    isSafeChoice: true,
    description: 'Valid strictly for a single entry and exit through Logistics Gate 4.',
  },
  {
    id: 'comp_inv_standing',
    type: 'invitation',
    label: 'Standing Directorate Guest Permit',
    provenance: 'SecondDraft Custom Contract',
    ontologicalWeight: 4,
    isSafeChoice: false,
    description: 'Continuous open access that authorizes the Common Body to track ongoing occupancy.',
  },

  // 3. Witness Mark
  {
    id: 'comp_wit_temporary',
    type: 'witness_mark',
    label: 'Temporary Witness Mark',
    provenance: 'porchlight_ON one-night voucher',
    ontologicalWeight: 0,
    isSafeChoice: true,
    description: 'Witnessed by a transient threshold organism; record dissolves upon departure.',
  },
  {
    id: 'comp_wit_database',
    type: 'witness_mark',
    label: 'Permanent Notarized Identity Stamp',
    provenance: 'SecondDraft Identity Seal',
    ontologicalWeight: 3,
    isSafeChoice: false,
    description: 'Permanent institutional record that permanently stabilizes a living identity.',
  },

  // 4. Expiry
  {
    id: 'comp_exp_immediate',
    type: 'expiry',
    label: 'Immediate Expiry upon Departure',
    provenance: 'Threshold Safety Protocol',
    ontologicalWeight: 0,
    isSafeChoice: true,
    description: 'Pass ceases to exist the instant the threshold is crossed.',
  },
  {
    id: 'comp_exp_perpetual',
    type: 'expiry',
    label: 'Perpetual / No Expiration Date',
    provenance: 'Standard Form Template',
    ontologicalWeight: 5,
    isSafeChoice: false,
    description: 'Permanent legal vessel that can never be revoked.',
  },
];

export const PALE_MARKET_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-011',
    title: 'Action-Bound Institutional Pass (P10)',
    provenance: 'Pale Market Identity Assembly Workbench',
    communityId: 'market',
    chapter: 5,
    representations: {
      primaryText:
        'A sterile, action-bound entry credential assembled from a one-use invitation, temporary witness mark, and immediate expiry. Authenticates entry into Menagerie operations without creating a living Recordborn claimant.',
      sensoryDescription: 'Thin, unvarnished card that feels cool and ephemeral to the touch.',
      accessibility: {
        altText: 'Logistics access pass stamped with immediate expiration and no identity name.',
      },
    },
    contradictionLinks: [],
    targetCases: ['case_menagerie_entry'],
  },
  {
    id: 'EV-012',
    title: 'Archivore Escrow Certificate (P11)',
    provenance: 'unremember_me Memory Removal Exchange',
    communityId: 'market',
    chapter: 5,
    representations: {
      primaryText:
        'Certificate of escrow from ARCHIVE_OF_TUESDAY. Holds the factual details of the player’s relationship in cold storage, shielding the player from Common Body predictive modeling while protecting the witness bond from complete destruction.',
      sensoryDescription: 'Deep stone cylinder containing the sealed hum of archived memory.',
      accessibility: {
        altText: 'Sealed escrow certificate detailing memory isolation and bond preservation.',
      },
    },
    contradictionLinks: [],
    targetCases: ['case_memory_escrow'],
  },
];
