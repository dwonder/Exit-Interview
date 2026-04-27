export interface ExitInterviewPayload {
  // Employee details
  employeeId: string;
  employeeName: string;
  email?: string;
  manager: string;
  position: string;
  functionName?: string;
  department?: string;
  grade: string;
  location?: string;
  lengthOfService?: string;
  age?: string;
  separationDate: string; // ISO date string e.g. "2026-04-24"

  // Reasons for leaving
  primaryReason: string;
  secondaryReason?: string;
  tertiaryReason?: string;
  singleTriggerEvent?: boolean;
  singleTriggerExplanation?: string;
  preventable?: boolean;
  preventableExplanation?: string;

  // Experience & suggestions
  suggestions: string;
  wouldRecommend?: boolean;

  // Next employment
  acceptedAnotherJob?: boolean;
  newEmployer?: string;
  newJobTitle?: string;
  newJobLocation?: string;
  howFoundJob?: string;
  howLongLooking?: string;
}
