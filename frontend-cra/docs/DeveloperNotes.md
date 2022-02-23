# Developer Notes

A file containing the reason behind some of the design decisions.

## Limit per client

To limit the number of items a client can buy a month (e.g. max 2 bags of rice per client), we will:
 1. Fetch the content of previous orders and calculate how many of each product they had already checked out

Previous solution:
 1. Create a field on the user entity
    - ~Store the product id and quantity bought this month~ (Wait, can this information be collected from past orders?)

 2. Fetch this data in the backend