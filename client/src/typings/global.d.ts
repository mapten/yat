declare global {
  interface Window {
    Cypress?: Cypress.Cypress;
  }
}

declare module "react/jsx-runtime" {
  export default any;
}