# Khmer Festival Collection — Khmer Living Archive

**Curator:** Nang Vannet · ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026

## 1. What this is

The Khmer Festival Collection is a digital archive preserving Cambodia's public festivals and national holidays. Every entry presents stories in both Khmer and English: what the festival is, when it occurs, its rituals, and its origin. The archive relies on community contributions and verified official sources like the Ministry of Cults and Religion, the Ministry of Tourism, and the Royal Palace.

Visitors can freely browse published entries, search records, sign up as contributors, and submit festival entries with photos. Contributors can track their items through moderation, while authorized reviewers manage the approval queue. Khmer text is always first-class and never transliterated or altered.

---

## 2. Who it's for

This app is built specifically for people in Cambodia:

- **Khmer-First UI:** Native rendering using the self-hosted **Kantumruy Pro** font alongside **Inter** for English support.
- **Mobile-First Design:** Optimized and tested on everyday smartphones (like the **Tecno Pova 7**) featuring a responsive bottom navigation bar on mobile and a sidebar on desktop.
- **Slow-Connection Tolerant:** Self-hosted fonts, lightweight assets, progressive loading states, and zero heavy trackers.
- **Rigorous Source Attribution:** Every entry enforces a validated `source` field so that knowledge is always correctly credited.

---

## 3. How it works

**Tech Stack:** Built with **Next.js 15** (App Router, React 19) on **Vercel**, powered by **Supabase** for authentication, public photo storage (`photos` bucket), and PostgreSQL data management.

### Database Schema Overview

| Table Name | Key Columns | Purpose |
| :--- | :--- | :--- |
| **`archive_entries`** | `id`, `owner`, `title_khmer`, `title_english`, `category`, `description_khmer`, `description_english`, `season_or_month`, `source`, `image_path`, `tags`, `status`, `review_note`, `created_at`, `updated_at` | Stores all community-submitted and seed cultural festival entries. |
| **`reviewers`** | `user_id` | Maps authenticated user IDs to reviewer roles. The single source of truth for moderation access. |

### Entry Lifecycle Statuses

- **`pending`** — Newly submitted items waiting for moderator approval.
- **`published`** — Approved items visible on the public home page feed. Any edit by a regular contributor resets the entry back to `pending` for re-moderation (only reviewers can edit a published entry while keeping it `published`).
- **`returned`** — Items sent back with a reviewer feedback note (`review_note`). Editing and resubmitting automatically re-queues them as `pending`.

### Row Level Security (RLS) Policies

- **`select`:** Restricted by database RLS so logged-out (`anon`) visitors can only read `status = 'published'` rows, while owners can read their own entries (`owner = auth.uid()`) and reviewers (`is_reviewer()`) can read pending entries in the moderation queue.
- **`insert`:** Authenticated contributors can insert rows where `owner = auth.uid()`.
- **`update` / `delete`:** Owners can only modify or remove their own records (`owner = auth.uid()`).

---

## 4. Security decisions

- **The Database Gate:** Security is enforced inside Supabase, not just by hiding UI links.
- **`is_reviewer()` RPC:** A server-side PostgreSQL function checks if `auth.uid()` exists in the `reviewers` table before allowing access to the `/review` page or handling edits.
- **`review_entry()` RPC:** Moderation actions (publishing or returning) execute securely inside the database via RPC. Direct client-side tampering or browser console attacks are blocked by RLS policies and server-side checks.

---

## 5. AI use

## 5. AI use

AI tools were used as iterative drafting and debugging partners across three development sprints. Every component, CSS rule, and SQL policy was reviewed line by line, modified where security or UI constraints required, and verified against live user roles.

| Sprint & Model | Specific Tasks Assigned | What Was Kept vs. Rewritten | Verification & Testing Method |
| :--- | :--- | :--- | :--- |
| **Sprint 1**<br>**Claude** (Sonnet 3.5) & **Gemini 3** (Flash 3.5 - Medium Thinking) | • **UI Layout & Theme Prototyping:** Drafted initial responsive card grids, hero headers, and theme splits (`Home.js` + `home.css`).<br>• **Bilingual Card & Search Bug Fixes:** Generated CSS fixes for empty-search dashed containers, fixed-height card rules to prevent layout shifting during EN/KH toggles, and mobile header font scaling.<br>• **Source Attribution Field:** Added bilingual `"Source:"` / `"ប្រភព៖"` metadata lines to `EntryCard.js`. | • **Rejected** full multi-section screenshot redesigns and bright/light theme overhauls that introduced static bloat or broke the dark aesthetic.<br>• **Kept** targeted negative-constraint additions (`EntryCard.js` source footer) and multi-bug CSS layout patches without changes. | Tested across desktop, tablet, and mobile viewports; toggled EN/KH repeatedly to verify zero card stretching or shrinking. |
| **Sprint 2**<br>**Gemini 3** (Flash 3.5 - Medium Thinking) & **Cline AI** (`deepseek/deepseek-v4-flash-latest`) | • **Auth & RLS Policies:** Designed `archive_entries` schema and Supabase Row-Level Security policies for owner-based access (`auth.uid() = owner`).<br>• **Dashboard State & Anti-Double-Click:** Added `e.stopPropagation()` and loading states to edit triggers.<br>• **Khmer IME & Mobile Upload Compression:** Implemented `onCompositionStart` / `onCompositionEnd` handlers for subscript Khmer typing (`ស្តុ`) and client-side canvas image compression. | • **Rewrote** the `INSERT` RLS rule to strictly enforce `owner = auth.uid()` on the database side so clients cannot spoof ownership.<br>• **Rewrote** edit button handlers to immediately set `disabled={true}` on click, preventing double submissions.<br>• **Adjusted** image compression quality from `0.6` up to `0.8` with a max-width cap so mobile photos stay sharp. | Executed SQL policies in Supabase; simulated unauthorized edits via browser DevTools console (verifying empty `data: []` responses were caught); tested Khmer IME search and photo uploads on mobile. |
| **Sprint 3**<br>**Gemini 3** (Flash 3.5 - Medium Thinking) & **Cline AI** (`deepseek/deepseek-v4-flash-latest`) | • **Moderation RPC & Return Notes:** Updated `review_entry` RPC to accept `note` text, built `ReviewReturnDialog.js`, and displayed `review_note` banners on `/my-entries`.<br>• **Review Queue & Grid Fixes:** Built `/review` pending counter, search/sort controls, `ReviewDetailDialog.js`, and `auto-fill` CSS grids so single cards do not stretch.<br>• **Resubmission Tracking:** Added side-by-side `(Submitted): [created_at]` and `(Resubmitted): [updated_at]` timestamps on review cards and detail modals. | • **Rewrote** frontend moderation calls to invoke `supabase.rpc('review_entry')` instead of direct table updates.<br>• **Refactored** inline button styles on `/my-entries` from mixed shorthand/longhand (`border` + `borderColor`) to explicit longhand properties to eliminate React warnings.<br>• **Fixed** modal stacking by raising `ReviewReturnDialog.js` to `zIndex: 90` above `ReviewDetailDialog.js` (`zIndex: 60`), and removed invalid JS comments inside JSX attributes that broke the SWC build. | Verified clean production builds (`npm run build` with exit code 0); tested end-to-end flows across logged-out visitors, contributors, and reviewers. |
---

## 6. Sources and credits

Seed entries in `src/data/entries.js` are credited to official Cambodian institutions:

- **Khmer New Year:** National Committee for Organizing National and International Festivals
- **Pchum Ben:** Ministry of Culture and Fine Arts & Ministry of Cults and Religion
- **Water Festival:** Ministry of Tourism of Cambodia
- **Meak Bochea:** Ministry of Cults and Religion
- **Royal Plowing Ceremony:** Ministry of the Royal Palace
- **King Norodom Sihamoni's Birthday:** Ministry of the Royal Palace & National Committee for Organizing National and International Festivals
- **National Independence Day:** Ministry of Information & National Committee for Organizing National and International Festivals
- **Visak Bochea:** Buddhist Institute of Cambodia & Ministry of Cults and Religion

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
- No secrets anywhere in the repo history: yes, checked with `git log --all --full-history -- ".env*"` and `git log --all -p -S "service_role"` (and `.env*` ignored in `.gitignore`)
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
