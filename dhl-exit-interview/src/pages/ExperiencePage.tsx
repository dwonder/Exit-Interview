// src/pages/ExperiencePage.tsx
import React, { useState } from "react";
import DHLLayout from "../components/layout/DHLLayout";

interface ExperienceValues {
  positives: string;
  challenges: string;
  managerFeedback: string;
  wouldRecommend: string; // "Yes" | "No" | ""
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
  const [touched, setTouched] = useState(false);

  // If you want to make this question required, you can use this later
  const recommendMissing = values.wouldRecommend === "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    // If you want to enforce answering the recommend question, uncomment:
    // if (recommendMissing) return;

    onNext();
  };

  return (
    <DHLLayout currentStep={currentStep} onStepChange={() => {}}>
      <div className="dhl-page">
        <h2 className="dhl-page__title">Your experience at DHL</h2>
        <p className="dhl-page__subtitle">
          Please share what worked well and what could have been better during
          your time with DHL Express Nigeria.
        </p>

        <form className="dhl-form" onSubmit={handleSubmit}>
          {/* Positives */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              What did you enjoy most about working at DHL Express?
            </label>
            <textarea
              className="dhl-form__control"
              rows={4}
              value={values.positives}
              onChange={(e) => onChange("positives", e.target.value)}
              placeholder="e.g. My team, development opportunities, work environment…"
            />
          </div>

          {/* Challenges */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              What challenges or frustrations did you experience?
            </label>
            <textarea
              className="dhl-form__control"
              rows={4}
              value={values.challenges}
              onChange={(e) => onChange("challenges", e.target.value)}
              placeholder="e.g. workload, processes, tools, communication…"
            />
          </div>

          {/* Manager feedback */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              Any feedback on your line manager or leadership?
            </label>
            <textarea
              className="dhl-form__control"
              rows={3}
              value={values.managerFeedback}
              onChange={(e) => onChange("managerFeedback", e.target.value)}
              placeholder="e.g. support received, communication, coaching…"
            />
          </div>

          {/* Would recommend DHL as Employer of Choice */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              Would you recommend DHL Express as an Employer of Choice?
            </label>
            <div className="dhl-radio-group">
              <label className="dhl-radio">
                <input
                  type="radio"
                  name="wouldRecommend"
                  value="Yes"
                  checked={values.wouldRecommend === "Yes"}
                  onChange={(e) => onChange("wouldRecommend", e.target.value)}
                />
                <span>Yes</span>
              </label>
              <label className="dhl-radio" style={{ marginLeft: 16 }}>
                <input
                  type="radio"
                  name="wouldRecommend"
                  value="No"
                  checked={values.wouldRecommend === "No"}
                  onChange={(e) => onChange("wouldRecommend", e.target.value)}
                />
                <span>No</span>
              </label>
            </div>

            {/* Optional inline validation if you decide to require this */}
            {touched && recommendMissing && (
              <div
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  color: "#d40511",
                }}
              >
                Please indicate whether you would recommend DHL Express as an
                Employer of Choice.
              </div>
            )}
          </div>

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
