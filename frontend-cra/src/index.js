import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {
  BrowserRouter,
  Routes,
  Route,
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
import RequireAuth from './components/RequireAuth';

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
