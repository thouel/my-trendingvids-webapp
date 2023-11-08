const url = '/api/show';

describe('Test the /api/show route', () => {
  before(() => {
    cy.task('db:teardown');
    cy.task('db:init');
  });
  beforeEach(() => {
    cy.intercept('/api/**/*', { middleware: true }, (req) => {
      req.on('before:response', (res) => {
        // force all API responses to not be cached
        res.headers['cache-control'] = 'no-store';
        delete req.headers['if-none-match'];
      });
    });
  });

  it('should fail if there is no show and no user', () => {
    cy.fixture('api/show-emptyShow-emptyUser.fix').as('body');
    cy.get('@body').then((body) => {
      cy.request({
        method: 'POST',
        url: url,
        body: body,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).equals(400);
        expect(res.body.show).to.be.undefined;
        expect(res.body.user).to.be.undefined;
        expect(res.body.error).to.exist;
        expect(res.body.error.message).to.exist;
      });
    });
  });

  it('should fail if there is no show and a user', () => {
    cy.fixture('api/show-emptyShow-withUnknownUser.fix').as('body');
    cy.get('@body').then((body) => {
      cy.request({
        method: 'POST',
        url: url,
        body: body,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).equals(400);
        expect(res.body.show).to.be.undefined;
        expect(res.body.user).to.be.undefined;
        expect(res.body.error).to.exist;
        expect(res.body.error.message).to.exist;
      });
    });
  });

  it('should fail if there is a show and an unknown user', () => {
    cy.fixture('api/show-withShow-withUnknownUser.fix').as('body');
    cy.get('@body').then((body) => {
      cy.request({
        method: 'POST',
        url: url,
        body: body,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).equals(400);
        expect(res.body.show).to.be.undefined;
        expect(res.body.user).to.be.undefined;
        expect(res.body.error).to.exist;
        expect(res.body.error.message).to.exist;
      });
    });
  });
  it('should succeed if there is a tvshow and a known user', () => {
    cy.fixture('api/show-withShow-withKnownUser.fix').as('body');
    cy.get('@body').then((body) => {
      cy.request({
        method: 'POST',
        url: url,
        body: body,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).equals(200);
        expect(res.body.show).not.to.be.undefined;
        expect(res.body.show.name).equals('Attack on Titan - the TEST');
        expect(res.body.user).not.to.be.undefined;
        expect(res.body.user.pinnedShowsIDs).to.have.length(1);
        expect(res.body.user.pinnedShowsIDs).include(res.body.show.id);
        expect(res.body.error).to.not.exist;
        expect(res.body.error?.message).to.not.exist;
      });
      cy.fixture('api/show-withShow2-withKnownUser.fix').as('body2');
      cy.get('@body2').then((body) => {
        cy.request({
          method: 'POST',
          url: url,
          body: body,
          failOnStatusCode: false,
        }).then((res) => {
          expect(res.status).equals(200);
          expect(res.body.show).not.to.be.undefined;
          expect(res.body.show.name).equals('Attack on Titan - the TEST2');
          expect(res.body.user).not.to.be.undefined;
          expect(res.body.user.pinnedShowsIDs).to.have.length(2);
          expect(res.body.user.pinnedShowsIDs).include(res.body.show.id);
          expect(res.body.error).to.not.exist;
          expect(res.body.error?.message).to.not.exist;
        });
      });
    });
  });

  it('should succeed if there is a movie and a known user', () => {
    cy.fixture('api/show-withMovie-withKnownUser.fix').as('body');
    cy.get('@body').then((body) => {
      cy.request({
        method: 'POST',
        url: url,
        body: body,
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).equals(200);
        expect(res.body.show).not.to.be.undefined;
        expect(res.body.show.name).equals('Pain Hustlers');
        expect(res.body.user).not.to.be.undefined;
        expect(res.body.user.pinnedShowsIDs).include(res.body.show.id);
        expect(res.body.error).to.not.exist;
        expect(res.body.error?.message).to.not.exist;
      });
    });
  });
});
