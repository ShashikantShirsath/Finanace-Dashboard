# Finance Dashboard API

A backend API for a finance dashboard application. It provides user authentication, role-based access control, financial record management, and dashboard summary data.

## Built With

- Node.js
- Express
- PostgreSQL
- `bcryptjs` for password hashing
- `jsonwebtoken` for JWT auth
- `joi` for request validation
- `express-rate-limit` for request throttling

## Key Features

- User registration and login
- JWT-based authentication
- Role-based authorization: `admin`, `analyst`, `viewer`
- CRUD operations for financial records
- Dashboard summary endpoint with totals, category aggregates, monthly trends, and recent activity
- Rate limiting for general API requests and stricter limits for authentication endpoints

## Requirements

- Node.js 18+ (or compatible modern version)
- PostgreSQL database
- `JWT_SECRET` environment variable

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with the following variables:

```env
PORT=5000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASS=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
```

3. Initialize your PostgreSQL database and create required tables.

> Note: The project uses `gen_random_uuid()` for record IDs. PostgreSQL must have the `pgcrypto` extension enabled, or you should adjust the record UUID generation logic.

4. Start the server:

```bash
node src/server.js
```

If you want, you can add a `start` script to `package.json`:

```json
"scripts": {
  "start": "node src/server.js"
}
```

## API Overview

### Authentication

#### Register

`POST /api/auth/register`

Body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "strongpassword",
  "role": "viewer"
}
```

Response:

- `201 Created` with user object
- `400 Bad Request` on validation failure

#### Login

`POST /api/auth/login`

Body:

```json
{
  "email": "jane@example.com",
  "password": "strongpassword"
}
```

Response:

- `200 OK` with JWT token:

```json
{ "token": "..." }
```

- `401 Unauthorized` on invalid credentials

### Authenticated Requests

Send JWT in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <token>
```

### User Management (Admin Only)

#### Get All Users

`GET /api/users`

#### Update User

`PUT /api/users/:id`

Body may include one or more of:

```json
{
  "name": "Updated Name",
  "role": "analyst",
  "status": "inactive"
}
```

#### Delete User

`DELETE /api/users/:id`

### Record Management

#### Create Record (Admin Only)

`POST /api/records`

Body:

```json
{
  "amount": 1500,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01",
  "description": "Monthly paycheck"
}
```

- `date` is optional and defaults to today's date if omitted.
- `description` maps to the `notes` field in storage.

#### Get Records

`GET /api/records`

Optional query parameters:

- `type` = `income` or `expense`
- `category`
- `startDate` and `endDate` (range filter)
- `search` (matches `notes` or `category`)
- `limit` (max page size, default `10`, max `100`)
- `pageNumber` (default `1`)

Response includes pagination metadata.

#### Update Record (Admin Only)

`PUT /api/records/:id`

Body may include:

```json
{
  "amount": 1800,
  "type": "income",
  "category": "salary",
  "date": "2026-04-02",
  "description": "Updated paycheck"
}
```

#### Delete Record (Admin Only)

`DELETE /api/records/:id`

Records are soft deleted using `deleted_at`.

### Dashboard

#### Get Dashboard Data

`GET /api/dashboard/data`

Returns:

- `summary` with total income, total expense, and net balance
- `categoryWiseTotals`
- `trends` by month
- `recentActivity`

Access: `admin` and `analyst` only

## Environment Variables

- `PORT` — optional server port (default `5000`)
- `DB_USER` — PostgreSQL username
- `DB_HOST` — PostgreSQL host
- `DB_NAME` — PostgreSQL database name
- `DB_PASS` — PostgreSQL password
- `DB_PORT` — PostgreSQL port
- `JWT_SECRET` — secret for signing JWTs

## Assumptions

- PostgreSQL is the target database.
- User registration can assign `viewer`, `analyst`, or `admin` roles.
- User `status` can be `active` or `inactive`.
- Authentication tokens expire after 1 day.
- `GEN_RANDOM_UUID()` is available or the DB setup is adjusted accordingly.
- `sqlite3` appears in dependencies but is not actively used by the codebase.

## Tradeoffs

- Simple role middleware is used instead of a more flexible permissions engine.
- No database migration or seed tooling is included.
- The current code assumes a Postgres-only environment, even though `sqlite3` is installed.
- Error responses are returned as generic messages rather than standardized API error objects.
- No automated tests are configured in `package.json`.

## Notes

- If you want a better development workflow, add `npm run dev` with `nodemon`.
- The API currently uses `pg` and `express` directly, so extending it for another database provider will require additional architecture changes.
