# New Zealand Adventure — Trip Itinerary Site

A static travel-itinerary website you can host for free on **GitHub Pages**.
It has a landing page (trip overview, travellers, flights, route map, per-day
summaries) and an internal page for each day, with **dynamic weather** for the
specific trip dates.

Everything is generated from a single source-of-truth file: [`itinerary.md`](./itinerary.md).

## How it works

```
itinerary.md   ──►   node build.js   ──►   docs/   ──►   GitHub Pages
(you edit this)      (generator)           (served)
```

- **`itinerary.md`** — YAML frontmatter holds all trip data. This is the only
  file you normally edit.
- **`build.js`** — reads `itinerary.md` and writes the site into `docs/`.
- **`docs/`** — the generated static site (this is what GitHub Pages serves).
- **Zero runtime dependencies** — the build uses only Node's standard library
  (a tiny YAML parser is bundled in `src/yaml-lite.js`), so no `npm install`
  is needed.

External services used at runtime (client-side, no API keys):
- **Weather:** [Open-Meteo](https://open-meteo.com/) — forecast for near dates,
  historical archive for past dates, and a "same date last year" seasonal
  estimate for dates far in the future.
- **Maps:** [Leaflet](https://leafletjs.com/) + OpenStreetMap / CARTO tiles.

## Update the itinerary

1. Edit [`itinerary.md`](./itinerary.md) (trip details, travellers, flights,
   days, etc.).
2. Rebuild:
   ```bash
   node build.js
   ```
   (or `npm run build`)
3. Commit the changes (including the regenerated `docs/`) and push.

> Tip: Just ask your assistant to "update the site from the itinerary" after
> editing `itinerary.md`, and it will run the build for you.

## Preview locally

```bash
npm run serve      # builds, then serves docs/ at http://localhost:8080
# or:
node serve.js      # serve without rebuilding
```

## Deploy to GitHub Pages

1. Create a repo and push this folder.
2. In the repo: **Settings → Pages**.
3. Set **Source** = *Deploy from a branch*, **Branch** = `main`, **Folder** = `/docs`.
4. Save. Your site publishes at `https://<username>.github.io/<repo>/`.

The `docs/.nojekyll` file is included so GitHub Pages serves the files as-is.

## Adding or removing days

Add or remove entries under `days:` in `itinerary.md`. Each day needs at least:

```yaml
  - day: 8
    date: "2026-11-21"
    title: "New Day Title"
    location:
      name: "Place Name"
      coords: [-45.0, 168.6]   # [latitude, longitude] — drives map + weather
    summary: >
      A short summary sentence.
    highlights:
      - "Thing one"
    schedule:
      - time: "09:00"
        activity: "Do something"
        notes: "Optional note"
    stay:
      name: "Hotel Name"        # use "—" if none (section is hidden)
      area: "Neighbourhood"
```

Re-run `node build.js` and a `day-8.html` page appears automatically, linked
from the landing page and the day-to-day navigation.

## Project structure

```
nz-2026/
├─ itinerary.md        # SOURCE OF TRUTH — edit this
├─ build.js            # generator: itinerary.md -> docs/
├─ serve.js            # local preview server
├─ package.json        # npm scripts (build / serve)
├─ src/
│  ├─ styles.css       # site styles (copied into docs/assets)
│  ├─ app.js           # maps + weather logic (copied into docs/assets)
│  └─ yaml-lite.js     # bundled minimal YAML parser (no deps)
└─ docs/               # GENERATED output served by GitHub Pages
   ├─ index.html
   ├─ day-1.html … day-N.html
   ├─ assets/{styles.css, app.js}
   ├─ data/trip.json
   └─ .nojekyll
```
