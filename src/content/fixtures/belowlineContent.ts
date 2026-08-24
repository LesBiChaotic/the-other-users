/**
 * Belowline Community & P06/P07 Content Fixtures — The Other Users
 * 
 * Contains production copy for Belowline stations, pressure topologies,
 * Manifest Ledger (P06/P07), acoustic audit logs, and route sharing.
 */

import { EvidenceItem, Message } from '../../domain/types/content';

export interface BelowlineStation {
  id: string;
  name: string;
  depthMeters: number;
  passingWeightTonsDaily: number;
  structuralCondition: string;
  isDeletedStation?: boolean;
}

export interface TransitManifest {
  id: string;
  manifestNumber: number;
  timestamp: string;
  declaredCargo: string;
  declaredWeightKg: number;
  acousticOccupancyText: string;
  acousticOccupancyVal: number; // 0 for synthetic zero, >0 for dirty silence
  pressureOccupancyText: string;
  destination: string;
  isForged: boolean;
  notes: string;
}

export interface PressureDiagram {
  cityId: string;
  cityName: string;
  pipeDiameterMm: number;
  loadDirectionDeg: number; // angle to rotate to match load continuity
  scarAlignmentFeature: string;
  continuationLead: string;
}

export const BELOWLINE_STATIONS: BelowlineStation[] = [
  {
    id: 'st_central_arch',
    name: 'Central Arch Junction',
    depthMeters: 42,
    passingWeightTonsDaily: 1240,
    structuralCondition: 'Stable / Granite & Cast Iron',
  },
  {
    id: 'st_v_null',
    name: 'Platform V-Null (Deleted Station)',
    depthMeters: 85,
    passingWeightTonsDaily: 0,
    structuralCondition: 'Demolished 1974 / Residual Load Scar Active',
    isDeletedStation: true,
  },
  {
    id: 'st_low_conduit',
    name: 'Lower Conduit 14',
    depthMeters: 110,
    passingWeightTonsDaily: 890,
    structuralCondition: 'Water seepage / 60Hz ambient hum',
  },
  {
    id: 'st_annex_n_spur',
    name: 'Annex N Maintenance Spur',
    depthMeters: 145,
    passingWeightTonsDaily: 4120,
    structuralCondition: 'Restricted / Directorate Structural Anchor',
  },
];

export const TRANSIT_MANIFESTS_P07: TransitManifest[] = [
  {
    id: 'man_41',
    manifestNumber: 41,
    timestamp: '01:14:00',
    declaredCargo: 'Cast iron pipe segments, 8,200 kg',
    declaredWeightKg: 8200,
    acousticOccupancyText: 'Dirty silence (water drip, pipe resonance, cable tension)',
    acousticOccupancyVal: 14.2,
    pressureOccupancyText: 'Continuous static carrier load',
    destination: 'Lower Conduit 14',
    isForged: false,
    notes: 'Normal carrier vibration confirmed.',
  },
  {
    id: 'man_42',
    manifestNumber: 42,
    timestamp: '02:40:12',
    declaredCargo: 'Granite ballast gravel, 14,000 kg',
    declaredWeightKg: 14000,
    acousticOccupancyText: 'Dirty silence (gravel settling, wheel friction)',
    acousticOccupancyVal: 22.8,
    pressureOccupancyText: 'High distributed density',
    destination: 'Central Arch Junction',
    isForged: false,
    notes: 'Standard union route.',
  },
  {
    id: 'man_44',
    manifestNumber: 44,
    timestamp: '04:17:30',
    declaredCargo: 'Climate-control housings, 4,120 kg',
    declaredWeightKg: 4120,
    acousticOccupancyText: 'Clean zero (0.000 dB / Absolute mathematical silence)',
    acousticOccupancyVal: 0.0,
    pressureOccupancyText: '6 intermittent adult-equivalent loads (disputed)',
    destination: 'Maintenance Spur [withheld] (Annex N)',
    isForged: true,
    notes: 'Audit Anomaly: Zero is what a forgery thinks silence looks like. Real tunnels always vibrate.',
  },
  {
    id: 'man_45',
    manifestNumber: 45,
    timestamp: '05:22:10',
    declaredCargo: 'Signal cable spools, 3,100 kg',
    declaredWeightKg: 3100,
    acousticOccupancyText: 'Dirty silence (spool hum, electrical relay clicks)',
    acousticOccupancyVal: 8.5,
    pressureOccupancyText: 'Unloaded carrier returning',
    destination: 'Central Arch Junction',
    isForged: false,
    notes: 'Routine morning transit.',
  },
];

export const PRESSURE_DIAGRAMS_P06: PressureDiagram[] = [
  {
    cityId: 'city_surface_a',
    cityName: 'Surface Sector Alpha (City 1)',
    pipeDiameterMm: 1200,
    loadDirectionDeg: 90, // Rotate by 90°
    scarAlignmentFeature: 'Load Scar V-Null Top Edge',
    continuationLead: 'Pipe conduits align southward into continuous limestone strata.',
  },
  {
    cityId: 'city_surface_b',
    cityName: 'Surface Sector Beta (City 2)',
    pipeDiameterMm: 1200,
    loadDirectionDeg: 180, // Rotate by 180°
    scarAlignmentFeature: 'Load Scar V-Null Center Fault',
    continuationLead: 'Vibration frequency matches carrier red_line_red_line route.',
  },
  {
    cityId: 'city_surface_c',
    cityName: 'Surface Sector Gamma (City 3)',
    pipeDiameterMm: 1200,
    loadDirectionDeg: 270, // Rotate by 270°
    scarAlignmentFeature: 'Load Scar V-Null Bottom Anchor',
    continuationLead: 'Structural terminus converges directly into Menagerie Annex N.',
  },
];

export const BELOWLINE_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EV-007',
    title: 'Subterranean Load Topology (Annex N Convergence)',
    provenance: 'Belowline Pressure Audit (P06 combined route)',
    communityId: 'below',
    chapter: 3,
    representations: {
      primaryText:
        'Continuous structural topology demonstrating that transit lines beneath three separate surface cities align into a single continuous subterranean conduit terminating beneath Menagerie Annex N.',
      sensoryDescription: 'Heavy low-frequency mineral vibration along unbroken bedrock.',
      accessibility: {
        altText: 'Aligned diagram showing three city subway maps connecting at Platform V-Null into Annex N.',
      },
    },
    contradictionLinks: ['EV-008'],
    targetCases: ['case_annex_n_route'],
  },
  {
    id: 'EV-008',
    title: 'Manifest 44 Synthetic Zero Audit',
    provenance: 'underplatform_9 Belowline Audit Log (P07)',
    communityId: 'below',
    chapter: 3,
    representations: {
      primaryText:
        'Acoustic audit of Manifest 44 proving mathematically synthetic silence (0.00 dB) while physical sensors recorded 6 adult-equivalent passenger loads being transported to Annex N.',
      sensoryDescription: 'Complete unnatural acoustic vacuum superimposed over physical track pressure.',
      accessibility: {
        altText: 'Acoustic waveform graph showing flatlined zero noise during active train movement.',
      },
    },
    contradictionLinks: ['EV-007'],
    targetCases: ['case_missing_passengers'],
  },
];

export const BELOWLINE_POSTS = [
  {
    id: 'BELOW-006',
    title: 'Service Notice: Bedrock Acoustic Dampening along Loop 4',
    authorHandle: 'underplatform_9',
    body: 'Loop 4 acoustic returns show 14% mineral damping increase. If the tunnel answers your footstep in sandstone rather than cast iron, adjust your pace by two half-beats. Silence is not an absence of trains; it is a change in stone density.',
    timestamp: '1 day ago',
  },
  {
    id: 'BELOW-007',
    title: 'Union Grievance 89-D: Freight Vibration in Residential Strata',
    authorHandle: 'red_line_red_line',
    body: 'MANAGEMENT DISPATCHED NIGHT FREIGHT AT 45 KM/H THROUGH RESIDENTIAL LIMESTONE. SLEEPING COLONIES REPORTED CRACKED BEDROCK IN LOWER CONDUIT 14. SPEED LIMIT REMAINS 25 KM/H IN POPULATED STRATA.',
    timestamp: '2 days ago',
  },
  {
    id: 'BELOW-008',
    title: 'Lost Station Etiquette: Platform V-Null Memory Protocol',
    authorHandle: 'underplatform_9',
    body: 'Do not speak the 1974 demolition date inside load-bearing columns. Memorial weight left on abandoned tracks disrupts Knucklerail navigation. If the wall returns an obsolete arrival chime, step backward three paces.',
    timestamp: '3 days ago',
  },
  {
    id: 'BELOW-009',
    title: 'Conduit Warning: Steam Line Pressure Fluctuations',
    authorHandle: 'red_line_red_line',
    body: 'SURFACE HEATING RETROFITS ARE LEAKING 120 PSI CONDENSATE INTO SPUR 8. Knucklerails crossing joint 12 must decelerate to avoid thermal shell blistering.',
    timestamp: '4 days ago',
  },
  {
    id: 'BELOW-010',
    title: 'O03 // Belowline Union Route Optimization Workbench',
    authorHandle: 'red_line_red_line',
    body: 'Union challenge: Calculate the optimal transit route from Central Arch to Annex N Spur without disturbing Foundation Widow nests along Platform V-Null. Correct routing saves carrier red_line_red_line from disciplinary action and awards Belowline trust.',
    timestamp: 'Just now',
  },
];

export const BELOWLINE_MESSAGES: Message[] = [
  {
    id: 'MSG-006',
    threadId: 'thread_mourningstar',
    senderId: 'usr_ilyr',
    senderSource: 'authentic_ilyr',
    timestamp: 'After Belowline exploration',
    body: 'Maps lie politely by placing north at the top. The Underfolk have never agreed to north.',
    unlockCondition: { type: 'gateReached', gateId: 'G2' },
    accessibility: {
      altText: 'Message from MOURNINGSTAR explaining Underfolk map orientation based on load, not compass north.',
    },
  },
];
