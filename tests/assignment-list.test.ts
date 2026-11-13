// @vitest-environment jsdom
import { createElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AssignmentList } from "@/components/AssignmentList";
import type { AssignmentDTO } from "@/lib/types";

const A01: AssignmentDTO = {
  id: "A01",
  title: "Foundation U1 – Reading",
  dueAt: "2026-11-13T23:59:00+07:00",
  submittedAt: null,
  status: "pending",
  late: false,
};

const A04: AssignmentDTO = {
  id: "A04",
  title: "Foundation U4 – Speaking",
  dueAt: "2026-11-08T23:59:00+07:00",
  submittedAt: "2026-11-10T12:00:00+07:00",
  status: "submitted",
  late: true,
};

/** Stands in for the endpoint, which is covered separately in filter.test.ts. */
function stubFetch(response: Partial<Response> | "never-settles") {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      response === "never-settles" ? new Promise(() => {}) : Promise.resolve(response),
    ),
  );
}

const ok = (assignments: AssignmentDTO[]) => ({
  ok: true,
  json: async () => ({ now: "2026-11-11T02:00:00.000Z", assignments }),
});

const renderList = () => render(createElement(AssignmentList));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AssignmentList", () => {
  it("tells the student it is loading while the request is in flight", () => {
    stubFetch("never-settles");
    renderList();

    expect(screen.getByRole("status").textContent).toContain("Đang tải");
  });

  it("renders each assignment with its due date and status", async () => {
    stubFetch(ok([A01, A04]));
    renderList();

    expect(await screen.findByText("Foundation U1 – Reading")).toBeTruthy();
    expect(screen.getByText("Foundation U4 – Speaking")).toBeTruthy();

    // A04 was handed in after its deadline, so it carries both badges.
    expect(screen.getByText("Nộp trễ")).toBeTruthy();
    expect(screen.getByText("Chưa nộp")).toBeTruthy();

    // The due date is rendered in GMT+7 regardless of where the test runs.
    expect(screen.getByText(/23:59 13\/11\/2026/)).toBeTruthy();
  });

  it("shows an error message instead of an empty page when the request fails", async () => {
    stubFetch({ ok: false, status: 500 } as Response);
    renderList();

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Không tải được");
  });

  it("says so explicitly when the student has no assignments", async () => {
    stubFetch(ok([]));
    renderList();

    expect(await screen.findByText(/chưa có bài tập nào/i)).toBeTruthy();
  });
});
