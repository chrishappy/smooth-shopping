exports.createPages = async ({ graphql, actions }) => {
  // const { createPage } = actions
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
           name
         }
       }
     }
    }
  `
  ).then(result => {
    result.data.allNodeArticle.edges.forEach(({ categories }) => {
      createPage({
        path: `categories/{categories.id}`,
        component: path.resolve(`./src/templates/product-category-page.js`),
        context: {
          id: node.id,
        },
      })
    })
  })
}
