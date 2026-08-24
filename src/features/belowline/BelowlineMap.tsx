/**
 * Belowline Pressure Map View — The Other Users
 * 
 * Subterranean structural topology with zoom controls and an equivalent
 * synchronized semantic station list for accessibility.
 */

import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './BelowlineMap.module.css';
import { BELOWLINE_STATIONS, BELOWLINE_POSTS } from '../../content/fixtures/belowlineContent';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const BelowlineMap: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 20, 180));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 20, 60));

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>UNDERFOLK TRANSIT UNION // PRESSURE TOPOLOGY</span>
        <h1 className="type-h1">Belowline Subterranean Grid</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Cities experienced as continuous stress fields. Topology is organized by material
          continuity, passing weight, and structural echo rather than compass north.
        </p>
      </header>

      {/* Manifest Ledger Investigation Banner */}
      <Link
        to="/below/manifests"
        className={styles.bannerManifests}
        aria-label="Open Belowline Manifest Ledger"
      >
        <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
          ★ P06 / P07 INVESTIGATION // MANIFEST LEDGER
        </span>
        <h2 className="type-h2">Continuous Manifest Ledger & Acoustic Audit</h2>
        <p className="type-body">
          Align pressure diagrams to uncover the Annex N conduit (P06) and audit Manifest 44
          for synthetic silence anomalies (P07).
        </p>
      </Link>

      {/* Interactive Topology Map Canvas */}
      <section className={styles.mapCanvasContainer} aria-labelledby="map-title">
        <div className={styles.mapControls}>
          <h2 id="map-title" className="type-h3" style={{ color: '#E0F2F1' }}>
            Pressure Vector Visualizer ({zoomLevel}%)
          </h2>

          <div className={styles.zoomButtons}>
            <BaseButton onClick={handleZoomOut} aria-label="Zoom Out Map">
              − Zoom Out
            </BaseButton>
            <BaseButton onClick={handleZoomIn} aria-label="Zoom In Map">
              + Zoom In
            </BaseButton>
          </div>
        </div>

        <div
          className={styles.mapVisual}
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
          role="img"
          aria-label="Pressure topology diagram showing load vectors connecting surface sectors to Platform V-Null"
        >
          <p><strong>[SUBTERRANEAN BEDROCK PRESSURE MATRIX]</strong></p>
          <p>LOAD CONTINUITY: 1,200mm CAST IRON CONDUIT</p>
          <p>TERMINUS: PLATFORM V-NULL ➔ ANNEX N SPUR (DEPTH: 145m)</p>
        </div>
      </section>

      {/* Synchronized Semantic Station List */}
      <section aria-labelledby="stations-title">
        <h2 id="stations-title" className="type-h3">
          Synchronized Station & Conduit Register
        </h2>

        <ul className={styles.stationList} aria-label="Belowline Stations">
          {BELOWLINE_STATIONS.map((station) => (
            <li
              key={station.id}
              className={`${styles.stationItem} ${
                station.isDeletedStation ? styles.stationItemDeleted : ''
              }`}
            >
              <div className={styles.stationHeader}>
                <h3 className={styles.stationName}>{station.name}</h3>
                <span className={styles.stationDepth}>Depth: {station.depthMeters}m</span>
              </div>

              <p className="type-small">
                <strong>Structural Material:</strong> {station.structuralCondition}
              </p>
              <p className="type-small" style={{ color: 'var(--text-muted)' }}>
                Passing Weight: {station.passingWeightTonsDaily} tons/day
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Ordinary Community Dispatches & O03 Workbench */}
      <section aria-labelledby="dispatches-title" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <h2 id="dispatches-title" className="type-h3">
          Belowline Union Dispatches & Route Notices
        </h2>

        {BELOWLINE_POSTS.map((post) => {
          const isO03 = post.id === 'BELOW-010';
          return (
            <div
              key={post.id}
              style={{
                backgroundColor: 'var(--bg-paper)',
                border: '1px solid var(--line-subtle)',
                borderLeft: isO03 ? '4px solid var(--accent-permission)' : '3px solid var(--line-emphasis)',
                borderRadius: 'var(--radius-4)',
                padding: 'var(--space-4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 className="type-h3">{post.title}</h3>
                <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
                  @{post.authorHandle} • {post.timestamp}
                </span>
              </div>

              <p className="type-body">{post.body}</p>

              {/* O03 Interactive Optimizer */}
              {isO03 && <BelowlineRouteOptimizer />}
            </div>
          );
        })}
      </section>
    </article>
  );
};

const BelowlineRouteOptimizer: React.FC = () => {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const setFlag = useGameStore((s) => s.setFlag);
  const changeRelationship = useGameStore((s) => s.changeRelationship);

  const isSolved = Boolean(puzzleState['o03_belowline_route_optimization']?.status === 'solved' || gameState.flags['o03_solved']);

  const ensurePuzzleActive = (puzzleId: string) => {
    const status = useGameStore.getState().puzzleState[puzzleId]?.status ?? 'unseen';
    if (status === 'unseen') {
      setPuzzleStatus(puzzleId, 'introduced');
      setPuzzleStatus(puzzleId, 'active');
    } else if (status === 'introduced') {
      setPuzzleStatus(puzzleId, 'active');
    }
  };

  const handleOptimize = (routeChoice: string) => {
    setSelectedRoute(routeChoice);
    if (routeChoice === 'conduit_14_bypass') {
      ensurePuzzleActive('o03_belowline_route_optimization');
      setPuzzleStatus('o03_belowline_route_optimization', 'solved', { route: routeChoice }, 'Optimal Conduit 14 bypass selected.');
      setFlag('o03_solved', true);
      changeRelationship('usr_red', 15);
      setFeedback('✓ Route confirmed! red_line_red_line saved from union discipline; +15 Belowline trust awarded.');
    } else {
      setFeedback('Route rejected: Crossing Platform V-Null disturbs Foundation Widow nests and cracks carrier axles.');
    }
  };

  return (
    <div style={{ marginTop: 'var(--space-2)', padding: 'var(--space-3)', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <p className="type-small" style={{ fontWeight: 700 }}>
        Select Freight Alignment for red_line_red_line:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <BaseButton
          variant={selectedRoute === 'platform_v_direct' ? 'primary' : 'default'}
          onClick={() => handleOptimize('platform_v_direct')}
          disabled={isSolved}
        >
          Direct Line: Platform V-Null High-Speed Track (High Stress)
        </BaseButton>

        <BaseButton
          variant={selectedRoute === 'conduit_14_bypass' ? 'primary' : 'default'}
          onClick={() => handleOptimize('conduit_14_bypass')}
          disabled={isSolved}
        >
          Protected Bypass: Lower Conduit 14 Seepage Channel (Low Damping)
        </BaseButton>
      </div>

      {feedback && (
        <p className="type-small" style={{ color: isSolved ? 'var(--accent-permission)' : 'var(--accent-warning)', fontWeight: 700 }}>
          {feedback}
        </p>
      )}
    </div>
  );
};
