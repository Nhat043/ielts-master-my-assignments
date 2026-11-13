import type { StudentId } from "./types";

/**
 * Simulated server-side session: the signed-in student is always S01.
 *
 * studentId is never taken from the URL, query string or request body.
 * A real system would read it from an authenticated cookie/session/JWT;
 * only the body of this function would change.
 */
export function getCurrentStudentId(): StudentId {
  return "S01";
}
