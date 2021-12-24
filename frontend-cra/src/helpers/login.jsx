import { LOCAL_STORAGE_JWT_TOKEN, loggedInVar } from "./cache";

/**
 * 
 * @param {string} jwt the JSON Web Token passed to the Apollo client for loggingin 
 */

export const loginAsync = async (username, password) => {
  const jwt = await authenicationAsync(username, password);
  if (jwt.hasOwnProperty('token')) {
    localStorage.setItem(LOCAL_STORAGE_JWT_TOKEN, jwt.token);
    loggedInVar(true);

    console.log('User successfully logged in');
  }
  else {
    console.warn('Unable to authenicate user');
    console.log(jwt);
  }
};

/// Get the JWT value the server 
const authenicationAsync = async (username, password) => {
  const usernameConcatPassword = `${username}:${password}`;

  const loginStrBase64 = Buffer.from(usernameConcatPassword, 'binary');
  const loginStr = loginStrBase64.toString('base64');

  console.log(loginStr);

  return fetch('https://ss.albernirentals.com/jwt/token?_format=json', {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${loginStr}`
    },
  }).then(response => response.json());
}


export const logout = () => {
  localStorage.removeItem(LOCAL_STORAGE_JWT_TOKEN);
  loggedInVar(false); 
};

export const isLoggedIn = () => loggedInVar();