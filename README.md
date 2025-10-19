# NotMySim Backend (MVP)

A minimal backend to support the NotMySim MVP:
- User auth (register/login with JWT)
- Device registration (store hashed SIM identifiers)
- Incident reporting (SIM change events)
- Panic actions logging
- List incidents for current user

**Stack**: Node.js, Express, Prisma, SQLite (easy to switch to Postgres), JWT, Joi validation, Helmet, CORS.

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Create .env from example
cp .env.example .env

# 3) Init DB & generate client
npx prisma migrate dev --name init

# 4) Start dev server
npm run dev
```

Server defaults to http://localhost:8080

## API Overview (MVP)

- `POST /auth/register` { email, password }
- `POST /auth/login` { email, password } -> { token }
- `POST /devices/register` (auth) { deviceId, imsiHash, iccidHash, carrier }
- `POST /incidents/report` (auth) { deviceId, type: "SIM_CHANGE", details }
- `GET /incidents` (auth) -> list incidents for user
- `POST /actions/panic` (auth) { deviceId, checklist: [...strings] }

> Store only **hashed** SIM identifiers (IMSI, ICCID) to protect user privacy.

## Move to Postgres (later)

- Set `DATABASE_URL` to a Postgres URL.
- Run `npx prisma migrate deploy` on your server.

## Security Notes

- Set a long random `JWT_SECRET` in production.
- Use HTTPS in production.
- Add rate limiting (e.g., express-rate-limit) and IP allow-lists as needed.
- Consider per-user encryption for extra sensitive fields.
