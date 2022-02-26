
import { makeVar, useQuery, useReactiveVar } from "@apollo/client";
import { apolloCachePersistor } from "./cache";
import { addToOrCreateMapEntry } from "./generic";
import { GET_PAST_ORDER_QUANTITIES } from "./queries";

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
export const previousOrderQuantities = makeVar(new Map());

/**
 * Update the previousOrderQuantities
 * 
 * @returns object same features of useQuery
 */
export const usePreviousOrderQuantities = () => {
  const {loading, error, data} = useQuery(GET_PAST_ORDER_QUANTITIES);

  if (loading) {  return;  }

  if (error) {  console.error(error);  }

  // Loop over and set the values of previous orders
  let pastOrderQuantities = new Map();
  data.orders.forEach((order) => {
    order.fieldOrderItems.forEach((curr) => {
      addToOrCreateMapEntry(
        pastOrderQuantities,
        curr.fieldProduct.meta.nid,
        parseFloat(curr.fieldQuantity));
    });
  })

  // Update previous quantities
  previousOrderQuantities(pastOrderQuantities);
}

export const useMaxAndMinQuantitiesForProduct = (product) => {
  usePreviousOrderQuantities();

  // Get previous quantities from the stores
  const cartProductQuantity = parseFloat(useReactiveVar(cartItemsVar).get(product.nid)) || 0.0;
  const pastOrderQuantities = parseFloat(useReactiveVar(previousOrderQuantities).get(product.nid)) || 0.0;

  // Calculate the max quantity a user can buy
  const maxQuantityWithoutLimit = parseFloat(product.fieldQuantity || 0.0) - cartProductQuantity;
  const maxQuantityWithLimit = parseFloat(product.fieldLimitPerClient || Infinity) - pastOrderQuantities - cartProductQuantity;
  const maxQuantity = Math.min(maxQuantityWithoutLimit, maxQuantityWithLimit);

  // Calculate the min quantity a user can buy
  const minQuantity = Math.min(maxQuantity, 1.0); // In case no more elements (e.g. maxQuantity is zero)

  return {
    maxQuantity, 
    minQuantity
  };
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

  // If the quantity exceeds the max quantity, add the remaining
  if (currItems.get(product.nid) + addQuantity > product.fieldQuantity) {
    console.warn(`Quantity Exceeded for ${product.title}`);

    addQuantity = product.fieldQuantity - currItems.get(product.nid); 
  }

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
  const cartTotal = window.localStorage.getItem(LOCAL_STORAGE_CART_TOTAL);
  if (cartItems !== null && cartTotal !== null) {
    const array = JSON.parse(cartItems);
    cartItemsVar(new Map(array));
    cartTotalVar(JSON.parse(cartTotal));
  }
}

/**
 * Store the cache
 */
export const storeCartItems = () => {
  const cartItems = JSON.stringify(Array.from(cartItemsVar()));
  window.localStorage.setItem(LOCAL_STORAGE_CART_ITEMS_VAR, cartItems);

  const cartTotal = JSON.stringify(cartTotalVar());
  window.localStorage.setItem(LOCAL_STORAGE_CART_TOTAL, cartTotal);
}

/**
 * Clear the cart
 */
export const clearCart = () => {
  cartItemsVar(new Map());
  cartTotalVar(0.0);

  // Clear the Apollo cache
  apolloCachePersistor.purge();

  // Clear local storage
  storeCartItems();
}