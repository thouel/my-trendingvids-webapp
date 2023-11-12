describe('Test the /api/trends/[showType] route with showType = movies or tvshows', () => {
  it('should succeed giving movies trends with showType = movies', () => {
    cy.request({
      method: 'POST',
      url: '/api/trends/movies',
      failOnStatusCode: true,
    }).then(({ status, body }) => {
      expect(status).equals(200);
      expect(body.shows).length.greaterThan(0);
    });
  });
  it('should succeed giving tvshows trends with whatever showType', () => {
    cy.request({
      method: 'POST',
      url: '/api/trends/abcdef',
      failOnStatusCode: true,
    }).then(({ status, body }) => {
      expect(status).equals(200);
      expect(body.shows).length.greaterThan(0);
      expect(body.shows[0].media_type).equals('tv');
    });
  });
  it('should succeed giving tvshows trends with showType = tvshows', () => {
    cy.request({
      method: 'POST',
      url: '/api/trends/tvshows',
      failOnStatusCode: true,
    }).then(({ status, body }) => {
      expect(status).equals(200);
      expect(body.shows).length.greaterThan(0);
      expect(body.shows[0].media_type).equals('tv');
    });
  });
});

describe('Test the /api/trends/[showType] route with showType = pinned shows', () => {
  before(() => {
    Cypress.session.clearAllSavedSessions();
    cy.task('db:teardown');
    cy.task('db:init');
  });
  beforeEach(() => {
    // Sign in the user, so we can get his pinned shows
    cy.signInByAPI(Cypress.env('TEST_MAIL'));
  });
  it('should fail if asking for pinned shows without giving a userId', () => {
    cy.request({
      method: 'POST',
      url: '/api/trends/p-shows',
      // body is not set, so there is no userId to extract
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).equals(400);
      expect(body.error?.message).equals('User not provided');
    });
  });

  it('should succeed giving user s pinned shows when asked for (with user that has no pinned shows)', () => {
    var userId;

    // Call the endpoint to get the logged in user information
    cy.request({
      method: 'GET',
      url: '/api/user/me',
      failOnStatusCode: true,
    })
      .then(({ status, body }) => {
        expect(status).equals(200);
        expect(body.user).not.to.be.undefined;
        expect(body.user.email).equals(Cypress.env('TEST_MAIL'));
        expect(body.user.id).not.to.be.undefined;

        // Get the userId
        userId = body.user.id;
      })
      .then(() => {
        // Call the endpoint to get the logged in user pinned shows
        cy.request({
          method: 'POST',
          url: '/api/trends/p-shows',
          body: JSON.stringify({ userId: userId }),
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).equals(200);
          expect(res.body.shows).lengthOf(0);
          expect(res.body.error).not.to.exist;
          expect(res.body.error?.message).not.to.exist;
        });
      });
  });

  it('should succeed giving user s pinned shows when asked for (with user that has 2 pinned shows)', () => {
    var user = {};
    var shows = [];

    // Call the endpoint to get the logged in user information
    cy.request({
      method: 'GET',
      url: '/api/user/me',
      failOnStatusCode: true,
    })
      .then(({ status, body }) => {
        cy.log('body', { body });
        expect(status).equals(200);
        expect(body.user).not.to.be.undefined;
        expect(body.user.email).equals(Cypress.env('TEST_MAIL'));
        expect(body.user.id).not.to.be.undefined;

        // Get the userId
        user = body.user;
      })
      .then(() => {
        // Add some shows to the user s profile

        // First, add the marvels (movie)
        cy.fixture('api/show-themarvels-test_mail.fix')
          .then((payload) => {
            payload.user.email = user.email;
            payload.user.id = user.id;
            payload.user.name = user.name;
          })
          .as('body');

        cy.get('@body').then((body) => {
          cy.request({
            method: 'POST',
            url: '/api/show',
            body: body,
            failOnStatusCode: true,
          }).then(({ status, body }) => {
            expect(status).equals(200);
            expect(body.show).not.to.be.undefined;
            expect(body.user).not.to.be.undefined;

            shows.push(body.show);
          });
        });

        // Second, add invincible (tvshow)
        cy.fixture('api/show-invincible-test_mail.fix')
          .then((payload) => {
            payload.user.email = user.email;
            payload.user.id = user.id;
            payload.user.name = user.name;
          })
          .as('body');

        cy.get('@body').then((body) => {
          cy.request({
            method: 'POST',
            url: '/api/show',
            body: body,
            failOnStatusCode: true,
          }).then(({ status, body }) => {
            expect(status).equals(200);
            expect(body.show).not.to.be.undefined;
            expect(body.user).not.to.be.undefined;

            shows.push(body.show);
          });
        });

        // Call the endpoint to get the logged in user pinned shows
        cy.request({
          method: 'POST',
          url: '/api/trends/p-shows',
          body: JSON.stringify({ userId: user.id }),
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).equals(200);
          expect(res.body.shows).lengthOf(2);
          expect(res.body.error).not.to.exist;
          expect(res.body.error?.message).not.to.exist;
        });
      });
  });
});
