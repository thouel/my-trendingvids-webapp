Cypress.Commands.add('openMoviesPage', () => {
  cy.visit('/');
  cy.get('a[href*="/shows/movies"]').click();
  cy.url().should('include', '/shows/movies');
});

Cypress.Commands.add('openTVShowsPage', () => {
  cy.visit('/');
  cy.get('a[href*="/shows/tvshows"]').click();
  cy.url().should('include', '/shows/tvshows');
});

Cypress.Commands.add('openMyShowsPage', () => {
  cy.visit('/');
  cy.get('a[href*="/shows/p-shows"]').click();
  cy.url().should('include', '/shows/p-shows');
});
