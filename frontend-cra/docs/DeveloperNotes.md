# Developer Notes

A file containing the reason behind some of the design decisions.

## Use JSON API

### Use actively maintained (but unstable) plugin `apollo-link-rest`

Installed using:

```
npm install --save @apollo/client apollo-link-rest graphql graphql-anywhere qs
```

### Use the unmaintained plugin `https://github.com/rsullivan00/apollo-link-json-api`. 

*Update*: Remove `apollo-link-json-api` because no longer supported

Installed using:

```bash
$ npm uninstall apollo-link-json-api apollo-link graphql graphql-anywhere qs humps --save
```

## Limit per client

To limit the number of items a client can buy a month (e.g. max 2 bags of rice per client), we will:
 1. Fetch the content of previous orders and calculate how many of each product they had already checked out

Previous solution:
 1. Create a field on the user entity
    - ~Store the product id and quantity bought this month~ (Wait, can this information be collected from past orders?)

 2. Fetch this data in the backend