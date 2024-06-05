export function runCreatesPostTest() {
  typeIntoCreatePostField();
  clickPostButton();

  assertPostCreation();

  function typeIntoCreatePostField() {
    cy.get('input[placeholder*="What\'s happening?"]').type('hello');
  }

  function clickPostButton() {
    cy.get('button').contains(/post/i).click();
  }

  function assertPostCreation() {
    cy.contains('Post Created.');
  }
}

export function runSearchesPostTest() {
  typeIntoSearchField();

  assertSearchPage();

  function typeIntoSearchField() {
    cy.get('input[placeholder="Search"]').type('hello{enter}');
  }

  function assertSearchPage() {
    cy.contains('Hello');
  }
}

export function assertProfilePage() {
  cy.contains('Posts');
  cy.contains('Hello World');
  cy.contains('@username');
}
