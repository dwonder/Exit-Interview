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
import type { ExitInterviewPayload } from "../types/ExitInterviewPayload"; 

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

      // 1) Build request body from wizard state – matches ExitInterviewPayload
      const body = {
        // Employee details
        employeeName: employeeDetails.fullName,
        employeeId: employeeDetails.staffId,
        manager: experienceSummary.managerFeedback || "N/A",
        position: "N/A", // TODO: capture from form later
        grade: "N/A",    // TODO: capture from form later
        separationDate: employeeDetails.lastWorkingDay,
        primaryReason: reasonsForLeaving.primaryReason,
        suggestions:
          experienceSummary.challenges ||
          experienceSummary.positives ||
          "No additional suggestions provided",

        // Optional profile data
        email: undefined, // or a string if you collect it
        functionName: undefined,
        department: employeeDetails.department || undefined,
        location: employeeDetails.location || undefined,
        lengthOfService: undefined,
        age: undefined,

        // More reasons
        secondaryReason: reasonsForLeaving.secondaryReason || undefined,
        tertiaryReason: reasonsForLeaving.tertiaryReason || undefined,

        // If there is any trigger-event text, mark the flag true and send explanation;
        // otherwise leave both undefined.
        singleTriggerEvent:
          reasonsForLeaving.singleTriggerEvent.trim() !== ""
            ? true
            : undefined,
        singleTriggerExplanation:
          reasonsForLeaving.singleTriggerEvent.trim() !== ""
            ? reasonsForLeaving.singleTriggerExplanation || undefined
            : undefined,

        // Preventable: treat "Yes"/"No"/"" as boolean or undefined
        preventable:
          reasonsForLeaving.preventable === "Yes"
            ? true
            : reasonsForLeaving.preventable === "No"
            ? false
            : undefined,
        preventableExplanation:
          reasonsForLeaving.preventableExplanation || undefined,

        // Recommendation & next employment
        wouldRecommend:
          experienceSummary.positives
            ? true
            : experienceSummary.challenges
            ? false
            : undefined,

        acceptedAnotherJob:
          nextEmployment.hasNewJob === true
            ? true
            : nextEmployment.hasNewJob === false
            ? false
            : undefined,

        newEmployer: nextEmployment.newIndustry || undefined,
        newJobTitle: undefined,
        newJobLocation: undefined,
        howFoundJob: undefined,
        howLongLooking: undefined,
      } satisfies ExitInterviewPayload;

      // 2) Send it to your backend via the shared API helper
      const result = await submitExitInterview(body);
      console.log("Server response:", result);

      // 3) Go to Thank You page when successful
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
