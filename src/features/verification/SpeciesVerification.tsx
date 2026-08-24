/**
 * Species Verification Flow & P00/P01 Puzzle Engine — The Other Users
 * 
 * Implements P00 (Permitted Entrances) and P01 (Behavior While Unobserved),
 * synthesizing the provisional Domestic Witness profile and unlocking Gate G0.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import styles from './SpeciesVerification.module.css';
import { VERIFICATION_STEPS } from '../../content/fixtures/checkpoint1Content';
import { BaseButton } from '../../components/primitives/BaseButton';
import { useGameStore } from '../../domain/state/useGameStore';

export const SpeciesVerification: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // Verification state tracking
  const [selectedEntrances, setSelectedEntrances] = useState<string[]>([]);
  const [selectedOccupancy, setSelectedOccupancy] = useState<string>('occ_one');
  const [unobservedAction, setUnobservedAction] = useState<string>('');
  const [hesitationSeconds, setHesitationSeconds] = useState<number>(0);

  const updateProfile = useGameStore((s) => s.updateProfile);
  const unlockGate = useGameStore((s) => s.unlockGate);
  const setFlag = useGameStore((s) => s.setFlag);
  const setPuzzleStatus = useGameStore((s) => s.setPuzzleStatus);
  const discoverEvidence = useGameStore((s) => s.discoverEvidence);

  // In-page unobserved behavioral timer
  useEffect(() => {
    if (currentStep === 4) {
      const timer = setInterval(() => {
        setHesitationSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep]);

  const toggleEntrance = (id: string) => {
    setSelectedEntrances((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      // Record P00 evaluation through legal state machine
      setPuzzleStatus('p00_species_verification', 'introduced');
      setPuzzleStatus('p00_species_verification', 'active');
      setPuzzleStatus(
        'p00_species_verification',
        'solved',
        selectedEntrances,
        'Entrances filtered by nonhuman permission protocol.'
      );
    }

    if (currentStep === 4) {
      // Record P01 evaluation through legal state machine
      const actionChosen = unobservedAction || `Waited ${hesitationSeconds}s without prompting`;
      setPuzzleStatus('p01_unobserved_behavior', 'introduced');
      setPuzzleStatus('p01_unobserved_behavior', 'active');
      setPuzzleStatus(
        'p01_unobserved_behavior',
        'solved',
        { action: actionChosen, hesitationMs: hesitationSeconds * 1000 },
        'Behavioral hesitation observed.'
      );
    }

    if (currentStep === 5) {
      // Synthesize provisional profile & unlock G0
      updateProfile({
        handle: 'Domestic_Witness_01',
        provisionalSpecies: 'DOMESTIC WITNESS',
        occupancyCount: selectedOccupancy === 'occ_more' ? 3 : 1,
        thresholdTolerance: 'Conditional Domestic',
        memoryDiet: 'Atmospheric Noise & Repetition',
        mimicryRisk: 'Elevated',
        witnessedShape: 'Indeterminate Observer',
        exposureScore: 10,
        legibilityScore: 5,
        pluralityScore: 15,
        complicityScore: 0,
        ilyrTrustScore: 25,
        revisions: [
          {
            chapter: 0,
            timestamp: Date.now(),
            summary: 'Provisional Domestic Witness synthesis from inconclusive account recovery.',
            traits: {
              occupancy: selectedOccupancy,
              entrances: selectedEntrances.join(', '),
              unobservedBehavior: unobservedAction || `${hesitationSeconds}s pause`,
            },
          },
        ],
      });

      unlockGate('G0');
      setFlag('species_verified', true);
      discoverEvidence('EV-001', 'Species Verification Queue');
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      navigate('/home');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate('/');
    }
  };

  return (
    <article className={styles.container}>
      <header>
        <span className={styles.stepIndicator}>
          VERIFICATION STEP {currentStep} OF {totalSteps}
        </span>
      </header>

      {/* STEP 1: Account Notice */}
      {currentStep === 1 && (
        <section className={styles.container}>
          <h1 className={styles.stepTitle}>Species Verification Protocol</h1>
          <p className={styles.instruction}>
            Your connection arrived through an irregular recovery queue. Palinode protocols
            require every node to declare its boundary shape, permission limits, and occupancy
            density before accessing community traffic.
          </p>
          <p className="type-small">
            Nonhuman nodes perceive permission as physical structure. Proceeding will test your
            anatomical boundaries.
          </p>
        </section>
      )}

      {/* STEP 2: P00 Permitted Entrances */}
      {currentStep === 2 && (
        <section className={styles.container}>
          <h1 className={styles.stepTitle}>{VERIFICATION_STEPS.p00_entrances.title}</h1>
          <p className={styles.instruction}>{VERIFICATION_STEPS.p00_entrances.instruction}</p>

          <div className={styles.optionsList} role="group" aria-label="Entrance Options">
            {VERIFICATION_STEPS.p00_entrances.options.map((option) => {
              const isChecked = selectedEntrances.includes(option.id);
              return (
                <label key={option.id} className={styles.optionItem}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleEntrance(option.id)}
                  />
                  <div>
                    <span className={styles.optionLabel}>{option.label}</span>
                    <p className={styles.optionSubtext}>{option.nonhumanInterpretation}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* STEP 3: Occupancy */}
      {currentStep === 3 && (
        <section className={styles.container}>
          <h1 className={styles.stepTitle}>{VERIFICATION_STEPS.occupancy.title}</h1>
          <p className={styles.instruction}>{VERIFICATION_STEPS.occupancy.instruction}</p>

          <div className={styles.optionsList} role="radiogroup" aria-label="Occupancy Selection">
            {VERIFICATION_STEPS.occupancy.options.map((option) => (
              <label key={option.id} className={styles.optionItem}>
                <input
                  type="radio"
                  name="occupancy"
                  value={option.id}
                  checked={selectedOccupancy === option.id}
                  onChange={() => setSelectedOccupancy(option.id)}
                />
                <div>
                  <span className={styles.optionLabel}>{option.label}</span>
                  <p className={styles.optionSubtext}>Trait: {option.trait}</p>
                </div>
              </label>
            ))}
          </div>
        </section>
      )}

      {/* STEP 4: P01 Behavior While Unobserved */}
      {currentStep === 4 && (
        <section className={styles.container}>
          <h1 className={styles.stepTitle}>{VERIFICATION_STEPS.p01_unobserved.title}</h1>
          <p className={styles.instruction}>{VERIFICATION_STEPS.p01_unobserved.instruction}</p>

          <p className="type-mono" style={{ color: 'var(--accent-network)' }}>
            [Passive observation active: {hesitationSeconds}s elapsed]
          </p>

          <div className={styles.optionsList}>
            <button
              type="button"
              className={styles.optionItem}
              onClick={() => setUnobservedAction('Altered interface contrast and sensory bounds')}
            >
              <div>
                <span className={styles.optionLabel}>Calibrate Sensory Thresholds</span>
                <p className={styles.optionSubtext}>Adjust local perception to reduce disorientation.</p>
              </div>
            </button>

            <button
              type="button"
              className={styles.optionItem}
              onClick={() => setUnobservedAction('Tested return route without crossing')}
            >
              <div>
                <span className={styles.optionLabel}>Verify Return Threshold</span>
                <p className={styles.optionSubtext}>Inspect boundary exit before committing presence.</p>
              </div>
            </button>

            <button
              type="button"
              className={styles.optionItem}
              onClick={() => setUnobservedAction('Declined behavioral observation explicitly')}
            >
              <div>
                <span className={styles.optionLabel}>Decline Behavioral Classification</span>
                <p className={styles.optionSubtext}>{VERIFICATION_STEPS.p01_unobserved.declineOption}</p>
              </div>
            </button>
          </div>

          <p className="type-small" style={{ color: 'var(--text-muted)' }}>
            {VERIFICATION_STEPS.p01_unobserved.disclosure}
          </p>
        </section>
      )}

      {/* STEP 5: Provisional Result */}
      {currentStep === 5 && (
        <section className={styles.container}>
          <h1 className={styles.stepTitle}>{VERIFICATION_STEPS.provisional_result.title}</h1>
          <p className={styles.instruction}>
            The network has generated a working hypothesis of your organism from observed choices.
          </p>

          <div className={styles.resultPanel}>
            <div className={styles.resultField}>
              <span className={styles.fieldKey}>PROVISIONAL CLASSIFICATION</span>
              <span className={styles.fieldValue}>{VERIFICATION_STEPS.provisional_result.classification}</span>
            </div>

            <div className={styles.resultField}>
              <span className={styles.fieldKey}>KNOWN HABITAT</span>
              <span className={styles.fieldValue}>{VERIFICATION_STEPS.provisional_result.habitat}</span>
            </div>

            <div className={styles.resultField}>
              <span className={styles.fieldKey}>FEEDING BEHAVIOR</span>
              <span className={styles.fieldValue}>{VERIFICATION_STEPS.provisional_result.feedingBehavior}</span>
            </div>

            <div className={styles.resultField}>
              <span className={styles.fieldKey}>IMITATION RISK</span>
              <span className={styles.fieldValue} style={{ color: 'var(--accent-warning)' }}>
                {VERIFICATION_STEPS.provisional_result.imitationRisk}
              </span>
            </div>
          </div>

          <p className="type-small" style={{ fontStyle: 'italic' }}>
            {VERIFICATION_STEPS.provisional_result.closingNotice}
          </p>
        </section>
      )}

      {/* STEP 6: Final Verification Handoff */}
      {currentStep === 6 && (
        <section className={styles.container}>
          <h1 className={styles.stepTitle}>Session Established</h1>
          <p className={styles.instruction}>
            Provisional profile registered in local cache. Gate <strong>G0</strong> unsealed.
            You may now navigate the Palinode home feed, correspondence ledger, and evidence board.
          </p>
          <p className="type-mono" style={{ color: 'var(--accent-permission)' }}>
            [Transmission received from MOURNINGSTAR in correspondence queue]
          </p>
        </section>
      )}

      {/* Navigation Controls */}
      <footer className={styles.navigationSection}>
        <BaseButton onClick={handlePrevStep}>
          {currentStep === 1 ? 'Cancel' : 'Previous Step'}
        </BaseButton>

        <BaseButton variant="primary" onClick={handleNextStep}>
          {currentStep === totalSteps ? 'Enter Palinode Hub' : 'Continue'}
        </BaseButton>
      </footer>
    </article>
  );
};
