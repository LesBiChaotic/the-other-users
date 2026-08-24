/**
 * Public Invitation Landing View — The Other Users
 * 
 * Production copy from PUB-001 with privacy disclosure and acceptance flow.
 */

import React from 'react';
import { useNavigate, Link } from 'react-router';
import styles from './InvitationLanding.module.css';
import { PUBLIC_INVITATION_CONTENT } from '../../content/fixtures/checkpoint1Content';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const InvitationLanding: React.FC = () => {
  const navigate = useNavigate();
  const setFlag = useGameStore((s) => s.setFlag);

  const handleAccept = () => {
    setFlag('invitation_accepted', true);
    navigate('/verify');
  };

  const handleDecline = () => {
    setFlag('invitation_declined', true);
    setFlag('invitation_accepted', true);
    navigate('/verify');
  };

  return (
    <article className={styles.container}>
      <header>
        <span className={styles.kicker}>PALINODE // RECOVERY DISPATCH</span>
        <h1 className={styles.title}>{PUBLIC_INVITATION_CONTENT.title}</h1>
      </header>

      <p className={styles.lead}>{PUBLIC_INVITATION_CONTENT.lead}</p>

      <section className={styles.disclosureSection} aria-label="Privacy and Content Disclosures">
        <p className={styles.disclosureText}>
          {PUBLIC_INVITATION_CONTENT.privacyDisclosure}
        </p>
        <p className={styles.disclosureText} style={{ fontStyle: 'italic' }}>
          {PUBLIC_INVITATION_CONTENT.contentWarningSummary}
        </p>
      </section>

      <section className={styles.actionsSection} aria-label="Invitation Responses">
        <BaseButton variant="primary" onClick={handleAccept}>
          {PUBLIC_INVITATION_CONTENT.actionAccept}
        </BaseButton>

        <BaseButton onClick={handleDecline}>
          {PUBLIC_INVITATION_CONTENT.actionDecline}
        </BaseButton>

        <Link to="/accessibility" style={{ textDecoration: 'none' }}>
          <BaseButton>
            {PUBLIC_INVITATION_CONTENT.actionSettings}
          </BaseButton>
        </Link>
      </section>
    </article>
  );
};
