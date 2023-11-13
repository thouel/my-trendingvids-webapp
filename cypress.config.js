const { defineConfig } = require('cypress');
const teardown = require('./cypress/scripts/teardown');
const init = require('./cypress/scripts/init');
const {
  getLinkInMail,
  refreshToken,
} = require('./cypress/scripts/mailTesterUtils');

require('dotenv').config({ path: '.env.local' });

module.exports = defineConfig({
  projectId: '78ae92',
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 3,
    // Configure retry attemps for `cypress open`
    // Default is 0
    openMode: 0,
  },
  e2e: {
    env: {
      LOCAL_URL: process.env.LOCAL_URL,
      TEST_MAIL: process.env.TEST_MAIL,
      MAIL_CREDENTIALS_PATH: './mail-tester/credentials.json',
      MAIL_TOKEN_PATH: './mail-tester/token.json',
      SESSION_COOKIE_NAME: 'next-auth.session-token',
      CSRF_COOKIE_NAME: 'next-auth.csrf-token',
    },
    specPattern: [
      'cypress/api/*.spec.{js,jsx,ts,tsx}',
      'cypress/e2e/*.spec.{js,jsx,ts,tsx}',
    ],
    baseUrl: process.env.LOCAL_URL,
    setupNodeEvents(on) {
      on('task', {
        'mail:getLink': (options) => getLinkInMail(options),
        'mail:refreshToken': () => refreshToken(),
        'db:teardown': () => teardown(),
        'db:init': () => init(),
      });
    },
  },

  component: {
    env: {
      LOCAL_URL: process.env.LOCAL_URL,
    },
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
