# InboxGlow

An animated contact page and lightweight message dashboard built for agencies, freelancers, SaaS products, and local businesses.

![React](https://img.shields.io/badge/React-19-61dafb) ![Node](https://img.shields.io/badge/Node-20+-68a063) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## What buyers receive

- Responsive animated contact page with a premium glass-style design
- Typed React form with client and server validation
- PostgreSQL storage through Prisma ORM
- Protected message dashboard with read and archive states
- Secure admin password login using a short-lived HTTP-only session cookie
- Message search, status filtering, and CSV export
- Spam honeypot, rate limiting, Helmet, CORS, and request-size limits
- Accessible labels, keyboard states, reduced-motion support, and responsive layouts
- Docker setup, automated tests, linting, CI, and deployment-ready builds
- Central content configuration—no need to edit the form component

## Quick start

Requirements: Node.js 20+, npm 10+, and Docker Desktop.

```bash
git clone YOUR_REPOSITORY_URL inboxglow
cd inboxglow
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
docker compose up -d
npm run db:generate
npm run db:deploy
npm run dev
```

Open `http://localhost:5173`. The admin dashboard is at `http://localhost:5173/admin`.

Use the `ADMIN_PASSWORD` value from `apps/api/.env` to open the dashboard. For a static marketplace preview without an API or database, set `VITE_DEMO_MODE="true"`; demo messages are stored only in that visitor's browser.

## Customise in minutes

1. Edit brand text, contact details, and enquiry types in `apps/web/src/config.ts`.
2. Change the main colour variables at the top of `apps/web/src/styles.css`.
3. Replace the page title and description in `apps/web/index.html`.
4. Set a strong `ADMIN_PASSWORD` and a unique `ADMIN_TOKEN_SECRET` in the deployed API environment.
5. Set `WEB_ORIGIN` to the public frontend URL and `VITE_API_URL` to the public API URL.

See [CUSTOMIZATION.md](docs/CUSTOMIZATION.md) and [DEPLOYMENT.md](docs/DEPLOYMENT.md) for full instructions.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the frontend and API together |
| `npm run build` | Create production builds |
| `npm test` | Run frontend and API tests |
| `npm run lint` | Check code quality |
| `npm run db:migrate -- --name init` | Create/apply a local migration |
| `npm run db:deploy` | Apply included migrations in production |
| `npm run db:studio` | Browse saved messages visually |

## Project structure

```text
apps/web/       React + Vite customer page and admin dashboard
apps/api/       Express API and Prisma database layer
docs/           Buyer customization, deployment, and support docs
.github/        CI quality checks
```

## Security notes

Never commit `.env` files. Change all sample secrets before deployment. The included single-admin login uses a signed, HTTP-only session cookie. Add user accounts, password hashing, password recovery, and role-based permissions before supporting multiple staff members or highly sensitive data.

## License and support

This package is intended for commercial sale. The included `LICENSE.md` is a seller-controlled commercial template, not an open-source licence. Replace the bracketed seller details and have the terms reviewed for your marketplace and country before selling.

Support policy: see [SUPPORT.md](SUPPORT.md). Security reports: see [SECURITY.md](SECURITY.md).
