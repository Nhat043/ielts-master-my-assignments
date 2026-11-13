export type StudentId = "S01" | "S02";

/** Source record. Server-only: it carries the studentId we filter on. */
export interface AssignmentRecord {
  id: string;
  studentId: StudentId;
  title: string;
  /** ISO 8601 with an explicit +07:00 offset */
  dueAt: string;
  /** null = not submitted yet */
  submittedAt: string | null;
}

export type AssignmentStatus = "submitted" | "overdue" | "pending";

export interface StatusResult {
  status: AssignmentStatus;
  /** Only true when the work was handed in after the deadline */
  late: boolean;
}

/** What the client receives. Deliberately carries NO studentId. */
export interface AssignmentDTO {
  id: string;
  title: string;
  dueAt: string;
  submittedAt: string | null;
  status: AssignmentStatus;
  late: boolean;
}
