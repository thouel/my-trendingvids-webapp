describe('Test the /api/genres/[showType] route', () => {
  it('should load movie-related genres', () => {
    cy.request({
      method: 'GET',
      url: '/api/genres/movies',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.genres).to.exist;
      expect(res.body.genres[0]).to.have.property('name');
      expect(res.body.genres[0]).to.have.property('id');
      expect(res.error).not.to.exist;
    });
  });
  it('should load tvshows-related genres', () => {
    cy.request({
      method: 'GET',
      url: '/api/genres/tvshows',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.genres).to.exist;
      expect(res.body.genres[0]).to.have.property('name');
      expect(res.body.genres[0]).to.have.property('id');
      expect(res.error).not.to.exist;
    });
  });
  it('should load tvshows-related genres even if i pass him anything as showType', () => {
    var tvshowsLength = 0;
    cy.request({
      method: 'GET',
      url: '/api/genres/tvshows',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.genres).to.exist;
      expect(res.body.genres[0]).to.have.property('name');
      expect(res.body.genres[0]).to.have.property('id');
      expect(res.error).not.to.exist;
      tvshowsLength = res.body.genres.length;
    });

    cy.request({
      method: 'GET',
      url: '/api/genres/anythingAsShowType',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.genres).to.exist;
      expect(res.body.genres[0]).to.have.property('name');
      expect(res.body.genres[0]).to.have.property('id');
      expect(res.error).not.to.exist;
      expect(res.body.genres.length).equals(tvshowsLength);
    });
  });
  it('should load movies-related genres when given p-movies', () => {
    cy.request({
      method: 'GET',
      url: '/api/genres/p-movies',
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.genres).to.exist;
      expect(res.body.genres[0]).to.have.property('name');
      expect(res.body.genres[0]).to.have.property('id');
      expect(res.error).not.to.exist;
    });
  });
  it('should fail if TMDB is not here', () => {
    const url = '/api/genres/movies';

    cy.intercept('GET', url, (req) => {
      req.on('response', (res) => {
        res.send(400, { error: { code: 'ERR', message: 'Fetch failed' } });
      });
    })
      .as('call')
      .then(() => {
        fetch(url, { method: 'GET' })
          .then((res) => res.json())
          .then((body) => {
            // Expect on body content
            expect(body.error).to.exist;
            expect(body.error.code).to.exist;
            expect(body.error.message).to.exist;
          });
      });

    cy.wait('@call')
      .its('response')
      .then((res) => {
        // Expects on response
        expect(res).to.have.property('statusCode').equals(400);
      });
  });
});
