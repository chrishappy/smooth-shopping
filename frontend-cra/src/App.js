import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import LoginPage from './pages/login';
import CartPage from './pages/cart';
import AccountPage from './pages/account';
import NotFoundPage from './pages/404';
import Layout from './components/layout';

import {
  ApolloProvider,
} from "@apollo/client"; // See: https://www.apollographql.com/docs/react/get-started/
import { apolloClient, cachePersistor } from './helpers/cache';
import Category from './pages/categories/category';
import RequireAuth from './components/RequireAuth';
import HomePage from './pages/home';
import './App.css';

const App = () => {
  const [client, setClient] = React.useState();

  React.useEffect(() => {
    async function init() {
      await cachePersistor.restore();
      setClient(apolloClient);
    }

    init().catch(console.error);
  }, []);

  // const clearCache = useCallback(() => {
  //   if (!persistor) {
  //     return;
  //   }
  //   persistor.purge();
  // }, [persistor]);

  if (!client) {
    return <h2>Initializing app...</h2>;
  }

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Routes>
          <Route path="/login" element={<Layout />}> {/* Wrapper element */}
            <Route index element={<LoginPage />} />
          </Route>
          <Route path="/" element={<Layout />}> {/* Wrapper element */}
            <Route element={<RequireAuth />}>  {/* Authentication guard */}
              <Route index element={<HomePage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="account" element={<AccountPage />} />
              <Route path="categories">
                <Route path=":categorySlug" element={<Category />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Routes>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
