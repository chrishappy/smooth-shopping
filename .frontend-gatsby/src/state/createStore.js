// import storage from 'redux-persist/lib/storage';
const { createStore } = require('redux');
const { persistStore, persistReducer } = require('redux-persist');
// const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const storage = require('./storage').default;
// const storage = require('redux-persist/lib/storage').default;

const initialState = {
  cartItems: {
		numberOfProducts: 0,
	},
	user: {
		totalCredits: 120.0,
		creditsRemaining: 120.0,
		familyName: 'Sample Family Name',
		numberOfFamilyMembers: 3,
	},
	loggedIn: false,
};

function reducer(state, action) {

	const product = action.product;

  switch (action.type) {

		case 'LOGIN':
		// Return a copy; note that ...someState should always PRECEDE the values you want to change
			return {
				...state,
				loggedIn: true,
			}

		case 'LOGOUT':
			return {
				...state,
				loggedIn: false,
			}

		case 'removeProduct':
			if (state.cartItems.hasOwnProperty(product.id)) {
				const newCartItems = { ...state.cartItems };
				delete newCartItems[product.id];

				return {
					...state,
					cartItems: {
						...newCartItems,
						numberOfProducts: state.cartItems.numberOfProducts - state.cartItems[product.id].quantity,
					}
				}
			}
			break;

		// action.product must have id and field_credit
		case 'incrementProduct':
		case 'decrementProduct':
			let quantityChange = action.hasOwnProperty('quantity') ? action.quantity : 1;

			if (quantityChange === Number.POSITIVE_INFINITY) {
				if (state.cartItems.hasOwnProperty(product.id)) {
					quantityChange = state.cartItems[product.id].quantity;
				}
				else {
					quantityChange = 0;
				}
			}

			if (action.type === 'decrementProduct') {
				quantityChange *= -1;
			}

			const newQuantity = state.cartItems.hasOwnProperty(product.id) 
				? state.cartItems[product.id].quantity + quantityChange
				: quantityChange;

			const newCreditRemaining = product.hasOwnProperty('field_credit') && product.field_credit !== null
        ? state.user.creditsRemaining + (parseFloat(product.field_credit) * -quantityChange)
        : state.user.creditsRemaining;

			if (newQuantity > 0) {
				return {
					...state,
					cartItems: {
						...state.cartItems,
						numberOfProducts: state.cartItems.numberOfProducts + quantityChange,
						[product.id]: {
							quantity: newQuantity
						}
					},
					user: {
						...state.user,
						creditsRemaining: newCreditRemaining,
					}
				}
			}
			else if (state.cartItems.hasOwnProperty(product.id)) {
				const newCartItems = { ...state.cartItems };
				delete newCartItems[product.id];

				return {
					...state,
					cartItems: {
						...newCartItems,
						numberOfProducts: state.cartItems.numberOfProducts + quantityChange,
					},
					user: {
						...state.user,
						creditsRemaining: newCreditRemaining,
					}
				}
			}
			break;

		default:
			break;
	}
	
	return state;
}

const persistConfig = {
  key: 'root',
  // storage: AsyncStorage,
  storage: storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);

const getStore = () => {
  const store = createStore(
    persistedReducer,
		initialState
  );
  const persistor = persistStore(store);
  return { store, persistor };
};

export default getStore;