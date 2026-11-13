import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  // tsconfig keeps jsx: "preserve" so Next handles the transform. Vitest compiles
  // the components itself, so point it at the automatic runtime — otherwise esbuild
  // emits React.createElement and the components fail with "React is not defined".
  esbuild: { jsx: "automatic" },
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
});
