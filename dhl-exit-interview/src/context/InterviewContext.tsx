import React, { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";

export type YesNo = "" | "Yes" | "No";

export type InterviewData = {
  // Employee details
  name: string;
  email: string;
  manager: string;
  position: string;
  functionName: string;
  grade: string;
  employeeId: string;
  lengthOfService: string;
  age: string;
  separationDate: string;

  // Reasons for leaving
  primaryReason: string;
  secondaryReason: string;
  tertiaryReason: string;
  singleTriggerEvent: YesNo;
  singleTriggerExplanation: string;
  preventable: YesNo;
  preventableExplanation: string;

  // Experience / suggestions
  suggestions: string;
  wouldRecommend: YesNo;

  // Next employment
  acceptedAnotherJob: YesNo;
  newEmployer: string;
  newJobTitle: string;
  newJobLocation: string;
  howFoundJob: string;
  howLongLooking: string;

  // Attachments (placeholder)
  attachments: string[];
};

const defaultData: InterviewData = {
  name: "",
  email: "",
  manager: "",
  position: "",
  functionName: "",
  grade: "",
  employeeId: "",
  lengthOfService: "",
  age: "",
  separationDate: "",
  primaryReason: "",
  secondaryReason: "",
  tertiaryReason: "",
  singleTriggerEvent: "",
  singleTriggerExplanation: "",
  preventable: "",
  preventableExplanation: "",
  suggestions: "",
  wouldRecommend: "",
  acceptedAnotherJob: "",
  newEmployer: "",
  newJobTitle: "",
  newJobLocation: "",
  howFoundJob: "",
  howLongLooking: "",
  attachments: [],
};

type InterviewContextType = {
  data: InterviewData;
  update: (patch: Partial<InterviewData>) => void;
  reset: () => void;
};

const InterviewContext = createContext<InterviewContextType | undefined>(
  undefined
);

export const InterviewProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<InterviewData>(defaultData);

  const update = (patch: Partial<InterviewData>) =>
    setData(prev => ({ ...prev, ...patch }));

  const reset = () => setData(defaultData);

  return (
    <InterviewContext.Provider value={{ data, update, reset }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) {
    throw new Error("useInterview must be used within InterviewProvider");
  }
  return ctx;
};
