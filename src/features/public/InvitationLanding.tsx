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

  const handleArchiveAccess = () => {
    setFlag('invitation_accepted', true);
    setFlag('archive_override', true);
    navigate('/home');
  };

  return (
    <article className={styles.container}>
      <div className={styles.dispatchRail} aria-hidden="true">
        <span>RECOVERY / 00</span><i /><span>UNROUTED ORGANISM</span>
      </div>

      <div className={styles.editorialColumn}>
        <header className={styles.heroHeader}>
          <span className={styles.kicker}>PALINODE · RECOVERY DISPATCH 00.1</span>
          <h1 className={styles.title}>{PUBLIC_INVITATION_CONTENT.title}</h1>
          <p className={styles.lead}>{PUBLIC_INVITATION_CONTENT.lead}</p>
        </header>

        <section className={styles.disclosureSection} aria-label="Privacy and Content Disclosures">
          <span className={styles.sectionIndex}>TRANSLATION NOTICE</span>
          <p className={styles.disclosureText}>{PUBLIC_INVITATION_CONTENT.privacyDisclosure}</p>
          <p className={styles.warningText}>{PUBLIC_INVITATION_CONTENT.contentWarningSummary}</p>
        </section>

        <section className={styles.actionsSection} aria-label="Invitation Responses">
          <BaseButton variant="primary" onClick={handleAccept}>{PUBLIC_INVITATION_CONTENT.actionAccept}</BaseButton>
          <BaseButton onClick={handleDecline}>{PUBLIC_INVITATION_CONTENT.actionDecline}</BaseButton>
          <button type="button" className={styles.archiveAccess} onClick={handleArchiveAccess}>
            <span>OPEN FULL ARCHIVE</span>
            <small>Testing access · story progress remains untouched</small>
          </button>
          <Link to="/accessibility" className={styles.settingsLink}>{PUBLIC_INVITATION_CONTENT.actionSettings}<span aria-hidden="true">↗</span></Link>
        </section>
      </div>

      <aside className={styles.specimenField} aria-hidden="true">
        <div className={styles.fieldLabel}>PROVISIONAL BODY / SIGNAL RETURN</div>
        <div className={styles.orbit}><i /><i /><i /></div>
        <div className={styles.bodyTrace}><span /><span /><span /></div>
        <div className={styles.readout}><b>01</b><span>BOUNDARY<br />UNRESOLVED</span></div>
        <p>We found your account before we found your species.</p>
      </aside>
    </article>
  );
};
