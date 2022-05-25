/**
 * @file
 * Store the login logic
 * Avoids the use of a `loggedIn = makeVar(false)`
 */

import { clearApolloCache } from "./cache";
import { debuggingIsOn, encodeURIComponentOrNull } from "./genericHelper";

// The constant for the local storage variable storing the JWT value
const LOCAL_STORAGE_JWT_TOKEN = 'JWT_AUTHENICATION';

// The constant for the local storage variable storing the JWT value
const LOCAL_STORAGE_CURRENT_USER_UUID = 'CURRENT_USER_UUID';

// A object of all the tokens
const LOCAL_STORAGE_USER_KEYS = {
  LOCAL_STORAGE_JWT_TOKEN,
  LOCAL_STORAGE_CURRENT_USER_UUID
};

// Get JWT key
export const getJwtString = () => encodeURIComponentOrNull(localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN));

// Get User Uuid 
export const getUserUuid = () => encodeURIComponentOrNull(localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_UUID));

// Helper function for convenience. Return whether the user is currently logged in
export const isLoggedIn = () => !!getJwtString() || !!getUserUuid();

/**
 * Use this function when the user is logging in the first time
 * 
 * @param {string} jwt the JSON Web Token passed to the Apollo client for loggingin 
 */

export const loginAsync = async (username, password) => {
  const jwt = await authenicationAsync(username, password);

  if (debuggingIsOn()) {
    console.log(`Authenication returns: ${JSON.stringify(jwt, null, 2)}`);
  }

  if (jwt.hasOwnProperty('token')) {
    localStorage.setItem(LOCAL_STORAGE_JWT_TOKEN, jwt.token);
    if (debuggingIsOn()) {
      console.log('User successfully logged in');
    }

    // Check if the User's uuid exists. If not, create it.
    await checkUserUuidAsync();

    return true;
  }
  
  if (debuggingIsOn()) {
    console.warn('Unable to authenicate user');
  }
  
  return false;
};

/**
 * Updates the UserUuid if not already set
 * @returns boolean
 */
export const checkUserUuidAsync = async () => {
  if (getUserUuid() === null) {
    // Get User ID
    const userUuid = await fetchUserUuid();
    if (userUuid) {
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_UUID, userUuid);
    }
    else {
      return false;
    }
  }

  return true;
}

/**
 * Get the JWT key with a fetch call
 * 
 * @param {*} username 
 * @param {*} password 
 * @returns Promise<any> The JWT key
 */

const authenicationAsync = async (username, password) => {
  const usernameConcatPassword = `${username}:${password}`;

  const loginStrBase64 = Buffer.from(usernameConcatPassword, 'binary');
  const loginStr = loginStrBase64.toString('base64');

  // ENSURE this is https:// for security
  return fetch(`${process.env.REACT_APP_ROOT_DOMAIN}/jwt/token?_format=json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${loginStr}`
    },
  }).then(response => response.json());
}

/**
 * Fetch the current user's uuid. Requires the JWT string.
 */
const fetchUserUuid = async () => {
  return fetch(`${process.env.REACT_APP_JSON_URL_WITH_END_SLASH}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getJwtString()}`
    },
  })
  .then(response => response.json())
  .then(data => data.meta.links.me.meta.id);
}

/**
 * Log out user
 */
export const logoutCurrentUser = () => {
  // Clear all local storage keys
  Object.keys(LOCAL_STORAGE_USER_KEYS).forEach((key) => {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEYS[key]);
  });

  clearApolloCache();
};
