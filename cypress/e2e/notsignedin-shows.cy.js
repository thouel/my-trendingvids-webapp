describe('not signed-in tests of shows listing', () => {
  it('checks main menu is 3 items long when not logged in', () => {
    cy.visit('/');
    cy.get('a[href*="/shows/movies"]').should('have.text', 'Movies');
    cy.get('a[href*="/shows/tvshows"]').should('have.text', 'TV Shows');
    cy.get('a[href*="/auth/signin"]').should('have.text', 'Sign in');
  });
});
