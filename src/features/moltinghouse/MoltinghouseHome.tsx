/**
 * Moltinghouse Community Home — The Other Users
 * 
 * Layered revision-based forum displaying mimicry support, host negotiation,
 * and entry points to soft_error's shed drafts and FIVE_OF_US plural timeline.
 */

import React from 'react';
import { Link } from 'react-router';
import styles from './MoltinghouseHome.module.css';
import { MOLTINGHOUSE_THREADS } from '../../content/fixtures/moltinghouseContent';

export const MoltinghouseHome: React.FC = () => {
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>MIMETIC MUTUAL AID // REVISION SHEDS</span>
        <h1 className="type-h1">Moltinghouse</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          A community for Borrowfaces, Housemolts, and Handfuls. Threads exist as stacked
          identity layers; newest revisions reveal earlier contours.
        </p>
      </header>

      {/* Primary Investigation Banners */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Link
          to="/molt/sheds/soft_error"
          className={styles.bannerInvestigation}
          aria-label="Investigate soft_error Shed Drafts"
        >
          <span className={styles.bannerKicker}>★ P04 INVESTIGATION // SHED ARCHIVE</span>
          <h2 className="type-h2">soft_error Shed Drafts & Revision Layers</h2>
          <p className="type-body">
            Examine the deleted drafts of Moltinghouse advice moderator @soft_error.
            Identify her authentic continuity signature beneath the standardized replacement layers.
          </p>
        </Link>

        <Link
          to="/molt/thread/five-of-us"
          className={styles.bannerInvestigation}
          aria-label="Investigate FIVE_OF_US Plural Timeline"
        >
          <span className={styles.bannerKicker}>★ P05 INVESTIGATION // PLURAL TIMELINE</span>
          <h2 className="type-h2">FIVE_OF_US: One Moderator, Several Bodies</h2>
          <p className="type-body">
            Review the five-voice transcript and repair telemetry of the repair cooperative.
            Determine whether disagreement constitutes account replacement or authentic plural personhood.
          </p>
        </Link>
      </section>

      {/* Ordinary Support Threads Stream */}
      <section className={styles.layeredDeck} aria-label="Support and Ethics Threads">
        <h2 className="type-h3" style={{ color: 'var(--text-muted)' }}>
          Community Advice & Contour Etiquette
        </h2>

        {MOLTINGHOUSE_THREADS.map((thread) => (
          <div key={thread.id} className={styles.threadLayer}>
            <div className={styles.layerHeader}>
              <span className={styles.authorMeta}>
                @{thread.authorHandle} ({thread.authorSpecies})
              </span>
              <span className={styles.revisionPill}>{thread.revisionCount} revisions</span>
            </div>

            <h3 className={styles.threadTitle}>{thread.title}</h3>
            <p className={styles.threadBody}>{thread.body}</p>

            <div style={{ marginTop: 'var(--space-2)' }}>
              <span className="type-small" style={{ color: 'var(--text-muted)' }}>
                {thread.comments.length} annotations attached
              </span>
            </div>
          </div>
        ))}
      </section>
    </article>
  );
};
