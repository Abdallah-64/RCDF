# RCDF NGO Management System

A secure, content-managed website for RCDF. The public site displays published information and accepts contact messages. The separate dashboard lets authenticated administrators manage that content.

## Technology

- Frontend: React, Vite, React Router, Tailwind CSS, Axios, Lucide
- API: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, Zod

## Layout

```
frontend/  React public site and protected admin dashboard
backend/   REST API, database models, validation, security middleware
```

## Getting started

1. Copy `backend/.env.example` to `backend/.env` and fill in a MongoDB connection string and long random JWT secret.
2. Install dependencies: `npm install`, then `npm install --prefix backend` and `npm install --prefix frontend`.
3. Seed example content: `npm run seed`.
4. Start both applications: `npm run dev`.

For development, the public site runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

For one-host local use, run `npm start`. Express builds and serves both the public site and API from `http://localhost:5000`; API routes remain under `/api`.

## Initial admin

The seed script reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the backend environment. It intentionally has no built-in production password.

## Security notes

Passwords are hashed, authentication uses expiring JWTs, sensitive endpoints are rate limited, every modifying route is server-side protected, and API input is validated. Never commit `.env`, database credentials, or JWT secrets.

## Main API routes

- `POST /api/auth/login`
- `GET /api/services`, `GET /api/projects`, `GET /api/pages/:key`, `GET /api/statistics`, `GET /api/settings`
- `POST /api/contact`
- Admin-only CRUD endpoints under `/api/services`, `/api/projects`, `/api/statistics`, `/api/pages`, `/api/settings`, and `/api/contact`

Image fields currently store a vetted hosted URL. Swap the `imageUrl` inputs for an approved object-storage upload adapter before accepting production uploads.
