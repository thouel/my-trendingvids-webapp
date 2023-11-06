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
    // Opens the found link
    cy.request({
      method: 'GET',
      url: link,
      failOnStatusCode: false,
    });
  });
});
