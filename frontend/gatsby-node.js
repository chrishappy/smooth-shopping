const path = require("path");
// const getStore = require("./src/state/createStore");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // const { store } = getStore();

  // createPage({ // Remove first character
  //   component: path.resolve(`./src/templates/cart-page.js`),
  //   context: {
  //     pids: store.hasOwnProperty("cartItems") ? store.cartItems.keys() : [],
  //   },
  // })

  // Create Product Category pages
  return graphql(`
    {
      allTaxonomyTermProductCategories {
        edges {
          node {
            id
            path {
              alias
            }
          }
        }
     }
    }
  `
  ).then(result => {
    result.data.allTaxonomyTermProductCategories.edges.forEach(({ node: category }) => {
      createPage({
        path: `${category.path.alias}`.substring(1), // Remove first character
        component: path.resolve(`./src/templates/product-category-page.js`),
        context: {
          tid: category.id,
        },
      })
    })
  })
}
