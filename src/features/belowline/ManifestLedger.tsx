/**
 * Belowline Manifest Ledger (P06 & P07 Workbench) — The Other Users
 * 
 * Implements P06 (A Street Beneath Six Cities) and P07 (Forged Silence),
 * featuring diagram alignment by load direction, acoustic silence audits,
 * and discovery of Annex N (Gate G3).
 */

import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './ManifestLedger.module.css';
import {
  TRANSIT_MANIFESTS_P07,
  PRESSURE_DIAGRAMS_P06,
} from '../../content/fixtures/belowlineContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const ManifestLedger: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'p06_maps' | 'p07_manifests'>('p06_maps');

  // P06 State: rotations of the 3 diagrams
  const [diagramRotations, setDiagramRotations] = useState<Record<string, number>>({
    city_surface_a: 0,
    city_surface_b: 0,
    city_surface_c: 0,
  });
  const [routeSharedFaction, setRouteSharedFaction] = useState<'accord' | 'directorate' | 'nobody' | null>(null);

  // P07 State: audit selection
  const [selectedManifestId, setSelectedManifestId] = useState<string | null>(null);
  const [hintLevel, setHintLevel] = useState<number>(0);

  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);
  const unlockGate = useGameStore((s) => s.unlockGate);
  const advanceChapter = useGameStore((s) => s.advanceChapter);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeRelationship = useGameStore((s) => s.changeRelationship);
  const resetPuzzle = useGameStore((s) => s.resetPuzzle);
  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isP06Solved = Boolean(puzzleState['p06_belowline_route']?.status === 'solved' || gameState.flags['p06_solved']);
  const isP07Solved = Boolean(puzzleState['p07_forged_silence']?.status === 'solved' || gameState.flags['p07_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleRotateDiagram = (cityId: string) => {
    setDiagramRotations((prev) => ({
      ...prev,
      [cityId]: ((prev[cityId] || 0) + 90) % 360,
    }));
  };

  // P06 Verification: diagrams must be rotated to their required load directions (90°, 180°, 270°)
  const handleVerifyRouteAlignment = (shareWith: 'accord' | 'directorate' | 'nobody') => {
    const a = diagramRotations['city_surface_a'] === 90;
    const b = diagramRotations['city_surface_b'] === 180;
    const c = diagramRotations['city_surface_c'] === 270;

    if (a && b && c) {
      ensurePuzzleActive('p06_belowline_route');
      setPuzzleStatus(
        'p06_belowline_route',
        'solved',
        { rotations: diagramRotations, sharedWith: shareWith },
        'Aligned load paths beneath six cities converging to Annex N.'
      );
      setFlag('p06_solved', true);
      setRouteSharedFaction(shareWith);
      setFlag('p06_route_shared_with', shareWith);
      discoverEvidence('EV-007', 'Belowline Pressure Audit');
    } else {
      ensurePuzzleActive('p06_belowline_route');
      setPuzzleStatus(
        'p06_belowline_route',
        'active',
        { attempts: (puzzleState['p06_belowline_route']?.attempts || 0) + 1 },
        'Rotations do not match structural load alignment.'
      );
    }
  };

  // P07 Verification: Identify Manifest 44 as the forged record
  const handleAuditManifest = (manifestId: string) => {
    if (!isP06Solved) return;
    setSelectedManifestId(manifestId);

    if (manifestId === 'man_44') {
      ensurePuzzleActive('p07_forged_silence');
      setPuzzleStatus(
        'p07_forged_silence',
        'solved',
        { forgedManifest: 'man_44', cleanZeroIdentified: true },
        'Identified synthetic clean zero in Manifest 44.'
      );
      setFlag('p07_solved', true);
      discoverEvidence('EV-008', 'underplatform_9 Belowline Audit Log');
      changeRelationship('usr_und', 10);
      unlockGate('G3'); // Opens Vesper & Menagerie public registry
      advanceChapter(3);
    } else {
      ensurePuzzleActive('p07_forged_silence');
      setPuzzleStatus(
        'p07_forged_silence',
        'active',
        { falseManifest: manifestId },
        'Selected manifest contains authentic dirty silence.'
      );
    }
  };

  const handleBypass = () => {
    ensurePuzzleActive('p06_belowline_route');
    ensurePuzzleActive('p07_forged_silence');
    setPuzzleStatus('p06_belowline_route', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setPuzzleStatus('p07_forged_silence', 'bypassed', { assisted: true }, 'Assisted bypass used.');
    setFlag('p06_solved', true);
    setFlag('p07_solved', true);
    discoverEvidence('EV-007', 'Assisted Belowline Pressure Audit');
    discoverEvidence('EV-008', 'Assisted underplatform_9 Belowline Audit Log');
    unlockGate('G3');
    advanceChapter(3);
  };

  const handleReset = () => {
    resetPuzzle('p06_belowline_route');
    resetPuzzle('p07_forged_silence');
    setDiagramRotations({ city_surface_a: 0, city_surface_b: 0, city_surface_c: 0 });
    setSelectedManifestId(null);
    setHintLevel(0);
  };

  const getHintText = (level: number) => {
    switch (level) {
      case 1:
        return 'Nudge: North is a human convention. Match what the structure feels: continuous pipe diameter and load scars.';
      case 2:
        return 'Method: In P06, rotate City 1 to 90°, City 2 to 180°, and City 3 to 270°. In P07, real silence is dirty with vibration; synthetic silence is clean zero.';
      case 3:
        return 'Guided: Manifest 44 contains 0.00 dB (clean zero) while moving 4,120 kg. That is the synthetic alteration.';
      case 4:
        return 'Resolve: In P06, align all 3 diagrams. In P07, select Manifest 44 as the altered record.';
      default:
        return 'Orientation: Align pressure diagrams to find Annex N (P06) and audit Manifest 44 for forged silence (P07).';
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className={styles.kicker}>BELOWLINE AUDIT // P06 & P07 WORKBENCH</span>
          <Link to="/below" style={{ fontSize: '0.8rem', color: 'var(--accent-network)' }}>
            ← Back to Map
          </Link>
        </div>
        <h1 className="type-h1">Manifest Ledger & Pressure Topology</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Audit subterranean transit manifests, align cross-city load lines, and expose
          the hidden destination beneath surface jurisdictions.
        </p>
      </header>

      {isP07Solved && (
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-network)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-network)' }}>
            ✓ Annex N Discovery Confirmed & Manifest 44 Forgery Exposed
          </h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            Gate <strong>G3</strong> unsealed. Vesper and the Menagerie public registry are now accessible.
          </p>
        </div>
      )}

      {/* Tabs */}
      <nav className={styles.tabBar} aria-label="Investigation Tabs">
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'p06_maps' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('p06_maps')}
        >
          1. A Street Beneath Six Cities (P06)
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === 'p07_manifests' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('p07_manifests')}
          disabled={!isP06Solved}
        >
          2. Forged Silence Audit (P07){!isP06Solved ? ' — LOCKED' : ''}
        </button>
      </nav>

      {/* TAB 1: P06 Pressure Diagram Alignment */}
      {activeTab === 'p06_maps' && (
        <section className={styles.section} aria-labelledby="p06-heading">
          <h2 id="p06-heading" className={styles.sectionTitle}>
            P06: Align Structural Load Paths
          </h2>
          <p className={styles.instruction}>
            Rotate diagrams by load direction rather than compass north until pipe diameters
            (1,200mm) and Platform V-Null stress scars continue across municipal borders.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {PRESSURE_DIAGRAMS_P06.map((diagram) => {
              const currentAngle = diagramRotations[diagram.cityId] || 0;
              return (
                <div key={diagram.cityId} className={styles.diagramCard}>
                  <div className={styles.diagramHeader}>
                    <h3 className="type-h3">{diagram.cityName}</h3>
                    <div className={styles.rotationControl}>
                      <span className="type-mono" style={{ fontSize: '0.8rem' }}>
                        Angle: {currentAngle}°
                      </span>
                      <BaseButton onClick={() => handleRotateDiagram(diagram.cityId)}>
                        Rotate +90°
                      </BaseButton>
                    </div>
                  </div>

                  <p className="type-small">
                    <strong>Conduit Diameter:</strong> {diagram.pipeDiameterMm}mm •{' '}
                    <strong>Anchor:</strong> {diagram.scarAlignmentFeature}
                  </p>
                  <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                    {diagram.continuationLead}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span className="type-small" style={{ fontWeight: 700 }}>
              Route Sharing Decision upon Alignment:
            </span>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <BaseButton
                variant="primary"
                onClick={() => handleVerifyRouteAlignment('accord')}
                disabled={isP06Solved}
              >
                Align & Share with Plurality Accord
              </BaseButton>
              <BaseButton
                onClick={() => handleVerifyRouteAlignment('directorate')}
                disabled={isP06Solved}
              >
                Align & Share with Directorate
              </BaseButton>
              <BaseButton
                onClick={() => handleVerifyRouteAlignment('nobody')}
                disabled={isP06Solved}
              >
                Align & Keep Secret
              </BaseButton>
            </div>
            {routeSharedFaction && (
              <p className="type-small" style={{ color: 'var(--accent-network)' }}>
                ✓ Route aligned and shared with: {routeSharedFaction.toUpperCase()}
              </p>
            )}
          </div>
        </section>
      )}

      {/* TAB 2: P07 Forged Silence */}
      {activeTab === 'p07_manifests' && (
        <section className={styles.section} aria-labelledby="p07-heading">
          <h2 id="p07-heading" className={styles.sectionTitle}>
            P07: Identify Altered Silence in Manifests
          </h2>
          <p className={styles.instruction}>
            underplatform_9 notes: "Silence is not zero. Zero is what a forgery thinks silence looks like."
            Real tunnels always vibrate with water, roots, and structural stress. Select the altered record.
          </p>

          <ul className={styles.manifestList} aria-label="Transit Manifests">
            {TRANSIT_MANIFESTS_P07.map((manifest) => (
              <li
                key={manifest.id}
                className={`${styles.manifestItem} ${
                  manifest.isForged && isP07Solved ? styles.manifestItemForged : ''
                }`}
              >
                <div className={styles.manifestHeader}>
                  <h3 className="type-h3">
                    Manifest #{manifest.manifestNumber} ({manifest.timestamp})
                  </h3>
                  <span className="type-mono" style={{ fontSize: '0.8rem', color: 'var(--accent-permission)' }}>
                    Cargo: {manifest.declaredWeightKg} kg
                  </span>
                </div>

                <div className={styles.manifestMetaGrid}>
                  <div>
                    <strong>Declared Cargo:</strong> {manifest.declaredCargo}
                  </div>
                  <div>
                    <strong>Destination:</strong> {manifest.destination}
                  </div>
                  <div>
                    <strong>Acoustic Reading:</strong> {manifest.acousticOccupancyText}
                  </div>
                  <div>
                    <strong>Pressure Occupancy:</strong> {manifest.pressureOccupancyText}
                  </div>
                </div>

                <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                  Audit Note: {manifest.notes}
                </p>

                <div style={{ marginTop: 'var(--space-2)' }}>
                  <BaseButton
                    variant={selectedManifestId === manifest.id ? 'primary' : 'default'}
                    onClick={() => handleAuditManifest(manifest.id)}
                    disabled={isP07Solved}
                  >
                    {manifest.id === 'man_44' && isP07Solved
                      ? '✓ Confirmed Altered Record'
                      : 'Flag as Altered Record'}
                  </BaseButton>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Hints & Reset */}
      <footer style={{ borderTop: '1px solid var(--line-subtle)', paddingTop: 'var(--space-4)' }}>
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
              Hint Level ({hintLevel} / 4)
            </span>
            {hintLevel < 4 ? (
              <BaseButton onClick={() => setHintLevel((p) => p + 1)}>
                Request Hint (Level {hintLevel + 1})
              </BaseButton>
            ) : (
              <BaseButton variant="primary" onClick={handleBypass}>
                Assisted Bypass (Level 4)
              </BaseButton>
            )}
          </div>
          <p className="type-body" style={{ fontSize: '0.9rem' }}>
            {getHintText(hintLevel)}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-3)' }}>
          <BaseButton onClick={handleReset}>
            Reset Audit Workbench
          </BaseButton>
          {isP07Solved && (
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Return to Palinode Hub</BaseButton>
            </Link>
          )}
        </div>
      </footer>
    </article>
  );
};
