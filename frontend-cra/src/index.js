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
import Test from './pages/test';
import Layout from './components/layout';

ReactDOM.render(
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" component={<App />} />
        <Route path="login" component={<LoginPage />} />
        <Route path="cart" component={<CartPage />} />
        <Route path="test" component={<Test />} />
      </Routes>
    </Layout>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
