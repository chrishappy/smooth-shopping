import { 
  ApolloClient, 
  createHttpLink, 
  InMemoryCache, 
  makeVar,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';



export const cartItemsVar = makeVar([]);

// TODO: Replace later?
export const loggedInVar = makeVar(true);

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

export const LOCAL_STORAGE_JWT_TOKEN = 'JW_TOKEN_VALUE';

// Set up authenication
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// The final Apollo client
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
});