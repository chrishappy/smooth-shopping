# Authenication

## Setting Up Authenication between React and a Drupal website

We're using Drupal's JWT module for authenication.

Links:
 - Module page: https://www.drupal.org/project/jwt
 - How to use: https://www.drupal.org/project/jwt/issues/3249407

## Workflow

I'm thinking of implentation the following workflow to login a user.

 1. Store user's username and password in a local state on the Login page (make sure it's wipe out later?)
 2. On submit, send an HTTP GET request using `fetch` to Drupal with the username and password as plain text (make sure it's https?)
 3. Store the returned JWT value in `localStorage`.
 4. Include this value in every apollo request (https://www.apollographql.com/docs/react/networking/advanced-http-networking/#customizing-request-logic)

## Other notes

### Logout User if Drupal server returns 401/403 error

Done! For more details, see https://www.apollographql.com/docs/react/networking/advanced-http-networking/#customizing-response-logic

### We're only allowing one role

We're only going to allow authenicated users execute arbitrary GraphQL commands. This prevents us from having more than one role, but I think that'll okay for this functional prototype.

(We don't need to allow anonymous users to execute arbitary GraphQL queries, since we're authenicating the user separate from Apollo)

### Migrate to GraphQL v4?

Right now, we're using GraphQL v3 because it requires less work to set up. However, it means that authenticated users may not be able view more information than they're supposed to.
