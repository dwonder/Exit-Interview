// Types for HR views (list and detail)

// One row in the HR list (matches /api/hr/exit-interviews SELECT)
export interface HrExitInterviewListItem {
  Id: number;
  EmployeeName: string;
  EmployeeId: string;
  FunctionName: string | null;
  Department: string | null;
  Grade: string | null;
  Manager: string | null;
  Location: string | null;
  SeparationDate: string | null; // string from API
  PrimaryReason: string | null;
}

// Response shape for GET /api/hr/exit-interviews
export interface HrExitInterviewListResponse {
  items: HrExitInterviewListItem[];
  total: number;
}

// Full detail record from GET /api/hr/exit-interviews/:id
// (include useful columns you have in the SQL table)
export interface HrExitInterviewDetail {
  Id: number;
  EmployeeName: string;
  EmployeeId: string;
  FunctionName: string | null;
  Department: string | null;
  Grade: string | null;
  Manager: string | null;
  Location: string | null;
  SeparationDate: string | null;
  PrimaryReason: string | null;

  // Next employment
  AcceptedAnotherJob?: boolean | null;
  NewEmployer?: string | null;
  NewJobTitle?: string | null;
  NewJobLocation?: string | null;
  HowFoundJob?: string | null;
  HowLongLooking?: string | null;

  // Experience & suggestions
  Suggestions?: string | null;
  WouldRecommend?: boolean | null;

  // Any extra columns in ExitInterviews table
  [key: string]: any;
}
