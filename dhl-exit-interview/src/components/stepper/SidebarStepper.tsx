import React from "react";
import classNames from "classnames";

export type StepKey =
  | "details"
  | "reasons"
  | "experience"
  | "next"
  | "attachments"
  | "review";

export interface SidebarStepperProps {
  currentStep: StepKey | string;
  onStepChange?: (stepKey: StepKey) => void;
}

const STEPS: { key: StepKey; label: string; description?: string }[] = [
  { key: "details", label: "Employee Details", description: "Basic information" },
  { key: "reasons", label: "Reasons for Leaving", description: "Why you are moving on" },
  { key: "experience", label: "DHL Experience", description: "Your journey here" },
  { key: "next", label: "Next Employment", description: "Your next chapter" },
  { key: "attachments", label: "Attachments", description: "Optional supporting files" },
  { key: "review", label: "Review & Submit", description: "Final checks" },
];

const SidebarStepper: React.FC<SidebarStepperProps> = ({
  currentStep,
  onStepChange,
}) => {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav className="dhl-stepper" aria-label="Exit interview progress">
      {/* Compact logo / title area for sidebar (visible on desktop) */}
      <div className="dhl-stepper__header">
        {/* TODO: Replace with narrow DHL brand lockup for sidebar if desired */}
        <div className="dhl-stepper__badge">
          <span className="dhl-stepper__badge-main">Exit Interview</span>
          <span className="dhl-stepper__badge-sub">DHL Express Nigeria</span>
        </div>
      </div>

      <ol className="dhl-stepper__list">
        {STEPS.map((step, index) => {
          const isActive = step.key === currentStep;
          const isCompleted = currentIndex > index;
          const isUpcoming = currentIndex < index;

          return (
            <li key={step.key} className="dhl-stepper__item">
              <button
                type="button"
                className={classNames("dhl-stepper__button", {
                  "dhl-stepper__button--active": isActive,
                  "dhl-stepper__button--completed": isCompleted,
                  "dhl-stepper__button--upcoming": isUpcoming,
                  "dhl-stepper__button--clickable": !!onStepChange,
                })}
                onClick={() =>
                  onStepChange && onStepChange(step.key)
                }
                aria-current={isActive ? "step" : undefined}
              >
                <span
                  className={classNames("dhl-stepper__circle", {
                    "dhl-stepper__circle--active": isActive,
                    "dhl-stepper__circle--completed": isCompleted,
                  })}
                >
                  {isCompleted ? (
                    <span className="dhl-stepper__check" aria-hidden="true">
                      ✓
                    </span>
                  ) : (
                    index + 1
                  )}
                </span>

                <span className="dhl-stepper__text">
                  <span className="dhl-stepper__label">
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="dhl-stepper__description">
                      {step.description}
                    </span>
                  )}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="dhl-stepper__connector" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      <div className="dhl-stepper__footer">
        <p className="dhl-stepper__hint">
          Your responses will be treated with respect and used to
          improve our people practices at DHL Nigeria.
        </p>
      </div>
    </nav>
  );
};

export default SidebarStepper;
