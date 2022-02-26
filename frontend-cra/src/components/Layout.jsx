import * as React from "react"
import { Outlet } from "react-router"
import { isLoggedIn } from "../helpers/loginHelper"

import CustomizedSnackbar from "./Snackbar"
import Header from "./Header"
import Footer from "./Footer"
import "./Layout.css"
import "./custom.css"

const Layout = () => {

  return (
    <div className="page">
      {isLoggedIn() ?
      <>
        <Header />
        <div
          style={{
            margin: `0 auto`,
            padding: `1.5rem 1.0875rem 5rem`,
            maxWidth: 960,
            minHeight: `80vh`
          }}
        >
          <main>
            <Outlet />
          </main>
        </div>
        <Footer/>
      </>
     :
      <div
        style={{
          margin: `0 auto`,
          padding: `5rem 1.0875rem 1rem`,
          maxWidth: 960,
          minHeight: `100vh`,
          color: 'white',
          backgroundImage: 'linear-gradient(rgba(0, 147, 181, 0.79), #003B81)'
        }}
      >
        <main>
          <Outlet />
        </main>
      </div>}
      <CustomizedSnackbar/>
    </div>
  )
}

export default Layout;