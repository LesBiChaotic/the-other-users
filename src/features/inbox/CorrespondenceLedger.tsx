/**
 * Correspondence Ledger & Inbox Surface — The Other Users
 * 
 * Manages three-source MOURNINGSTAR messages and user/faction correspondence.
 */

import React, { useState } from 'react';
import styles from './CorrespondenceLedger.module.css';
import { INITIAL_MESSAGES } from '../../content/fixtures/checkpoint1Content';
import { useGameStore } from '../../domain/state/useGameStore';

export const CorrespondenceLedger: React.FC = () => {
  const [selectedReply, setSelectedReply] = useState<string | null>(null);
  const changeRelationship = useGameStore((s) => s.changeRelationship);
  const setFlag = useGameStore((s) => s.setFlag);

  const message = INITIAL_MESSAGES[0];

  const handleSelectReply = (replyId: string, text: string) => {
    setSelectedReply(replyId);
    setFlag('msg_001_replied', true);
    setFlag('msg_001_choice', text);
    changeRelationship('usr_ilyr', 5);
  };

  return (
    <article className={styles.container}>
      <header className={styles.header}>
        <span className={styles.kicker}>PALINODE // CORRESPONDENCE LEDGER</span>
        <h1 className="type-h1">Direct Transmissions & Dead Drops</h1>
        <p className="type-body" style={{ color: 'var(--text-muted)' }}>
          Messages received through threshold protocols. Source signatures indicate authentic,
          simulated, or indirect permission error channels.
        </p>
      </header>

      <ul className={styles.threadList} aria-label="Messages">
        <li className={styles.threadItem}>
          <div className={styles.threadHeader}>
            <span className={styles.senderHandle}>MOURNINGSTAR</span>
            <span className={styles.sourceBadge}>[AUTHENTIC LINTEL PROTOCOL]</span>
          </div>

          <p className={styles.messageBody}>"{message.body}"</p>

          <div className={styles.replySection}>
            <span className={styles.replyTitle}>Available Response Channels</span>

            {selectedReply ? (
              <p className={styles.repliedNotice}>
                ✓ Response transmitted to MOURNINGSTAR dead drop.
              </p>
            ) : (
              message.replies?.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  className={styles.replyButton}
                  onClick={() => handleSelectReply(reply.id, reply.text)}
                >
                  {reply.text}
                </button>
              ))
            )}
          </div>
        </li>
      </ul>
    </article>
  );
};
