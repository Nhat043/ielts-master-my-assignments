"use client";

import { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/format";
import type { AssignmentDTO } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

type State =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "ready"; now: string; items: AssignmentDTO[] };

export function AssignmentList() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/assignments")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d: { now: string; assignments: AssignmentDTO[] }) => {
        if (!cancelled) setState({ kind: "ready", now: d.now, items: d.assignments });
      })
      .catch(() => !cancelled && setState({ kind: "error" }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.kind === "loading") return <p className="note" role="status">Đang tải bài tập…</p>;
  if (state.kind === "error")
    return <p className="note note-error" role="alert">Không tải được danh sách. Tải lại trang để thử lại.</p>;
  if (state.items.length === 0) return <p className="note">Bạn chưa có bài tập nào.</p>;

  return (
    <>
      <p className="clock">Thời điểm giả lập: {formatDateTime(state.now)} (GMT+7)</p>
      <ul className="list">
        <li className="row row-head" aria-hidden="true">
          <span>Tên bài</span>
          <span>Hạn nộp</span>
          <span>Trạng thái</span>
        </li>
        {state.items.map((a) => (
          <li key={a.id} className="row">
            <span className="title">{a.title}</span>
            <span className="due">
              <span className="lbl">Hạn nộp: </span>
              {formatDateTime(a.dueAt)}
            </span>
            <StatusBadge status={a.status} late={a.late} />
          </li>
        ))}
      </ul>
    </>
  );
}
