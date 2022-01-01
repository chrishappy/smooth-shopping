/**
 * @file
 * Store the login logic
 * Avoids the use of a `loggedIn = makeVar(false)`
 */

// The constant for the local storage variable storing the JWT value
const LOCAL_STORAGE_JWT_TOKEN = 'JWT_aUTHENICATION';

// Get JWT key
export const getJwtString = () => localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN) || null;

// Helper function for convience. Return whether the user is currently logged in
export const isLoggedIn = () => !!getJwtString();

/**
 * Use this function when the user is logging in the first time
 * 
 * @param {string} jwt the JSON Web Token passed to the Apollo client for loggingin 
 */

export const loginAsync = async (username, password) => {
  const jwt = await authenicationAsync(username, password);

  // console.log(`Authenication returns: ${JSON.stringify(jwt, null, 2)}`);

  if (jwt.hasOwnProperty('token')) {
    localStorage.setItem(LOCAL_STORAGE_JWT_TOKEN, jwt.token);
    console.log('User successfully logged in');
  }
  else {
    console.warn('Unable to authenicate user');
    console.log(jwt);
  }
};

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

  return fetch('https://ss.albernirentals.com/jwt/token?_format=json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${loginStr}`
    },
  }).then(response => response.json());
}

/**
 * Log out user
 */
export const logoutCurrentUser = () => {
  localStorage.removeItem(LOCAL_STORAGE_JWT_TOKEN);
};
