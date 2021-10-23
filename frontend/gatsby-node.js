const path = require("path")

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  // createPage({
  //   path: "/using-dsg",
  //   component: require.resolve("./src/templates/using-dsg.js"),
  //   context: {},
  //   defer: true,
  // })
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
    result.data.allTaxonomyTermProductCategories.edges.forEach(({ node }) => {
      createPage({
        path: `${node.path.alias}`.substring(1), // Remove first character
        component: path.resolve(`./src/templates/product-category-page.js`),
        context: {
          tid: node.id,
        },
      })
    })
  })
}
