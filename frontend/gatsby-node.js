const path = require("path");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

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
