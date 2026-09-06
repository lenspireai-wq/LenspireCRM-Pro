import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import reactHooks from "eslint-plugin-react-hooks";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    // Keep legacy debt visible while allowing lint to guard new work.
    plugins: { "react-hooks": reactHooks },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);
