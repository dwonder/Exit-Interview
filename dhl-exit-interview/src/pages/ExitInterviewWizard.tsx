// src/pages/ExitInterviewWizard.tsx
import React, { useState, useMemo } from "react";
import EmployeeDetailsPage from "./EmployeeDetailsPage";
import ReasonsPage from "./ReasonsPage";
import ExperiencePage from "./ExperiencePage";
import NextEmploymentPage from "./NextEmploymentPage";
import AttachmentsPage from "./AttachmentsPage";
import ReviewSubmitPage from "./ReviewSubmitPage";
import ThankYouPage from "./ThankYouPage";

export type StepKey =
  | "details"
  | "reasons"
  | "experience"
  | "next"
  | "attachments"
  | "review"
  | "thank-you";

interface ExitInterviewWizardProps {
  currentStep: StepKey;
  goToStep: (step: StepKey) => void;
}

const ExitInterviewWizard: React.FC<ExitInterviewWizardProps> = ({
  currentStep,
  goToStep,
}) => {
  const [employeeDetails, setEmployeeDetails] = useState({
    fullName: "",
    staffId: "",
    department: "",
    location: "",
    lastWorkingDay: "",
  });

  const [reasonsForLeaving, setReasonsForLeaving] = useState({
    primaryReason: "",
    secondaryReason: "",
    tertiaryReason: "",
    singleTriggerEvent: "",
    singleTriggerExplanation: "",
    preventable: "",
    preventableExplanation: "",
  });

  const [experienceSummary, setExperienceSummary] = useState({
    positives: "",
    challenges: "",
    managerFeedback: "",
  });

  const [nextEmployment, setNextEmployment] = useState<{
    hasNewJob: boolean | undefined;
    newIndustry: string;
    stayingInLogistics: boolean | undefined;
  }>({
    hasNewJob: undefined,
    newIndustry: "",
    stayingInLogistics: undefined,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const attachments = useMemo(
    () => ({ fileNames: files.map((f) => f.name) }),
    [files]
  );

  const handleSubmitAll = async () => {
    try {
      setIsSubmitting(true);

      // 1) Build request body from wizard state
      const body = {
        // Required-ish fields for your API
        name: employeeDetails.fullName,
        employeeId: employeeDetails.staffId,
        manager: experienceSummary.managerFeedback || "N/A",
        position: "N/A", // TODO: replace when you capture this
        grade: "N/A", // TODO: replace when you capture this
        separationDate: employeeDetails.lastWorkingDay,
        primaryReason: reasonsForLeaving.primaryReason,
        suggestions:
          experienceSummary.challenges ||
          experienceSummary.positives ||
          "No additional suggestions provided",

        // Optional profile data
        email: null,
        functionName: null,
        department: employeeDetails.department || null,
        location: employeeDetails.location || null,
        lengthOfService: null,
        age: null,

        // More reasons
        secondaryReason: reasonsForLeaving.secondaryReason || null,
        tertiaryReason: reasonsForLeaving.tertiaryReason || null,
        singleTriggerEvent: reasonsForLeaving.singleTriggerEvent || null,
        singleTriggerExplanation:
          reasonsForLeaving.singleTriggerExplanation || null,
        preventable: reasonsForLeaving.preventable || null,
        preventableExplanation:
          reasonsForLeaving.preventableExplanation || null,

        // Recommendation & next employment
        wouldRecommend:
          experienceSummary.positives
            ? "Yes"
            : experienceSummary.challenges
            ? "No"
            : null,

        acceptedAnotherJob:
          nextEmployment.hasNewJob === true
            ? "Yes"
            : nextEmployment.hasNewJob === false
            ? "No"
            : null,

        newEmployer: nextEmployment.newIndustry || null,
        newJobTitle: null,
        newJobLocation: null,
        howFoundJob: null,
        howLongLooking: null,
      };

      // 2) Send it to your backend (Codespaces URL, change host if needed)
      const response = await fetch(
        "https://ideal-space-invention-696ww6xr6grcrv94-8080.app.github.dev/api/exit-interviews",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      // 3) Handle API response
      if (!response.ok) {
        let message = "Error submitting your exit interview.";
        try {
          const errJson = await response.json();
          if (errJson && typeof errJson.error === "string") {
            message = errJson.error;
          }
        } catch {
          // ignore JSON parse issues
        }
        alert(message);
        return;
      }

      const result = await response.json();
      console.log("Server response:", result);

      // Go to Thank You page when successful
      goToStep("thank-you");
    } catch (error) {
      console.error("Network or other error:", error);
      alert(
        "We could not submit your exit interview due to a technical issue. " +
          "Please try again or contact HR if it continues."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const reasonsForReview = useMemo(
    () => ({
      primaryReason: reasonsForLeaving.primaryReason,
      otherReasons: [
        reasonsForLeaving.secondaryReason,
        reasonsForLeaving.tertiaryReason,
        reasonsForLeaving.singleTriggerEvent
          ? `Trigger event: ${reasonsForLeaving.singleTriggerEvent}${
              reasonsForLeaving.singleTriggerExplanation
                ? ` (${reasonsForLeaving.singleTriggerExplanation})`
                : ""
            }`
          : "",
        reasonsForLeaving.preventable
          ? `Preventable: ${reasonsForLeaving.preventable}${
              reasonsForLeaving.preventableExplanation
                ? ` (${reasonsForLeaving.preventableExplanation})`
                : ""
            }`
          : "",
      ]
        .filter(Boolean)
        .join(" | "),
    }),
    [reasonsForLeaving]
  );

  // Decide which page to render based on currentStep
  switch (currentStep) {
    case "details":
      return (
        <EmployeeDetailsPage
          currentStep="details"
          onNext={() => goToStep("reasons")}
          values={employeeDetails}
          onChange={(field, value) =>
            setEmployeeDetails((prev) => ({ ...prev, [field]: value }))
          }
        />
      );

    case "reasons":
      return (
        <ReasonsPage
          currentStep="reasons"
          onNext={() => goToStep("experience")}
          onBack={() => goToStep("details")}
          values={reasonsForLeaving}
          onChange={(field, value) =>
            setReasonsForLeaving((prev) => ({ ...prev, [field]: value }))
          }
        />
      );

    case "experience":
      return (
        <ExperiencePage
          currentStep="experience"
          onNext={() => goToStep("next")}
          onBack={() => goToStep("reasons")}
          values={experienceSummary}
          onChange={(field, value) =>
            setExperienceSummary((prev) => ({ ...prev, [field]: value }))
          }
        />
      );

    case "next":
      return (
        <NextEmploymentPage
          currentStep="next"
          onNext={() => goToStep("attachments")}
          onBack={() => goToStep("experience")}
          values={nextEmployment}
          onChange={(field, value) =>
            setNextEmployment((prev) => ({ ...prev, [field]: value }))
          }
        />
      );

    case "attachments":
      return (
        <AttachmentsPage
          currentStep="attachments"
          onNext={() => goToStep("review")}
          onBack={() => goToStep("next")}
          files={files}
          setFiles={setFiles}
        />
      );

    case "review":
      return (
        <ReviewSubmitPage
          currentStep="review"
          onStepChange={goToStep}
          onEditSection={goToStep}
          employeeDetails={employeeDetails}
          reasonsForLeaving={reasonsForReview}
          experienceSummary={experienceSummary}
          nextEmployment={nextEmployment}
          attachments={attachments}
          onSubmit={handleSubmitAll}
          isSubmitting={isSubmitting}
        />
      );

    case "thank-you":
      return <ThankYouPage />;

    default:
      return null;
  }
};

export default ExitInterviewWizard;
