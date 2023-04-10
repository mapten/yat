/**
 * Creates an alias for the data-testid attributes
 */
Cypress.Commands.add('dataTestId', (value) => {
  return cy.get(`[data-testid=${value}]`);
});

