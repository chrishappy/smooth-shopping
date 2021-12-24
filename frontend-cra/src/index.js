import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import reportWebVitals from './reportWebVitals';

import App from './App';
import LoginPage from './pages/login';
import CartPage from './pages/cart';
import AccountPage from './pages/account';
import NotFoundPage from './pages/404';
import Layout from './components/layout';

import {
  ApolloProvider,
} from "@apollo/client"; // See: https://www.apollographql.com/docs/react/get-started/
import { apolloClient } from './helpers/cache';
import Category from './pages/categories/category';
import { isLoggedIn } from './helpers/login';

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={apolloClient}>
      <Routes>
        <Route path="/login" element={<Layout />}> {/* Wrapper element */}
          <Route index element={<LoginPage />} />
        </Route>
        <Route path="/" element={<Layout />}> {/* Wrapper element */}
          <Route element={<RequireAuth />}>  {/* Authentication guard */}
            <Route index element={<App />} />
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
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function RequireAuth(){
  let location = useLocation();

  if (!isLoggedIn()) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}