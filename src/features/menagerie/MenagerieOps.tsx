/**
 * Menagerie Facility Operations Console — The Other Users
 * 
 * Facility section drawing and physical enclosure control hubs.
 * Avoids KPI dashboards; prioritizes anatomical containment structures and sensor routing.
 */

import React from 'react';
import { Link } from 'react-router';
import styles from './MenagerieOps.module.css';
import { ENCLOSURE_SENSOR_MATRICES_P14 } from '../../content/fixtures/menagerieContent';
import { useGameStore } from '../../domain/state/useGameStore';

export const MenagerieOps: React.FC = () => {
  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);

  const isP14Solved = Boolean(puzzleState['p14_camera_that_never_blinks']?.status === 'solved' || gameState.flags['p14_solved']);

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>FACILITY OPERATIONS // SECTION ARCHITECTURE</span>
        <h1 className="type-h1">Annex N Operations Console</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Physical cross-section of Subterranean Annex N. Sensor matrices attach directly
          to bedrock enclosures and threshold frames.
        </p>
      </header>

      {/* Facility Power Status */}
      <section className={styles.powerStatusStrip} aria-label="Facility Power Allocation">
        <span>GLOBAL FACILITY POWER:</span>
        <span style={{ color: isP14Solved ? 'var(--accent-permission)' : 'var(--accent-warning)', fontWeight: 700 }}>
          {isP14Solved
            ? 'DIVERTED TO LIVE SENSORS (OPTICAL LOOPS OFFLINE)'
            : '85% ALLOCATED TO SYNTHETIC OPTICAL GENERATION'}
        </span>
      </section>

      {/* Facility Blueprint Section Drawing */}
      <section className={styles.facilityBlueprint} aria-labelledby="blueprint-title">
        <h2 id="blueprint-title" className="type-h3" style={{ color: '#E0F2F1' }}>
          Annex N Structural Section Elevation (Depth: 145m)
        </h2>

        <div
          className={styles.blueprintVisual}
          role="img"
          aria-label="Schematic drawing of Annex N subterranean enclosures and sensor routing paths"
        >
          <p><strong>[ANNEX N SUBTERRANEAN SECTION ELEVATION]</strong></p>
          <p>BEDROCK CEILING ➔ ENCLOSURE C-12 (PRESSURE SAINT ANCHOR)</p>
          <p>LOGISTICS CONDUIT ➔ ENCLOSURE N-04 (MOURNINGSTAR THRESHOLD FRAME)</p>
          <p>MAINTENANCE SPUR ➔ ENCLOSURE T-02 (KNUCKLERAIL ACCESS)</p>
        </div>
      </section>

      {/* Ilyr Exit Procedure Access Banner */}
      {isP14Solved && (
        <Link
          to="/menagerie/threshold"
          className={styles.enclosureCard}
          style={{ borderLeftColor: 'var(--accent-permission)' }}
          aria-label="Execute Ilyr Threshold Exit Procedure"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)', fontWeight: 700 }}>
            ★ P15 PROCEDURE UNLOCKED // THRESHOLD EXIT
          </span>
          <h2 className="type-h2">Enclosure N-04: A Door Defined as Never Entered</h2>
          <p className="type-body">
            Execute the time-bounded corrective admission protocol to safely release
            @MOURNINGSTAR under porchlight_ON witness.
          </p>
        </Link>
      )}

      {/* Enclosure Navigation List */}
      <section aria-labelledby="enclosures-title">
        <h2 id="enclosures-title" className="type-h3">
          Active Enclosure Control Stations
        </h2>

        <ul className={styles.enclosureList} aria-label="Enclosure Control Stations">
          {ENCLOSURE_SENSOR_MATRICES_P14.map((matrix) => (
            <li key={matrix.enclosureId}>
              <Link
                to={`/menagerie/enclosure/${matrix.enclosureId}`}
                className={styles.enclosureCard}
                aria-label={`Open control station for ${matrix.enclosureName}`}
              >
                <div className={styles.cardHeader}>
                  <h3 className="type-h3">{matrix.enclosureName}</h3>
                  <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Subject: {matrix.occupantSubject}
                  </span>
                </div>

                <p className="type-small" style={{ color: 'var(--text-primary)' }}>
                  {matrix.biologicalFootprintNote}
                </p>

                <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)' }}>
                  ➔ Inspect 5-Sensor Matrix & Audit Video Loop
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};
