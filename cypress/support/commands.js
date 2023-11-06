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
  console.log('email', { email });
  console.log('csrfToken', { csrfToken });

  // Go to homepage

  // // Open the sign in page
  // cy.get('a[href*="/auth/signin"]').click();

  // enter mail
  // cy.get('#email').type(email);

  // cy.intercept('POST', '/api/auth/signin/email').as('signin');

  // click button
  //cy.get('button[type=submit][tabindex=2]').click();
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

  // cy.wait('@signin').its('request.body').should('contain', 'csrfToken=');

  // // check the page correctly transitioned
  // cy.url().should('include', '/auth/verify-request');

  // const oneMinuteAgo = new Date();
  // oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

  // // Calls the task that performs the mail search using mail-tester
  // cy.task('getLinkInMail', {
  //   subject: 'Sign in to localhost:3000',
  //   after: oneMinuteAgo,
  //   include_body: true,
  // }).then((link) => {
  //   // Opens the found link
  //   cy.visit(link);
  // });
});
