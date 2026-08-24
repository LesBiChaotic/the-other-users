/**
 * Witness Wire Community Home — The Other Users
 * 
 * Continuous annotated observation stream of human habits, domestic cycles,
 * and the pinned Player Observation Case.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import styles from './WitnessWireHome.module.css';
import { WITNESS_WIRE_THREADS } from '../../content/fixtures/witnessWireContent';
import { useGameStore } from '../../domain/state/useGameStore';

export const WitnessWireHome: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const setFlag = useGameStore((s) => s.setFlag);
  const flags = useGameStore((s) => s.gameState.flags);

  // Track thread reading count for narrative progression
  useEffect(() => {
    const currentViewed = (flags['wire_threads_viewed_count'] as number) || 0;
    if (currentViewed >= 3) {
      setFlag('wire_threads_viewed_4', true);
    }
  }, [flags, setFlag]);

  const ordinaryThreads = WITNESS_WIRE_THREADS.filter((t) => !t.metadata?.isCaseFile);
  const caseThread = WITNESS_WIRE_THREADS.find((t) => t.metadata?.isCaseFile);

  const tags = ['All', 'Domestic Habits', 'Appliances', 'Linguistics', 'Courtship', 'Moderation Notice'];

  const filteredThreads =
    selectedTag === 'All'
      ? ordinaryThreads
      : ordinaryThreads.filter((t) =>
          t.metadata?.tags?.includes(selectedTag)
        );

  const recordThreadClick = () => {
    const current = (flags['wire_threads_viewed_count'] as number) || 0;
    setFlag('wire_threads_viewed_count', current + 1);
    if (current + 1 >= 3) {
      setFlag('wire_threads_viewed_4', true);
    }
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>HUMAN OBSERVATION GUILD // FORUM STREAM</span>
        <h1 className="type-h1">Witness Wire</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Continuous observation of human domestic habits, routines, appliance divination,
          and courtship rituals. Ethical observers mark inference separately from verified behavior.
        </p>
      </header>

      {/* Pinned Case Banner */}
      {caseThread && (
        <Link
          to="/wire/case/player"
          className={styles.caseBanner}
          aria-label="Investigate Personal Observation Case"
        >
          <span className={styles.caseBadge}>★ ACTIVE CASE DOSSIER // CHAPTER 1</span>
          <h2 className={styles.caseTitle}>{caseThread.title}</h2>
          <p className={styles.caseSnippet}>{caseThread.body}</p>
          <span className="type-small" style={{ color: 'var(--accent-network)', fontWeight: 600 }}>
            → Open Photographic & Routine Evidence Workbench
          </span>
        </Link>
      )}

      {/* Filter Bar */}
      <section className={styles.filterBar} aria-label="Filter Observation Categories">
        <span className={styles.filterLabel}>Observation Category:</span>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`${styles.filterChip} ${
              selectedTag === tag ? styles.filterChipActive : ''
            }`}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </section>

      {/* Stream List */}
      <ul className={styles.streamList} aria-label="Observation Stream">
        {filteredThreads.map((thread) => (
          <li key={thread.id}>
            <article className={styles.threadRow}>
              <div className={styles.threadMeta}>
                <span>
                  By{' '}
                  <Link
                    to={`/wire/user/${thread.authorId === 'usr_aun' ? 'AUNTIE_STATIC' : thread.authorId === 'usr_nvr' ? 'neverlookstraight' : 'MOURNINGSTAR'}`}
                    className={styles.authorLink}
                  >
                    {thread.authorId === 'usr_aun'
                      ? 'AUNTIE_STATIC'
                      : thread.authorId === 'usr_nvr'
                      ? 'neverlookstraight'
                      : 'MOURNINGSTAR'}
                  </Link>
                </span>
                <span>{thread.timestamp}</span>
              </div>

              <Link
                to={`/wire/thread/${thread.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
                onClick={recordThreadClick}
              >
                <h3 className={styles.threadTitle}>{thread.title}</h3>
                <p className={styles.threadExcerpt}>{thread.body}</p>
              </Link>

              <div className={styles.threadFooter}>
                <span>{thread.comments.length} annotations</span>
                {thread.metadata?.tags && (
                  <span>• {thread.metadata.tags.join(', ')}</span>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </article>
  );
};
