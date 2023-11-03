import { expect, test as setup } from '@playwright/test';
import { check_inbox, refresh_access_token } from 'gmail-tester';

const authFile = 'playwright/.auth/user.json';
const credentialsFile = 'playwright/.auth/credentials.json';
const tokenFile = 'playwright/.auth/token.json';

setup('refresh mail-tester token', async () => {
  await refresh_access_token(credentialsFile, tokenFile);
});

setup('authenticate with github', async ({ page }) => {
  setup.slow();
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
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  // Check if there's a 'Authorize' page
  if (await page.getByRole('button', { name: 'Authorize' }).isVisible()) {
    await page.getByRole('button', { name: 'Authorize' }).click();
  }

  // Check if there's a 'Code Verification' page
  // The verification code is sent by mail, so
  // we need to go fetch the mail, get the code
  // and set it up in the page
  if (await page.getByRole('button', { name: 'Verify' }).isVisible()) {
    // Wait for the mail to arrive in inbox
    await page.waitForTimeout(1000);

    // Get the mail
    var dateAfter = new Date();
    dateAfter.setMinutes(dateAfter.getMinutes() - 1);
    const messages = await check_inbox(credentialsFile, tokenFile, {
      from: 'noreply@github.com',
      subject: '[GitHub] Please verify your device',
      after: dateAfter,
      include_body: true,
    });

    expect(messages.length).toBeGreaterThanOrEqual(1);

    // Get the code
    const regex = /verification code:.(([0-9]){6})/gim;
    const res = regex.exec(messages[0].body.text);

    // Copy the code in the right input
    await page.getByPlaceholder('XXXXXX').fill(res[1]);

    // The page seems to be auto-validated once the code
    // is set.
    //await page.getByRole('button', { name: 'Verify' }).click();
  }
  // --- End of authentication steps

  // Wait for the homepage to load
  await page.waitForTimeout(10000);

  console.log(
    'cookies',
    (await page.context().cookies()).filter(
      (c) => c.name.indexOf('next-auth') > -1,
    ),
  );
  // Then save the cookies
  await page.context().storageState({ path: authFile });
});
