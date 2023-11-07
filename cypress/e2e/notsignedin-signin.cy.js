describe('not signed-in tests of sign in page', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('checks all sign in options are available', () => {
    cy.get('a[href*="/auth/signin"]').click();
    cy.get('#email').should('be.empty').should('be.enabled');
    cy.get('button[type=submit][tabindex=2]').should('have.text', 'Sign in');
    cy.get('div[tabindex=5] > button:contains("Sign in with GitHub")').should(
      'be.enabled',
    );
    cy.get('div[tabindex=6] > button:contains("Sign in with Twitch")').should(
      'be.enabled',
    );
  });
});
