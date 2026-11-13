/** Fixed simulated clock: 11/11/2026 09:00 (GMT+7). Never calls Date.now(). */
export const SIMULATED_NOW = new Date("2026-11-11T09:00:00+07:00");

export function getNow(): Date {
  return SIMULATED_NOW;
}
