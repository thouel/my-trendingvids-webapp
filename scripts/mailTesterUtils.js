const { check_inbox, refresh_access_token } = require('gmail-tester');

const opts = {
  credentials: './mail-tester/credentials.json',
  token: './mail-tester/token.json',
};

async function getLinkInMail(options) {
  const link = await check_inbox(opts.credentials, opts.token, {
    ...options,
    wait_time_sec: '1',
    max_wait_time_sec: '10',
  }).then((messages) => {
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
}

async function refreshToken() {
  await refresh_access_token(opts.credentials, opts.token);
  return { ok: 1 };
}

module.exports = { getLinkInMail, refreshToken };
