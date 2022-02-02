/**
 * Check whether an object has the specified property and it is not null nor undefined
 * 
 * @param {object} obj the object we want to examine
 * @param {string} prop the property we want to check for
 */
export const hasExistentProperty = (obj, prop) => {
  return obj.hasOwnProperty(prop) && (obj[prop] !== undefined) && (obj[prop] !== null);
}