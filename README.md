# nextjs-auth-starter

A runnable **local demo, not production authentication**. Next.js App Router, strict TypeScript, Tailwind CSS 4, lucide-react, stable NextAuth.js 4, Zod and bcryptjs. There is one environment-configured demo account; no database, registration, OAuth or external API.

## Run locally

Use Node.js 22 or newer (verified with Node 24) and npm.

```sh
npm ci
npm run setup:demo
npm run dev
```

Open http://localhost:3000/login. Sign in with:

- Email: `demo@example.com`
- Password: `Demo-Only!2026`

`setup:demo` creates an ignored `.env.local` with a cryptographically random 32-byte secret and a freshly salted bcrypt cost-12 hash of that **public demo password**. It refuses to overwrite an existing file. On POSIX it requests owner-only permissions; on Windows access follows your directory ACLs. No account is inserted anywhere.

### Copy-and-configure alternative

Copy `.env.example` to `.env.local` (`Copy-Item .env.example .env.local` in PowerShell, or `cp .env.example .env.local` on macOS/Linux). Generate a secret:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64url'))"
```

Paste that value into `NEXTAUTH_SECRET=` in `.env.local`, then run `npm run dev`. The example already includes a working cost-12 hash for the public demo password. **Keep the backslashes before the hash’s dollar signs**: Next.js expands `$` in environment files. When configuring environment variables directly in a hosting dashboard, supply the raw hash without backslashes or surrounding quotes. The secret must be random, at least 32 characters, and never committed. All auth configuration is server-only; do not prefix it with `NEXT_PUBLIC_`.

## Build and run

```sh
npm run build
npm start
```

`npm run typecheck` checks TypeScript. No test suite is included. `package-lock.json` pins the installed dependencies; use `npm ci` for repeatable installation. On Windows, run these commands from a normal terminal if a restricted execution sandbox prevents the native Next.js compiler from accessing the workspace.

## Behavior and structure

- `/` redirects to `/dashboard`; it adds no extra product page.
- `/login` validates inputs and presents loading, generic failure feedback, and a password visibility toggle. Authenticated visitors redirect to `/dashboard`.
- `/dashboard` calls `getServerSession` on the server before rendering any session information. Unauthenticated requests redirect to `/login`. KPI cards are explicitly labeled sample data.
- `src/lib/auth.ts` contains the credentials provider. It validates again on the server, rejects passwords over bcrypt’s 72-byte limit, and compares the hash even for an unknown well-formed email. Only the demo user ID, name and email enter the session.
- `src/app/api/auth/[...nextauth]/route.ts` uses the supported NextAuth v4 App Router route handler pattern on the Node runtime. The selected stable package declares Next.js 16 / React 19 compatibility. See [NextAuth initialization](https://next-auth.js.org/configuration/initialization#route-handlers-app) and [server session documentation](https://next-auth.js.org/configuration/nextjs).
- NextAuth handles encrypted JWT sessions in HttpOnly, SameSite cookies and CSRF protection for sign-in/sign-out. HTTPS uses secure cookies automatically. Local HTTP development cannot use HTTPS-only cookies. The configured session lifetime is one hour. No localStorage authentication or hand-written cookie/token implementation is used.
- Sign-out uses the library’s POST flow and returns to `/login`. Redirect destinations are restricted to the two local app pages.

## Security boundaries and demo limitations

**Do not deploy this shared demo account as authentication for real users or sensitive data.** Its password and example hash are intentionally public. There is no durable brute-force protection/rate limiting, account lifecycle, password reset, MFA, audit trail or central session revocation. For real authentication, design those controls and per-user authorization; apply distributed rate limits before password hashing. An in-memory limiter would not protect multiple workers or serverless instances, so this demo does not pretend to provide one.

Protect every future data access, server action and API separately with server-side session and authorization checks. A protected page does not automatically secure unrelated routes. Do not place personalized pages behind a public cache. This app renders both auth pages dynamically.

Use HTTPS and a correct canonical `NEXTAUTH_URL` outside localhost. Never log credentials, commit `.env.local`, expose secrets to client code, or use a predictable secret. Rotating `NEXTAUTH_SECRET` invalidates existing tokens. Changing the demo hash does **not** revoke already issued tokens. Sign-out clears this browser’s session cookie; a copied token can remain valid until expiry. Keep dependencies patched and review security headers/CSP for your real deployment. The included basic headers are not a complete production hardening policy.

The UI uses local CSS/system fonts and no remote images, fonts or APIs. All chart and KPI values are illustrative.

## Verification performed

The production build and strict TypeScript check passed on Windows with Node 24. Live HTTP checks against `npm start` verified `/login` returns 200, unauthenticated `/dashboard` redirects to `/login`, wrong credentials return 401, valid credentials create an HttpOnly session cookie, authenticated dashboard rendering includes the demo email, and sign-out restores the protected-route redirect. The example bcrypt hash was separately verified against the documented demo password. No automated tests were added. Browser interaction, responsive visual QA and external deployment were not verified.
