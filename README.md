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

AI tools helped draft code and fix bugs across three sprints. Every suggestion was checked, improved when needed, and tested with real user accounts before keeping it.

| Sprint & AI Model | Tasks Given to AI (Prompt Summary) | What Was Kept vs. Changed | How It Was Tested |
| :--- | :--- | :--- | :--- |
| **Sprint 1**<br>*Gemini 3.6 Flash* (writing prompts)<br>*Claude Sonnet 5* (writing code) | • **Entry 1 (Image Reference):** Asked for a full website redesign based on a sample screenshot with a Khmer New Year hero banner.<br>• **Entry 2 (Code Split & Light Theme):** Split the page code and CSS into separate files and tested switching to a bright white theme.<br>• **Entry 3 (Bug Batch Fix):** Fixed unstyled empty-search boxes, cards changing size when switching languages, and oversized mobile header text.<br>• **Entry 4 (Targeted Addition):** Added a bilingual `"Source:"` / `"ប្រភព៖"` line to the bottom of entry cards without changing the dark theme. | • **Rejected** the screenshot redesign (too many fake static sections) and the light theme (looked too plain compared to the dark theme).<br>• **Kept** the card sizing fixes, smaller mobile header text, and the new source line as given. | Checked on phone, tablet, and laptop screens; switched between English and Khmer repeatedly to make sure cards stayed the same size. |
| **Sprint 2**<br>*Gemini 3.6 Flash* (reading lab & writing prompts)<br>*Cline — DeepSeek V4 Flash* (writing code) | • **Entry 1 (Access Rules):** Set up user sign-up/login and database rules so users can only edit or delete their own posts.<br>• **Entry 2 (Button Lag & Loading):** Fixed slow edit buttons that needed multiple clicks and added loading spinners.<br>• **Entry 3 (Khmer Typing & Photos):** Fixed Khmer subscript letters breaking in the search bar and added photo compression for mobile uploads. | • **Changed** the database insert rule to automatically lock posts to the logged-in user so nobody can fake ownership.<br>• **Updated** edit buttons to lock immediately when clicked so users cannot submit twice.<br>• **Adjusted** photo compression quality from `0.6` to `0.8` so mobile photos stay clear and sharp. | Tried editing another user's post through the browser console to confirm it gets blocked; tested Khmer typing and photo uploads on a phone. |
| **Sprint 3**<br>*Gemini 3.6 Flash* (reading lab & writing prompts)<br>*Cline — DeepSeek V4 Flash* (writing code) | • **Entry 1 (Feedback Notes):** Added a pop-up box for reviewers to write feedback when returning a post, and showed those notes to the author.<br>• **Entry 2 (Grid Layout & Details):** Fixed single cards from stretching too wide, added a pending post counter, and created a full-details pop-up.<br>• **Entry 3 (Resubmission Dates):** Displayed both the original submitted date and the updated resubmitted date on review cards. | • **Changed** approval and return buttons to run safely through a secure database function instead of direct edits.<br>• **Fixed** pop-up layering so the feedback box appears on top of the details window.<br>• **Removed** a bad code comment that broke the build, and cleaned up button border warnings. | Ran a full build check with zero errors; tested every feature while logged out, as a regular contributor, and as a reviewer. |

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

_Note on Photography:_ All the images from this project are generated via **Google Stitch AI**

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
