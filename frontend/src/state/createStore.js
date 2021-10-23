import storage from 'redux-persist/lib/storage';
const { createStore } = require('redux');
const { persistStore, persistReducer } = require('redux-persist');
// const AsyncStorage = require('@react-native-async-storage/async-storage').default;


const initialState = {
  cartItems: {}
};

function reducer(state = initialState, action) {
  switch (action.type) {
		case 'addProduct':
			const product = action.product;
			const tempState = {...state};

			if (!tempState.hasOwnProperty('cartItems')) {
				tempState.cartItems = {};
			}

			if (!tempState.cartItems.hasOwnProperty(product.id)) {
				tempState.cartItems[product.id] = {
					quantity: 0
				};
			}

			tempState.cartItems[product.id]['quantity']++;
			return tempState;

		default:
			return state;
	}
	
}

const persistConfig = {
  key: 'root',
  // storage: AsyncStorage,
  storage: storage,
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