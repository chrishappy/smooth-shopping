# Developer Notes

A file containing the reason behind some of the design decisions.

## Use JSON API

Because Drupal's GraphQL module is either 1) insecure or 2) requires too much work to set up initially

### Use the unmaintained plugin `https://github.com/rsullivan00/apollo-link-json-api`. 

Installed using:

```bash
$ npm install apollo-link-json-api apollo-link @apollo/client graphql graphql-anywhere qs humps camelcase apollo-link-rest --save
```

**Note**: We must use `fieldNameNormalizer: camelCase,` when creating a JsonApi (or RestApi) link, because GraphQL does not suppose snack_case field names.

## Limit per client

To limit the number of items a client can buy a month (e.g. max 2 bags of rice per client), we will:
 1. Fetch the content of previous orders and calculate how many of each product they had already checked out

Previous solution:
 1. Create a field on the user entity
    - ~Store the product id and quantity bought this month~ (Wait, can this information be collected from past orders?)

 2. Fetch this data in the backend