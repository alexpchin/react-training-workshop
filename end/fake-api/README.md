# fake API

This API runs some form of issue reporting website and you've been hired to build the React frontend for it.

(Note that this entirely in memory for the sake of the workshop - restarting the server looses any changes you've made to your database).

There are two models in this (dreadfully implemented) API:

- users, which have the following fields: `name`, `email` and `id`
- issues, which have the following fields: `title`, `content`, `userId` and `id`

Each user has a unique `id`, as do the `issues`. 

The API provides the following endpoints, which all return JSON and expect to be given JSON where needed.

- `GET /users` gets a list of all users
- `GET /users/:id` gets an individual user by ID
- `POST /users` creates a new user
- `GET /issues` gets a list of all issues
- `GET /issues/:id` gets an individual issue by ID
- `POST /issues` creates a new issue

There's no validation on the server, this is left as an exercise to the frontend to implement.
