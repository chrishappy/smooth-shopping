/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { connect } from "react-redux"

import Header from "./header"
import Footer from "./footer"
import "./layout.css"
import "./custom.css"

let cart = {
  creditsRemaining: 100,
  totalCredits: 100
};

const Layout = ({ children, storeState }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    storeState.loggedIn ?
    <>
      <Header
        siteTitle={data.site.siteMetadata?.title || `Title`}
        cart={cart}
        />
      <div
        style={{
          margin: `0 auto`,
          padding: `0 1.0875rem 5rem`,
          maxWidth: 960,
          minHeight: `80vh`
        }}
      >
        <main>{children}</main>
      </div>
      <Footer/>
    </> :
    <>
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
      <main>{children}</main>
    </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default connect(state => ({
  storeState: state
}),  null)(Layout)
