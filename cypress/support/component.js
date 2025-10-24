// Import commands.js using ES2015 syntax:
import './commands';

// Import cypress-axe for accessibility testing
import 'cypress-axe';

// Import React and mount from cypress/react
import { mount } from 'cypress/react';

// Make mount available globally
Cypress.Commands.add('mount', mount);

// Global configuration for component testing
beforeEach(() => {
  // Inject axe-core into the page
  cy.injectAxe();
});

// Custom command for component accessibility testing
Cypress.Commands.add('checkComponentA11y', options => {
  cy.checkA11y(null, options);
});
