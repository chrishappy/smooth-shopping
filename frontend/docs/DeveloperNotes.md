# Developer Notes

A file containing the reason behind some of the design decisions.

## Use JSON API

Because Drupal's GraphQL module is either:
 1. v3: insecure (allow arbitary queries)
 2. v4: requires too much work to set up initially and does not support existing permissions per entity (out of the box)

Thus, we're switching to Drupal's JSON API module. Although it spits out more information than GraphQL, it's a feature fully supported by Drupal and has Drupal's entity permissions supported by default.

### Use the (not actively maintained) plugin `https://github.com/rsullivan00/apollo-link-json-api`. 

Although it's not actively maintained, I think we could switch to Apollo's REST API pretty easily.

Installed using:

```bash
$ npm install apollo-link-json-api apollo-link-rest apollo-link @apollo/client graphql graphql-anywhere qs humps camelcase apollo-link-rest --save
```

**Note**: We must use `fieldNameNormalizer: camelCase,` when creating a JsonApi (or RestApi) link, because GraphQL does not support snack_case field names.

## Limit per client

To limit the number of items a client can buy a month (e.g. max 2 bags of rice per client), we will:
 1. Fetch the content of previous orders and calculate how many of each product they had already checked out

Use `date-fns` to calculate the first day of this month.

**Previous solution:**
 1. Create a field on the user entity
    - ~Store the product id and quantity bought this month~ (Wait, can this information be collected from past orders?)

 2. Fetch this data in the backend

## Abandon Gatsby

We could not figure out how to use Redux effectively with Gatsby to build an efficient cart. Thus, we moved from a static site generator to a React app.
