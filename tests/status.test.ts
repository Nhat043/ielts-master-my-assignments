import { describe, expect, it } from "vitest";
import { SIMULATED_NOW } from "@/lib/clock";
import { ASSIGNMENTS } from "@/lib/data";
import { computeStatus } from "@/lib/status";

const byId = (id: string) => ASSIGNMENTS.find((a) => a.id === id)!;

describe("computeStatus at the simulated now: 11/11/2026 09:00 (GMT+7)", () => {
  it("A01: not submitted, still in time -> pending", () => {
    expect(computeStatus(byId("A01"), SIMULATED_NOW)).toEqual({
      status: "pending",
      late: false,
    });
  });

  it("A02: not submitted, past due -> overdue", () => {
    expect(computeStatus(byId("A02"), SIMULATED_NOW)).toEqual({
      status: "overdue",
      late: false,
    });
  });

  it("A03: handed in before the deadline -> submitted, not late", () => {
    expect(computeStatus(byId("A03"), SIMULATED_NOW)).toEqual({
      status: "submitted",
      late: false,
    });
  });

  it("A04: handed in after the deadline -> submitted and late", () => {
    expect(computeStatus(byId("A04"), SIMULATED_NOW)).toEqual({
      status: "submitted",
      late: true,
    });
  });

  it("boundary: handing in exactly at the deadline still counts as on time", () => {
    const due = "2026-11-11T09:00:00+07:00";
    const result = computeStatus({ dueAt: due, submittedAt: null }, new Date(due));
    expect(result.status).toBe("pending");
  });
});
