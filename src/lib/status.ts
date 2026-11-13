import type { AssignmentRecord, StatusResult } from "./types";

/**
 * Rules:
 *  - submitted                   -> "submitted" (late = handed in after the deadline)
 *  - not submitted, past due     -> "overdue"
 *  - not submitted, still in time-> "pending"
 *
 * `now` is injected rather than read from the system clock, which keeps this
 * function pure and testable against a fixed point in time.
 */
export function computeStatus(
  record: Pick<AssignmentRecord, "dueAt" | "submittedAt">,
  now: Date,
): StatusResult {
  const due = new Date(record.dueAt).getTime();

  if (record.submittedAt !== null) {
    const submitted = new Date(record.submittedAt).getTime();
    return { status: "submitted", late: submitted > due };
  }

  // Strict ">" so handing in exactly at the deadline still counts as on time.
  return { status: now.getTime() > due ? "overdue" : "pending", late: false };
}
