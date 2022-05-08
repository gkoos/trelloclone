# Trello Clone
A simple Trello clone with lists and cards.

## Backend
The backend is an Express app, using Mongo for data persistence. The `list` documents include the cards, this obviously makes moviong cards between lists a bit more complicated, but that wasn't in the core requirements anyway :)

Originally I intended to apply an API-first approach, ie. define the API in a swagger/openapi file first and generate boilerplate code from it, but the selection of tools that can be used for that is surprisingly limited and low key so I chose to go the other way around: from annotations in the controller code we generate the API definition with `swagger-jsdoc`. We utilise this definition then to generate a human readable documentation of the API with `swagger-ui-express` and validate requests and responses with `express-openapi-validator`. This way we don't have to keep the code and the API documentation in sync.

Rather than using mongo id's, I added an `id` field both to the lists and the cards - this is not neccessary but in my experience in tools like Trello (or Jira for example) these can help generate somewhat more human-readable url's to lists or cards (eg. you work on ticket 1823 rather than ticket 6276932f662b8d8662ecfa5f). This `id` is not unique accross lists, so when moving a card between lists, we need to create a new one.

### Endpoints
#### GET /swagger.json
Returns the generated swaggerfile in json format for clients to utilize

#### GET /swagger
Displays the generated API documentation

#### GET /lists
Returns all lists (only the core data, without cards)

#### POST /lists
Creates a new list

#### PUT /lists/{listId}
Updates a card

#### DELETE /lists/{listId}
Deletes a card

#### GET /lists/{listId}/cards
Returns the cards belonging to the given list

#### POST /lists/{listId}/cards
Adds a new card to the list

#### UPDATE /lists/{listId}/cards/{cardId}
Updates a card

#### DELETE /lists/{listId}/cards/{cardId}
Deletes a card

For the exact syntax of the endpoints please consult the generated documentation at `/swagger`

### Prerequisites
- docker v20 - for earlier versions you might need to run `docker-compose` to spin up the mongo container instead of the yarn script provided
- node v17+ - should work with earlier versions too as long as es6 modules are supported (from v13 or so)
- yarn

### Start development server
`cd backend`

`yarn` - install dependencies

`yarn mongo:start` - start MongoDB in the docker container

`yarn start:dev` - start server in development mode with nodemon or simply `yarn start` Then the API can be accessed at `http://localhost:3001`

### Run tests
`yarn test`

### Todo
- Refactor swagger annotations to eliminate redundancies
- Define error responses in the swagger annotations
- Shut down the application gracefully (close mongo connection etc.) to avoid jest warnings
- Use deleteMany instead of remove with Mongoose

## Frontend
Unfortunately there was no time left to do anything meaningful for the frontend in these couple of hours. The idea is setting up a project with `create-react-app` and then use a package like `react-openapi-client`. Then in the app we can configure the backend access by the swaggerfilw and we can refer to the endpoints simply by their operationId and the custom hooks of the package do the heavy lifting for us.
 