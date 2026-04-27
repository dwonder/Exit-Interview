// src/components/layout/DHLLayout.tsx
import React from "react";
import SidebarStepper from "../stepper/SidebarStepper";
import type { StepKey } from "../../pages/ExitInterviewWizard";

export interface DHLLayoutProps {
  children: React.ReactNode;
  currentStep?: StepKey | string; // now optional
  onStepChange?: (stepKey: StepKey) => void;
}

const DHLLayout: React.FC<DHLLayoutProps> = ({
  children,
  currentStep,
  onStepChange,
}) => {
  return (
    <div className="dhl-root">
      <div className="dhl-root__bg" />

      <header className="dhl-header">
        <div className="dhl-header__left">
          {/* DHL Logo placeholder - replace with real logo */}
          <div className="dhl-logo">
            <span className="dhl-logo__mark">DHL</span>
            <span className="dhl-logo__country">Nigeria</span>
          </div>
        </div>
        <div className="dhl-header__right">
          <span className="dhl-header__title">Employee Exit Interview</span>
          <span className="dhl-header__subtitle">
            Thank you for helping us improve the employee experience at DHL
            Nigeria.
          </span>
        </div>
      </header>

      <main className="dhl-shell">
        <div className="dhl-shell__inner">
          <aside className="dhl-shell__sidebar">
            {currentStep && (
              <SidebarStepper
                currentStep={currentStep}
                onStepChange={onStepChange}
              />
            )}
          </aside>

          <section className="dhl-shell__content">
            <div className="dhl-card">
              <div className="dhl-card__hero">
                <div className="dhl-card__hero-graphic" aria-hidden="true" />
                <div className="dhl-card__hero-text">
                  <h1 className="dhl-card__hero-title">Exit Interview Form</h1>
                  <p className="dhl-card__hero-subtitle">
                    Please answer the questions as honestly as you feel
                    comfortable. Your feedback supports positive change within
                    DHL Express Nigeria.
                  </p>
                </div>
              </div>

              <div className="dhl-card__body">{children}</div>
            </div>
          </section>
        </div>
      </main>

      <footer className="dhl-footer">
        <span className="dhl-footer__text">
          © {new Date().getFullYear()} DHL Express Nigeria. All rights reserved.
        </span>
      </footer>
    </div>
  );
};

export default DHLLayout;
