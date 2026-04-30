# Kaam Se Kaam — Notion Integration Setup

## What was added

- `netlify/functions/notion-push.mjs` — a serverless function that proxies
  calls from the app to the Notion API (keeps your token server-side and safe)
- "Send to Notion" / "N" buttons on Tasks (Today + Calendar views), Notes,
  and Reflections — each pushes that item to a Notion database as a new page

---

## One-time setup (takes ~5 minutes)

### Step 1 — Create a Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click **+ New integration**
3. Give it a name (e.g. "Kaam Se Kaam") and select your workspace
4. Copy the **Internal Integration Token** — it starts with `secret_...`

### Step 2 — Create (or choose) a Notion database

This is where pushed items will land. You can use your existing
Monthly Tasks database or create a new one.

The database needs these properties (add any that are missing):

| Property name | Type        |
|---------------|-------------|
| Name          | Title       |
| Type          | Select      |
| Source        | Select      |
| Date          | Date        |
| Category      | Rich text   |

### Step 3 — Connect the integration to your database

1. Open the database in Notion
2. Click **...** (top right) → **Connections** → add your integration

### Step 4 — Get your Database ID

Open the database in your browser. The URL looks like:
```
https://www.notion.so/your-workspace/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX?v=...
```
The 32-character string before the `?` is your Database ID.

### Step 5 — Set environment variables in Netlify

1. Go to your Netlify site dashboard
2. **Site configuration → Environment variables → Add variable**
3. Add these two:

| Key                  | Value                          |
|----------------------|--------------------------------|
| `NOTION_TOKEN`       | `secret_...` (from Step 1)     |
| `NOTION_DATABASE_ID` | your 32-char database ID       |

### Step 6 — Deploy

**Option A — Drag and drop (same as before):**
1. Run `npm install && npm run build` in the project folder
2. Drag the `dist/` folder into Netlify Drop

**Option B — Connect to GitHub (recommended for future updates):**
1. Push this project to a GitHub repo
2. In Netlify: **Add new site → Import an existing project → GitHub**
3. Select the repo — Netlify will auto-detect the build settings from `netlify.toml`
4. Future pushes to `main` will auto-deploy

---

## How the buttons work

| Where              | Button  | What it sends                             |
|--------------------|---------|-------------------------------------------|
| Today view tasks   | **N**   | Task name, category, date                 |
| Calendar view tasks| **N**   | Task name, category, date                 |
| Notes editor       | **Send to Notion** | Note title + full content    |
| Reflection modal   | **Send to Notion** | Both reflection fields as page body |

The button turns green and shows **✓ Sent** for 3 seconds on success.
Nothing in the app changes — items stay in localStorage as normal.
