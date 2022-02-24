import { 
  ApolloClient, 
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import camelCase from 'camelcase';

import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';
import { onError } from '@apollo/client/link/error';
import { getJwtString, logoutCurrentUser } from './login';
import { cartItemsVar, clearCart } from './cartItems';
import { JsonApiLink } from "apollo-link-json-api";



// ---------------------------------------------------------------------------
// Currently not used
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        cartItems: {
          read() {
            return cartItemsVar();
          }
        },
      }
    },
    // NodeProduct: {
    //   fields: {
    //     localQuantity: {
    //       read(data, data2) {
    //         console.log({ data, data2 });
    //         return 1; //cartItemsVar();
    //       }
    //     }
    //   }
    // }
  }
});

// Set up authenication
const httpLink = createHttpLink({
});
const jsonApiLink = new JsonApiLink({
  uri: `${process.env.REACT_APP_JSON_URL_WITH_END_SLASH}`,
  fieldNameNormalizer: camelCase,
});


// Set up authenication
// https://www.apollographql.com/docs/react/networking/advanced-http-networking/#customizing-request-logic
const authMiddleware = new ApolloLink((operation, forward) => {
  // get the authentication token from local storage if it exists
  const token = getJwtString();

  if (!token) {
    console.error(`The JWT string is somehow null or empty. Value: ${JSON.stringify(token)}`)
  }

  // Add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Accept: "application/json",
      Authorization: token ? `Bearer ${token}` : null,
    }
  }));

  return forward(operation);
})

// Logout if we get a 401 or 403
// https://www.apollographql.com/docs/react/networking/advanced-http-networking/#customizing-response-logic
const logoutLink = onError((err) => {
  if (err.hasOwnProperty('networkError')) {
    const statusCode = err.networkError.statusCode;
    if (statusCode === 401 || statusCode === 403) {
      logoutCurrentUser();
    }
  }
  else if (err.hasOwnProperty('graphQLErrors')) {
    // TODO: Show an alert popup
    console.error(err);
  }
})

// await before instantiating ApolloClient, else queries might run before the cache is persisted
export const cachePersistor = new CachePersistor({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

/**
 * Clear the ApolloClient and Cart cache
 * @returns undefined|null
 */
export const clearApolloCache = () => {
  if (!cachePersistor) {
    return;
  }
  cachePersistor.purge();

  // Clear the cart cache too
  clearCart();
};

// The final Apollo client
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    authMiddleware,
    logoutLink,
    jsonApiLink,
    httpLink,
  ]),
  cache,
  // typeDefs
});