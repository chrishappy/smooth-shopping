import { 
  ApolloClient, 
  createHttpLink, 
  InMemoryCache, 
  makeVar,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';



export const cartItemsVar = makeVar([]);

// TODO: Replace later?
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
  const token = localStorage.getItem(LOCAL_STORAGE_JWT_TOKEN);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// The final Apollo client
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
});