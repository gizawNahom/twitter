describe('twitter', () => {
  beforeEach(() => {
    cy.viewport('iphone-8');
    cy.visit('/');
  });

  it('creates post', () => {
    cy.get('a[href="/compose/tweet"]').click();
    cy.get('input[placeholder*="What\'s happening?"]').type('hello');
    cy.get('button').contains(/post/i).click();

    cy.contains('Post Created.');
  });

  it('searches post', () => {
    cy.visit('/search?q=hello');
    cy.get('input[placeholder*="Search"]').type('hello{enter}');

    cy.contains('Hello');
  });

  it('gets profile', () => {
    cy.get('a[href="/username"]').click();

    cy.contains('Posts');
    cy.contains('Hello World');
    cy.contains('@username');
  });
});
