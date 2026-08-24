/**
 * Community Directory Surface — The Other Users
 * 
 * Continuous ledger directory of all six social networks and one classified institution.
 */

import React from 'react';
import { Link } from 'react-router';
import styles from './CommunityDirectory.module.css';
import { COMMUNITIES_LIST } from '../../content/fixtures/checkpoint1Content';

export const CommunityDirectory: React.FC = () => {
  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>PALINODE // SPATIAL INDEX</span>
        <h1 className="type-h1">Nonhuman Networks & Jurisdictions</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Palinode encompasses six distinct social networks and one classified institution.
          Each interface organizes perception according to its members’ biological senses.
        </p>
      </header>

      <ul className={styles.communityList} aria-label="Communities Directory">
        {COMMUNITIES_LIST.map((comm) => {
          const statusClass =
            comm.status === 'active'
              ? styles.statusActive
              : comm.status === 'classified'
              ? styles.statusClassified
              : '';

          return (
            <li key={comm.id} className={styles.communityRow}>
              <div className={styles.rowHeader}>
                <Link to={comm.route} className={styles.communityName}>
                  {comm.name}
                </Link>
                <span className={`${styles.statusTag} ${statusClass}`}>
                  [{comm.status}]
                </span>
              </div>

              <span className={styles.cultureText}>{comm.speciesCulture}</span>
              <span className={styles.spatialText}>Spatial Metaphor: {comm.spatialMetaphor}</span>
              <p className={styles.teaserText}>{comm.teaser}</p>
            </li>
          );
        })}
      </ul>
    </article>
  );
};
