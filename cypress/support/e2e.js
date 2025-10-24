// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Import cypress-axe for accessibility testing
import 'cypress-axe';

// Global configuration for accessibility testing
beforeEach(() => {
  // Inject axe-core into the page
  cy.injectAxe();
});

// Custom command for accessibility testing
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.checkA11y(context, options);
});

// Custom command for keyboard navigation testing
Cypress.Commands.add('testKeyboardNavigation', selector => {
  cy.get(selector).focus();
  cy.focused().should('be.visible');
  cy.focused().should('have.focus');
});

// Custom command for color contrast testing
Cypress.Commands.add('testColorContrast', selector => {
  cy.get(selector).should('be.visible');
  // This would need a custom implementation or plugin for actual contrast testing
});

// Custom command for screen reader testing
Cypress.Commands.add('testScreenReader', selector => {
  cy.get(selector)
    .should('have.attr', 'aria-label')
    .or('have.attr', 'aria-labelledby')
    .or('have.attr', 'aria-describedby');
});
