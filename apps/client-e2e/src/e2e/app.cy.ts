describe('twitter', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1280, 720);
  });

  it('creates post', () => {
    cy.get('input[placeholder*="What\'s happening?"]').type('hello');
    cy.get('button').contains(/post/i).click();

    cy.contains('Post Created.');
  });

  it('searches post', () => {
    cy.get('input[placeholder="Search"]').type('hello{enter}');

    cy.contains('Hello');
  });

  it('gets profile', () => {
    cy.get('a').contains('Profile').click();

    cy.contains('Posts');
    cy.contains('Hello World');
    cy.contains('@username');
  });
});
