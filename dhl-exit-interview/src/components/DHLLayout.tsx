import React from "react";
import TopBar from "./TopBar";

export type StepId =
  | "welcome"
  | "employee"
  | "reasons"
  | "experience"
  | "nextEmployment"
  | "attachments"
  | "review";

export interface DHLLayoutProps {
  currentStep: StepId;
  children: React.ReactNode;
}

const steps: { id: StepId; label: string }[] = [
  { id: "welcome",         label: "Welcome" },
  { id: "employee",        label: "Employee Details" },
  { id: "reasons",         label: "Reasons for Leaving" },
  { id: "experience",      label: "Experience & Feedback" },
  { id: "nextEmployment",  label: "Next Employment" },
  { id: "attachments",     label: "Attachments" },
  { id: "review",          label: "Review & Submit" },
];

const DHLLayout: React.FC<DHLLayoutProps> = ({ currentStep, children }) => {
  return (
    <div className="app-root">
      <TopBar />
      <main className="app-main">
        <div className="app-shell">
          {/* Left sidebar: DHL-branded panel with stepper */}
          <aside className="app-sidebar">
            {/* Sidebar image placeholder to visualise a DHL-themed illustration */}
            <div className="sidebar-hero">
              <div className="sidebar-hero-image">IMAGE</div>
              <div className="sidebar-hero-text">
                <div className="sidebar-hero-title">Thank you</div>
                <div className="sidebar-hero-body">
                  Your feedback helps DHL Nigeria improve our employee experience.
                </div>
              </div>
            </div>

            <ol className="stepper">
              {steps.map((step, index) => {
                const isCurrent = step.id === currentStep;
                const isCompleted =
                  steps.findIndex(s => s.id === currentStep) > index;

                const className = [
                  "stepper-item",
                  isCurrent ? "current" : "",
                  isCompleted ? "completed" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <li key={step.id} className={className}>
                    <span className="step-index">
                      {isCompleted ? "✓" : index + 1}
                    </span>
                    <span className="step-label">{step.label}</span>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* Main card */}
          <section className="app-content">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DHLLayout;
