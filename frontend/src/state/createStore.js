// import storage from 'redux-persist/lib/storage';
const { createStore } = require('redux');
const { persistStore, persistReducer } = require('redux-persist');
// const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const storage = require('./storage').default;
// const storage = require('redux-persist/lib/storage').default;

const initialState = {
  cartItems: {}
};

function reducer(state = initialState, action) {
	const tempState = {...state};

  switch (action.type) {
		case 'addProduct':
			const product = action.product;

			// if (!tempState.hasOwnProperty('cartItems')) {
			// 	tempState.cartItems = {};
			// }

			if (!tempState.cartItems.hasOwnProperty(product.id)) {
				tempState.cartItems[product.id] = {
					quantity: 0
				};
			}

			tempState.cartItems[product.id]['quantity']++;
			break;

		default:
			break;
	}

	return tempState;

}


// if (typeof localStorage !== 'undefined' && localStorage.getItem(LOCALSTORAGE_SESSION_KEY) !== null) {
// 	store = JSON.parse(localStorage.getItem(LOCALSTORAGE_SESSION_KEY));
// }
// else {
// 	store = createStore(
// 		reducer,
// 		initialState, // initial state
// 	);
// }

// if (typeof window !== 'undefined') {
// 	window.addEventListener('onbeforeunload', () => {
// 		localStorage.setItem(LOCALSTORAGE_SESSION_KEY, JSON.stringify(store));
// 	});
// }

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