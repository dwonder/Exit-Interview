// src/pages/ReviewSubmitPage.tsx
import React from "react";
import * as Layout from "../components/layout/DHLLayout"; // namespace import works as a value
import type { StepKey } from "./ExitInterviewWizard";

interface ReviewSubmitPageProps {
  currentStep?: string;
  onStepChange?: (stepKey: StepKey) => void;

  employeeDetails?: {
    fullName?: string;
    staffId?: string;
    department?: string;
    location?: string;
    lastWorkingDay?: string;
  };
  reasonsForLeaving?: {
    primaryReason?: string;
    otherReasons?: string;
  };
  experienceSummary?: {
    positives?: string;
    challenges?: string;
    managerFeedback?: string;
  };
  nextEmployment?: {
    hasNewJob?: boolean;
    newIndustry?: string;
    stayingInLogistics?: boolean;
  };
  attachments?: {
    fileNames?: string[];
  };

  onEditSection?: (sectionKey: StepKey) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

const ReviewSubmitPage: React.FC<ReviewSubmitPageProps> = (props) => {
  const {
    currentStep = "review",
    onStepChange,
    onEditSection,
    onSubmit,
    isSubmitting,
  } = props;

  // Safe fallbacks
  const employeeDetails = props.employeeDetails || {};
  const reasonsForLeaving = props.reasonsForLeaving || {};
  const experienceSummary = props.experienceSummary || {};
  const nextEmployment = props.nextEmployment || {};
  const attachments = props.attachments || { fileNames: [] };

  return (
    <Layout.default currentStep={currentStep} onStepChange={onStepChange}>
      <div className="dhl-review">
        {/* Left: text summary */}
        <div className="dhl-review__main">
          <h2 className="dhl-review__title">Review your responses</h2>
          <p className="dhl-review__intro">
            Please take a final look at your answers. You can still go back
            to any section to adjust your comments before submitting.
          </p>

          {/* Employee details */}
          <section className="dhl-review__section">
            <div className="dhl-review__section-header">
              <h3 className="dhl-review__section-title">Employee details</h3>
              <button
                type="button"
                className="dhl-link-button"
                onClick={() => onEditSection && onEditSection("details")}
              >
                Edit
              </button>
            </div>
            <dl className="dhl-review__grid">
              <div>
                <dt>Full name</dt>
                <dd>{employeeDetails.fullName || "—"}</dd>
              </div>
              <div>
                <dt>Staff ID</dt>
                <dd>{employeeDetails.staffId || "—"}</dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{employeeDetails.department || "—"}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{employeeDetails.location || "—"}</dd>
              </div>
              <div>
                <dt>Last working day</dt>
                <dd>{employeeDetails.lastWorkingDay || "—"}</dd>
              </div>
            </dl>
          </section>

          {/* Reasons */}
          <section className="dhl-review__section">
            <div className="dhl-review__section-header">
              <h3 className="dhl-review__section-title">Reasons for leaving</h3>
              <button
                type="button"
                className="dhl-link-button"
                onClick={() => onEditSection && onEditSection("reasons")}
              >
                Edit
              </button>
            </div>
            <dl className="dhl-review__grid">
              <div>
                <dt>Primary reason</dt>
                <dd>{reasonsForLeaving.primaryReason || "—"}</dd>
              </div>
              <div className="dhl-review__grid--full">
                <dt>Other contributing reasons</dt>
                <dd>{reasonsForLeaving.otherReasons || "—"}</dd>
              </div>
            </dl>
          </section>

          {/* Experience */}
          <section className="dhl-review__section">
            <div className="dhl-review__section-header">
              <h3 className="dhl-review__section-title">
                Your experience at DHL Nigeria
              </h3>
              <button
                type="button"
                className="dhl-link-button"
                onClick={() => onEditSection && onEditSection("experience")}
              >
                Edit
              </button>
            </div>
            <dl className="dhl-review__grid">
              <div className="dhl-review__grid--full">
                <dt>Positive aspects</dt>
                <dd>{experienceSummary.positives || "—"}</dd>
              </div>
              <div className="dhl-review__grid--full">
                <dt>Areas of challenge</dt>
                <dd>{experienceSummary.challenges || "—"}</dd>
              </div>
              <div className="dhl-review__grid--full">
                <dt>Feedback about your manager / leadership</dt>
                <dd>{experienceSummary.managerFeedback || "—"}</dd>
              </div>
            </dl>
          </section>

          {/* Next employment */}
          <section className="dhl-review__section">
            <div className="dhl-review__section-header">
              <h3 className="dhl-review__section-title">Next employment</h3>
              <button
                type="button"
                className="dhl-link-button"
                onClick={() => onEditSection && onEditSection("next")}
              >
                Edit
              </button>
            </div>
            <dl className="dhl-review__grid">
              <div>
                <dt>New role secured</dt>
                <dd>
                  {nextEmployment.hasNewJob === undefined
                    ? "—"
                    : nextEmployment.hasNewJob
                    ? "Yes"
                    : "No"}
                </dd>
              </div>
              <div>
                <dt>New industry</dt>
                <dd>{nextEmployment.newIndustry || "—"}</dd>
              </div>
              <div>
                <dt>Remaining in logistics / express</dt>
                <dd>
                  {nextEmployment.stayingInLogistics === undefined
                    ? "—"
                    : nextEmployment.stayingInLogistics
                    ? "Yes"
                    : "No"}
                </dd>
              </div>
            </dl>
          </section>

          {/* Attachments */}
          <section className="dhl-review__section">
            <div className="dhl-review__section-header">
              <h3 className="dhl-review__section-title">Attachments</h3>
              <button
                type="button"
                className="dhl-link-button"
                onClick={() => onEditSection && onEditSection("attachments")}
              >
                Edit
              </button>
            </div>
            <div className="dhl-review__attachments">
              {attachments.fileNames && attachments.fileNames.length > 0 ? (
                <ul>
                  {attachments.fileNames.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              ) : (
                <p className="dhl-review__muted">No files attached.</p>
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="dhl-review__submit-area">
            <p className="dhl-review__disclaimer">
              By submitting this form, you confirm that the information
              provided is accurate to the best of your knowledge. Your
              feedback will be treated confidentially and used to improve
              DHL Nigeria’s people practices.
            </p>

            <div className="dhl-review__actions">
              <button
                type="button"
                className="dhl-button dhl-button--secondary"
                onClick={() => onStepChange && onStepChange("experience")}
              >
                Back
              </button>
              <button
                type="button"
                className="dhl-button dhl-button--primary"
                onClick={onSubmit}
                disabled={!!isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit exit interview"}
              </button>
            </div>
          </div>
        </div>

        {/* Right: illustration */}
        <aside className="dhl-review__visual">
          <div className="dhl-review__visual-card">
            <div className="dhl-review__visual-graphic" aria-hidden="true" />
            <div className="dhl-review__visual-text">
              <h4>Thank you for your contribution</h4>
              <p>
                Your time and effort at DHL Nigeria are appreciated.
                Your feedback helps shape a better workplace for
                current and future colleagues.
              </p>
              <ul>
                <li>Responses handled with respect</li>
                <li>Used to improve employee experience</li>
                <li>No impact on your final entitlements</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </Layout.default>
  );
};

export default ReviewSubmitPage;
