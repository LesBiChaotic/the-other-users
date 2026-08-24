/**
 * Convergence Anatomical Assembly Status — The Other Users
 * 
 * Displays the 8 sensory family organs, tracking which modes of nonhuman perception
 * remain surviving and distinct vs absorbed and standardized by the Common Body.
 */

import React from 'react';
import { Link } from 'react-router';
import styles from './ConvergenceStatus.module.css';
import { SENSORY_FAMILY_ORGANS } from '../../content/fixtures/convergenceContent';
import { useGameStore } from '../../domain/state/useGameStore';

export const ConvergenceStatus: React.FC = () => {
  const gameState = useGameStore((s) => s.gameState);
  const puzzleState = useGameStore((s) => s.puzzleState);
  const isCountermodelReady = Boolean(
    gameState.flags['countermodel_ready'] ||
    puzzleState['p16_definitions_of_human']?.status === 'solved'
  );

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>PHYSICAL CONVERGENCE FINALE // ANATOMICAL ASSEMBLY</span>
        <h1 className="type-h1">Convergence Anatomical Network</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Physical assembly of the Common Body. Eight sensory family organs synthesize into
          a universal form. Track which modes of perception maintain distinct living witnesses.
        </p>
      </header>

      {/* Primary Investigation / Finale Action Banners */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Link
          to="/convergence/witnesses"
          className={styles.bannerAssembly}
          aria-label="Assemble Living Witness Counter-Model"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
            ★ P16 INVESTIGATION // WITNESS COUNTER-MODEL
          </span>
          <h2 className="type-h2">Definitions of a Human (Assemble Witnesses)</h2>
          <p className="type-body">
            Collect contradictory witness statements from living allies across distinct sensory
            families to produce irreconcilable definitions that break Common Body compression.
          </p>
        </Link>

        {isCountermodelReady && (
          <Link
            to="/convergence/permission"
            className={styles.bannerAssembly}
            style={{ borderLeftColor: 'var(--accent-network)' }}
            aria-label="Execute Final Permission Contract"
          >
            <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-network)', fontWeight: 700 }}>
              ★ P17 FINALE COMMITMENT // THE FINAL PERMISSION
            </span>
            <h2 className="type-h2">The Final Permission (Determine Ending)</h2>
            <p className="type-body">
              Draft the final threshold contract. Define what may cross from network model into
              physical reality and resolve the fate of Palinode.
            </p>
          </Link>
        )}
      </section>

      {/* 8 Sensory Family Organs */}
      <section aria-labelledby="organs-title">
        <h2 id="organs-title" className="type-h3" style={{ color: 'var(--text-muted)' }}>
          Sensory Family Organs Status
        </h2>

        <ul className={styles.organGrid} aria-label="Sensory Family Organs">
          {SENSORY_FAMILY_ORGANS.map((organ) => (
            <li key={organ.familyId} className={styles.organCard}>
              <div className={styles.organHeader}>
                <h3 className={styles.familyName}>{organ.familyName}</h3>
                <span className={styles.sensoryMode}>{organ.sensoryMode}</span>
              </div>

              <p className="type-small">
                <strong>Species Representatives:</strong> {organ.representativeSpecies}
              </p>

              <p className="type-body" style={{ fontSize: '0.95rem' }}>
                {organ.statusSummary}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};
