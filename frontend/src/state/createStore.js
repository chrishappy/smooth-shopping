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

  switch (action.type) {
		case 'addProduct':
			const product = action.product;
			const newQuantity = state.cartItems.hasOwnProperty(product.id) 
				? state.cartItems[product.id].quantity + 1
				: 1;
			
			
			return {
				...state,
				cartItems: {
					...state.cartItems,
					[product.id]: {
						quantity: newQuantity
					}
				}
			}

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

const getStore = () => {
  const store = createStore(
    persistedReducer
  );
  const persistor = persistStore(store);
  return { store, persistor };
};

export default getStore;