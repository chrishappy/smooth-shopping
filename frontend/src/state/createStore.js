const { createStore } = require('redux');
const { persistStore, persistReducer } = require('redux-persist');
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const initialState = {
  cartItems: {}
};

function reducer(state = initialState, action) {
  switch (action.type) {
		case 'addProduct':
			const product = action.product;

			if (!state.hasOwnProperty('cartItems')) {
				state = {cartItems: {}, ...state};
			}

			if (!state.cartItems.hasOwnProperty(product.id)) {
				state.cartItems[product.id] = {
					quantity: 0
				};
			}

			state.cartItems[product.id]['quantity']++;

			break;

		default:
			break;
	}

	return state
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(
	persistedReducer,
	initialState, // initial state
);
const persistor = persistStore(store);

const getStore = () => {
  return { store, persistor };
}

export default getStore;