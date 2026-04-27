import React from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/exit-interview");
  };

  return (
    <div className="dhl-root">
      <div className="dhl-root__bg" />
      <main className="dhl-shell dhl-shell--center">
        <div
          className="dhl-shell__inner"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <section className="dhl-shell__content" style={{ maxWidth: 380 }}>
            <div className="dhl-card">
              <div className="dhl-card__hero">
                <div
                  className="dhl-card__hero-graphic"
                  aria-hidden="true"
                />
                <div className="dhl-card__hero-text">
                  <h1 className="dhl-card__hero-title">Exit Interview</h1>
                  <p className="dhl-card__hero-subtitle">
                    Thank you for taking the time to complete this exit
                    interview for DHL Express Nigeria. Your honest feedback
                    helps us improve our workplace.
                  </p>
                </div>
              </div>
              <div className="dhl-card__body">
                <p style={{ fontSize: 13, marginBottom: 16 }}>
                  This process typically takes about 8–10 minutes. Your
                  responses will be reviewed by HR and handled confidentially
                  and respectfully.
                </p>
                <button
                  type="button"
                  className="dhl-button dhl-button--primary"
                  onClick={handleStart}
                >
                  Enter the Exit Interview
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;
