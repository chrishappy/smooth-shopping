import { 
  ApolloClient, 
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { JsonApiLink } from 'apollo-link-json-api';
import { RestLink } from 'apollo-link-rest';
import { camelize, pascalize } from 'humps';

import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';
import { onError } from '@apollo/client/link/error';
import { getJwtString, logoutCurrentUser } from './login';
import { clearCart } from './cartItems';



// ---------------------------------------------------------------------------
// Currently not used
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        products: { // see: https://www.apollographql.com/docs/react/pagination/core-api/#improving-the-merge-function
          read(existing, {
            args: {
              // Default to returning the entire cached list,
              // if offset and limit are not provided.
              offset = 0,
              limit = existing ? existing.length: 0,
            } = {},
          }) {
            return existing && existing.slice(offset, offset + limit);
          },
          keyArgs: [],
          merge(existing, incoming, { args: { offset = 0 }}) {
            // Slicing is necessary because the existing data is
            // immutable, and frozen in development.
            const merged = existing ? existing.slice(0) : [];
            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }
            return merged;
          },
        }
      }
    }
  //   Query: {
  //     fields: {
  //       cartItems: {
  //         read() {
  //           return cartItemsVar();
  //         }
  //       },
  //     }
  //   },
    // NodeProduct: {
    //   fields: {
    //     localQuantity: {
    //       read(data, options) {
    //         console.log({ data, options });
            
    //       }
    //     }
    //   }
    // }
  }
});

// Set up http links
const httpLink = createHttpLink({});

const restLink = new RestLink({
  uri: process.env.REACT_APP_REST_URL_WITH_END_SLASH,
  fieldNameNormalizer: camelize,
  headers: {
    'Content-Type': 'application/json',
  },
});

const jsonApiLink = new JsonApiLink({
  uri: process.env.REACT_APP_JSON_URL_WITH_END_SLASH,
  fieldNameNormalizer: camelize,
  typeNameNormalizer: pascalize,
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
      Accept: 'application/json',
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
export const apolloCachePersistor = new CachePersistor({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

/**
 * Clear the ApolloClient and Cart cache
 * @returns undefined|null
 */
export const clearApolloCache = () => {
  if (!apolloCachePersistor) {
    return;
  }
  apolloCachePersistor.purge();

  // Clear the cart cache too
  clearCart();
};

// The final Apollo client
export const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    authMiddleware,
    logoutLink,
    restLink,
    jsonApiLink,
    httpLink,
  ]),
  cache,
  // typeDefs
});