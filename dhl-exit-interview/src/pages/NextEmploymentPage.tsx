// src/pages/NextEmploymentPage.tsx
import React, { useState } from "react";
import DHLLayout from "../components/layout/DHLLayout";

interface NextEmploymentValues {
  hasNewJob: boolean | undefined;
  newIndustry: string;
  stayingInLogistics: boolean | undefined;
  newEmployer?: string;
  newJobTitle?: string;
  howFoundJob?: string;
  howLongLooking?: string;
}

interface NextEmploymentPageProps {
  currentStep: string;
  onNext: () => void;
  onBack: () => void;
  values: NextEmploymentValues;
  onChange: (
    field: keyof NextEmploymentValues,
    value: string | boolean | undefined
  ) => void;
}

const NextEmploymentPage: React.FC<NextEmploymentPageProps> = ({
  currentStep,
  onNext,
  onBack,
  values,
  onChange,
}) => {
  const [touched, setTouched] = useState(false);

  const requiredMissing = values.hasNewJob === undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!requiredMissing) {
      onNext();
    }
  };

  const hasNewJobValue =
    values.hasNewJob === undefined ? "" : values.hasNewJob ? "Yes" : "No";

  const stayingInLogisticsValue =
    values.stayingInLogistics === undefined
      ? ""
      : values.stayingInLogistics
      ? "Yes"
      : "No";

  // When user changes the primary question, we also reset some dependent fields
  const handleHasNewJobChange = (value: string) => {
    if (value === "") {
      onChange("hasNewJob", undefined);
      onChange("newIndustry", "");
      onChange("newEmployer", "");
      onChange("newJobTitle", "");
      onChange("howFoundJob", "");
      onChange("howLongLooking", "");
    } else if (value === "Yes") {
      onChange("hasNewJob", true);
      // keep existing details
    } else {
      // No
      onChange("hasNewJob", false);
      onChange("newIndustry", "");
      onChange("newEmployer", "");
      onChange("newJobTitle", "");
      onChange("howFoundJob", "");
      onChange("howLongLooking", "");
    }
  };

  const showNewJobDetails = values.hasNewJob === true;

  return (
    <DHLLayout currentStep={currentStep} onStepChange={() => {}}>
      <div className="dhl-page">
        <h2 className="dhl-page__title">Next employment</h2>
        <p className="dhl-page__subtitle">
          This section helps us understand where our talent is moving to and how
          we can remain competitive in the market.
        </p>

        <form className="dhl-form" onSubmit={handleSubmit}>
          {/* Have you accepted another job? */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              <span className="dhl-form__label-required">*</span>
              Have you accepted another job?
            </label>
            <select
              className="dhl-form__control"
              value={hasNewJobValue}
              onChange={(e) => handleHasNewJobChange(e.target.value)}
              required
            >
              <option value="">Select Yes or No</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* Only show these if they have a new job */}
          {showNewJobDetails && (
            <>
              {/* New employer */}
              <div className="dhl-form__group">
                <label className="dhl-form__label">New employer</label>
                <input
                  className="dhl-form__control"
                  value={values.newEmployer || ""}
                  onChange={(e) => onChange("newEmployer", e.target.value)}
                  placeholder="e.g. ABC Logistics Ltd"
                />
              </div>

              {/* New job title */}
              <div className="dhl-form__group">
                <label className="dhl-form__label">New job title</label>
                <input
                  className="dhl-form__control"
                  value={values.newJobTitle || ""}
                  onChange={(e) => onChange("newJobTitle", e.target.value)}
                  placeholder="e.g. Operations Manager"
                />
              </div>

              {/* New industry */}
              <div className="dhl-form__group">
                <label className="dhl-form__label">New industry</label>
                <input
                  className="dhl-form__control"
                  value={values.newIndustry}
                  onChange={(e) => onChange("newIndustry", e.target.value)}
                  placeholder="e.g. Finance, Technology, Manufacturing"
                />
              </div>

              {/* How did you find the job? */}
              <div className="dhl-form__group">
                <label className="dhl-form__label">
                  How did you find the job?
                </label>
                <input
                  className="dhl-form__control"
                  value={values.howFoundJob || ""}
                  onChange={(e) => onChange("howFoundJob", e.target.value)}
                  placeholder="e.g. LinkedIn, Referral, Job board"
                />
              </div>

              {/* How long have you been looking? */}
              <div className="dhl-form__group">
                <label className="dhl-form__label">
                  How long have you been looking?
                </label>
                <input
                  className="dhl-form__control"
                  value={values.howLongLooking || ""}
                  onChange={(e) => onChange("howLongLooking", e.target.value)}
                  placeholder="e.g. 3 months"
                />
              </div>
            </>
          )}

          {/* Will you remain in logistics business? */}
          <div className="dhl-form__group">
            <label className="dhl-form__label">
              Will you remain in logistics business?
            </label>
            <select
              className="dhl-form__control"
              value={stayingInLogisticsValue}
              onChange={(e) =>
                onChange(
                  "stayingInLogistics",
                  e.target.value === ""
                    ? undefined
                    : e.target.value === "Yes"
                )
              }
            >
              <option value="">Select Yes or No</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {touched && requiredMissing && (
            <div
              style={{
                marginTop: 4,
                fontSize: 12,
                color: "#d40511",
              }}
            >
              Please indicate whether you have accepted another job.
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

export default NextEmploymentPage;
