import { ASSIGNMENTS } from "./data";
import { computeStatus } from "./status";
import type { AssignmentDTO, StudentId } from "./types";

/** Keep only the given student's work, then map to the DTO (dropping studentId). */
export function getAssignmentsForStudent(
  studentId: StudentId,
  now: Date,
): AssignmentDTO[] {
  return ASSIGNMENTS.filter((a) => a.studentId === studentId).map((a) => ({
    id: a.id,
    title: a.title,
    dueAt: a.dueAt,
    submittedAt: a.submittedAt,
    ...computeStatus(a, now),
  }));
}
