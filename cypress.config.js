const { defineConfig } = require('cypress');
const { check_inbox } = require('gmail-tester');

require('dotenv').config({ path: '.env.local' });

module.exports = defineConfig({
  env: {
    LOCAL_URL: process.env.LOCAL_URL,
    TEST_MAIL: process.env.TEST_MAIL,
    MAIL_CREDENTIALS_PATH: './mail-tester/credentials.json',
    MAIL_TOKEN_PATH: './mail-tester/token.json',
  },
  projectId: '78ae92',
  e2e: {
    baseUrl: process.env.LOCAL_URL,
    setupNodeEvents(on) {
      on('task', {
        getLinkInMail(options) {
          const link = check_inbox(
            './mail-tester/credentials.json',
            './mail-tester/token.json',
            {
              ...options,
              wait_time_sec: '1',
              max_wait_time_sec: '10',
            },
          ).then((messages) => {
            if (!Array.isArray(messages)) {
              console.error('No messages found', messages);
              return null;
            }
            var html = messages[0].body.html;
            const regex = /href="(.*)"/gim;
            const matches = regex.exec(html);
            return matches[1];
          });

          return link;
        },
      });
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
