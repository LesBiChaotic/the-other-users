/**
 * Witness Wire User Profile View — The Other Users
 * 
 * Displays nonhuman member taxonomy, biological form, boundaries, and voice.
 */

import React from 'react';
import { useParams, Link } from 'react-router';
import styles from './WitnessUserProfile.module.css';
import { CORE_USER_PROFILES } from '../../content/fixtures/checkpoint1Content';

export const WitnessUserProfile: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();

  // Lookup user profile by handle or ID
  const user = CORE_USER_PROFILES.find(
    (u) => u.handle.toLowerCase() === handle?.toLowerCase() || u.id === handle
  );

  const getExtraUserBio = (userHandle: string) => {
    switch (userHandle?.toLowerCase()) {
      case 'neverlookstraight':
        return {
          form: 'Peripheral Friend',
          pronouns: 'they/them',
          bio: 'if you can see me clearly, please stop trying. Photography available for events nobody attends directly.',
          boundary: 'Do not focus camera directly upon peripheral field.',
        };
      case 'auntie_static':
        return {
          form: 'Routine Keeper',
          pronouns: 'she/her',
          bio: 'Humans are less mysterious after the eighth repetition and more mysterious after the ninth.',
          boundary: 'Routines must be recorded with ±15min human variance margin.',
        };
      case 'mrs_cold':
        return {
          form: 'Cold Cabinet Oracle',
          pronouns: 'she/her in translation',
          bio: 'I know what your household will run out of and when. No, opening me again will not produce a different answer.',
          boundary: 'Do not open compressor door repeatedly without intention.',
        };
      case 'mourningstar':
        return {
          form: 'Lintelkin',
          pronouns: 'they/them',
          bio: 'I do not grant standing permission. Ask for the door, purpose, duration, and return path. Pinned: If I sound comforting, verify the sender.',
          boundary: 'Standing permission is prohibited.',
        };
      case 'soft_error':
        return {
          form: 'Borrowface',
          pronouns: 'she/her',
          bio: 'bad at closure,, excellent at contour repair. I will tell you when your disguise is unsafe. I will not tell you that means you are ugly.',
          boundary: 'do not archive my face without the argument attached.',
        };
      default:
        return {
          form: user?.speciesId || 'Witness Node',
          pronouns: user?.pronouns || 'they/them',
          bio: user?.voiceGuidelines || 'Active observer on the Palinode network.',
          boundary: 'Observation protocol active.',
        };
    }
  };

  const bioData = getExtraUserBio(handle || '');

  return (
    <article className={styles.container}>
      <nav>
        <Link to="/wire" className={styles.backLink}>
          ← Back to Witness Wire Stream
        </Link>
      </nav>

      <section className={styles.heroProfile} aria-label="Member Silhouette">
        <div className={styles.silhouette} aria-hidden="true">
          👁
        </div>
        <h1 className={styles.handleTitle}>{handle || user?.handle}</h1>
        <span className={styles.formSubtitle}>Form: {bioData.form}</span>
        <p className="type-small">Pronouns: {bioData.pronouns}</p>
      </section>

      <section className={styles.section} aria-labelledby="bio-heading">
        <h2 id="bio-heading" className={styles.sectionHeading}>
          Member Profile & Voice
        </h2>
        <p className={styles.bioText}>"{bioData.bio}"</p>
      </section>

      <section className={styles.section} aria-labelledby="boundary-heading">
        <h2 id="boundary-heading" className={styles.sectionHeading}>
          Biological Boundary & Observation Protocol
        </h2>
        <div className={styles.boundaryBox}>
          <strong>Declared Boundary:</strong> {bioData.boundary}
        </div>
      </section>
    </article>
  );
};
