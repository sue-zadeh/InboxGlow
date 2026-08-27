# Deployment guide

## Recommended simple setup

- Frontend: Vercel, Netlify, or Cloudflare Pages
- API: Railway, Render, Fly.io, or Azure App Service
- Database: Neon, Supabase Postgres, Railway Postgres, or managed PostgreSQL

## API environment

Set these variables on the API host:

```text
DATABASE_URL=your-managed-postgresql-url
PORT=4000
WEB_ORIGIN=https://your-frontend.example
ADMIN_PASSWORD=a-strong-unique-password
ADMIN_TOKEN_SECRET=64-random-hex-characters
COOKIE_CROSS_SITE=false
NODE_ENV=production
```

Generate the token secret with `openssl rand -hex 32`.

Keep `COOKIE_CROSS_SITE=false` when the frontend and API share the same site or are connected through a reverse proxy. Set it to `true` only when the frontend and API use different HTTPS sites; this makes the secure session cookie use `SameSite=None`.

Build command: `npm install && npm run db:generate && npm run build -w @inboxglow/api`

Start command: `npm run db:deploy -w @inboxglow/api && npm start -w @inboxglow/api`

## Frontend environment

Set `VITE_API_URL=https://your-api.example/api` before building.

Build command: `npm install && npm run build -w @inboxglow/web`

Publish directory: `apps/web/dist`

## Before going live

- Use unique production secrets.
- Allow CORS only from the real frontend domain.
- Run the database migration against production.
- Submit a real form and confirm it appears in `/admin`.
- Test mobile, keyboard navigation, and error states.
- Add real privacy-policy and terms links.
- Replace all bracketed seller/support placeholders in the legal and support files.
- Turn on automated database backups and host monitoring.
