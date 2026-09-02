# EWACON 2026 — Full-stack conference platform

Built from the supplied EWA Conference Plan External v5. The supplied deck specifies 22 December 2026, EWACON 2026, the green-energy/semiconductor focus, speakers/program, exhibition concept, official colors, and Platinum/Gold/Silver sponsorship pricing.

## Stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: PostgreSQL
- Security: Helmet, CORS, rate limit, bcrypt, JWT
- QR: server-generated registration QR

## Run
1. Create PostgreSQL database `ewacon2026`.
2. Run `database/schema.sql`, then `database/seed.sql`.
3. Copy `.env.example` to `backend/.env` and set `DATABASE_URL` and a strong `JWT_SECRET`.
4. In `backend`: `npm install && npm run dev`.
5. In `frontend`: `npm install`, create `.env` with `VITE_API_URL=http://localhost:5000/api`, then `npm run dev`.
6. Open the Vite URL.

Demo admin seeded by `seed.sql`: `admin@ewacon.sa` / `ChangeMe123!`. Change it before production.

## Production next steps
- Add transactional email/SMS provider.
- Integrate a Saudi payment gateway after selection.
- Replace placeholder booth inventory/dimensions with approved exhibition plan.
- Add admin CRUD for speakers, agenda, packages and event settings.
- Add CSV/XLSX export and badge-printing endpoint.
- Put backend behind HTTPS and a reverse proxy; use managed PostgreSQL and secrets storage.
