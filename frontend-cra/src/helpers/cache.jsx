import { 
  ApolloClient, 
  ApolloLink,
  createHttpLink, 
  InMemoryCache, 
  makeVar,
  from,
  gql
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getJwtString, logoutCurrentUser } from './login';


// ---------------------------------------------------------------------------
// Cart Items reactive variable and operations
export const cartItemsVar = makeVar([]);

const NewOrderItem = (product, quantity) => {
  return { 
    productId: product.entityId,
    quantity: quantity,
    field_credit: product.fieldCredit,
    field_expired: product.fieldExpired,
    title: product.entityLabel
  };
}

export const AddOrderItem = (product, addQuantity) => {
  console.log(product);
  let currItems = cartItemsVar();

  let found = currItems.findIndex(prod => prod.productId === product.entityId);
  if (found >= 0) {
    currItems[found].quantity += addQuantity;
  }
  else {
    currItems.push(NewOrderItem(product, addQuantity));
  }

  cartItemsVar(currItems);
  console.log(cartItemsVar());
  return currItems;
}
// ---------------------------------------------------------------------------

const typeDefs = gql`
  extend type Query {
    cartItems: [OrderItem!]!
  }
  extend type OrderItem {
    productId: Int!
    quantity: Float!
    field_credit: Float!
    field_expired: Boolean!
    title: String!
  }
`;

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        cartItems: {
          read() {
            return cartItemsVar();
          }
        },
        // currentUser: {
        //   loggedIn: {
        //     read() {
        //       return isLoggedIn();
        //     }
        //   }
        // }
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

  if (!token) {
    console.error(`The JWT string is somehow null or empty. Value: ${JSON.stringify(token)}`)
  }

  // Add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
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

// The final Apollo client
export const apolloClient = new ApolloClient({
  link: from([
    authMiddleware,
    logoutLink,
    httpLink,
  ]),
  cache: cache,
  typeDefs
});