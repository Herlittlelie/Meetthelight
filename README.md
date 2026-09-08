# Meet the Light — website

Plain static site (HTML + CSS + vanilla JS). No build step, no framework.
Testimonials and events are driven by JSON files so you can update content
without touching the page markup.

## Structure

```
index.html            Main page (shows 2 testimonials + events)
testimonials.html     All testimonials (with privacy note)
data/
  testimonials.json   ← edit to add / change testimonials
  events.json         ← edit to add / change events
assets/
  css/fonts.css       Font @font-face rules (don't need to touch)
  css/styles.css      Base styles + helpers
  js/common.js        Nav + hover effects (shared)
  js/render.js        Card builders + event date logic (shared)
  js/main.js          Homepage logic (FAQ, newsletter, data loading)
  js/testimonials.js  Testimonials-page logic
  fonts/*.woff2       Self-hosted fonts
index.bundled.backup.html   Original one-file export (kept as backup — safe to delete)
```

## Editing testimonials

Edit `data/testimonials.json`. It's a list; add as many as you like:

```json
{
  "quote": "What the person said.",
  "name": "First L.",
  "location": "City, Country",
  "accent": "#ffc44f"
}
```

- The **homepage shows the first 2** in the list.
- `testimonials.html` shows **all** of them.
- `accent` sets the left border / quote-mark colour. Good choices:
  `#ffc44f` (gold), `#a191bf` (lavender), `#b0c9d6` (blue), `#294675` (navy).

## Editing events

Edit `data/events.json`. Events move themselves between **Upcoming** and
**Past** based on today's date — no manual moving needed.

**Upcoming, one-off event** (shown as a full card; becomes a "past" pill
automatically after `endDate` passes):

```json
{
  "title": "Appenzell",
  "location": "Switzerland",
  "badge": "In-Person",
  "startDate": "2026-05-20",
  "endDate": "2026-05-21",
  "venue": "Venue details upon registration",
  "accent": "#ffc44f",
  "theme": "light"
}
```

**Recurring event** (always stays in Upcoming — use `"theme": "dark"` for the
highlighted navy card):

```json
{
  "title": "Online",
  "location": "From anywhere in the world",
  "badge": "Virtual · Weekly",
  "recurring": true,
  "schedule": "Every Tuesday",
  "time": "7:00 p.m. CET",
  "accent": "#ffc44f",
  "theme": "dark"
}
```

**Historic event** (no dates → shown as a "past" pill; `count` is optional):

```json
{ "title": "Brussels Peace Fields", "count": 5 }
```

Dates are `YYYY-MM-DD`. A single-day event can use just `startDate`.

## Running locally

The pages load JSON with `fetch()`, which browsers block on `file://`.
Open the folder with a tiny local server instead:

```
python -m http.server 8000
```

Then visit http://localhost:8000 . (When deployed to Cloudflare/GitHub it
just works — this only matters for local preview.)

## Deploying (GitHub + Cloudflare Pages)

1. Push this folder to a GitHub repo.
2. In Cloudflare Pages, create a project from the repo.
3. Build command: **(none)** — Build output directory: **/** (the root).

Because it's a static site, edits to the JSON files go live on the next push
(or immediately, if you edit them straight in the GitHub web editor).

## Notes

- The newsletter form is **front-end only** — it shows a confirmation but does
  not send the email anywhere yet. Wire it to a service (e.g. a Cloudflare
  Pages Function, Mailchimp, Buttondown) when you're ready to collect signups.
- `index.bundled.backup.html` is the original single-file export. It's kept so
  nothing is lost; you can delete it, or exclude it from deploys.
