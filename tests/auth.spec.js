import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

test('all sign-in are correctly displayed', async ({ page }) => {
  await page.goto(process.env.LOCAL_URL);

  await page.waitForTimeout(1000);

  if (!(await page.getByRole('link', { name: 'Sign in' }).isVisible())) {
    // click on the menu opener
    await page.getByRole('button', { name: 'Open main menu' }).click();
  }

  await page.getByRole('link', { name: 'Sign in' }).click();

  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /twitch/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /github/i })).toBeVisible();
});
