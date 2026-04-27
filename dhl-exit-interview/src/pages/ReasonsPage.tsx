import React, { useState } from "react";
import DHLLayout from "../components/layout/DHLLayout";

interface ReasonsValues {
  primaryReason: string;
  secondaryReason: string;
  tertiaryReason: string;
  singleTriggerEvent: string;
  singleTriggerExplanation: string;
  preventable: string;
  preventableExplanation: string;
}

interface ReasonsPageProps {
  currentStep: string;
  onNext: () => void;
  onBack: () => void;
  values: ReasonsValues;
  onChange: (field: keyof ReasonsValues, value: string) => void;
}

const ReasonsPage: React.FC<ReasonsPageProps> = ({
  currentStep,
  onNext,
  onBack,
  values,
  onChange,
}) => {
  // Defensive fallback in case values is ever undefined at runtime
  const safeValues: ReasonsValues = values || {
    primaryReason: "",
    secondaryReason: "",
    tertiaryReason: "",
    singleTriggerEvent: "",
    singleTriggerExplanation: "",
    preventable: "",
    preventableExplanation: "",
  };

  const [touched, setTouched] = useState(false);

  const requiredMissing =
    !safeValues.primaryReason ||
    !safeValues.singleTriggerEvent ||
    !safeValues.preventable;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!requiredMissing) {
      onNext();
    }
  };

  return (
    <DHLLayout currentStep={currentStep} onStepChange={() => {}}>
      <div className="dhl-page">
        <h2 className="dhl-page__title">Reasons for leaving</h2>
        <p className="dhl-page__subtitle">
          Help us understand the main reasons behind your decision to leave DHL
          Nigeria.
        </p>

        <form className="dhl-form" onSubmit={handleSubmit}>
          {/* Primary reason */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              <span className="dhl-form__label-required">*</span>
              Primary reason for leaving
            </label>
            <select
              className="dhl-form__control"
              value={safeValues.primaryReason}
              onChange={(e) => onChange("primaryReason", e.target.value)}
              required
            >
              <option value="">Select a reason</option>
              <option value="Career growth">Career growth</option>
              <option value="Compensation and benefits">
                Compensation and benefits
              </option>
              <option value="Work-life balance">Work-life balance</option>
              <option value="Manager relationship">Manager relationship</option>
              <option value="Relocation">Relocation</option>
              <option value="Personal reasons">Personal reasons</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Secondary reason */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Secondary reason</label>
            <input
              className="dhl-form__control"
              placeholder="Optional secondary reason"
              value={safeValues.secondaryReason}
              onChange={(e) => onChange("secondaryReason", e.target.value)}
            />
          </div>

          {/* Tertiary reason */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">Tertiary reason</label>
            <input
              className="dhl-form__control"
              placeholder="Optional tertiary reason"
              value={safeValues.tertiaryReason}
              onChange={(e) => onChange("tertiaryReason", e.target.value)}
            />
          </div>

          {/* Trigger event */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              <span className="dhl-form__label-required">*</span>
              Was there a single event that triggered your decision?
            </label>
            <select
              className="dhl-form__control"
              value={safeValues.singleTriggerEvent}
              onChange={(e) =>
                onChange("singleTriggerEvent", e.target.value)
              }
              required
            >
              <option value="">Select Yes or No</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="dhl-form__group">
            <label className="dhl-form__label">If yes, please explain</label>
            <textarea
              className="dhl-form__control dhl-form__control--textarea"
              placeholder="Explain the event if you are comfortable sharing."
              value={safeValues.singleTriggerExplanation}
              onChange={(e) =>
                onChange("singleTriggerExplanation", e.target.value)
              }
            />
          </div>

          {/* Preventable */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              <span className="dhl-form__label-required">*</span>
              Do you believe your resignation could have been prevented?
            </label>
            <select
              className="dhl-form__control"
              value={safeValues.preventable}
              onChange={(e) => onChange("preventable", e.target.value)}
              required
            >
              <option value="">Select Yes or No</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="dhl-form__group">
            <label className="dhl-form__label">If yes, please explain</label>
            <textarea
              className="dhl-form__control dhl-form__control--textarea"
              placeholder="What might have changed your decision?"
              value={safeValues.preventableExplanation}
              onChange={(e) =>
                onChange("preventableExplanation", e.target.value)
              }
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
              Please complete all required questions before continuing.
            </div>
          )}

          {/* Buttons */}
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

export default ReasonsPage;
