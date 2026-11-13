import { NextResponse } from "next/server";
import { getAssignmentsForStudent } from "@/lib/assignments";
import { getNow } from "@/lib/clock";
import { getCurrentStudentId } from "@/lib/session";

export const dynamic = "force-dynamic";

/**
 * Deliberately declares no request parameter: any ?studentId=... or header the
 * client sends is unreachable from here, so it cannot influence the result.
 */
export async function GET() {
  const studentId = getCurrentStudentId();
  const now = getNow();
  const assignments = getAssignmentsForStudent(studentId, now);
  return NextResponse.json({ now: now.toISOString(), assignments });
}
