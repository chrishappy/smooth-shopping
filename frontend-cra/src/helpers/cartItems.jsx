
import { makeVar } from "@apollo/client";

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

  // Update quantity
  if (!currItems.has(product.id)) {
    currItems.set(product.id, 0.0);
  }

  // If the quantity exceeds the max quantity, add the remaining
  if (currItems.get(product.id) + addQuantity > product.fieldQuantity) {
    console.warn(`Quantity Exceeded for ${product.title}`);
    // TODO: show users a notice

    addQuantity = product.fieldQuantity - currItems.get(product.id); 
  }

  currItems.set(product.id, currItems.get(product.id) + addQuantity);
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

  // Update quantity
  if (!currItems.has(product.id)) {
    currItems.set(product.id, 0.0);
  }
  currItems.set(product.id, currItems.get(product.id) - minusQuantity);

  // Remove is necessary
  if (currItems.get(product.id) <= 0) {
    currItems.delete(product.id);
  }
  
  cartItemsVar(currItems);

  // Update cart total
  updateCartTotal(product.fieldCredit, -minusQuantity);

  return currItems;
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

  // Clear local storage
  storeCartItems();
}