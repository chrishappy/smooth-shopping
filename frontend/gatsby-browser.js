/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/browser-apis/
 */

// Import the component at the top of the file
import * as React from "react"
import Layout from './src/components/layout';
import { PersistGate } from 'redux-persist/integration/react'
import getStore from "./src/state/createStore"
import { Provider } from 'react-redux'


export const wrapPageElement = ({ element, props }) => {
  const { store, persistor } = getStore();
  
  return (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Layout {...props}>{element}</Layout>
    </PersistGate>
  </Provider>
)};