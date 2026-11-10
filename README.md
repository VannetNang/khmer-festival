# Khmer Festival Collection — Khmer Living Archive

**Curator:** Nang Vannet · ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026

## 1. What this is

The Khmer Festival Collection is a digital archive preserving Cambodia's public festivals and national holidays. Every entry presents stories in both Khmer and English: what the festival is, when it occurs, its rituals, and its origin. The archive relies on community contributions and verified official sources like the Ministry of Cults and Religion, the Ministry of Tourism, and the Royal Palace.

Visitors can freely browse published entries, search records, sign up as contributors, and submit festival entries with photos. Contributors can track their items through moderation, while authorized reviewers manage the approval queue. Khmer text is always first-class and never transliterated or altered.

---

## 2. Who it's for

This app is built specifically for people in Cambodia:

- **Khmer-First UI:** Native rendering using the **Kantomruy Pro** font alongside English support.
- **Mobile-First Design:** Optimized and tested on everyday smartphones (like the **Tecno Pova 7**) featuring a responsive bottom navigation bar on mobile and a sidebar on desktop.
- **Slow-Connection Tolerant:** Self-hosted fonts, lightweight assets, progressive loading states, and zero heavy trackers.
- **Rigorous Source Attribution:** Every entry enforces a validated `source` field so that knowledge is always correctly credited.

---

## 3. How it works

**Tech Stack:** Built with **Next.js 15** (App Router, React 19) on **Vercel**, powered by **Supabase** for authentication, public photo storage (`photos` bucket), and PostgreSQL data management.

### Database Schema Overview

| Table Name | Key Columns | Purpose |
| :--- | :--- | :--- |
| **`archive_entries`** | `id`, `owner`, `title_khmer`, `title_english`, `category`, `description_khmer`, `description_english`, `season_or_month`, `source`, `image_path`, `status`, `review_note`, `created_at`, `updated_at` | Stores all community-submitted and seed cultural festival entries. |
| **`reviewers`** | `user_id` | Maps authenticated user IDs to reviewer roles. The single source of truth for moderation access. |

### Entry Lifecycle Statuses

- **`pending`** — Newly submitted items waiting for moderator approval.
- **`published`** — Approved items visible on the public home page feed.
- **`returned`** — Items sent back with a reviewer feedback note (`review_note`). Resubmitting automatically re-queues them as `pending`.

### Row Level Security (RLS) Policies

- **`select`:** Publicly viewable for published feeds (`using (true)` in DB; filtered by app queries).
- **`insert`:** Authenticated contributors can insert rows where `owner = auth.uid()`.
- **`update` / `delete`:** Owners can only modify or remove their own records.

---

## 4. Security decisions

- **The Database Gate:** Security is enforced inside Supabase, not just by hiding UI links.
- **`is_reviewer()` RPC:** A server-side PostgreSQL function checks if `auth.uid()` exists in the `reviewers` table before allowing access to the `/review` page or handling edits.
- **`review_entry()` RPC:** Moderation actions (publishing or returning) execute securely inside the database via RPC. Direct client-side tampering or browser console attacks are blocked by RLS policies and server-side checks.

---

## 5. AI use

| Model & Tool                                       | Task Assigned                                                        | What Was Kept vs. Rewritten                                                                            | Verification & Testing Method                                                                        |
| :------------------------------------------------- | :------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Gemini 3** (Medium Thinking)                     | SQL database design, RLS policies, and RPC security functions.       | Kept core SQL architecture; manually refined fallback logic and post-update row verification checks.   | Tested in Supabase SQL editor and verified via end-to-end user and stranger simulation scripts.      |
| **Cline AI** (`deepseek/deepseek-v4-flash-latest`) | Frontend React components, page scaffolding, and responsive layouts. | Kept UI markup structure; refactored inline style shorthand/longhand conflicts and JSX comment syntax. | Tested locally (`npm run build`) and verified across logged-out, contributor, and reviewer accounts. |

---

## 6. Sources and credits

Seed entries in `src/data/entries.js` are credited to official Cambodian institutions:

- **Khmer New Year:** National Committee for Organizing National and International Festivals
- **Pchum Ben:** Ministry of Culture and Fine Arts & Ministry of Cults and Religion
- **Water Festival:** Ministry of Tourism of Cambodia
- **Meak Bochea:** Ministry of Cults and Religion
- **Royal Plowing Ceremony & King's Birthday:** Ministry of the Royal Palace
- **National Independence Day:** Ministry of Information
- **Visak Bochea:** Buddhist Institute of Cambodia

_Note on Photography:_ Featured visual imagery is generated via **Google Stitch AI** under verified project permissions.

---

## 7. Running it locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/VannetNang/khmer-festival.git
   cd khmer-festival
   ```

2. **Install dependencies** (only `next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr`)

   ```bash
   npm install
   ```

3. **Create `.env.local`** in the project root with the two required variable names (get the values from your Supabase dashboard → Project Settings → API):

   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

   No other environment variables are required. Note: the anon key is a **public, publishable key by design** — it is safe to expose in the browser because all authorization is enforced server-side by RLS and the RPCs, not by key secrecy. A `service_role` key or any other secret never belongs in this repo.

4. **Provision the database** — paste `src/lib/supabase/schema.sql` into Supabase → SQL Editor → Run (safe to run more than once), then apply the review additions (the `status`/`review_note` columns, `reviewers` table, `is_reviewer`, and `review_entry`) in the same SQL editor. Create a public `photos` storage bucket limited to JPEG/PNG/WebP and 5 MB.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Open http://localhost:3000. For production, push to GitHub and import the repo on [vercel.com](https://vercel.com), adding the same two environment variables there.

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: yes, (https://khmer-festival-beta.vercel.app/)
- A stranger cannot publish their own entry through the page or the console: yes, tested (November 6, 2026)
- Logged out, the API returns nothing pending or returned: yes, tested (November 6, 2026)
- Contributors can edit and delete only their own entries: yes
- No secrets anywhere in the repo history: yes, checked with (how)
- At least eight real entries, each with a credited source: yes, (8 entries + community contributions)
- Khmer renders on every screen a user meets, including the queue: yes
- Works at phone width: yes, Tecno Pova 7 and mobile viewports (375px–430px)
- No test entries, lorem ipsum or TODO comments in shipped pages: yes
- No console errors on the main pages: yes
- jesseorndorff is a collaborator on this repo: yes
- Supabase project restored and awake on (November 10, 2026)
- Demo video link opens in a private window: not yet, (link)
- Reflection pasted in the Canvas submission: not yet
- Posted in the Show Your Archive discussion: not yet
- Q&A slot booked for (date and time) not yet
