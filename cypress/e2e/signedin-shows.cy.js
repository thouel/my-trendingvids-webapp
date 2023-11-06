describe('signin', () => {
  beforeEach(() => {
    const mail = Cypress.env('TEST_MAIL');

    // Get the page to extract the csrfToken

    var csrfToken = '';
    cy.visit('/auth/signin');
    cy.get('input[name=csrfToken]').then((input) => {
      csrfToken = input.val();
    });

    cy.session(
      mail,
      () => {
        cy.signInByMail(mail, csrfToken).then((res) => {
          console.log('res', { res });
          expect(res.status).to.eq(200);
          expect(res.body).to.include('Click the link');
        });
      },
      {
        validate: () => {
          console.log('in validate');
        },
        cacheAcrossSpecs: true,
      },
    );

    // cy.session('saveCookies', cy.signInByMail(Cypress.env('TEST_MAIL')), {
    //   validate() {
    //     console.log('Cookies!', cy.getCookies());
    //   },
    //   cacheAcrossSpecs: true,
    // });
  });

  it('checks menu is 5 items long', () => {
    cy.get('a[href*="/shows/movies"]').should('have.text', 'Movies');
    cy.get('a[href*="/shows/tvshows"]').should('have.text', 'TV Shows');
    cy.get('a[href*="/shows/p-shows"]').should('have.text', 'My Shows');
    cy.get('a[href*="/auth/signout"]').should('have.text', 'Sign out');
  });
});
