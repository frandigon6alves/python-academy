import { expect, test, type Page } from "@playwright/test";

// Set SCREENSHOT_DIR to keep full-page screenshots of each step.
async function snap(page: Page, name: string) {
  if (process.env.SCREENSHOT_DIR) {
    await page.screenshot({ path: `${process.env.SCREENSHOT_DIR}/${name}.png`, fullPage: true });
  }
}

test("a learner signs up, completes a lesson and manages settings", async ({ page }) => {
  const email = `learner-${Date.now()}@example.com`;

  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Learn programming with Python");
  await expect(page.getByRole("link", { name: "Python Basics" })).toBeVisible();
  await snap(page, "01-academy");

  await page.getByRole("link", { name: "Sign up" }).first().click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Display name").fill("Smoke Tester");
  await page.getByLabel("Password").fill("supersecret1");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Hi, Smoke Tester!" })).toBeVisible();

  await page.goto("/en/courses/python-basics/lessons/variables");
  await expect(page.getByRole("heading", { name: "Key takeaways" })).toBeVisible();
  for (const group of await page.getByRole("group").all()) {
    await group.getByRole("radio").first().check();
  }
  await page.getByRole("button", { name: "Submit answers" }).click();
  await expect(page.getByText(/You scored \d of 3/)).toBeVisible();
  await expect(page.getByText("New badge: First steps")).toBeVisible();
  await snap(page, "02-lesson-quiz");

  await page.getByRole("link", { name: "My hub" }).click();
  await expect(page.getByText(/Level 1 · \d+ XP/)).toBeVisible();
  await expect(page.getByText("1 day streak")).toBeVisible();
  await snap(page, "03-hub");

  await page.getByLabel("Language").selectOption("es");
  await expect(page).toHaveURL(/\/es\/hub$/);
  await expect(page.getByRole("heading", { name: "¡Hola, Smoke Tester!" })).toBeVisible();

  await page.getByLabel("Tema").selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await snap(page, "04-hub-es-dark");

  await page.getByRole("link", { name: "Ajustes" }).click();
  await page.getByLabel("Nombre visible").fill("Smoke Renamed");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByText("Cambios guardados.")).toBeVisible();
  await snap(page, "05-settings");

  // Reloading keeps the dark theme without a flash: it is applied before first paint.
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page.getByRole("link", { name: "Iniciar sesión" })).toBeVisible();
  await expect(page).toHaveURL(/\/es$/);
});
