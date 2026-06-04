# Deployment guide

## Before you push to GitHub

- Never commit `.env`, `.env.local`, or real API keys.
- Use `.env.example` files as templates only.

## Local development

### Backend

```bash
# From project root — set your key (PowerShell)
$env:YOUTUBE_API_KEY="your_key_here"
./mvnw.cmd spring-boot:run
```

Runs on `http://localhost:8080` with CORS allowed for `http://localhost:5173`.

### Frontend

```bash
cd jam-frontend
cp .env.example .env.local   # optional; defaults work for localhost
npm install
npm run dev
```

## Production environment variables

### Backend (Spring Boot)

| Variable | Required | Description |
|----------|----------|-------------|
| `YOUTUBE_API_KEY` | Yes | YouTube Data API v3 key (server only) |
| `SPRING_PROFILES_ACTIVE` | Yes | Set to `prod` |
| `APP_CORS_ALLOWED_ORIGINS` | Yes | Frontend URL(s), comma-separated, e.g. `https://jam.example.com` |

Optional: replace in-memory H2 with PostgreSQL via `spring.datasource.*` in a custom profile.

### Frontend (Vite build)

Set at **build time** on your static host:

| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://api.example.com/api` |
| `VITE_WS_URL` | `https://api.example.com/ws` |

```bash
cd jam-frontend
VITE_API_URL=https://your-api.example.com/api \
VITE_WS_URL=https://your-api.example.com/ws \
npm run build
```

Deploy the `jam-frontend/dist` folder to Netlify, Vercel, GitHub Pages, etc.

## Suggested hosting layout

| Component | Options |
|-----------|---------|
| Frontend | Vercel, Netlify, Cloudflare Pages |
| Backend | Railway, Render, Fly.io, AWS Elastic Beanstalk |

Use **HTTPS** everywhere. The WebSocket URL must use `https://` (SockJS will use secure transports).

## Production checklist

- [ ] `SPRING_PROFILES_ACTIVE=prod` (disables H2 console, reduces SQL logging)
- [ ] `APP_CORS_ALLOWED_ORIGINS` matches your exact frontend origin(s)
- [ ] `YOUTUBE_API_KEY` set only on the server
- [ ] Frontend built with correct `VITE_API_URL` and `VITE_WS_URL`
- [ ] YouTube API key restricted by HTTP referrer / IP in Google Cloud Console

## Known limitations (MVP)

- No user authentication — room codes are shared secrets; anyone with the code can control the session.
- Host actions (end session, kick) are verified by username string only, not cryptographic tokens.
- In-memory H2: all rooms are lost on server restart. Use PostgreSQL for persistence when ready.
