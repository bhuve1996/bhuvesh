describe('Accessibility E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should not have accessibility violations on homepage', () => {
    cy.checkA11y();
  });

  it('should not have accessibility violations on navigation', () => {
    cy.get('nav').should('be.visible');
    cy.checkA11y('nav');
  });

  it('should not have accessibility violations on buttons', () => {
    cy.get('button').each($button => {
      cy.wrap($button).should('be.visible');
    });
    cy.checkA11y('button');
  });

  it('should support keyboard navigation', () => {
    cy.get('body').tab();
    cy.focused().should('be.visible');

    cy.focused().tab();
    cy.focused().should('be.visible');
  });

  it('should have proper focus management', () => {
    cy.get('button').first().focus();
    cy.focused().should('have.focus');
    cy.focused().should('be.visible');
  });

  it('should have proper ARIA attributes', () => {
    cy.get('nav').should('have.attr', 'role', 'navigation');
    cy.get('nav').should('have.attr', 'aria-label');
  });

  it('should support screen readers', () => {
    cy.get('img').should('have.attr', 'alt');
    cy.get('button')
      .should('have.attr', 'aria-label')
      .or('have.attr', 'aria-labelledby')
      .or('have.attr', 'aria-describedby');
  });
});
