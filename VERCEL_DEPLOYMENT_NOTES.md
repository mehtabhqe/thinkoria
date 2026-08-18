# Vercel deployment notes

The personal Vercel preview serves the built Thinkoria SPA with an explicit fallback to `/index.html` for non-API, non-storage routes. Direct `/about`, `/catalogue`, `/club`, `/forum`, and `/submit` routes were verified after the fallback redeploy. The final preview also returned a successful anonymous `auth.me` tRPC response through the Manus backend and served the Thinkoria logo through the Manus storage rewrite.

Manus remains the backend and database system of record. The Vercel preview does not migrate the database, server, OAuth service, storage, notifications, or admin data.

Authenticated Vercel flows remain blocked until Manus allows the Vercel callback URL for the Thinkoria OAuth application. The rejected callback is:

`https://thinkoria-site-mehtabalh-gmailcoms-projects.vercel.app/api/oauth/callback`

Until that allowlist entry exists, sign-in, paper submission mutations, published-paper PDF access through authenticated/editorial flows, authenticated forum posting, club applications, admin actions, and notification-triggering mutations are verified only on the Manus domain and are not claimed as working on Vercel.
