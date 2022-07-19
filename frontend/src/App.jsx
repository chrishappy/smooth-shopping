import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from './pages/Login';
import CartPage from './pages/Cart';
import AccountPage from './pages/Account';
import NotFoundPage from './pages/404';
import Layout from './components/Layout';

import {
  ApolloProvider,
} from "@apollo/client"; // See: https://www.apollographql.com/docs/react/get-started/
import { apolloClient, apolloCachePersistor } from './helpers/cache';
import Category from './pages/categories/Category';
import RequireAuth from './components/RequireAuth';
import HomePage from './pages/Home';
import './App.css';
import { restoreCartItems, storeCartItems } from './helpers/cartHelper';
import SearchProducts from './pages/SearchPage';
import PastOrders from './pages/PastOrders';
import LogoutPage from './pages/Logout';

const App = () => {
  const [client, setClient] = React.useState();

  React.useEffect(() => {
    async function init() {
      // Restore the cartItems if not present
      restoreCartItems();

      // Set client + restore persistor
      await apolloCachePersistor.restore();
      setClient(apolloClient);

      // Store cart items before unloading
      window.addEventListener('beforeunload', () => {
        storeCartItems();
      });
    }

    init().catch(console.error);
  }, []);

  if (!client) {
    return (
        <p style={{textAlign: 'center'}}>Loading...</p>
    );
  }

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Routes>
          <Route path="/login" element={<Layout />}> {/* Wrapper element */}
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="/logout" element={<LogoutPage />}> {/* Wrapper element */}
          </Route>
          <Route path="/" element={<Layout />}> {/* Wrapper element */}
            <Route element={<RequireAuth />}>  {/* Authentication guard */}
              <Route index element={<HomePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="categories">
                <Route path=":categorySlug" element={<Category />} />
              </Route>
              <Route path="search" element={<SearchProducts />} />
              <Route path="history" element={<PastOrders />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
