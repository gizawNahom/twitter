import {
  assertProfilePage,
  runCreatesPostTest,
  runSearchesPostTest,
} from '../support/app.po';

describe('twitter', () => {
  beforeEach(() => {
    cy.viewport('iphone-8');
    cy.visit('/');
  });

  it('creates post', () => {
    navigateToCreatePostPage();
    runCreatesPostTest();

    function navigateToCreatePostPage() {
      cy.get('a[href="/compose/tweet"]').click();
    }
  });

  it('searches post', () => {
    navigateToSearchPage();
    runSearchesPostTest();

    function navigateToSearchPage() {
      cy.get('a[href="/search"]').click();
    }
  });

  it('gets profile', () => {
    navigateToProfilePage();
    assertProfilePage();

    function navigateToProfilePage() {
      cy.get('a[href="/username"]').click();
    }
  });
});
