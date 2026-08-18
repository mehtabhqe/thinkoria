# Supabase + Vercel assessment for Thinkoria

## Official platform findings

Supabase’s current Free plan includes two free projects, 50,000 monthly active users, 500 MB database size per project, 1 GB file storage, 5 GB egress, and 500,000 Edge Function invocations. Free projects may pause after one week of inactivity. Supabase Auth uses JWTs and integrates with Postgres and Row Level Security. Vercel supports backend frameworks and serverless functions, but a serverless deployment must account for function limits, database connection pooling, and the absence of a permanently running process.

## Thinkoria migration map

The current application uses Manus OAuth, a MySQL/TiDB database through Drizzle, Manus tRPC/Express server procedures, Manus S3-backed storage, owner notifications, and existing production records. A Supabase migration would require a new Postgres schema, data export/transform/import, replacement of OAuth/session handling, replacement of storage upload URLs, replacement or reimplementation of tRPC server procedures, notification delivery configuration, and a new admin authorization model. Existing Manus data would not automatically appear in Supabase.

## Recommendation

Keep Manus as the live system of record until a separate Supabase staging project has passed an end-to-end migration test. Do not point Vercel production at a new empty Supabase project. The safest target architecture is Vercel frontend plus a Vercel-compatible backend/API layer connected to Supabase Postgres/Auth/Storage, while the current Manus site remains available for rollback. Migration should use a new database namespace/project, a read-only export from Manus, explicit schema mapping, and feature-by-feature verification before any DNS or production switch.

## Sources

- https://supabase.com/pricing
- https://supabase.com/docs/guides/platform/billing-on-supabase
- https://supabase.com/docs/guides/auth
- https://vercel.com/docs/frameworks/backend
