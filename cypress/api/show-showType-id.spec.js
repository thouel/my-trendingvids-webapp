describe('Test the /api/show/[showType]/[id] route', () => {
  beforeEach(() => {
    cy.task('db:teardown');
    cy.task('db:init');
  });

  it('GET should fail if the requested movie does not exist', () => {
    const url = '/api/show/movies/a';
    cy.request({
      method: 'GET',
      url: url,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).equals(400);
      expect(res.body.show).to.be.undefined;
      expect(res.body.error).to.exist;
      expect(res.body.error.message).to.exist;
      expect(res.body.error.message).equals(
        'The resource you requested could not be found.',
      );
    });
  });

  it('GET should fail if the requested tvshow does not exist', () => {
    const url = '/api/show/tvshows/a';
    cy.request({
      method: 'GET',
      url: url,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).equals(400);
      expect(res.body.show).to.be.undefined;
      expect(res.body.error).to.exist;
      expect(res.body.error.message).to.exist;
      expect(res.body.error.message).equals(
        'The resource you requested could not be found.',
      );
    });
  });

  it('GET should succeed with the movie', () => {
    const url = '/api/show/movies/862968';
    cy.request({
      method: 'GET',
      url: url,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).equals(200);
      expect(res.body.show).not.to.be.undefined;
      expect(res.body.error).not.to.exist;
      expect(res.body.show).to.include.keys(
        'backdrop_path',
        'homepage',
        'id',
        'overview',
        'title',
        'external_ids',
      );
    });
  });
  it('GET should succeed with the tvshow', () => {
    const url = '/api/show/tvshows/233629';
    cy.request({
      method: 'GET',
      url: url,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).equals(200);
      expect(res.body.show).not.to.be.undefined;
      expect(res.body.error).not.to.exist;
      expect(res.body.show).to.include.keys(
        'backdrop_path',
        'homepage',
        'id',
        'overview',
        'name',
        'external_ids',
      );
    });
  });

  it('DELETE should fail with unknown show and unknown user', () => {
    const url = `/api/show/tvshows/123`;
    cy.request({
      method: 'DELETE',
      url: url,
      body: JSON.stringify({ userId: '754e5e5cdbb2d41ebe1c92e5' }),
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).equals(400);
      expect(res.body.show).to.be.undefined;
      expect(res.body.user).to.be.undefined;
      expect(res.body.error).to.exist;
      expect(res.body.error.message).to.exist;
    });
  });

  it('DELETE should fail with unknown show and known user', () => {
    const url = `/api/show/tvshows/123`;
    cy.request({
      method: 'DELETE',
      url: url,
      body: JSON.stringify({ userId: '654e6534dbb2d41ebe1c9309' }),
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).equals(400);
      expect(res.body.show).to.be.undefined;
      expect(res.body.user).to.be.undefined;
      expect(res.body.error).to.exist;
      expect(res.body.error.message).to.exist;
    });
  });
  it('DELETE should fail with known show and unknown user', () => {
    // Connect a show to the test user
    cy.fixture('api/show-withShow-withKnownUser.fix').as('body');
    cy.get('@body').then((body) => {
      cy.request({
        method: 'POST',
        url: '/api/show',
        body: body,
        failOnStatusCode: false,
      }).then((res) => {
        const url = `/api/show/tvshows/${res.body.show.externalId}`;

        // Test
        cy.request({
          method: 'DELETE',
          url: url,
          body: JSON.stringify({ userId: '754e5e5cdbb2d41ebe1c92e5' }),
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).equals(400);
          expect(res.body.show).not.to.be.undefined;
          expect(res.body.user).to.be.undefined;
          expect(res.body.error).to.exist;
          expect(res.body.error.message).to.exist;
        });
      });
    });
  });

  it('DELETE should succeed with known show and known user', () => {
    // Connect a show to the test user
    cy.fixture('api/show-withShow-withKnownUser.fix').as('body');
    cy.get('@body').then((body) => {
      cy.request({
        method: 'POST',
        url: '/api/show',
        body: body,
        failOnStatusCode: false,
      }).then((res) => {
        const url = `/api/show/tvshows/${res.body.show.externalId}`;

        // Test
        cy.request({
          method: 'DELETE',
          url: url,
          body: JSON.stringify({ userId: res.body.user.id }),
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).equals(200);
          expect(res.body.show).not.to.be.undefined;
          expect(res.body.user).not.to.be.undefined;
          expect(res.body.error).not.to.exist;
          expect(res.body.show).to.include.keys(
            'backdropPath',
            'homepage',
            'id',
            'externalId',
            'overview',
            'name',
            'mediaType',
            'imdbId',
            'userIDs',
          );
          expect(res.body.show.userIDs).to.be.empty;
          expect(res.body.user).to.include.keys(
            'id',
            'name',
            'email',
            'pinnedShowsIDs',
          );
          expect(res.body.user.pinnedShowsIDs).to.be.empty;
        });
      });
    });
  });
});
