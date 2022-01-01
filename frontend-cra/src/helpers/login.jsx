import { 
  apolloClient, 
  currentUserVar, 
  LOCAL_STORAGE_JWT_TOKEN, 
  loggedInVar,
} from "./cache";
import { GET_USER_STATS } from "./queries";

/**
 * 
 * @param {string} jwt the JSON Web Token passed to the Apollo client for loggingin 
 */

export const loginAsync = async (username, password) => {
  const jwt = await authenicationAsync(username, password);

  console.log(`Authenication returns: ${JSON.stringify(jwt, null, 2)}`);

  if (jwt.hasOwnProperty('token')) {
    localStorage.setItem(LOCAL_STORAGE_JWT_TOKEN, jwt.token);
    loggedInVar(true);

    // Run code to initalizer user
    // TODO: need to run this code if user already has JWT token
    await initializeUserAsync();

    console.log('User successfully logged in');
  }
  else {
    console.warn('Unable to authenicate user');
    console.log(jwt);
  }
};

/**
 * After logging in or coming back with a JWT, run this code
 */
const initializeUserAsync = async () => {
  const { data } = await apolloClient.query({
    query: GET_USER_STATS,
  });
  currentUserVar({
    ...currentUserVar,
    ...data.currentUserContext,
  });
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

  console.log(loginStr);

  return fetch('https://ss.albernirentals.com/jwt/token?_format=json', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${loginStr}`
    },
  }).then(response => response.json());
}

export const logout = () => {
  localStorage.removeItem(LOCAL_STORAGE_JWT_TOKEN);
  loggedInVar(false); 
};

export const isLoggedIn = () => loggedInVar();

export const getJwtString = () => localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN) || null;