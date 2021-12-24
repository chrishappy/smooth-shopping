import { 
  ApolloClient, 
  createHttpLink, 
  InMemoryCache, 
  makeVar,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { logout } from './login';



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
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = () => localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN);
  // return the headers to the context so httpLink can read them

  return {
    headers: {
      ...headers,
      'Authorization': token().length > 0 ? `Bearer ${token()}` : '',
    }
  }
});

// Logout if we get a 401
const logoutLink = onError(({ networkError }) => {
  console.log(networkError.statusCode);
  console.log(networkError);
  if (networkError.statusCode === 401
      || networkError.statusCode === 403) {
    logout();
  }
})

// The final Apollo client
export const apolloClient = new ApolloClient({
  link: from([
    authLink,
    logoutLink,
    httpLink,
  ]),
  cache: cache,
});