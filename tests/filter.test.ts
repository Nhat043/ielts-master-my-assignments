import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/assignments/route";
import { getAssignmentsForStudent } from "@/lib/assignments";
import { SIMULATED_NOW } from "@/lib/clock";

const S01_IDS = ["A01", "A02", "A03", "A04"];
const ids = (body: { assignments: { id: string }[] }) => body.assignments.map((a) => a.id);

/**
 * Next always passes a Request to a route handler. Ours deliberately declares no
 * parameter, so we cast here to call it exactly the way the framework does.
 */
const callRoute = (url: string) =>
  (GET as unknown as (req: Request) => Promise<Response>)(new Request(url));

describe("filtering assignments by student", () => {
  it("returns only S01's work, never S02's B01", () => {
    const result = getAssignmentsForStudent("S01", SIMULATED_NOW);
    expect(result.map((a) => a.id)).toEqual(S01_IDS);
  });

  it("never exposes studentId or any trace of S02 in the response", async () => {
    const body = await (await GET()).json();

    expect(ids(body)).toEqual(S01_IDS);
    const payload = JSON.stringify(body);
    for (const leak of ["B01", "S02", "studentId"]) {
      expect(payload).not.toContain(leak);
    }
  });

  it("ignores a studentId supplied by the client (IDOR guard)", async () => {
    const spoofed = await (
      await callRoute("http://localhost/api/assignments?studentId=S02")
    ).json();
    const normal = await (await GET()).json();

    // Spoofing the query changes nothing: the payload is identical.
    expect(spoofed).toEqual(normal);
    expect(ids(spoofed)).toEqual(S01_IDS);
  });
});
