describe('Test the /api/show/[showType]/[id] route', () => {
  before(() => {
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
});
