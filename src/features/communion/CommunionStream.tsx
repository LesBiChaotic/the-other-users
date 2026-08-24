/**
 * Communion Liturgical Stream Home — The Other Users
 * 
 * Presents convergence ideology as sincere community before revealing replication prompts.
 * Respects authentic believers who choose synchronization while analyzing forced standardization.
 */

import React from 'react';
import { Link } from 'react-router';
import styles from './CommunionStream.module.css';
import { COMMUNION_SERMONS } from '../../content/fixtures/communionContent';

export const CommunionStream: React.FC = () => {
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>CONVERGENCE & COMPLETION // LITURGICAL STREAM</span>
        <h1 className="type-h1">Communion Liturgical Stream</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          A community devoted to the cessation of difference. Here, friction is framed as injury
          and universal synchronization as restorative peace.
        </p>
      </header>

      {/* Primary Investigation Banners */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Link
          to="/communion/testimonies"
          className={styles.bannerLitany}
          aria-label="Annotate Communion Testimonies"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-warning)', fontWeight: 700 }}>
            ★ P12 INVESTIGATION // TESTIMONY ARCHIVE
          </span>
          <h2 className="type-h2">Testimony Without Diagnosis (Authentic vs Generated)</h2>
          <p className="type-body">
            Separate sincere, cost-bearing believers from synthetic Common Body replication artifacts
            without declaring all faith counterfeit.
          </p>
        </Link>

        <Link
          to="/communion/litany"
          className={styles.bannerLitany}
          aria-label="Concordance Analysis of Litany"
        >
          <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-permission)', fontWeight: 700 }}>
            ★ P13 INVESTIGATION // REPLICATION CONCORDANCE
          </span>
          <h2 className="type-h2">The Litany of One Shape (Replication Prompt)</h2>
          <p className="type-body">
            Isolate the byte-identical sentence that functions as an interface replication instruction
            and quarantine it through living contradiction.
          </p>
        </Link>
      </section>

      {/* Sermons and Teachings */}
      <section aria-labelledby="sermons-heading">
        <h2 id="sermons-heading" className="type-h3" style={{ color: 'var(--text-muted)' }}>
          Sermons of the Shared Form
        </h2>

        {COMMUNION_SERMONS.map((sermon) => (
          <div key={sermon.id} className={styles.sermonCard}>
            <div className={styles.sermonHeader}>
              <h3 className={styles.sermonTitle}>{sermon.title}</h3>
              <span className="type-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Speaker: @{sermon.authorHandle} ({sermon.timestamp})
              </span>
            </div>

            <p className={styles.sermonBody}>"{sermon.body}"</p>
          </div>
        ))}
      </section>
    </article>
  );
};
