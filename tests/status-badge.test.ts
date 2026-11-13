import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/StatusBadge";
import type { AssignmentStatus } from "@/lib/types";

/**
 * Renders the component to a plain HTML string. No DOM needed: react-dom/server
 * is already a dependency, so this stays a normal node-environment test.
 */
const render = (status: AssignmentStatus, late: boolean) =>
  renderToStaticMarkup(createElement(StatusBadge, { status, late }));

describe("StatusBadge labels", () => {
  it('shows "Chưa nộp" for pending work', () => {
    const html = render("pending", false);
    expect(html).toContain("Chưa nộp");
    expect(html).not.toContain("Nộp trễ");
  });

  it('shows "Quá hạn" once the deadline has passed', () => {
    expect(render("overdue", false)).toContain("Quá hạn");
  });

  it('shows "Đã nộp" alone when the work arrived on time', () => {
    const html = render("submitted", false);
    expect(html).toContain("Đã nộp");
    expect(html).not.toContain("Nộp trễ");
  });

  it('shows "Đã nộp" and "Nộp trễ" together when the work arrived late', () => {
    const html = render("submitted", true);
    expect(html).toContain("Đã nộp");
    expect(html).toContain("Nộp trễ");
  });
});
