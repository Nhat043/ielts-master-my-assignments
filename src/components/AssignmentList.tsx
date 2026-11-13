"use client";

/**
 * Fetches the endpoint from the browser rather than reading the data directly in a
 * server component. That keeps the server/client boundary real: whatever reaches this
 * file has already been filtered server-side and travelled over HTTP, exactly as a
 * production client would receive it.
 */

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
    // Guards against a response arriving after the component has unmounted, which
    // would otherwise set state on something no longer on screen.
    let cancelled = false;
    fetch("/api/assignments")
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d: { now: string; assignments: AssignmentDTO[] }) => {
        if (!cancelled) setState({ kind: "ready", now: d.now, items: d.assignments });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });
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
        {/* Hidden from assistive tech: below 640px the header row is not rendered and
            each card repeats its own label, so announcing it here would duplicate. */}
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
