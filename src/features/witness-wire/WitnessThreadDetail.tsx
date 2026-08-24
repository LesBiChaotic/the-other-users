/**
 * Witness Wire Thread Detail View — The Other Users
 * 
 * Renders individual observation threads, inline replies, and author profiles.
 */

import React from 'react';
import { useParams, Link } from 'react-router';
import styles from './WitnessThreadDetail.module.css';
import { WITNESS_WIRE_THREADS, WireComment } from '../../content/fixtures/witnessWireContent';
import { BaseButton } from '../../components/primitives/BaseButton';

export const WitnessThreadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const thread = WITNESS_WIRE_THREADS.find((t) => t.id === id);

  if (!thread) {
    return (
      <article className={styles.container}>
        <h1 className="type-h2">Observation Thread Not Found</h1>
        <p className="type-body">The requested observation has been archived or quarantined.</p>
        <Link to="/wire" className={styles.backLink}>
          ← Return to Witness Wire Stream
        </Link>
      </article>
    );
  }

  const getAuthorHandle = (authorId: string) => {
    switch (authorId) {
      case 'usr_aun':
        return 'AUNTIE_STATIC';
      case 'usr_nvr':
        return 'neverlookstraight';
      case 'usr_mrs':
        return 'MRS_COLD';
      case 'usr_sof':
        return 'soft_error';
      case 'usr_cal':
        return 'calmly_complete';
      case 'usr_ilyr':
        return 'MOURNINGSTAR';
      case 'usr_por':
        return 'porchlight_ON';
      case 'usr_ter':
        return 'TermsMayApply';
      default:
        return authorId;
    }
  };

  return (
    <article className={styles.container}>
      <nav>
        <Link to="/wire" className={styles.backLink}>
          ← Back to Observation Stream
        </Link>
      </nav>

      <header className={styles.postHeader}>
        <div className={styles.metaRow}>
          <span>
            OBSERVED BY{' '}
            <Link
              to={`/wire/user/${getAuthorHandle(thread.authorId)}`}
              className={styles.authorLink}
            >
              {getAuthorHandle(thread.authorId)}
            </Link>
          </span>
          <span>{thread.timestamp}</span>
        </div>

        <h1 className={styles.postTitle}>{thread.title}</h1>
        <p className={styles.postBody}>{thread.body}</p>
      </header>

      {thread.metadata?.isCaseFile && (
        <section style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-paper)', border: '1px solid var(--accent-permission)', borderRadius: 'var(--radius-4)' }}>
          <h2 className="type-h3" style={{ color: 'var(--accent-warning)' }}>Active Investigation Workbench</h2>
          <p className="type-body" style={{ marginTop: 'var(--space-1)' }}>
            This thread contains connected photographic evidence and routine logs.
          </p>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <Link to="/wire/case/player" style={{ textDecoration: 'none' }}>
              <BaseButton variant="primary">Launch Case Evidence Workbench</BaseButton>
            </Link>
          </div>
        </section>
      )}

      <section className={styles.annotationsSection} aria-label="Community Annotations">
        <h2 className={styles.sectionTitle}>
          Recorded Annotations ({thread.comments.length})
        </h2>

        <ul className={styles.commentsList}>
          {thread.comments.map((comment: WireComment) => (
            <li key={comment.id} className={styles.commentItem}>
              <div className={styles.commentMeta}>
                <Link
                  to={`/wire/user/${getAuthorHandle(comment.authorId)}`}
                  className={styles.authorLink}
                >
                  {getAuthorHandle(comment.authorId)}
                </Link>
                <span>{comment.timestamp}</span>
              </div>
              <p className={styles.commentBody}>{comment.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};
