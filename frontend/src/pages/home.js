import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import CategoryGrid from "../components/category-grid"

const HomePage = () => (
  <Layout>
    <Seo title="Home" />
    <h1>Start Shopping</h1>
    <CategoryGrid/>
  </Layout>
)

export default HomePage