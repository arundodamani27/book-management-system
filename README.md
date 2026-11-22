# Book Store Manager

A simple book management application using Express.js and Fetch API.

## Project structure

- `server.js`: Express REST API and local server entry point
- `public/index.html`: frontend markup
- `public/styles.css`: frontend styling
- `public/app.js`: Fetch API calls and frontend interactions

## Run locally

```bash
npm install
npm start
```

Open http://localhost:3000.

## API endpoints

- `GET /books` — list books
- `GET /book/:id` — get a book by ID
- `POST /books` — add a book (`author`, `price`)
- `PUT /book/:id` — update a book (`author` and/or `price`)
- `DELETE /book/:id` — delete a book

Data is stored in memory and resets when the server restarts.
