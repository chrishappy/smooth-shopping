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

/**
 * Add a value to a map entry. If it does not exist, create it.
 * @param {Map} map the map to operate on
 * @param {string|int} key the key of the entry to operate on
 * @param {float|int} valueToAdd the value to add to the entry
 */
export const addToOrCreateMapEntry = (map, key, valueToAdd) => {
  let previousValue = map.get(key) || 0.0;
  map.set(key, previousValue + valueToAdd);
}

/**
 * If debug is on
 */
export const debuggingIsOn = () => {
  return process.env.NODE_ENV === 'development';
}

/**
 * Format floats (e.g. if XX.00 => XX)
 */
export const formatFloat = (number) => {
  const float = parseFloat(number);
  // Source: https://stackoverflow.com/a/661569
  // Author: kkyy <https://stackoverflow.com/users/64503/kkyy>
  const roundedNumber = Math.round(float*100)/100;
  // End source

  const theString = roundedNumber + '';
  return theString.replace(/\.00$/, '');
}