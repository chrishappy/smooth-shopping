
import { makeVar, useLazyQuery, useReactiveVar } from "@apollo/client";
import { getUnixTime } from "date-fns";
import { startOfMonth } from "date-fns/esm";
import { zonedTimeToUtc } from "date-fns-tz"
import { apolloCachePersistor } from "./cache";
import { addToOrCreateMapEntry } from "./genericHelper";
import { GET_PAST_ORDER_QUANTITIES_OF_THIS_MONTH } from "./queries";

/**
 * Stores the product ids and quantities in a dictionary:
 *  {productID: quantity}
 */
const LOCAL_STORAGE_CART_ITEMS_VAR = 'LOCAL_STORAGE_CART_ITEMS_VAR';
export const cartItemsVar = makeVar(new Map());

// The amount of credits used in the cart
// Don't store remainingStoreCredits so that we don't have to initialize
// the value
const LOCAL_STORAGE_CART_TOTAL = 'LOCAL_STORAGE_CART_TOTAL';
export const cartTotalVar = makeVar(0.0);

// Store how many of each product a user has already purchased
const LOCAL_STORAGE_PREVIOUS_ORDER_QUANTITIES = 'LOCAL_STORAGE_PREVIOUS_ORDER_QUANTITIES';
export const previousOrderQuantitiesVar = makeVar(new Map());

/**
 * Update the previousOrderQuantities
 * 
 * @returns object same features of useQuery
 */
export const usePreviousOrderQuantitiesUpdater = async () => {
  // created dates are stored in UTC, thus need UTC
  // TODO: Ensure that the timezone is implemented correctly
  const firstDayOfCurrentMonthInUTC = zonedTimeToUtc(startOfMonth(new Date()), 'America/Vancouver');
  const firstDayOfCurrentMonthTimestamp = getUnixTime(firstDayOfCurrentMonthInUTC);

  const [getPastQuantities] = useLazyQuery(GET_PAST_ORDER_QUANTITIES_OF_THIS_MONTH, {
    variables: {
      firstDayOfCurrentMonthTimestamp
    }
  });

  return () => getPastQuantities()
    .then(({data}) => {
      // Loop over and set the values of previous orders within this month
      let pastOrderQuantities = new Map();
      data.pastQuantities.forEach((order) => {
        order.fieldOrderItems.forEach((curr) => {
          addToOrCreateMapEntry(
            pastOrderQuantities,
            curr.fieldProduct.meta.nid,
            parseFloat(curr.fieldQuantity));
        });
      });

      console.log(pastOrderQuantities);

      // Update previous quantities
      previousOrderQuantitiesVar(pastOrderQuantities);

      return true;
    })
    .catch(({error}) => {
      console.error(`Error getting past quantities: ${JSON.stringify(error)}`)

      return false;
    })
}

/**
 * 
 * @param {NodeProduct|object} product the node product with an nid, fieldQuanity, and fieldLimitPerClient
 * @returns {[float, float]} maxQuantity (the maximum a client can purchase), minQuantity (1 or 0)
 */
export const useMaxAndMinQuantitiesForProduct = (product) => {  
  return staticMaxAndMinQuantitiesForProduct({
    product,
    cartItems: useReactiveVar(cartItemsVar),
    previousOrderQuantities: useReactiveVar(previousOrderQuantitiesVar),
  });
}

/**
 * 
 * @param {object} options E.g. { product, cartItems = cartItemsVar, previousOrderQuantities = previousOrderQuantitiesVar }
}
 * @returns 
 */
export const staticMaxAndMinQuantitiesForProduct = ({
  product, 
  cartItems = cartItemsVar, 
  previousOrderQuantities = previousOrderQuantitiesVar
}) => {

  // Get previous quantities from the stores
  const cartProductQuantity = parseFloat(cartItems.get(product.nid)) || 0.0;
  const pastOrderQuantities = parseFloat(previousOrderQuantities.get(product.nid)) || 0.0;

  console.log(`Past orders : ${previousOrderQuantities.get(product.nid)}`);

  // Calculate the max quantity a user can buy
  const maxQuantityWithoutLimit = parseFloat(product.fieldQuantity || 0.0) - cartProductQuantity;
  const maxQuantityWithLimit = parseFloat(product.fieldLimitPerClient || Infinity) - pastOrderQuantities - cartProductQuantity;

  const maxQuantity = Math.min(maxQuantityWithoutLimit, maxQuantityWithLimit);

  // Calculate the min quantity a user can buy
  const minQuantity = Math.min(maxQuantity, 1.0); // In case no more elements (e.g. maxQuantity is zero)

  return [maxQuantity, minQuantity];
}

/**
 * Increase the quantity of a product in the cart
 * 
 * @param {float} product the product to add to the cart. Require the fields:
 *  - id
 *  - fieldCredit
 *  - fieldQuantity
 * @param {float|int} addQuantity the amount to add to product
 * @returns {object} the cart items
 */
export const AddOrderItem = (product, addQuantity) => {
  let currItems = cartItemsVar();

  // If the quantity exceeds the maximum, add the remaining
  // console.log([currItems.get(product.nid), addQuantity, maxQuantity])
  // if (currItems.get(product.nid) + addQuantity > maxQuantity) {
  //   console.warn(`Quantity Exceeded for ${product.title}`);

  //   addQuantity = maxQuantity - currItems.get(product.nid); 
  // }

  addToOrCreateMapEntry(currItems, product.nid, addQuantity);
  cartItemsVar(currItems);

  // Update cart total
  updateCartTotal(product.fieldCredit, addQuantity);

  return currItems;
}

/**
 * Reduce the quantity of a product in the cart
 * 
 * @param {float} product the product to minus from the cart. Require 
 *                        `id` and `fieldCredit` fields
 * @param {float|int} minusQuantity the amount to minus from product
 * @returns {object} the cart items
 */
export const MinusOrderItem = (product, minusQuantity) => {
  let currItems = cartItemsVar();

  addToOrCreateMapEntry(currItems, product.nid, -minusQuantity);

  // Remove is necessary
  if (currItems.get(product.nid) <= 0) {
    currItems.delete(product.nid);
  }
  
  cartItemsVar(currItems);

  // Update cart total
  updateCartTotal(product.fieldCredit, -minusQuantity);

  return currItems;
}

export const hasNoMoreQuantity = (product) => {
  return (product.fieldQuantity <= 0.0);
}

/**
 * Update the total amount in the cart
 * 
 * @param {float} price 
 * @param {float} quantity 
 */
const updateCartTotal = (price, quantity) => {
  cartTotalVar(cartTotalVar() + price * quantity);
};

/**
 * Restore the cache
 */
export const restoreCartItems = () => {
  const cartItems = window.localStorage.getItem(LOCAL_STORAGE_CART_ITEMS_VAR);
  const pastOrderQuantities = window.localStorage.getItem(LOCAL_STORAGE_PREVIOUS_ORDER_QUANTITIES);
  const cartTotal = window.localStorage.getItem(LOCAL_STORAGE_CART_TOTAL);

  if (cartItems !== null && cartTotal !== null && pastOrderQuantities !== null) {
    const cartItemsAsArray = JSON.parse(cartItems);
    cartItemsVar(new Map(cartItemsAsArray));
    
    const pastOrderQuantitiesAsArray = JSON.parse(pastOrderQuantities);
    cartItemsVar(new Map(pastOrderQuantitiesAsArray));

    cartTotalVar(JSON.parse(cartTotal));
  }
}

/**
 * Store the cache
 */
export const storeCartItems = () => {
  const cartItems = JSON.stringify(Array.from(cartItemsVar()));
  window.localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_VAR, cartItems);
  
  const pastOrderQuantities = JSON.stringify(Array.from(cartItemsVar()));
  window.localStorage.setItem(LOCAL_STORAGE_PREVIOUS_ORDER_QUANTITIES, pastOrderQuantities);

  const cartTotal = JSON.stringify(cartTotalVar());
  window.localStorage.setItem(LOCAL_STORAGE_CART_TOTAL, cartTotal);
}

/**
 * Clear the cart
 */
export const clearCart = () => {
  cartItemsVar(new Map());
  previousOrderQuantitiesVar(new Map());
  cartTotalVar(0.0);

  // Clear the Apollo cache
  apolloCachePersistor.purge();

  // Clear local storage
  storeCartItems();
}