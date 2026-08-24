/**
 * Correspondence Ledger & Inbox Surface — The Other Users
 * 
 * Manages three-source MOURNINGSTAR messages and user/faction correspondence.
 */

import React, { useState } from 'react';
import styles from './CorrespondenceLedger.module.css';
import { INITIAL_MESSAGES } from '../../content/fixtures/checkpoint1Content';
import { MOURNINGSTAR_MESSAGES, MourningstarSource } from '../../domain/canon/storyRegistry';
import { useGameStore } from '../../domain/state/useGameStore';

export const CorrespondenceLedger: React.FC = () => {
  const [selectedReply, setSelectedReply] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState('MSG-001');
  const chapter = useGameStore((s) => s.gameState.chapter);
  const messageState = useGameStore((s) => s.narrativeState.messageState);
  const changeRelationship = useGameStore((s) => s.changeRelationship);
  const setFlag = useGameStore((s) => s.setFlag);
  const setMessageState = useGameStore((s) => s.setMessageState);

  const initial = INITIAL_MESSAGES[0];
  const availableMessages = [
    {
      id: initial.id,
      chapter: 0,
      source: initial.senderSource as MourningstarSource,
      subject: 'Species verification inconclusive',
      body: initial.body,
      signatureLabel: 'AUTHENTIC LINTEL PROTOCOL',
      replies: initial.replies,
    },
    ...MOURNINGSTAR_MESSAGES
      .filter((message) => message.chapter <= chapter)
      .map((message) => ({ ...message, replies: undefined })),
  ];
  const message = availableMessages.find((item) => item.id === selectedMessageId) ?? availableMessages[0];

  const sourceNames: Record<MourningstarSource, string> = {
    authentic_ilyr: 'Scheduled Ilyr',
    common_body_imitator: 'Archive-derived imitation',
    permission_error: 'Live permission fault',
  };

  const selectMessage = (messageId: string) => {
    setSelectedMessageId(messageId);
    setSelectedReply(messageState[messageId]?.replyId ?? null);
    setMessageState(messageId, 'read');
  };

  const handleSelectReply = (replyId: string, text: string) => {
    setSelectedReply(replyId);
    setFlag('msg_001_replied', true);
    setFlag('msg_001_choice', text);
    changeRelationship('usr_ilyr', 5);
    setMessageState(message.id, 'reply', replyId);
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

      <nav className={styles.messageIndex} aria-label="MOURNINGSTAR transmissions">
        {availableMessages.map((item) => (
          <button
            type="button"
            key={item.id}
            className={item.id === message.id ? styles.indexActive : styles.indexButton}
            onClick={() => selectMessage(item.id)}
          >
            <span>{item.subject}</span>
            <small>{sourceNames[item.source]} · Chapter {item.chapter}</small>
          </button>
        ))}
      </nav>

      <ul className={styles.threadList} aria-label="Selected message">
        <li className={styles.threadItem}>
          <div className={styles.threadHeader}>
            <span className={styles.senderHandle}>MOURNINGSTAR</span>
            <span className={`${styles.sourceBadge} ${styles[message.source]}`}>
              [{message.signatureLabel}]
            </span>
          </div>

          <p className={styles.messageBody}>"{message.body}"</p>

          <div className={styles.replySection}>
            <span className={styles.replyTitle}>Available Response Channels</span>

            {selectedReply ? (
              <p className={styles.repliedNotice}>
                ✓ Response transmitted to MOURNINGSTAR dead drop.
              </p>
            ) : message.replies?.length ? (
              message.replies.map((reply) => (
                <button
                  key={reply.id}
                  type="button"
                  className={styles.replyButton}
                  onClick={() => handleSelectReply(reply.id, reply.text)}
                >
                  {reply.text}
                </button>
              ))
            ) : (
              <p className={styles.noReply}>
                This transmission exposes no reply threshold. Compare its source signature before trusting its tone.
              </p>
            )}
          </div>
        </li>
      </ul>
    </article>
  );
};
