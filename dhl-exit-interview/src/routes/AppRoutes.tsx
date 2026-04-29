// src/routes/AppRoutes.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import WelcomePage from "../pages/WelcomePage";
import ExitInterviewFlow from "../pages/ExitInterviewFlow";
import HRDashboardPage from "../pages/hr/HRDashboardPage";
import HRInterviewListPage from "../pages/hr/HRInterviewListPage";
import HRInterviewDetailPage from "../pages/hr/HRInterviewDetailPage";


/**
 * Application routes
 * - "/"                    → Welcome landing page
 * - "/exit-interview/*"    → Full employee exit interview wizard
 * - "/hr/..."              → HR views (dashboard, list, detail)
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Employee entry / landing */}
      <Route path="/" element={<WelcomePage />} />

      {/* Full exit interview wizard */}
      <Route path="/exit-interview/*" element={<ExitInterviewFlow />} />
  {/* Thank you after submission */}
  


      {/* HR flow */}
      <Route path="/hr" element={<HRDashboardPage />} />
      <Route path="/hr/interviews" element={<HRInterviewListPage />} />
      <Route path="/hr/interviews/:id" element={<HRInterviewDetailPage />} />

      {/* Fallback: anything unknown goes back to the welcome page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
