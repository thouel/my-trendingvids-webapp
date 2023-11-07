const signIn = (mail) => {
  cy.session(
    mail.toString(),
    () => {
      cy.signIn(mail);
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
};

describe('signedin-menu-and-shows', () => {
  before(() => {
    Cypress.session.clearAllSavedSessions();
  });
  beforeEach(() => {
    const mail = Cypress.env('TEST_MAIL');
    signIn(mail);
    cy.visit('/');
  });
  afterEach(() => {
    cy.signOut();
    cy.visit('/');
  });

  it('checks menu is 5 items long', () => {
    cy.get('a[href*="/shows/movies"]').should('have.text', 'Movies');
    cy.get('a[href*="/shows/tvshows"]').should('have.text', 'TV Shows');
    cy.get('a[href*="/shows/p-shows"]').should('have.text', 'My Shows');
    cy.get('a[href*="/auth/signout"]').should('have.text', 'Sign out');
  });

  it('adds a movie to my list', () => {
    // Opens the Movies page
    cy.get('a[href*="/shows/movies"]').click();

    // Opens the first show card of the first line
    cy.get('#splide01-slide01').click();

    //TODO: could be refactored using .as() to store the element
    var title = '';
    cy.get('h1 > div[title]')
      .then((el) => {
        cy.log(el.text());
        title = el.text();
      })
      .then(() => {
        // Adds this show to my list
        cy.get('button svg[alt*="Add to"]').parent().click();

        // Checks that the movie has been added to my list and the button changed
        cy.get('button > svg[alt*="Remove from"]', { timeout: 10000 }).should(
          'be.visible',
        );

        // Close the show card
        cy.get('button:contains("Close")').click();

        // Opens the My list page
        cy.get('a[href*="/shows/p-shows"]').click();

        // Checks that the title of the image is the same as the one
        // we added a few steps before,
        // then open the show card
        cy.get(`a[href] > img[title="${title}"]:first`)
          .should('be.visible')
          .click();

        // Removes from My List
        cy.get('button > svg[alt*="Remove from"]').click();

        // Checks that the movie can be added
        cy.get('button > svg[alt*="Add to"]').should('be.visible');

        // Close the show card
        cy.get('button:contains("Close")').click();

        // Checks that the show has been removed from the list
        cy.get(`a[href] > img[title="${title}"]`).should('not.exist');
      });
  });
});
