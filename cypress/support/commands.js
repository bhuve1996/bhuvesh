// Custom commands for accessibility testing

// Command to test keyboard navigation
Cypress.Commands.add('testKeyboardNavigation', selector => {
  cy.get(selector).focus();
  cy.focused().should('be.visible');
  cy.focused().should('have.focus');
});

// Command to test ARIA attributes
Cypress.Commands.add('testAriaAttributes', selector => {
  cy.get(selector).should('be.visible');
  cy.get(selector)
    .should('have.attr', 'aria-label')
    .or('have.attr', 'aria-labelledby')
    .or('have.attr', 'aria-describedby');
});

// Command to test focus management
Cypress.Commands.add('testFocusManagement', selector => {
  cy.get(selector).focus();
  cy.focused().should('have.focus');
  cy.focused().should('be.visible');
});

// Command to test screen reader compatibility
Cypress.Commands.add('testScreenReader', selector => {
  cy.get(selector).should('be.visible');
  cy.get(selector)
    .should('have.attr', 'role')
    .or('have.attr', 'aria-label')
    .or('have.attr', 'aria-labelledby');
});

// Command to test color contrast (placeholder - would need actual implementation)
Cypress.Commands.add('testColorContrast', selector => {
  cy.get(selector).should('be.visible');
  // This would need a custom implementation or plugin for actual contrast testing
});

// Command to test responsive design
Cypress.Commands.add('testResponsiveDesign', (selector, viewport) => {
  cy.viewport(viewport.width, viewport.height);
  cy.get(selector).should('be.visible');
});

// Command to test loading states
Cypress.Commands.add('testLoadingStates', selector => {
  cy.get(selector).should('be.visible');
  cy.get(selector).should('not.have.attr', 'aria-busy', 'true');
});

// Command to test error states
Cypress.Commands.add('testErrorStates', selector => {
  cy.get(selector).should('be.visible');
  cy.get(selector)
    .should('have.attr', 'aria-invalid', 'true')
    .or('have.attr', 'aria-describedby');
});
