describe('signedin-menu-and-shows', () => {
  before(() => {
    Cypress.session.clearAllSavedSessions();
    cy.task('mail:refreshToken');
    cy.task('db:teardown');
  });
  beforeEach(() => {
    const mail = Cypress.env('TEST_MAIL');
    cy.signInByAPI(mail);
    cy.visit('/');
  });
  afterEach(() => {
    cy.signOut();
    cy.visit('/');
  });

  it('checks menu is 5 items long when signedin', () => {
    cy.get('a[href*="/shows/movies"]').should('have.text', 'Movies');
    cy.get('a[href*="/shows/tvshows"]').should('have.text', 'TV Shows');
    cy.get('a[href*="/shows/p-shows"]').should('have.text', 'My Shows');
    cy.get('a[href*="/auth/signout"]').should('have.text', 'Sign out');
  });

  it('adds a movie to my list then removes it', () => {
    // Opens the Movies page
    cy.get('a[href*="/shows/movies"]').click();

    // Opens the first show card of the first line
    cy.get('#splide01-slide01', { timeout: 10000 }).click();

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
          .click({ timeout: 10000 });

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

  it('adds two shows to my list then removes these', () => {
    cy.openTVShowsPage();

    // Opens the first show card of the first line
    cy.get('#splide01-slide01', { timeout: 10000 }).click();

    // Gets the title of the show
    var title = '';
    cy.get('h1 > div[title]').then((el) => {
      // We open a then() here to make sure the title is fetched before using it for comparison a few steps later
      cy.log(el.text());
      title = el.text();

      // Adds this show to my list
      cy.get('button svg[alt*="Add to"]').parent().click();

      // Checks that the movie has been added to my list, i.e the button changed
      cy.get('button > svg[alt*="Remove from"]', { timeout: 10000 }).should(
        'be.visible',
      );

      // Close the show card
      cy.get('button:contains("Close")').click();

      // Opens the My list page
      cy.openMyShowsPage();

      // Locate the first show in my list
      cy.get('a[href] > img[title]:first').as('firstShowInMyList');

      // Checks that this is visible
      cy.get('@firstShowInMyList').should('be.visible');

      // Checks that the title of the image is the same as the one
      // we added a few steps before,
      cy.get('@firstShowInMyList')
        .invoke('attr', 'title')
        .should('equals', title);
    });

    // Opens Movies page
    cy.openMoviesPage();

    // Opens the first show card of the first line
    cy.get('#splide02-slide01', { timeout: 10000 }).click();

    // Gets the title to compare it with the title of the card in MyShows
    cy.get('h1 > div[title]').then((el) => {
      // We open a then() here to make sure the title is fetched before using it for comparison a few steps later
      title = el.text();

      // Adds this show to my list
      cy.get('button svg[alt*="Add to"]').parent().click();

      // Checks that the movie has been added to my list, i.e the button changed
      cy.get('button > svg[alt*="Remove from"]', { timeout: 10000 }).should(
        'be.visible',
      );

      // Close the show card
      cy.get('button:contains("Close")').click();

      // Opens the My list page
      cy.openMyShowsPage();

      // Locate the first show in my list
      cy.get('#splide01-slide02 a img[title]:first').as('secondShowInMyList');

      // Checks that this is visible
      cy.get('@secondShowInMyList').should('be.visible');

      // Checks that the title of the image is the same as the one
      // we added a few steps before,
      cy.get('@secondShowInMyList')
        .invoke('attr', 'title')
        .should('equals', title);
    });

    // Then open the show card
    cy.get('@secondShowInMyList').click();

    // Removes from My List
    cy.get('button > svg[alt*="Remove from"]').click();

    // Checks that the movie can be added
    cy.get('button > svg[alt*="Add to"]').should('be.visible');

    // Close the show card
    cy.get('button:contains("Close")').click();

    // Checks that the show has been removed from the list
    cy.get('@secondShowInMyList').should('not.exist');

    // Then open the show card
    cy.get('@firstShowInMyList').click();

    // Removes from My List
    cy.get('button > svg[alt*="Remove from"]').click();

    // Checks that the movie can be added
    cy.get('button > svg[alt*="Add to"]').should('be.visible');

    // Close the show card
    cy.get('button:contains("Close")').click();

    // Checks that the show has been removed from the list
    cy.get('@firstShowInMyList').should('not.exist');
  });
});
