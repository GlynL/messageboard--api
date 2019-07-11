# Messageboard - API

Backend for messageboard application.

Live site: https://glynlewington.com/messageboard

## Tech
* Node.js
* Express
* MongoDB
* passportJS
* Jest

## API
* /api/users
  * DELETE - remove users - auth required (must be user)
* /api/users/signup
  * POST - create new user
* /api/users/login
  * POST - returns JWT 
* /api/boards
  * GET - fetch all boards
  * POST - create new board - auth required
* /api/:board/threads
  * GET - fetch all threads
  * POST - create new thread - auth required
* /api/:board/threads/:id
  * DELETE - remove thread - auth required (must be author)
* /api/:board/:thread/replies
  * GET - fetch all replies
  * POST - create new reply - auth required
* /api/:board/:thread/replies/:id
  * DELETE - remove reply - auth required (must be author)

## Setup locally

Clone or download repo.

`npm install`

`touch .env`

```
SECRET=randomstring
DB=yourmongodb
```

npm start
```

## Run tests

`npm test`
