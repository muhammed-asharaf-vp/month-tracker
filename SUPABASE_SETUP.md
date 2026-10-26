# Supabase setup for Month Tracker

This app stores the people list in one shared Supabase Postgres table. Every signed-in member can view, add, update, and delete records. The table is not available to signed-out visitors.

## 1. Create and configure Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `supabase/migrations/20261026000100_shared_people.sql`.
3. Disable public sign-ups in the Supabase Auth settings. Add only trusted members under Authentication > Users. The app intentionally has sign-in only; it does not let any visitor create an account.
4. Under Project Settings > API, copy the Project URL and the publishable (or legacy anon) key. Never put the `service_role` secret in the browser app.

The migration enables Row Level Security. Signed-in members share the same list, including permission to edit and delete all rows. The migration also enables Postgres Changes for live updates.

## 2. Configure the app

For local development, copy `.env.example` to `.env.local`, then replace the example values:

```text
VITE_SUPABASE_URL=https://dfmilpjnbiovhunxgxod.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

For Vercel, add the same two values under Project Settings > Environment Variables for the environments you use, then redeploy. The URL and publishable/anon key are browser-visible by design; database access is protected by the SQL grants and RLS policies above.

## Existing browser data

The previous version saved records in each browser's localStorage. This version does not automatically copy those separate lists into Supabase. Keep the old browser data until you have manually added or imported any records you need.