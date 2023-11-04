import { expect, test as setup } from '@playwright/test';
import prisma from 'app/utils/db/db-prisma';
import { check_inbox, refresh_access_token } from 'gmail-tester';

const authFile = 'playwright/.auth/user.json';
const credentialsFile = 'playwright/.auth/credentials.json';
const tokenFile = 'playwright/.auth/token.json';

setup('refresh mail-tester token', async () => {
  await refresh_access_token(credentialsFile, tokenFile);
});

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

  // take a screenshot
  await page.screenshot({ path: 'playwright-report/authends-1.png' });

  // Wait for the homepage to load
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().indexOf(process.env.LOCAL_URL) > -1 &&
        response.status() === 200,
    ),
    expect(page.getByText('Welcome')).toBeVisible(),
  ]);

  console.log(
    'cookies',
    (await page.context().cookies()).filter(
      (c) => c.name.indexOf('next-auth') > -1,
    ),
  );

  // var foundSessionToken = false;
  // (await page.context().cookies()).filter((c) => {
  //   if (c.name.indexOf('next-auth.session-token') > -1)
  //     foundSessionToken = true;
  // });

  // if (!foundSessionToken) {
  //   // This is a dummy random session token
  //   const sessionToken = '04456e41-ec3b-4edf-92c1-48c14e57cacd2';

  //   const date = new Date();
  //   const expires = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  //   // we make sure the test user exists in our database
  //   await prisma.user.upsert({
  //     where: {
  //       email: 'thoueldev@gmail.com',
  //     },
  //     create: {
  //       name: 'thoueldev',
  //       email: 'thoueldev@gmail.com',
  //       sessions: {
  //         create: {
  //           expires,
  //           sessionToken,
  //         },
  //       },
  //       accounts: {
  //         create: {
  //           type: 'oauth',
  //           provider: 'github',
  //           providerAccountId: '2222222',
  //           access_token: 'ggg_zZl1pWIvKkf3UDynZ09zLvuyZsm1yC0YoRPt',
  //           token_type: 'bearer',
  //           scope: 'read:org,read:user,repo,user:email',
  //         },
  //       },
  //     },
  //     update: {},
  //   });

  //   // we add a session token cookie
  //   await page.context().addCookies([
  //     {
  //       name: 'next-auth.session-token',
  //       value: sessionToken,
  //       domain: 'localhost',
  //       path: '/',
  //       httpOnly: true,
  //       sameSite: 'Lax',
  //       expires: expires.getTime() / 1000,
  //     },
  //   ]);
  //   await page.context().addCookies([
  //     {
  //       name: 'next-auth.session-token',
  //       value: sessionToken,
  //       domain: '127.0.0.1',
  //       path: '/',
  //       httpOnly: true,
  //       sameSite: 'Lax',
  //       expires: expires.getTime() / 1000,
  //     },
  //   ]);
  //   console.log('cookie added');
  // }

  // console.log(
  //   'cookies',
  //   (await page.context().cookies()).filter(
  //     (c) => c.name.indexOf('next-auth') > -1,
  //   ),
  // );

  await page.screenshot({ path: 'playwright-report/authends.png' });

  // Then save the cookies
  await page.context().storageState({ path: authFile });
});
