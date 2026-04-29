// src/pages/ThankYouPage.tsx
import React from "react";

type ThankYouPageProps = {
  referenceId: string | null;
};

const ThankYouPage: React.FC<ThankYouPageProps> = ({ referenceId }) => {
  const handleFinish = () => {
    // Reload app to the start/welcome
    window.location.href = "/";
  };

  return (
    <div className="dhl-root">
      <div className="dhl-root__bg" />
      <main className="dhl-shell dhl-shell--center">
        <div
          className="dhl-shell__inner"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <section className="dhl-shell__content" style={{ maxWidth: 420 }}>
            <div className="dhl-card">
              <div className="dhl-card__hero">
                <div className="dhl-card__hero-graphic" aria-hidden="true" />
                <div className="dhl-card__hero-text">
                  <h1 className="dhl-card__hero-title">Thank you!</h1>
                  <p className="dhl-card__hero-subtitle">
                    Your exit interview has been submitted successfully.
                    DHL Nigeria appreciates your time with us and your honest
                    feedback.
                  </p>
                </div>
              </div>

              <div className="dhl-card__body">
                {referenceId && (
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: 4,
                      border: "1px solid #e0e0e0",
                      background: "#fafafa",
                      marginBottom: 16,
                      fontSize: 13,
                    }}
                  >
                    <p style={{ margin: 0, marginBottom: 4 }}>
                      Your reference ID is:
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: 16,
                        letterSpacing: 0.5,
                      }}
                    >
                      {referenceId}
                    </p>
                    <p style={{ margin: 0, marginTop: 8 }}>
                      Please keep this ID for your records or if HR needs to
                      refer to your interview later.
                    </p>
                  </div>
                )}

                <p style={{ fontSize: 13, marginBottom: 16 }}>
                  A member of the HR team may contact you if any clarification
                  is needed. You may now close this window or return to the
                  start of the application.
                </p>
                <button
                  type="button"
                  className="dhl-button dhl-button--primary"
                  onClick={handleFinish}
                >
                  Finish and restart
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ThankYouPage;
