/**
 * Function to update an object with other object that contains the properties to be updated.
 * It does a shallow clone (it is not needed to do a deep clone, and it's better for performance reasons).
 * @param {T} oldObject The object to be updated with the new properties
 * @param {Partial<T>} updatedProperties The properties to update in the old object. It is a partial
 * class, to indicate that it contains some properties from the old object
 */
export function updateObject<T>(oldObject: T, updatedProperties: Partial<T>): T {
  return {
    ...oldObject,
    ...updatedProperties,
  } as T;
}