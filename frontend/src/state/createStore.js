// import storage from 'redux-persist/lib/storage';
const { createStore } = require('redux');
const { persistStore, persistReducer } = require('redux-persist');
// const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const storage = require('./storage').default;
// const storage = require('redux-persist/lib/storage').default;

const initialState = {
  cartItems: {}
};

function reducer(state, action) {

  switch (action.type) {
		case 'incrementProduct':
		case 'decrementProduct':

			const product = action.product;
			let incrementBy = action.hasOwnProperty('by') ? action.by : 1;

			if (action.type === 'decrementProduct') {
				incrementBy *= -1;
			}

			const newQuantity = state.cartItems.hasOwnProperty(product.id) 
				? state.cartItems[product.id].quantity + incrementBy
				: incrementBy;

			if (newQuantity > 0) {
				return {
					...state,
					cartItems: {
						...state.cartItems,
						[product.id]: {
							quantity: newQuantity
						}
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