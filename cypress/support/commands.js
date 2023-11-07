// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
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

Cypress.Commands.add('signIn', (email) => {
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
});

Cypress.Commands.add('signOut', () => {
  cy.request({
    method: 'GET',
    url: '/api/auth/signout?callbackUrl=/',
    failOnStatusCode: false,
  });
  cy.clearCookie(Cypress.env('SESSION_COOKIE_NAME'));
  cy.getCookie(Cypress.env('SESSION_COOKIE_NAME')).should('not.exist');
});
