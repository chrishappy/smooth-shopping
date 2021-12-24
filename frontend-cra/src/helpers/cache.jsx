import { 
  ApolloClient, 
  ApolloLink,
  createHttpLink, 
  InMemoryCache, 
  makeVar,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getJwtString, logout } from './login';



export const cartItemsVar = makeVar([]);

// TODO: Replace later?
// Remove `export` later?
export const loggedInVar = makeVar(false);

// The constant for the local storage variable storing the JWT value
export const LOCAL_STORAGE_JWT_TOKEN = 'JW_TOKEN_VALUE';

if (localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN)) {
  loggedInVar(true);
}

// TODO: Replace later?
export const currentUserVar = makeVar({
		totalCredits: 120.0,
		creditsRemaining: 120.0,
		familyName: 'Sample Family Name',
		numberOfFamilyMembers: 3,
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        cartItems: {
          read() {
            return cartItemsVar();
          }
        },
        currentUser: {
          loggedIn: {
            read() {
              return loggedInVar();
            }
          }
        }
      }
    }
  }
});

// Set up authenication
const httpLink = createHttpLink({
  uri: 'https://ss.albernirentals.com/graphql',
});


// Set up authenication
// https://www.apollographql.com/docs/react/networking/advanced-http-networking/#customizing-request-logic
const authMiddleware = new ApolloLink((operation, forward) => {
  // get the authentication token from local storage if it exists
  const token = getJwtString();

  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }));

  return forward(operation);
})

// Logout if we get a 401
// https://www.apollographql.com/docs/react/networking/advanced-http-networking/#customizing-response-logic
const logoutLink = onError((err) => {
  if (err.hasOwnProperty('networkError')) {
    const statusCode = err.networkError.statusCode;
    if (statusCode === 401 || statusCode === 403) {
      logout();
    }
  }
  else if (err.hasOwnProperty('graphQLErrors')) {
    // TODO: Show an alert popup
    console.error(err);
  }
})

// The final Apollo client
export const apolloClient = new ApolloClient({
  link: from([
    authMiddleware,
    logoutLink,
    httpLink,
  ]),
  cache: cache,
});