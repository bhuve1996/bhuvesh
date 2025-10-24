/// <reference types="cypress" />
/// <reference types="cypress/react" />

declare namespace Cypress {
  interface Chainable {
    mount: typeof import('cypress/react').mount;
  }
}
