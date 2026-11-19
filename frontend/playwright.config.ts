import { defineConfig, devices } from "@playwright/test";

// Expects the frontend and backend to be running (see README); point it elsewhere with E2E_BASE_URL.
export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
