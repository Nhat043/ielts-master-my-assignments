import type { AssignmentStatus } from "@/lib/types";

const LABEL: Record<AssignmentStatus, string> = {
  submitted: "Đã nộp",
  overdue: "Quá hạn",
  pending: "Chưa nộp",
};

export function StatusBadge({
  status,
  late,
}: {
  status: AssignmentStatus;
  late: boolean;
}) {
  return (
    <span className="badges">
      <span className={`badge badge-${status}`}>{LABEL[status]}</span>
      {late && <span className="badge badge-late">Nộp trễ</span>}
    </span>
  );
}
