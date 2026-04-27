import React, { useState } from "react";
import DHLLayout from "../components/layout/DHLLayout";

interface ExperienceValues {
  positives: string;
  challenges: string;
  managerFeedback: string;
}

interface ExperiencePageProps {
  currentStep: string;
  onNext: () => void;
  onBack: () => void;
  values: ExperienceValues;
  onChange: (field: keyof ExperienceValues, value: string) => void;
}

const ExperiencePage: React.FC<ExperiencePageProps> = ({
  currentStep,
  onNext,
  onBack,
  values,
  onChange,
}) => {
  const safeValues: ExperienceValues =
    values || {
      positives: "",
      challenges: "",
      managerFeedback: "",
    };

  const [touched, setTouched] = useState(false);

  const requiredMissing = !safeValues.positives && !safeValues.challenges;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    onNext();
  };

  return (
    <DHLLayout currentStep={currentStep} onStepChange={() => {}}>
      <div className="dhl-page">
        <h2 className="dhl-page__title">Your experience at DHL Nigeria</h2>
        <p className="dhl-page__subtitle">
          Please share your thoughts on your overall experience. Your feedback
          helps DHL Nigeria improve the working environment.
        </p>

        <form className="dhl-form" onSubmit={handleSubmit}>
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              Positive aspects of working at DHL Nigeria
            </label>
            <textarea
              className="dhl-form__control dhl-form__control--textarea"
              rows={4}
              value={safeValues.positives}
              onChange={(e) => onChange("positives", e.target.value)}
              placeholder="What worked well for you? (culture, team, learning, etc.)"
            />
          </div>

          <div className="dhl-form__group">
            <label className="dhl-form__label">Areas of challenge</label>
            <textarea
              className="dhl-form__control dhl-form__control--textarea"
              rows={4}
              value={safeValues.challenges}
              onChange={(e) => onChange("challenges", e.target.value)}
              placeholder="What could have been better in your experience?"
            />
          </div>

          <div className="dhl-form__group">
            <label className="dhl-form__label">
              Feedback about your manager / leadership
            </label>
            <textarea
              className="dhl-form__control dhl-form__control--textarea"
              rows={4}
              value={safeValues.managerFeedback}
              onChange={(e) =>
                onChange("managerFeedback", e.target.value)
              }
              placeholder="Any feedback you would like to share about your manager or leadership."
            />
          </div>

          {touched && requiredMissing && (
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "#d40511",
              }}
            >
              You may leave this section brief, but please consider sharing at
              least one comment.
            </div>
          )}

          <div className="dhl-form__actions">
            <button
              type="button"
              className="dhl-button dhl-button--secondary"
              onClick={onBack}
            >
              Back
            </button>
            <button type="submit" className="dhl-button dhl-button--primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </DHLLayout>
  );
};

export default ExperiencePage;
