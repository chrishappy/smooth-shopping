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
import Category from './pages/Category';
import RequireAuth from './components/RequireAuth';
import HomePage from './pages/Home';
import './App.css';
import { restoreCartItems, storeCartItems, usePastOrderQuantitiesUpdater } from './helpers/cartHelper';
import SearchProducts from './pages/SearchPage';
import PastOrders from './pages/PastOrders';
import LogoutPage from './pages/Logout';
import { isLoggedIn } from './helpers/loginHelper';
import AmeliaBookAppointment from './ameliaBooking/AmeliaBookAppointment';

const App = () => {
  const [client, setClient] = React.useState();

  const updatePastQuantities = usePastOrderQuantitiesUpdater(apolloClient);

  React.useEffect(() => {
    async function init() {
      // Restore the cartItems if not present
      restoreCartItems();

      // Restore persistor 
      await apolloCachePersistor.restore();

      // Set the client to manage the queries
      setClient(apolloClient);

      // Run the product quantities from past orders to 
      // enforce limits per user/month
      if (isLoggedIn() ) {
        updatePastQuantities();
      }

      window.addEventListener('beforeunload', storeCartItems);

    }

    init().catch(console.error);

    // Store cart items before unloading
    return () => {
      window.removeEventListener('beforeunload', storeCartItems);
    };

  }, [updatePastQuantities]);

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
              <Route /* index */ path="home" element={<HomePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="categories">
                {/* Uses state to identify the category: must be accessed only from Homepage */}
                <Route path=":categorySlug" element={<Category />} />
              </Route>
              <Route path="search" element={<SearchProducts />} />
              <Route path="history" element={<PastOrders />} />
              <Route
                // path="book-appointment" 
                index // TODO: Replace with homepage again
                element={<AmeliaBookAppointment />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
