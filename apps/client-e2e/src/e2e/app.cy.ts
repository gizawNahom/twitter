import {
  assertProfilePage,
  runCreatesPostTest,
  runSearchesPostTest,
} from '../support/app.po';

describe('twitter', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1280, 720);
  });

  it('creates post', () => {
    runCreatesPostTest();
  });

  it('searches post', () => {
    runSearchesPostTest();
  });

  it('gets profile', () => {
    navigateToProfilePage();
    assertProfilePage();

    function navigateToProfilePage() {
      cy.get('a').contains('Profile').click();
    }
  });
});
