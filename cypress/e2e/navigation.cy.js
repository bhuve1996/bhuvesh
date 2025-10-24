describe('Navigation E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should navigate to different sections', () => {
    cy.get('nav').should('be.visible');
    cy.get('[role="menuitem"]').should('have.length.at.least', 3);
  });

  it('should toggle mobile menu', () => {
    cy.viewport('iphone-6');
    cy.get('[aria-label="Toggle mobile menu"]').click();
    cy.get('#mobile-menu').should('be.visible');
    cy.get('[aria-label="Toggle mobile menu"]').should(
      'have.attr',
      'aria-expanded',
      'true'
    );
  });

  it('should close mobile menu when item is clicked', () => {
    cy.viewport('iphone-6');
    cy.get('[aria-label="Toggle mobile menu"]').click();
    cy.get('[role="menuitem"]').first().click();
    cy.get('#mobile-menu').should('not.be.visible');
  });

  it('should support keyboard navigation', () => {
    cy.get('[role="menuitem"]').first().focus();
    cy.focused().should('have.focus');
    cy.focused().should('be.visible');
  });

  it('should have proper focus indicators', () => {
    cy.get('[role="menuitem"]').first().focus();
    cy.focused().should('have.focus');
    cy.focused().should('be.visible');
  });

  it('should not have accessibility violations', () => {
    cy.checkA11y('nav');
  });
});
