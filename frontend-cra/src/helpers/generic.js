/**
 * Check whether an object has the specified property and it is not null nor undefined
 * 
 * @param {object} obj the object we want to examine
 * @param {string} prop the property we want to check for
 * @returns bool
 */
export const hasExistentProperty = (obj, prop) => {
  return obj.hasOwnProperty(prop) && (obj[prop] !== undefined) && (obj[prop] !== null);
}

/**
 * encodeURIComponent the string unless it's null or falsely
 * 
 * @param {string} str the string we want to encode and check if null
 * @returns string | null
 */
export const encodeURIComponentOrNull = (str) => {
  return encodeURIComponent(str || '') || null
}