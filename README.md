# Python Academy

**Learn programming with Python.** A free, bilingual (English / Spanish) and gamified
learning platform: short lessons with runnable examples, quizzes graded on the server,
XP, levels, badges, quests, a leaderboard and printable certificates.

The project is also a reference for a clean full-stack layout: a FastAPI backend split
by domain, and a Next.js frontend split by feature, both small enough to read in an afternoon.

## Features

- **Academy page** (public): hero, course catalogue with level, duration, lesson count and
  your progress when signed in, a "predict the output" demo quiz that needs no account,
  and a searchable A–Z glossary of 47 Python terms.
- **Four courses, 16 lessons**: Python Basics, Control Flow, Functions & Modules and Data
  Structures. Each lesson is Markdown with highlighted code, key takeaways and a 3-question quiz.
- **Exams and certificates**: each course ends with a 6-question exam, unlocked once every
  lesson is complete. Scoring 70% or more issues a printable certificate with a public
  verification ID.
- **Gamification**: XP for lessons, correct answers, perfect quizzes and exams; levels from
  XP thresholds; streaks; six badges; daily and weekly quests; weekly and all-time leaderboards
  that only show display names.
- **Learner hub**: level and XP bar, streak, quests, badges, "continue learning" and course progress.
- **Accounts**: sign up, log in, log out with server-side sessions in an `HttpOnly`,
  `SameSite=Lax` cookie. Passwords are hashed with Argon2, failed logins are rate-limited and
  bad credentials always return the same generic error.
- **Settings**: display name, language, theme, password change (requires the current password)
  and account deletion (requires the password and typing `DELETE`).
- **Two languages everywhere**: UI, lessons, quizzes, glossary, badges and quests exist in
  English and Spanish. The locale lives in the URL (`/en/...`, `/es/...`) and is saved to your
  settings when signed in.
- **Light and dark themes**: follows the system by default, can be switched manually, and is
  applied before the first paint so there is no flash.
- **Accessibility**: semantic landmarks, skip link, labelled controls, visible focus rings,
  `aria-live` quiz feedback, keyboard-only navigation, reduced-motion support and WCAG AA
  contrast in both themes (checked by a unit test).

## Architecture

```mermaid
flowchart LR
    Browser -->|"/en/..., /es/..."| Next["Next.js (App Router)<br/>frontend/"]
    Browser -->|"/api/* (same origin)"| Next
    Next -->|"rewrite /api/* to"| API["FastAPI<br/>backend/ · /api/v1"]
    API --> DB[("SQLite or PostgreSQL")]
    Content["backend/content/<br/>YAML + Markdown"] -->|"python -m app.seed"| DB
```

- The browser only ever talks to the Next.js server. Next.js **rewrites** `/api/*` to FastAPI,
  so the session cookie is first-party and no CORS setup is needed.
- Course content lives in plain files (`backend/content`). A seed script loads it into the
  database (SQLite locally, PostgreSQL in production); it is idempotent, keeps row ids stable
  and never touches learner data, so it runs on every start.
- Quiz and exam answers are **graded on the server**. Questions are sent without their answer
  key, which is only revealed in the grading response.
- Every learning action is written to an append-only `activity_events` table. XP totals,
  leaderboards, streaks, quest progress and badge rules are all computed from it, which keeps
  the gamification rules in one small module.

### Request flow: submitting a lesson quiz

```mermaid
sequenceDiagram
    participant UI as LessonQuiz (React)
    participant P as progress/service.py
    participant G as gamification/service.py
    UI->>P: POST /api/v1/lessons/{id}/quiz {answers}
    P->>P: grade answers, store attempt, complete lesson
    P->>G: record_activity(lessons_completed, correct_answers, ...)
    P->>G: collect_rewards()
    G-->>P: XP gained, level, new badges, completed quests
    P-->>UI: results + explanations + rewards
    UI->>UI: invalidate "learner" queries (hub, progress, leaderboard)
```

### Security notes

- Session tokens are random 256-bit values; only their SHA-256 hash is stored.
- Changing the password signs out every other session. Deleting the account removes all of the
  user's data through `ON DELETE CASCADE`.
- State-changing requests must send an `X-Requested-With` header. Together with `SameSite=Lax`
  cookies this blocks cross-site request forgery: browsers cannot add custom headers to
  cross-site forms, and the API never approves the CORS preflight a cross-origin fetch would need.
- Errors use RFC 9457 problem details (`application/problem+json`).
- The login rate limiter is in memory, per process. That fits the single-process setup here;
  several API replicas would need a shared store such as Redis.
- Behind the production proxies the limiter never trusts `X-Forwarded-For`; see
  [Client IP behind the proxies](#client-ip-behind-the-proxies).

## Running it

### With Docker Compose

```bash
docker compose up --build
```

Open <http://localhost:3000>. The API docs are at <http://localhost:8000/docs>.
If those ports are taken, use `FRONTEND_PORT=3001 BACKEND_PORT=8001 docker compose up --build`.
The SQLite database is kept in the `academy-data` volume, and content is re-seeded on every start.

### Manually

Requirements: Python 3.12+, Node.js 24 and pnpm.

```bash
# Backend: http://127.0.0.1:8000 (docs at /docs)
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements-dev.txt
.venv/bin/python -m app.seed          # creates data/academy.sqlite and loads the content
.venv/bin/uvicorn app.main:app --reload

# Frontend: http://localhost:3000 (in a second terminal)
cd frontend
pnpm install
pnpm dev                               # set BACKEND_URL if the API is not on 127.0.0.1:8000
```

Backend settings are environment variables with the `ACADEMY_` prefix; see
[`backend/.env.example`](backend/.env.example). Set `ACADEMY_COOKIE_SECURE=true` when serving over HTTPS.

The database is a local SQLite file unless `DATABASE_URL` (or `ACADEMY_DATABASE_URL`) is set.
PostgreSQL URLs are accepted as hosting providers give them (`postgres://...` or
`postgresql://...?sslmode=require`) and use the psycopg 3 driver. Timestamps are stored as UTC
(`timestamp with time zone` on PostgreSQL) and returned by the API with a `Z` suffix.

The tables are created with SQLAlchemy's `create_all` instead of migrations, which keeps the
project simple: it creates missing tables on start and never alters existing ones. If you change
a model locally, delete `backend/data/academy.sqlite` and seed again. Once real data lives in
PostgreSQL, a model change that alters an existing table needs a manual `ALTER TABLE` (or
Alembic, once the schema starts to evolve regularly).

## Deploying (free): Vercel + Render + Neon

```mermaid
flowchart LR
    Browser -->|"https://your-app.vercel.app"| Vercel["Vercel<br/>Next.js (frontend/)"]
    Vercel -->|"/api/* + client IP + shared secret"| Render["Render free web service<br/>FastAPI (backend/)"]
    Render --> Neon[("Neon PostgreSQL")]
```

The browser only talks to the Vercel domain. Next.js forwards `/api/*` to Render, so the session
cookie is first-party (`HttpOnly`, `Secure`, `SameSite=Lax`) and no CORS setup is needed.

### 1. Database: Neon

1. Create a project at <https://neon.tech> (region **AWS Europe Central 1 / Frankfurt**, next to
   the Render service).
2. Copy the connection string from **Connect**. Either the pooled (`-pooler`) or the direct
   host works, e.g.
   `postgresql://user:password@ep-xxx-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`.
   Keep `?sslmode=require`; the backend switches the scheme to the psycopg 3 driver itself.

Tables are created and the course content is loaded by the backend when it starts.

### 2. Backend: Render

1. Push the repository to GitHub.
2. In Render, choose **New > Blueprint**, pick the repository and confirm. It reads
   [`render.yaml`](render.yaml): a free Python web service in Frankfurt with root directory
   `backend`, build `pip install -r requirements.txt`, health check `/api/v1/health`, and start
   `python -m app.seed && uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips '*'`.
3. When asked, paste the Neon connection string as `DATABASE_URL`.
4. After the first deploy, open the service's **Environment** tab and copy the generated value of
   `ACADEMY_PROXY_SECRET`. Note the service URL, e.g. `https://python-academy-api.onrender.com`.

| Render variable | Value |
|-----------------|-------|
| `DATABASE_URL` | Neon connection string (set by you; `sync: false`) |
| `ACADEMY_PROXY_SECRET` | Generated by Render; copy it to Vercel as `PROXY_SECRET` |
| `ACADEMY_COOKIE_SECURE` | `true` (set by the blueprint) |
| `PYTHON_VERSION` | `3.12` (set by the blueprint) |

Optional: `ACADEMY_SESSION_DAYS`, `ACADEMY_LOGIN_MAX_ATTEMPTS`, `ACADEMY_LOGIN_WINDOW_SECONDS`.
No CORS or allowed-origin setting exists or is needed, because the browser never calls Render
directly.

### 3. Frontend: Vercel

1. **Add New > Project**, import the repository and set **Root Directory** to `frontend`.
   The framework preset is Next.js; pnpm is detected from `pnpm-lock.yaml`.
2. In **Settings > Build and Deployment**, set **Node.js Version** to `24.x`.
3. Add the environment variables below (Production, and Preview if you use preview deployments),
   then deploy. Change nothing else: `output: "standalone"` is only used by the Docker image.

| Vercel variable | Value |
|-----------------|-------|
| `BACKEND_URL` | The Render service URL, e.g. `https://python-academy-api.onrender.com` (no trailing path) |
| `PROXY_SECRET` | The value of `ACADEMY_PROXY_SECRET` from Render |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1`, so Vercel uses the pnpm version pinned in `package.json` (`packageManager`) |

`BACKEND_URL` is also baked into the fallback rewrite at build time, so redeploy after changing it.

### Client IP behind the proxies

Login attempts are rate-limited per client IP and email. In production a request passes through
Vercel and Render's load balancer, and the Render URL is public, so a raw `X-Forwarded-For` could
be forged by anyone calling Render directly. The chain is trusted like this instead:

- Vercel overwrites `X-Forwarded-For` / `X-Real-IP` with the address that connected to it, so the
  browser cannot forge them there. The Next.js proxy ([`frontend/src/proxy.ts`](frontend/src/proxy.ts))
  reads that address, drops any `X-Academy-*` headers the browser sent, and forwards the request
  to `BACKEND_URL` with `X-Academy-Client-IP` and `X-Academy-Proxy-Secret`.
- The backend ([`backend/app/core/client_ip.py`](backend/app/core/client_ip.py)) uses
  `X-Academy-Client-IP` only when the secret matches (constant-time comparison). Requests without
  the right secret, i.e. direct calls to Render, all share one rate-limit bucket per email, so
  forged addresses gain nothing and cannot lock out people who sign in through the website.
- Without `ACADEMY_PROXY_SECRET` (local and Docker setups) the socket peer address is used, as
  before. `--proxy-headers` on Render only affects the scheme and `request.client`, which the
  limiter does not use when the secret is set.

### Free-tier notes

- Render's free service sleeps after 15 minutes without traffic; the first request afterwards
  takes up to a minute while it wakes up (and re-runs the idempotent seed).
- Neon suspends idle computes. The backend checks pooled connections before use
  (`pool_pre_ping`), recycles them every 5 minutes and keeps the pool small (5 + 5 overflow).
- The rate limiter lives in memory, so a restart clears it.

## Tests and quality checks

| Where     | Command                                  | What it covers |
|-----------|------------------------------------------|----------------|
| backend   | `.venv/bin/ruff check . && .venv/bin/ruff format --check .` | Lint and formatting |
| backend   | `.venv/bin/mypy`                         | Strict type checking |
| backend   | `.venv/bin/pytest`                       | Auth, settings, content integrity, courses, progress/XP/levels, badges, quests, streaks, leaderboards, exams and certificates, idempotent seeding, database URLs, rate-limit client IP (58 tests, in-memory SQLite) |
| backend   | `TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/academy_test .venv/bin/pytest` | The same suite against PostgreSQL (the database is wiped; each test runs in a rolled-back transaction) |
| frontend  | `pnpm lint && pnpm format:check`         | ESLint (Next.js rules) and Prettier |
| frontend  | `pnpm typecheck`                         | TypeScript in strict mode |
| frontend  | `pnpm test`                              | Vitest + Testing Library: quiz form, demo quiz, API client, theme script, glossary search, identical en/es message keys and placeholders, colour-contrast of every token pair in both themes (78 tests) |
| frontend  | `pnpm build`                             | Production build |
| frontend  | `E2E_BASE_URL=http://localhost:3000 pnpm e2e` | Optional Playwright smoke test against a running stack: sign up, finish a lesson quiz, check the hub, switch to Spanish, dark mode, settings, log out |

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs the backend and
frontend checks on every push and pull request, and the backend tests a second time against a
`postgres:17` service container.

A throwaway PostgreSQL for running the suite locally:

```bash
docker run -d --rm --name academy-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=academy_test \
  -p 127.0.0.1:55432:5432 postgres:17
TEST_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:55432/academy_test .venv/bin/pytest
docker stop academy-pg
```

## Adding content

All content lives in [`backend/content`](backend/content). Run `python -m app.seed` (or restart
the Docker stack) after editing it.

**A lesson.** Add `courses/<course>/lessons/<lesson-slug>.en.md` and `<lesson-slug>.es.md`. Each
file starts with `# Title` and ends with a `## Key takeaways` (English) or `## Puntos clave`
(Spanish) section of `- ` bullets. Then list the lesson in the course's `course.yaml` with its
reading time and quiz:

```yaml
lessons:
  - slug: my-lesson
    minutes: 8
    quiz:
      - prompt: { en: What does this print?, es: ¿Qué imprime esto? }
        code: |
          print(1 + 1)
        options: { en: ["2", "11"], es: ["2", "11"] }
        answer: 0                 # zero-based index of the correct option
        explanation: { en: Integers add up., es: Los enteros se suman. }
```

**A course.** Create `courses/<slug>/course.yaml` with `slug`, `order`, `level`
(`beginner` or `intermediate`), bilingual `title` and `summary`, its `lessons` and an `exam`
(a list of questions in the same shape as quiz questions).

**Glossary terms, badges and quests** are in `glossary.yaml`, `badges.yaml` and `quests.yaml`.
Badges and quests are data-driven: each one names a metric (`lessons_completed`,
`correct_answers`, `perfect_quizzes`, `exams_passed`, `total_xp`, `streak_days`, `xp_earned`)
and a threshold.

`tests/test_content.py` fails if a lesson or question is missing a language.

## Adding a language

1. Backend: add the code to `LANGUAGES` and the `Lang` type in `app/core/i18n.py`, and to
   `TAKEAWAYS_HEADINGS` in `app/courses/content_loader.py`.
2. Content: add the new key next to every `en`/`es` value and a `<lesson>.<code>.md` file
   for every lesson.
3. Frontend: add the code to `locales` in `src/i18n/routing.ts`, the `Locale` type in
   `src/lib/api/types.ts`, and a `src/messages/<code>.json` catalogue. Add it to the
   catalogue test in `src/messages/messages.test.ts` so its keys are checked too.

## Project structure

```text
.
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app factory: middleware, errors, routers
│   │   ├── seed.py            # loads content/ into the database
│   │   ├── core/              # settings, database, column types, client IP, errors, CSRF guard, i18n
│   │   ├── auth/              # sign up, log in/out, sessions, password hashing, rate limit
│   │   ├── users/             # profile, settings, password change, account deletion
│   │   ├── courses/           # courses, lessons, glossary, demo quiz, grading, content loader
│   │   ├── progress/          # quiz and exam submissions, course progress, certificates
│   │   └── gamification/      # XP, levels, streaks, badges, quests, leaderboards
│   ├── content/               # courses (YAML + Markdown), glossary, badges, quests, demo quiz
│   └── tests/                 # pytest suite (SQLite or PostgreSQL, seeded with the real content)
├── frontend/
│   ├── e2e/                   # optional Playwright smoke test
│   └── src/
│       ├── app/[locale]/      # routes: academy, courses, lessons, exam, certificates, hub, ...
│       ├── features/          # one folder per screen, with its components and styles
│       ├── components/        # shared UI (buttons, fields, progress bar) and layout
│       ├── lib/api/           # fetch client, response types, TanStack Query hooks per domain
│       ├── i18n/ messages/    # next-intl routing and the en/es catalogues
│       ├── styles/            # design tokens, global and code-highlighting styles
│       └── theme/             # no-flash theme script and theme provider
├── docker-compose.yml
├── render.yaml                # Render blueprint for the backend
└── .github/workflows/ci.yml
```

Each backend domain has the same four files: `models.py` (tables), `schemas.py` (API shapes),
`service.py` (logic) and `router.py` (HTTP endpoints).

## Design

The palette is built from four colours: lavender `#CCABD8`, muted purple `#8474A1`, teal
`#08979D` and deep teal `#045A5C`. Components only use semantic tokens (`--color-bg`,
`--color-surface`, `--color-text`, `--color-muted`, `--color-primary`, `--color-accent`,
`--color-focus`, ...) defined in [`src/styles/tokens.css`](frontend/src/styles/tokens.css),
with separate values for the dark theme.

Teal `#08979D` on white is below 4.5:1, so light-mode text and buttons use deep teal
`#045A5C`, and dark mode uses a light teal tint. `tokens.test.ts` computes the contrast ratio
of every text/background pair (and the syntax-highlighting colours) in both themes.

## License

[MIT](LICENSE) © 2026 Franciellen Gonçalves
