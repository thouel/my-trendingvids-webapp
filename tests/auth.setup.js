import { test as setup } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate with github', async ({ page }) => {
  await page.goto(process.env.LOCAL_URL);

  if (!(await page.getByRole('link', { name: 'Sign in' }).isVisible())) {
    // click on the menu opener
    await page.getByRole('button', { name: 'Open main menu' }).click();
  }

  await page.getByRole('link', { name: 'Sign in' }).click();

  await page.getByRole('button', { name: /github/i }).click();
  await page
    .getByLabel('Username or email address')
    .fill(process.env.TEST_USERNAME);
  await page.getByLabel('Password').fill(process.env.TEST_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  if (await page.getByRole('button', { name: 'Authorize' }).isVisible()) {
    await page.getByRole('button', { name: 'Authorize' }).click();
  }
  // --- End of authentication steps

  // Wait for the homepage to load
  await page.waitForURL(process.env.LOCAL_URL);

  // Then save the cookies
  await page.context().storageState({ path: authFile });
});
