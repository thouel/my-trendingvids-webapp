Cypress.Commands.add('signInByMail', (email, csrfToken) => {
  expect(email).to.be.not.empty;
  expect(csrfToken).to.be.not.empty;

  cy.request({
    method: 'POST',
    url: '/api/auth/signin/email',
    failOnStatusCode: false,
    form: true,
    body: {
      email,
      csrfToken,
    },
  });

  const minutesAgo = new Date();
  minutesAgo.setMinutes(minutesAgo.getMinutes() - 5);

  // Calls the task that performs the mail search using mail-tester
  cy.task(
    'getLinkInMail',
    {
      subject: 'Sign in to localhost:3000',
      after: minutesAgo,
      include_body: true,
    },
    { log: true, timeout: 10000 },
  ).then((link) => {
    const url = link.split(':3000')[1];
    cy.log('opening', { url });
    // Opens the found link
    cy.request({
      method: 'GET',
      url: url,
      failOnStatusCode: false,
    });
  });
});

Cypress.Commands.add('signInByAPI', (email) => {
  cy.log(`signIn using ${email}`);
  cy.session(
    email.toString(),
    () => {
      var csrfToken = '';
      cy.visit('/');

      cy.visit('/auth/signin').then(() => {
        cy.getCookie('next-auth.csrf-token')
          .then((cookie) => {
            csrfToken = cookie.value.split('%7C')[0];
            cy.log('csrfToken', { csrfToken });
          })
          .then(() => {
            cy.signInByMail(email, csrfToken).then((res) => {
              expect(res.status).to.eq(200);
              expect(res.body).not.to.include('Sign in with');
              expect(res.body).to.include('Welcome');
            });
          });
      });
    },
    {
      validate: () => {
        // Search across all cookies if each session cookie has a value property
        var found = false;
        cy.getCookies().then((cookies) => {
          cookies.map((c, i) => {
            cy.log(`cookie[${i}]`, c.name);
            if (c.name.startsWith(Cypress.env('SESSION_COOKIE_NAME'))) {
              expect(c.value).to.be.not.empty;
              found = true;
            }
          });
          expect(found).to.be.true;
        });
      },
      // cacheAcrossSpecs: true,
    },
  );
});

Cypress.Commands.add('signOut', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/signout?callbackUrl=/',
    failOnStatusCode: false,
  });

  // To handle session token chunking
  cy.getCookies().then((cookies) => {
    cookies.map((c, i) => {
      cy.log(`cookie[${i}]`, c.name);
      if (c.name.startsWith(Cypress.env('SESSION_COOKIE_NAME'))) {
        cy.clearCookie(c.name);
        cy.getCookie(c.name).should('not.exist');
      }
    });
  });
});
