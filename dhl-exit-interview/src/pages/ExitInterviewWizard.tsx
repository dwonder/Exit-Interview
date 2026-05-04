// src/pages/ExitInterviewWizard.tsx
import React, { useState, useMemo } from "react";
import EmployeeDetailsPage from "./EmployeeDetailsPage";
import ReasonsPage from "./ReasonsPage";
import ExperiencePage from "./ExperiencePage";
import NextEmploymentPage from "./NextEmploymentPage";
import AttachmentsPage from "./AttachmentsPage";
import ReviewSubmitPage from "./ReviewSubmitPage";
import ThankYouPage from "./ThankYouPage";
import { submitExitInterview } from "../services/api";

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
    email: "",            // NEW
    manager: "",          // (if you ever want to capture manager here)
    department: "",
    location: "",
    lastWorkingDay: "",
    position: "",         // NEW
    grade: "",            // NEW
    lengthOfService: "",  // NEW
    age: "",              // NEW
  });

  const DEPARTMENT_OPTIONS = [
  "HR",
  "IT",
  "Customer service",
  "Operations",
  "Commercial",
  "General management",
  "Finance",
] as const;

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
    wouldRecommend: "",   // NEW: "Yes" | "No" | ""
  });

  const [nextEmployment, setNextEmployment] = useState<{
    hasNewJob: boolean | undefined;
    newIndustry: string;
    stayingInLogistics: boolean | undefined;
    newEmployer?: string;     // NEW
    newJobTitle?: string;     // NEW
    howFoundJob?: string;     // NEW
    howLongLooking?: string;  // NEW
  }>({
    hasNewJob: undefined,
    newIndustry: "",
    stayingInLogistics: undefined,
    newEmployer: "",
    newJobTitle: "",
    howFoundJob: "",
    howLongLooking: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store referenceId so we can show it on Thank You page
  const [referenceId, setReferenceId] = useState<string | null>(null);

  const attachments = useMemo(
    () => ({ fileNames: files.map((f) => f.name) }),
    [files]
  );

  const handleSubmitAll = async () => {
    try {
      setIsSubmitting(true);

      // Frontend validation for required fields
      if (
  !employeeDetails.fullName.trim() ||
  !employeeDetails.staffId.trim() ||
  !employeeDetails.department.trim() ||
  !employeeDetails.lastWorkingDay.trim() ||
  !reasonsForLeaving.primaryReason.trim()
) {
  alert(
    "Please fill in your name, staff ID, department, last working day and primary reason before submitting."
  );
  setIsSubmitting(false);
  return;
}

if (!DEPARTMENT_OPTIONS.includes(employeeDetails.department as any)) {
  alert("Please select a valid department from the dropdown.");
  setIsSubmitting(false);
  return;
}

      // 1) Build request body from wizard state – matches backend expectations
      const body = {
        // Required fields expected by the API
        name: employeeDetails.fullName,
        employeeId: employeeDetails.staffId,
        manager: experienceSummary.managerFeedback || "N/A",
        position: employeeDetails.position || "N/A",
        grade: employeeDetails.grade || "N/A",
        separationDate: employeeDetails.lastWorkingDay,
        primaryReason: reasonsForLeaving.primaryReason,
        suggestions:
          experienceSummary.challenges ||
          experienceSummary.positives ||
          "No additional suggestions provided",

        // Optional profile data
        email: employeeDetails.email || undefined,
        functionName: undefined,
        department: employeeDetails.department || undefined,
        location: employeeDetails.location || undefined,
        lengthOfService: employeeDetails.lengthOfService || undefined,
        age: employeeDetails.age || undefined,

        // More reasons
        secondaryReason: reasonsForLeaving.secondaryReason || undefined,
        tertiaryReason: reasonsForLeaving.tertiaryReason || undefined,

        // Backend expects "Yes"/"No"/undefined strings for these flags
        singleTriggerEvent:
          reasonsForLeaving.singleTriggerEvent.trim() !== "" ? "Yes" : undefined,
        singleTriggerExplanation:
          reasonsForLeaving.singleTriggerEvent.trim() !== ""
            ? reasonsForLeaving.singleTriggerExplanation || undefined
            : undefined,

        preventable:
          reasonsForLeaving.preventable === "Yes"
            ? "Yes"
            : reasonsForLeaving.preventable === "No"
            ? "No"
            : undefined,
        preventableExplanation:
          reasonsForLeaving.preventableExplanation || undefined,

        wouldRecommend:
          experienceSummary.wouldRecommend === "Yes"
            ? "Yes"
            : experienceSummary.wouldRecommend === "No"
            ? "No"
            : undefined,

        acceptedAnotherJob:
          nextEmployment.hasNewJob === true
            ? "Yes"
            : nextEmployment.hasNewJob === false
            ? "No"
            : undefined,

        newEmployer: nextEmployment.newEmployer || undefined,
        newJobTitle: nextEmployment.newJobTitle || undefined,
        newJobLocation: undefined,
        howFoundJob: nextEmployment.howFoundJob || undefined,
        howLongLooking: nextEmployment.howLongLooking || undefined,
      };

      const result = await submitExitInterview(body);
      console.log("Server response:", result);

      if (result && result.referenceId) {
        setReferenceId(result.referenceId);
      } else {
        setReferenceId(null);
      }

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
      return <ThankYouPage referenceId={referenceId} />;

    default:
      return null;
  }
};

export default ExitInterviewWizard;
