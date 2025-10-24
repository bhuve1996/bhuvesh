// Import commands.js using ES2015 syntax:
import './commands';

// Import cypress-axe for accessibility testing
import 'cypress-axe';

// Global configuration for component testing
beforeEach(() => {
  // Inject axe-core into the page
  cy.injectAxe();
});

// Custom command for component accessibility testing
Cypress.Commands.add('checkComponentA11y', options => {
  cy.checkA11y(null, options);
});
