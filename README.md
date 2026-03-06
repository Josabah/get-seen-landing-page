# Get Seen

It started as a simple page with a backend and a database to learn the full request–response lifecycle. From there it grew: tests, migrations, rate limiting, client/server structure, and a bit of polish. Still a small full-stack app—static frontend, Express API, PostgreSQL—but with a clear path from request to response to DB and back.

## Project structure

```
client/               # Frontend (entry: client/index.html)
server/               # Backend (entry: server/index.js)
├── db/               # Database client
├── lib/              # Shared utilities (e.g. validation)
├── routes/           # API routes
├── migrations/       # SQL migrations (run via npm run db:migrate)
├── app.js            # Express app (used by server + tests)
├── index.js          # Backend entry point
└── run-migrations.js
tests/
```

## Local setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env`
   - Set `DATABASE_URL` to your PostgreSQL connection string (required)

3. **Database**
   - Run migrations: `npm run db:migrate`

4. **Run**
   - Start the server: `npm run dev` (or `npm start`)
   - Open the app at `http://localhost:3000` (or the port in `PORT`, default 3000)
   - The server serves the landing page and injects `window.API_BASE` (empty = same origin)

## Environment variables

See [.env.example](.env.example). Summary:

- **DATABASE_URL** (required) – PostgreSQL connection string
- **PORT** – Server port (default 3000)
- **ALLOWED_ORIGIN** – CORS allowed origin (default `http://localhost:3000`)
- **API_BASE** – Optional; injected into the frontend when served from Express (empty = same origin). Set when the frontend is deployed separately.

## Tests

- **Unit + API:** `npm test`
- Unit tests (validation) run without a database.
- API tests (health + subscribe) run only when `DATABASE_URL` is set; otherwise they are skipped. Use a test or throwaway DB in CI.

## Scripts

| Script        | Description                    |
|---------------|--------------------------------|
| `npm start`   | Start the server               |
| `npm run dev` | Start with nodemon             |
| `npm run db:migrate` | Run SQL migrations      |
| `npm test`    | Run the test suite             |
