/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"

import Header from "./header"
import Footer from "./footer"
import "./layout.css"
import "./custom.css"
import { Outlet } from "react-router"
import { loggedInVar } from "../helpers/cache"

const Layout = () => {

  return (
    <div className="page">
      {loggedInVar() ?
      <>
        <Header
          siteTitle={`Title`}
          />
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
      </div>
    }
    </div>
  )
}

export default Layout;