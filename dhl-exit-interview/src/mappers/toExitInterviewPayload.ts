import type { ExitInterviewPayload } from "../types/ExitInterviewPayload";

// For now, assume a flat state with these keys.
// Replace `any` with your real InterviewState type later.
export function toExitInterviewPayload(state: any): ExitInterviewPayload {
  return {
    // Employee details – map from flat keys
    employeeId: state.employeeId ?? "",
    employeeName: state.name ?? "",
    email: state.email ?? "",
    manager: state.manager ?? "",
    position: state.position ?? "",
    functionName: state.functionName ?? "",
    department: state.department ?? "",
    grade: state.grade ?? "",
    location: state.location ?? "",
    lengthOfService: state.lengthOfService ?? "",
    age: state.age ?? "",
    separationDate: state.separationDate ?? "",

    // Reasons – adjust names once you see them in state
    primaryReason: state.primaryReason ?? "",
    secondaryReason: state.secondaryReason ?? "",
    tertiaryReason: state.tertiaryReason ?? "",
    singleTriggerEvent: state.singleTriggerEvent ?? false,
    singleTriggerExplanation: state.singleTriggerExplanation ?? "",
    preventable: state.preventable ?? false,
    preventableExplanation: state.preventableExplanation ?? "",

    // Experience & suggestions
    suggestions: state.suggestions ?? "",
    wouldRecommend: state.wouldRecommend ?? false,

    // Next employment
    acceptedAnotherJob: state.acceptedAnotherJob ?? false,
    newEmployer: state.newEmployer ?? "",
    newJobTitle: state.newJobTitle ?? "",
    newJobLocation: state.newJobLocation ?? "",
    howFoundJob: state.howFoundJob ?? "",
    howLongLooking: state.howLongLooking ?? "",
  };
}
