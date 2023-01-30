/**
 * Service that returns the {@link window} system object.
 * 
 * This is basically done to easily mock the {@link window} object during the unit tests.
 */
export const windowReferenceService = (): Window => {
  return window;
};