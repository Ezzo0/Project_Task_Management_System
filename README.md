# Project Task Management System

Project Task Management System is a REST API for managing projects, tasks and users. It provides authentication, role-based access, project CRUD, task management, and basic project statistics.

**Tech Stack**

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Auth:** JSON Web Tokens (JWT)
- **Containerization:** Docker + Docker Compose

## Getting started (local)

Prerequisites:

- Node.js (18+ recommended)
- PostgreSQL

1. Create a `.env` file in the project root.
   Save your values to `.env` and ensure Postgres is reachable with those credentials. Here is an example variables used by the app:

```
# Server
PORT=4000
NODE_ENV=development

# Database (Postgres)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=project_db

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build and run (production):

```bash
npm run build
npm start
```

5. Run database migrations:

```bash
npm run migration:run
```

## Running with Docker

This project includes a `docker-compose.yml` for running the API together with a Postgres service.

Bring up the services:

```bash
docker compose up --build
```

To stop and remove containers:

```bash
docker compose down
```

## Postman Collection

A Postman collection is included at `postman_collection.json` to help test the API. Import it into Postman (File → Import) or use Postman's CLI. The collection contains example requests for authentication, projects, and tasks and sets the following collection variables: `baseUrl`, `token`, `projectId`, and `taskId`. Use the `Login Admin` request to obtain an admin token for accessing admin-only endpoints.
The collection also includes a `refreshToken` variable and a `POST /api/auth/refresh` request to exchange refresh tokens for new access tokens. Depending on how the API is configured, refresh tokens may be returned in the login response body as `refreshToken` or set as an HttpOnly cookie.

## API Endpoints

Below are the main API endpoints exposed by the application. All endpoints are prefixed with `/api`.

- **Authentication (public)**
  - `POST /api/auth/register` — Register a new user. Body: `{ name, email, password }`.
  - `POST /api/auth/login` — Login with email and password. Returns `{ token }`.
  - `POST /api/auth/refresh` — Exchange a refresh token for a new access token. Typically requires sending the refresh token in the request (or via an HttpOnly cookie), and returns a new access token.

- **Projects (authenticated)** — all project routes require a valid JWT in the `Authorization: Bearer <token>` header (the app applies `authMiddleware` to `/api/projects`).
  - `GET /api/projects` — List projects.
  - `POST /api/projects` — Create a project.
  - `GET /api/projects/:id` — Get a single project by id.
  - `PATCH /api/projects/:id` — Update a project.
  - `DELETE /api/projects/:id` — Delete a project.

- **Tasks (authenticated)** — nested under a project; also protected by `authMiddleware`.
  - `GET /api/projects/:projectId/tasks` — List tasks for a project.
  - `POST /api/projects/:projectId/tasks` — Create a task in a project.
  - `GET /api/projects/:projectId/tasks/:taskId` — Get a single task.
  - `PATCH /api/projects/:projectId/tasks/:taskId` — Update a task.
  - `DELETE /api/projects/:projectId/tasks/:taskId` — Delete a task.

- **Admin-only (role = `admin`)** — mounted under `/api/admin/projects` and protected by both `authMiddleware` and the `authorize("admin")` role middleware:
  - `GET /api/admin/projects/with-users` — List projects with creator (user) information.
  - `GET /api/admin/projects/stats` — Get project statistics.

## Role-based access control (RBAC)

- Authentication: The app expects a JWT in the `Authorization` header in the form `Bearer <token>`. The `authMiddleware` verifies the token and sets `req.userId` and `req.userRole`.
- Authorization: The `authorize(...roles)` middleware checks `req.userRole` and returns `403 Forbidden` when the user's role is not allowed. The admin endpoints listed above use `authorize("admin")` and therefore require the authenticated user to have the `admin` role.

## Seeded admin credentials

The initial migration seeds a default admin user. These credentials are present in the migration at `src/migrations/1680000000000-CreateInitialSchema.ts` and are:

- **Email:** admin@example.com
- **Password:** admin123

The password is stored hashed using PostgreSQL's `crypt()`/`gen_salt()` (bcrypt) during the migration, so the plaintext password above is the value used when seeding.

## Useful npm scripts

- `npm run dev` — start development server (ts-node-dev)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled production server
- `npm run migration:run` — run TypeORM migrations
- `npm run migration:generate` — generate a migration (pass `--name=...`)
