/**
 * Palinode Home Feed Surface — The Other Users
 * 
 * Asymmetrical editorial feed displaying primary dispatches, network state conditions,
 * and live community fragments.
 */

import React from 'react';
import styles from './PalinodeHome.module.css';
import { PALINODE_HUB_DISPATCHES } from '../../content/fixtures/checkpoint1Content';
import { useGameStore } from '../../domain/state/useGameStore';

export const PalinodeHome: React.FC = () => {
  const chapter = useGameStore((s) => s.gameState.chapter);
  const primaryDispatch = PALINODE_HUB_DISPATCHES[0];
  const feedDispatches = PALINODE_HUB_DISPATCHES.slice(1);

  return (
    <article className={styles.container}>
      <header className={styles.networkBanner} aria-label="Network Status">
        <span className={styles.bannerKicker}>PALINODE RELAY TELEMETRY // CHAPTER {chapter}</span>
        <h2 className={styles.bannerCondition}>Network Condition: Sensory Packets Active</h2>
      </header>

      {/* Primary Dispatch */}
      <section className={styles.primaryDispatch} aria-labelledby="primary-dispatch-title">
        <div className={styles.dispatchMeta}>
          <span>DISPATCH {primaryDispatch.id}</span>
          <span>•</span>
          <span>{primaryDispatch.author}</span>
        </div>
        <h1 id="primary-dispatch-title" className={styles.dispatchTitle}>
          {primaryDispatch.title}
        </h1>
        <p className={styles.dispatchBody}>{primaryDispatch.body}</p>
      </section>

      {/* Cross-Community Fragment Stream */}
      <section className={styles.feedSection} aria-labelledby="live-feed-heading">
        <h2 id="live-feed-heading" className={styles.sectionHeader}>
          Live Network Dispatches & Guild Bulletins
        </h2>

        <ul className={styles.feedList}>
          {feedDispatches.map((dispatch) => (
            <li key={dispatch.id} className={styles.feedItem}>
              <div className={styles.itemHeader}>
                <span className={styles.itemAuthor}>{dispatch.author}</span>
                <span className={styles.itemTime}>{dispatch.timestamp}</span>
              </div>
              <h3 className={styles.itemTitle}>{dispatch.title}</h3>
              <p className={styles.itemBody}>{dispatch.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};
