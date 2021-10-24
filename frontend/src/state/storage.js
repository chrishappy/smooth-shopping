// const createWebStorage = require("redux-persist/lib/storage/createWebStorage").default;
// const createWebStorage = ;

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

// const storage =
//   typeof window === "undefined" ? createNoopStorage() : require('redux-persist/lib/storage').default;

const storage =
  typeof window === "undefined" ? createNoopStorage() : require("redux-persist/lib/storage/createWebStorage").default('local');

export default storage;