// src/pages/ExitInterviewFlow.tsx
import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ExitInterviewWizard from "./ExitInterviewWizard";
import type { StepKey } from "./ExitInterviewWizard";

const ExitInterviewFlow: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map URLs to wizard step keys
  const getStepFromPath = (): StepKey => {
    if (location.pathname.startsWith("/exit-interview/reasons")) return "reasons";
    if (location.pathname.startsWith("/exit-interview/experience"))
      return "experience";
    if (location.pathname.startsWith("/exit-interview/next-employment"))
      return "next";
    if (location.pathname.startsWith("/exit-interview/attachments"))
      return "attachments";
    if (location.pathname.startsWith("/exit-interview/review")) return "review";
    if (location.pathname.startsWith("/exit-interview/thank-you"))
      return "thank-you";
    return "details";
  };

  const goToStep = (step: StepKey) => {
    switch (step) {
      case "details":
        navigate("/exit-interview/details");
        break;
      case "reasons":
        navigate("/exit-interview/reasons");
        break;
      case "experience":
        navigate("/exit-interview/experience");
        break;
      case "next":
        navigate("/exit-interview/next-employment");
        break;
      case "attachments":
        navigate("/exit-interview/attachments");
        break;
      case "review":
        navigate("/exit-interview/review");
        break;
      case "thank-you":
        navigate("/exit-interview/thank-you");
        break;
    }
  };

  const currentStep = getStepFromPath();

  return (
    <Routes>
      {/* Default /exit-interview → /exit-interview/details */}
      <Route
        index
        element={<Navigate to="/exit-interview/details" replace />}
      />

      {/* All wizard URLs render the same wizard component */}
      <Route
        path="details"
        element={
          <ExitInterviewWizard currentStep={currentStep} goToStep={goToStep} />
        }
      />
      <Route
        path="reasons"
        element={
          <ExitInterviewWizard currentStep={currentStep} goToStep={goToStep} />
        }
      />
      <Route
        path="experience"
        element={
          <ExitInterviewWizard currentStep={currentStep} goToStep={goToStep} />
        }
      />
      <Route
        path="next-employment"
        element={
          <ExitInterviewWizard currentStep={currentStep} goToStep={goToStep} />
        }
      />
      <Route
        path="attachments"
        element={
          <ExitInterviewWizard currentStep={currentStep} goToStep={goToStep} />
        }
      />
      <Route
        path="review"
        element={
          <ExitInterviewWizard currentStep={currentStep} goToStep={goToStep} />
        }
      />
      <Route
        path="thank-you"
        element={
          <ExitInterviewWizard currentStep={currentStep} goToStep={goToStep} />
        }
      />

      {/* Any unknown subpath under /exit-interview goes to first step */}
      <Route
        path="*"
        element={<Navigate to="/exit-interview/details" replace />}
      />
    </Routes>
  );
};

export default ExitInterviewFlow;
