import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

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
					quantity: 1
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
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(
	persistedReducer,
	initialState, // initial state
);
const persistor = persistStore(store);

const storeWrapper = () => {
  return { store, persistor };
}

export default storeWrapper;