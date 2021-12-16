### Fetch for `page/cart.js`

```js
const query = `
query page_cart($productIds:[String!], $limit:Int!, $offset:Int!) {
  nodeQuery(limit: $limit, offset: $offset, filter: {
    conditions: [
      {operator: EQUAL, field: "type", value: ["product"]},
      {operator: IN, field: "nid", value: $productIds},
    ]}
  ) {
    entities {
      ... on Node {
        nid
        title
      }
      ... on NodeProduct {
        fieldCredit
        fieldExpired
        fieldImage {
          entity {
            ... on File {
              url
            }
          }
        }
      }
    }
  }
}
`

const variables = `
{
  "productIds": [
    "3",
    "5",
    "8"
  ],
  "offset": 0,
  "limit": 50
}
`;

fetch(
  `https://ss.albernirentals.com/graphql?query=${encodeURIComponent(query)}&variables=${encodeURIComponent(variables)}`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer %ACCESS_TOKEN%`,
      "content-type": "application/json",
    },
  },)
  .then(response => response.json())
  .then(data => console.log(data))
```

### For `page/home.js`

```js
const query = `
query page_home {
  taxonomyTermQuery {
    count
    entities {
      ... on TaxonomyTerm {
        tid
        name
        path {
          alias
        }
        uuid
      }
      ... on TaxonomyTermProductCategories {
        fieldImage {
          entity {
            ... on File {
              url
            }
          }
        }
      }
    }
  }
}
`

const variables = `
{}
`;

fetch(
  `https://ss.albernirentals.com/graphql?query=${encodeURIComponent(query)}&variables=${encodeURIComponent(variables)}`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer %ACCESS_TOKEN%`,
      "content-type": "application/json",
    },
  },)
  .then(response => response.json())
  .then(data => console.log(data))
  ```

### For login

```js
const query = `
query Login($username:String!, $password:String!) {
  JwtToken(username: $username, password: $password) {
    jwt
  }
}
`
const variables = JSON.stringify({
  username: 'Dummy for GraphQL Query',
  password: '',
});

fetch(
  `https://ss.albernirentals.com/graphql?query=${encodeURIComponent(query)}&variables=${encodeURIComponent(variables)}`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer %ACCESS_TOKEN%`,
      "content-type": "application/json",
    },
  },)
  .then(response => response.json())
  .then(data => console.log(data))
```