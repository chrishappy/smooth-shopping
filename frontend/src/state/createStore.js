// import storage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { createStore } = require('redux');
const { persistStore, persistReducer } = require('redux-persist');
// const AsyncStorage = require('@react-native-async-storage/async-storage').default;


// Store the state in local storage
// const LOCALSTORAGE_SESSION_KEY = "custom_store_ss"
// if (localStorage.getItem(LOCALSTORAGE_SESSION_KEY) !== null) {
// 	tempState = JSON.parse(localStorage.getItem(LOCALSTORAGE_SESSION_KEY));
// }


const initialState = {
  cartItems: {}
};


function reducer(state = initialState, action) {
	let tempState = {...state};

  switch (action.type) {
		case 'ADD_PRODUCT':
			const product = action.product;

			if (!tempState.hasOwnProperty('cartItems')) {
				tempState.cartItems = {};
			}

			if (!tempState.cartItems.hasOwnProperty(product.id)) {
				tempState.cartItems[product.id] = {
					quantity: 0
				};
			}

			tempState.cartItems[product.id]['quantity']++;
			break;

		case 'GET_TOTAL_CREDITS':
			break;

		case '':
			break;

		default:
			break;
	}

	

	return tempState;

}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // storage: storage,
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