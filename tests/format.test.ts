import { describe, expect, it } from "vitest";
import { formatDateTime } from "@/lib/format";

describe("formatDateTime", () => {
  it("renders a +07:00 timestamp in Vietnamese day/month/year order", () => {
    expect(formatDateTime("2026-11-13T23:59:00+07:00")).toBe("23:59 13/11/2026");
  });

  it("renders the same instant identically however it is expressed", () => {
    // 16:59 UTC is 23:59 in GMT+7 — the formatter is pinned to Asia/Ho_Chi_Minh,
    // so neither the input's offset nor the host timezone can shift the output.
    expect(formatDateTime("2026-11-13T16:59:00Z")).toBe(
      formatDateTime("2026-11-13T23:59:00+07:00"),
    );
  });
});
