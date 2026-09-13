#!/usr/bin/env node
/*
 * build.js — Static site generator for the travel itinerary.
 * ---------------------------------------------------------------------------
 * Reads `itinerary.md` (YAML frontmatter = single source of truth) and writes
 * a static website into `docs/`, ready for GitHub Pages.
 *
 * Usage:
 *   node build.js          # regenerate the whole site
 *   npm run build          # same thing
 *
 * Output:
 *   docs/index.html        # landing page
 *   docs/day-N.html        # one page per itinerary day
 *   docs/assets/styles.css # shared styles
 *   docs/assets/app.js     # map + weather logic
 *   docs/data/trip.json    # machine-readable trip data (used by app.js)
 *   docs/.nojekyll         # tell GitHub Pages not to run Jekyll
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { parseYaml } = require('./src/yaml-lite');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'itinerary.md');
const OUT = path.join(ROOT, 'docs');
const ASSETS = path.join(OUT, 'assets');
const DATA = path.join(OUT, 'data');
const STATIC = path.join(ROOT, 'src', 'assets-static'); // copied verbatim to docs/assets

/* --------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------ */

/** Read the YAML frontmatter block from a markdown file. */
function parseFrontmatter(md) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error('itinerary.md is missing its YAML frontmatter (--- ... ---).');
  }
  return parseYaml(match[1]);
}

/** Escape a string for safe insertion into HTML text/attributes. */
function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Small "to be confirmed" badge. */
function tbcBadge(extraClass) {
  return `<span class="tbc-badge${extraClass ? ' ' + extraClass : ''}" title="This item is not yet confirmed">TBC</span>`;
}

/** True if a day has any unconfirmed (tbc) items. */
function dayHasTbc(d) {
  const inList = (arr) => (arr || []).some((x) => x && x.tbc);
  return Boolean(d.tbc) || inList(d.schedule) || inList(d.highlights) || inList(d.otherActivities);
}

/** Count of unconfirmed schedule items on a day. */
function tbcCount(d) {
  return (d.schedule || []).filter((s) => s && s.tbc).length;
}

/** Format an ISO date (YYYY-MM-DD) into a friendly long form. */
function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Break an ISO date into calendar-tile parts: weekday, day, month, year. */
function dateParts(iso) {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return { weekday: '', day: iso, month: '', year: '' };
  return {
    weekday: d.toLocaleDateString('en-AU', { weekday: 'short' }),
    day: d.toLocaleDateString('en-AU', { day: 'numeric' }),
    month: d.toLocaleDateString('en-AU', { month: 'short' }),
    year: d.toLocaleDateString('en-AU', { year: 'numeric' }),
  };
}

/** Short date like "Sat 14 Nov". */
function formatShort(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/** Whole-day count between two ISO dates, inclusive. */
function dayCount(startIso, endIso) {
  const a = new Date(startIso + 'T00:00:00');
  const b = new Date(endIso + 'T00:00:00');
  if (isNaN(a) || isNaN(b)) return null;
  return Math.round((b - a) / 86400000) + 1;
}

function ensureDirs() {
  for (const dir of [OUT, ASSETS, DATA]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/* --------------------------------------------------------------------------
 * Shared HTML chunks
 * ------------------------------------------------------------------------ */

// A crisp SVG favicon (skier on a slope) embedded as a data URI — no file needed.
const FAVICON_SVG =
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>` +
  `<rect width='64' height='64' rx='14' fill='%232b7fc4'/>` +
  `<path d='M4 46 L60 30' stroke='%23ffffff' stroke-width='4' stroke-linecap='round' opacity='0.9'/>` +
  `<circle cx='40' cy='15' r='5' fill='%23e0ff98'/>` +
  `<path d='M38 21 L33 33 L41 40' stroke='%23e0ff98' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' fill='none'/>` +
  `<path d='M33 33 L45 30' stroke='%23e0ff98' stroke-width='4' stroke-linecap='round'/>` +
  `<path d='M20 44 L52 34' stroke='%23e04a5f' stroke-width='3.5' stroke-linecap='round'/>` +
  `</svg>`;
const FAVICON_HREF = `data:image/svg+xml,${FAVICON_SVG}`;

function head(title, opts = {}) {
  const desc = opts.description || '';
  const url = opts.url || '';
  const image = opts.image || '';
  const social = [
    desc ? `<meta name="description" content="${esc(desc)}" />` : '',
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    desc ? `<meta property="og:description" content="${esc(desc)}" />` : '',
    url ? `<meta property="og:url" content="${esc(url)}" />` : '',
    image ? `<meta property="og:image" content="${esc(image)}" />` : '',
    `<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    desc ? `<meta name="twitter:description" content="${esc(desc)}" />` : '',
    image ? `<meta name="twitter:image" content="${esc(image)}" />` : '',
  ].filter(Boolean).join('\n  ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <link rel="icon" type="image/svg+xml" href="${FAVICON_HREF}" />
  ${social}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <link rel="stylesheet" href="assets/styles.css" />
</head>`;
}

function homeButton(variant) {
  return `
  <a class="home-btn${variant ? ' home-btn--' + variant : ''}" href="index.html" aria-label="Home" title="Home">
    <svg class="home-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  </a>`;
}

function footer(trip) {
  return `
  <footer class="footer">
    <a class="footer__gh" href="https://github.com/semaj-jing/2026-jz-trip-nz" target="_blank" rel="noopener" aria-label="View this project on GitHub">
      <svg class="footer__gh-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.575.106.785-.25.785-.556 0-.274-.01-1-.015-1.965-3.196.695-3.87-1.54-3.87-1.54-.523-1.33-1.277-1.685-1.277-1.685-1.044-.714.08-.699.08-.699 1.154.081 1.762 1.185 1.762 1.185 1.026 1.758 2.692 1.25 3.348.956.104-.743.401-1.25.73-1.538-2.552-.29-5.235-1.276-5.235-5.68 0-1.255.448-2.28 1.184-3.084-.119-.29-.513-1.46.112-3.043 0 0 .966-.31 3.166 1.178a10.98 10.98 0 0 1 2.882-.388c.978.004 1.963.132 2.882.388 2.199-1.488 3.163-1.178 3.163-1.178.627 1.583.233 2.753.114 3.043.738.804 1.183 1.829 1.183 3.084 0 4.415-2.687 5.386-5.247 5.67.412.355.78 1.056.78 2.13 0 1.538-.014 2.777-.014 3.155 0 .309.207.667.79.554A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"/>
      </svg>
    </a>
    <p>${esc(trip.title)} · ${esc(formatShort(trip.startDate))}–${esc(formatShort(trip.endDate))}</p>
    <p class="footer__muted">Weather via <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a> · Map tiles © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors</p>
  </footer>`;
}

/** Giscus (GitHub Discussions) comments embed. Renders only when configured. */
function giscusEmbed(trip) {
  const g = trip.giscus;
  if (!g || !g.repo || !g.repoId || !g.categoryId) return '';
  return `
    <section class="panel comments" id="comments">
      <h2 class="section-title">Comments</h2>
      <p class="section-lead">Leave a note for this day — sign in with GitHub to comment.</p>
      <div class="giscus"></div>
      <script src="https://giscus.app/client.js"
        data-repo="${esc(g.repo)}"
        data-repo-id="${esc(g.repoId)}"
        data-category="${esc(g.category || '')}"
        data-category-id="${esc(g.categoryId)}"
        data-mapping="${esc(g.mapping || 'pathname')}"
        data-strict="${esc(g.strict || '0')}"
        data-reactions-enabled="${esc(g.reactionsEnabled != null ? g.reactionsEnabled : '1')}"
        data-emit-metadata="0"
        data-input-position="${esc(g.inputPosition || 'bottom')}"
        data-theme="${esc(g.theme || 'light')}"
        data-lang="${esc(g.lang || 'en')}"
        crossorigin="anonymous"
        async>
      </script>
    </section>`;
}

function scripts(page) {
  return `
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <script src="assets/app.js"></script>
  <script>document.addEventListener('DOMContentLoaded', function () { window.TripSite && TripSite.init(${JSON.stringify(page)}); });</script>
  </body>
</html>`;
}

/* --------------------------------------------------------------------------
 * Landing page
 * ------------------------------------------------------------------------ */

function renderIndex(trip, days) {
  const startCal = dateParts(trip.startDate);
  const endCal = dateParts(trip.endDate);

  const travelerCards = (trip.travelers || [])
    .map(
      (t) => {
        const display = (t.nickname || t.name || '').trim();
        return `
        <li class="traveler">
          ${
            t.avatar
              ? `<img class="traveler__avatar traveler__avatar--img" src="${esc(t.avatar)}" alt="${esc(display)}" />`
              : `<span class="traveler__avatar" aria-hidden="true">${esc((display || '?').charAt(0))}</span>`
          }
          <span class="traveler__name" title="${esc(t.name || '')}">${esc(display)}</span>
        </li>`;
      }
    )
    .join('');

  const flightRows = (trip.flights || [])
    .map(
      (f) => `
        <div class="flight-card">
          <div class="flight-card__type">${esc(f.type)}</div>
          <div class="flight-card__route">
            <div class="flight-card__endpoint">
              <span class="flight-card__code">${esc(f.from)}</span>
              <span class="flight-card__time">${esc(f.departure)}</span>
            </div>
            <div class="flight-card__plane" aria-hidden="true">✈</div>
            <div class="flight-card__endpoint flight-card__endpoint--to">
              <span class="flight-card__code">${esc(f.to)}</span>
              <span class="flight-card__time">${esc(f.arrival)}</span>
            </div>
          </div>
          <div class="flight-card__details">
            <span>${esc(f.airline)} ${esc(f.flightNumber)}</span>
            <span class="flight-card__conf">Conf: ${esc(f.confirmation || '—')}</span>
          </div>
        </div>`
    )
    .join('');

  const essentials = (trip.essentials || [])
    .map(
      (e) => `
        <div class="essential">
          <dt>${esc(e.label)}</dt>
          <dd>${esc(e.value)}</dd>
        </div>`
    )
    .join('');

  const dayCards = days
    .map(
      (d) => {
        const marks = (d.landmarks && d.landmarks.length)
          ? d.landmarks
          : [d.location && d.location.name].filter(Boolean);
        const markChips = marks
          .map((m) => `<span class="day-card__landmark">📍 ${esc(m)}</span>`)
          .join('');
        return `
        <li class="day-item">
          <a class="day-card" href="day-${d.day}.html">
            <div class="day-card__header">
              <div class="day-card__headings">
                <span class="day-card__num">Day ${d.day}</span>
                <h3 class="day-card__title">${esc(d.title)}</h3>
                <span class="day-card__date">${dayHasTbc(d) ? tbcBadge('tbc-badge--sm') + ' ' : ''}${esc(formatShort(d.date))}</span>
              </div>
              <div class="day-card__aside">
                <div class="day-card__weather" data-weather-badge data-lat="${esc(d.location.coords[0])}" data-lon="${esc(d.location.coords[1])}" data-date="${esc(d.date)}">
                  <span class="weather-badge__loading">Loading weather…</span>
                </div>
                <span class="day-card__go">View day →</span>
              </div>
            </div>
            <div class="day-card__body">
              <p class="day-card__summary">${esc((d.summary || '').trim())}</p>
              ${markChips ? `<div class="day-card__landmarks">${markChips}</div>` : ''}
            </div>
          </a>
        </li>`;
      }
    )
    .join('');

  const shareImg = trip.siteUrl ? `${trip.siteUrl.replace(/\/$/, '')}/assets/snowboard-bg.jpg` : 'assets/snowboard-bg.jpg';
  return `${head(trip.title, {
    description: trip.tagline || (trip.summary || '').trim(),
    url: trip.siteUrl || '',
    image: shareImg,
  })}
<body>
  ${homeButton()}

  <section class="hero">
    <img class="hero__photo" src="assets/snowboard-bg.jpg" alt="" aria-hidden="true" />
    <div class="hero__inner">
      <div class="hero__content">
        <div class="hero__dates">
          <div class="cal-tile" aria-label="Trip start ${esc(formatDate(trip.startDate))}">
            <span class="cal-tile__weekday">${esc(startCal.weekday)}</span>
            <span class="cal-tile__day">${esc(startCal.day)}</span>
            <span class="cal-tile__month">${esc(startCal.month)} ${esc(startCal.year)}</span>
          </div>
          <span class="hero__dates-arrow" aria-hidden="true">→</span>
          <div class="cal-tile" aria-label="Trip end ${esc(formatDate(trip.endDate))}">
            <span class="cal-tile__weekday">${esc(endCal.weekday)}</span>
            <span class="cal-tile__day">${esc(endCal.day)}</span>
            <span class="cal-tile__month">${esc(endCal.month)} ${esc(endCal.year)}</span>
          </div>
        </div>
        <h1 class="hero__title">${esc(trip.title)}</h1>
        ${trip.subtitle ? `<p class="hero__subtitle">${esc(trip.subtitle)}</p>` : ''}
        <p class="hero__summary">${esc((trip.summary || '').trim())}</p>
        <ul class="travelers travelers--hero">${travelerCards}</ul>
      </div>
    </div>
  </section>

  <main class="container">
    <section class="panel" id="map">
      <h2 class="section-title">Places We'll Visit</h2>
      <p class="section-lead">A few highlights along the way — tap a marker to see what it is.</p>
      <div id="route-map" class="route-map"></div>
    </section>

    <section class="panel" id="itinerary">
      <h2 class="section-title">Day-by-Day</h2>
      <p class="section-lead">A quick summary of each day. Click through for the full breakdown.</p>
      <ul class="day-list">${dayCards}</ul>
    </section>

    <section class="panel" id="flights">
      <h2 class="section-title">Flights</h2>
      <div class="flights">${flightRows}</div>
    </section>
  </main>

  ${footer(trip)}
  ${scripts({ type: 'index', mapCenter: trip.mapCenter, mapZoom: trip.mapZoom })}`;
}

/* --------------------------------------------------------------------------
 * Day page
 * ------------------------------------------------------------------------ */

/** Build a bare carousel (no panel wrapper). `opts.variant` adds a modifier. */
function renderCarousel(gallery, altText, opts) {
  opts = opts || {};
  if (!gallery.length) return '';
  const variant = opts.variant ? ` carousel--${opts.variant}` : '';
  const autoplay = opts.autoplay !== false && gallery.length > 1;

  const slides = gallery
    .map(
      (g, i) => `
            <figure class="carousel__slide${i === 0 ? ' is-active' : ''}" data-slide="${i}" role="group" aria-roledescription="slide" aria-label="Image ${i + 1} of ${gallery.length}">
              <img class="carousel__img" src="${esc(g.src)}" alt="${esc(g.caption || altText || '')}" loading="lazy" />
              <figcaption class="carousel__caption">
                <span class="carousel__caption-text">${esc((g.caption || '').trim())}</span>
                ${g.credit ? `<span class="carousel__credit">${esc(g.credit)}</span>` : ''}
              </figcaption>
            </figure>`
    )
    .join('');

  const dots = gallery
    .map(
      (_, i) =>
        `<button class="carousel__dot${i === 0 ? ' is-active' : ''}" type="button" data-goto="${i}" aria-label="Go to image ${i + 1}"></button>`
    )
    .join('');

  // Single-image galleries don't need controls.
  const controls =
    gallery.length > 1
      ? `
          <button class="carousel__btn carousel__btn--prev" type="button" data-dir="-1" aria-label="Previous image">‹</button>
          <button class="carousel__btn carousel__btn--next" type="button" data-dir="1" aria-label="Next image">›</button>
          <div class="carousel__dots" role="tablist">${dots}</div>
          <div class="carousel__counter"><span data-carousel-index>1</span> / ${gallery.length}</div>`
      : '';

  return `<div class="carousel${variant}" data-carousel${autoplay ? ' data-autoplay="6000"' : ''}>
            <div class="carousel__viewport">${slides}</div>
            ${controls}
          </div>`;
}

/** Build the gallery carousel markup for a day (or '' if no images). */
function renderGallery(gallery, d) {
  if (!gallery.length) return '';
  return `
        <section class="panel panel--gallery">
          ${renderCarousel(gallery, d.title)}
        </section>`;
}

/**
 * A "filmstrip" carousel that shows multiple images per view (3 on desktop,
 * fewer on smaller screens via CSS) and slides one image at a time. Used for
 * the day page's top gallery aggregating all the day's activity images.
 */
function renderFilmstrip(images, altText) {
  if (!images.length) return '';

  const slides = images
    .map(
      (g, i) => `
            <figure class="filmstrip__slide" data-slide="${i}">
              <img class="filmstrip__img" src="${esc(g.src)}" alt="${esc(g.caption || altText || '')}" loading="lazy" />
              ${
                g.caption || g.credit
                  ? `<figcaption class="filmstrip__caption">
                       ${g.caption ? `<span class="filmstrip__caption-text">${esc((g.caption || '').trim())}</span>` : ''}
                       ${g.credit ? `<span class="filmstrip__credit">${esc(g.credit)}</span>` : ''}
                     </figcaption>`
                  : ''
              }
            </figure>`
    )
    .join('');

  const controls =
    images.length > 1
      ? `
          <button class="filmstrip__btn filmstrip__btn--prev" type="button" data-dir="-1" aria-label="Previous images">‹</button>
          <button class="filmstrip__btn filmstrip__btn--next" type="button" data-dir="1" aria-label="Next images">›</button>`
      : '';

  return `<div class="filmstrip" data-filmstrip>
            <div class="filmstrip__viewport">
              <div class="filmstrip__track">${slides}</div>
            </div>
            ${controls}
          </div>`;
}

/**
 * Collect every image for a day into a single de-duplicated list:
 * the day-level gallery first, then each schedule item's gallery (in order).
 * Used to feed the top 3-pane filmstrip.
 */
function collectDayImages(d) {
  const out = [];
  const seen = new Set();
  const push = (arr) => {
    (arr || []).forEach((g) => {
      if (g && g.src && !seen.has(g.src)) {
        seen.add(g.src);
        out.push(g);
      }
    });
  };
  push(d.gallery);
  (d.schedule || []).forEach((s) => push(s.gallery));
  return out;
}

function renderDay(trip, days, index) {
  const d = days[index];
  const prev = days[index - 1];
  const next = days[index + 1];

  // Build map "stops" from schedule items that have coordinates, and number
  // them so each timeline row corresponds to a numbered node on the day map.
  const stops = [];
  const scheduleItems = d.schedule || [];
  scheduleItems.forEach((s) => {
    if (Array.isArray(s.coords) && s.coords.length === 2) {
      stops.push({
        n: stops.length + 1,
        coords: s.coords,
        time: s.time || '',
        activity: s.activity || '',
        tbc: Boolean(s.tbc),
      });
      s._stopNum = stops.length; // annotate for the timeline marker
    }
  });

  let altPopoverId = 0;
  const schedule = scheduleItems
    .map(
      (s) => {
        const clickable = s._stopNum
          ? ` timeline__item--clickable" data-stop="${s._stopNum}" data-lat="${esc(s.coords[0])}" data-lon="${esc(s.coords[1])}" role="button" tabindex="0" aria-label="Show ${esc(s.activity || 'this stop')} on the map`
          : '';

        // Small gallery attached below this schedule item.
        const itemGallery = (s.gallery && s.gallery.length)
          ? `<div class="timeline__gallery">${renderCarousel(s.gallery, s.activity, { variant: 'compact' })}</div>`
          : '';

        // "Alternatives" chip -> click-to-open popover with gallery.
        let altBlock = '';
        if (s.alternatives && s.alternatives.length) {
          const pid = `alt-pop-${d.day}-${++altPopoverId}`;
          const altList = s.alternatives
            .map(
              (a) => `
                  <li class="altpop__item">
                    <h4 class="altpop__title">${esc(a.title)}</h4>
                    ${a.gallery && a.gallery.length ? `<div class="altpop__gallery">${renderCarousel(a.gallery, a.title, { variant: 'compact' })}</div>` : ''}
                    ${a.description ? `<p class="altpop__desc">${esc((a.description || '').trim())}</p>` : ''}
                  </li>`
            )
            .join('');
          altBlock = `
            <div class="altwrap" data-altwrap>
              <button type="button" class="altchip" data-altbtn aria-expanded="false" aria-controls="${pid}">
                <span class="altchip__icon" aria-hidden="true">🔀</span>
                Alternatives
                <span class="altchip__count">${s.alternatives.length}</span>
              </button>
              <div class="altpop" id="${pid}" data-altpop hidden>
                <div class="altpop__head">
                  <span class="altpop__heading">Alternatives for ${esc(s.activity || 'this stop')}</span>
                  <button type="button" class="altpop__close" data-altclose aria-label="Close">×</button>
                </div>
                <ul class="altpop__list">${altList}</ul>
              </div>
            </div>`;
        }

        return `
        <li class="timeline__item${s.tbc ? ' is-tbc' : ''}${clickable}">
          <span class="timeline__time">${esc(s.time || '')}</span>
          <div class="timeline__body">
            ${s._stopNum ? `<span class="timeline__node" title="Stop ${s._stopNum} on the map">${s._stopNum}</span>` : ''}
            <span class="timeline__activity">${esc(s.activity || '')}${s.tbc ? ' ' + tbcBadge() : ''}</span>
            ${s.desc ? `<span class="timeline__desc">${esc((s.desc || '').trim())}</span>` : ''}
            ${s.notes ? `<span class="timeline__notes">${esc(s.notes)}</span>` : ''}
            ${altBlock}
            ${s._stopNum ? `<span class="timeline__locate" aria-hidden="true">📍 Show on map</span>` : ''}
            ${itemGallery}
          </div>
        </li>`;
      }
    )
    .join('');

  const highlights = (d.highlights || [])
    .map((h) => {
      // A highlight can be a plain string or an object { text, tbc }.
      const text = typeof h === 'object' && h !== null ? h.text : h;
      const isTbc = typeof h === 'object' && h !== null && h.tbc;
      return `<li${isTbc ? ' class="is-tbc"' : ''}>${esc(text)}${isTbc ? ' ' + tbcBadge() : ''}</li>`;
    })
    .join('');

  // Header background: a full-bleed carousel of all the day's images
  // (day-level gallery + every schedule item's gallery), shown behind the
  // day-hero content. One image at a time, auto-advancing.
  const dayImages = collectDayImages(d);
  const heroCarousel = dayImages.length
    ? `<div class="day-hero__bg">${renderCarousel(dayImages, d.title, { variant: 'hero' })}</div>`
    : '';
  const gallerySection = ''; // gallery now lives in the hero background

  // Bottom section repurposed as "Other Activities" — optional extras for the
  // day/area that aren't tied to a specific schedule slot.
  const otherActivities = d.otherActivities || [];
  const otherItems = otherActivities
    .map(
      (a) => `
          <li class="alt${a.tbc ? ' is-tbc' : ''}">
            <h3 class="alt__title">${esc(a.title)}${a.tbc ? ' ' + tbcBadge() : ''}</h3>
            ${
              a.gallery && a.gallery.length
                ? `<div class="alt__gallery">${renderCarousel(a.gallery, a.title, { variant: 'compact' })}</div>`
                : ''
            }
            ${a.description ? `<p class="alt__desc">${esc((a.description || '').trim())}</p>` : ''}
            ${
              a.impact
                ? `<p class="alt__impact"><span class="alt__impact-label">Good to know</span>${esc((a.impact || '').trim())}</p>`
                : ''
            }
          </li>`
    )
    .join('');

  const alternativesSection = otherActivities.length
    ? `
        <section class="panel">
          <details class="alts" open>
            <summary class="alts__summary">
              <span class="alts__summary-text">
                <span class="alts__icon" aria-hidden="true">✨</span>
                Other Activities
                <span class="alts__count">${otherActivities.length}</span>
              </span>
              <span class="alts__chevron" aria-hidden="true">▾</span>
            </summary>
            <p class="alts__lead">Optional extras around ${esc(d.location && d.location.name || 'the area')} if you have time or want to swap something out.</p>
            <ul class="alts__list">${otherItems}</ul>
          </details>
        </section>`
    : '';

  // Full-size bottom nav links.
  const prevLink = prev
    ? `<a class="daynav__link" href="day-${prev.day}.html">← Day ${prev.day}: ${esc(prev.title)}</a>`
    : `<a class="daynav__link" href="index.html">← Overview</a>`;
  const nextLink = next
    ? `<a class="daynav__link daynav__link--next" href="day-${next.day}.html">Day ${next.day}: ${esc(next.title)} →</a>`
    : `<a class="daynav__link daynav__link--next" href="index.html">Overview →</a>`;

  // Compact top nav (icon + short label).
  const prevTop = prev
    ? `<a class="daynav-top__link" href="day-${prev.day}.html" title="Day ${prev.day}: ${esc(prev.title)}"><span class="daynav-top__arrow">←</span><span class="daynav-top__text">Day ${prev.day}</span></a>`
    : `<a class="daynav-top__link" href="index.html" title="Overview"><span class="daynav-top__arrow">←</span><span class="daynav-top__text">Overview</span></a>`;
  const nextTop = next
    ? `<a class="daynav-top__link daynav-top__link--next" href="day-${next.day}.html" title="Day ${next.day}: ${esc(next.title)}"><span class="daynav-top__text">Day ${next.day}</span><span class="daynav-top__arrow">→</span></a>`
    : `<a class="daynav-top__link daynav-top__link--next" href="index.html" title="Overview"><span class="daynav-top__text">Overview</span><span class="daynav-top__arrow">→</span></a>`;

  const cal = dateParts(d.date);

  // Day location map: prefer explicit start/end route, else a single point.
  const loc = d.location || {};
  const dayRoute =
    loc.start && loc.end && loc.start.coords && loc.end.coords
      ? { start: loc.start, end: loc.end }
      : null;

  const baseUrl = trip.siteUrl ? trip.siteUrl.replace(/\/$/, '') : '';
  const dayShareImg = (dayImages[0] && dayImages[0].src)
    || (baseUrl ? `${baseUrl}/assets/snowboard-bg.jpg` : 'assets/snowboard-bg.jpg');
  const dayDesc = `Day ${d.day} · ${formatShort(d.date)} — ${d.location && d.location.name}. ${(d.summary || '').trim()}`
    .replace(/\s+/g, ' ').slice(0, 180);
  return `${head(`Day ${d.day} · ${d.title} — ${trip.title}`, {
    description: dayDesc,
    url: baseUrl ? `${baseUrl}/day-${d.day}.html` : '',
    image: dayShareImg,
  })}
<body>
  ${homeButton('day')}

  <section class="day-hero${heroCarousel ? ' day-hero--has-bg' : ''}">
    ${heroCarousel}
    <div class="day-hero__inner">
      <nav class="daynav-top" aria-label="Day navigation">
        ${prevTop}
        <span class="daynav-top__center">
          <span class="daynav-top__count">Day ${d.day} of ${days.length}</span>
          <a class="daynav-top__home" href="index.html" aria-label="Home" title="Home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M3 10.5 12 3l9 7.5" />
              <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
            </svg>
          </a>
        </span>
        ${nextTop}
      </nav>
      <div class="day-hero__head">
        <div class="cal-tile" aria-label="${esc(formatDate(d.date))}">
          <span class="cal-tile__weekday">${esc(cal.weekday)}</span>
          <span class="cal-tile__day">${esc(cal.day)}</span>
          <span class="cal-tile__month">${esc(cal.month)} ${esc(cal.year)}</span>
        </div>
        <div class="day-hero__headings">
          <h1 class="day-hero__title">${esc(d.title)}</h1>
          <p class="day-hero__loc">📍 ${esc(d.location && d.location.name)}, ${esc(trip.country)}</p>
        </div>
      </div>
      <p class="day-hero__summary">${esc((d.summary || '').trim())}</p>
      ${
        tbcCount(d)
          ? `<p class="day-hero__tbc-note">⚠️ ${tbcCount(d)} item${tbcCount(d) > 1 ? 's' : ''} on this day ${tbcCount(d) > 1 ? 'are' : 'is'} still to be confirmed — see the highlighted rows below.</p>`
          : ''
      }
    </div>
  </section>

  <main class="container container--day">
    <div class="day-layout">
      <div class="day-main">
        ${gallerySection}
        <section class="panel">
          <h2 class="section-title">Schedule</h2>
          <ol class="timeline">${schedule}</ol>
        </section>
        ${alternativesSection}
      </div>

      <aside class="day-side">
        <section class="panel panel--weather" data-weather-panel data-lat="${esc(d.location.coords[0])}" data-lon="${esc(d.location.coords[1])}" data-date="${esc(d.date)}" data-place="${esc(d.location.name)}">
          <h2 class="section-title">Weather</h2>
          <div class="weather" data-weather-target>
            <p class="weather__loading">Fetching forecast…</p>
          </div>
        </section>

        ${
          d.stay && d.stay.name && d.stay.name !== '—'
            ? `<section class="panel">
          <h2 class="section-title">Where We Stay</h2>
          <p class="stay__name">🏨 ${esc(d.stay.name)}</p>
          <p class="stay__area">${esc(d.stay.area || '')}</p>
        </section>`
            : ''
        }

        <section class="panel">
          <h2 class="section-title">${stops.length > 1 || dayRoute ? "Today's Route" : 'Location'}</h2>
          ${
            stops.length
              ? `<p class="day-map__route-label">${stops.length} stop${stops.length > 1 ? 's' : ''} — numbered in schedule order.</p>`
              : dayRoute
              ? `<p class="day-map__route-label"><span class="day-map__pt day-map__pt--start">${esc(dayRoute.start.name)}</span> <span class="day-map__arrow">→</span> <span class="day-map__pt day-map__pt--end">${esc(dayRoute.end.name)}</span></p>`
              : ''
          }
          <div id="day-map" class="day-map"></div>
        </section>
      </aside>
    </div>

    ${giscusEmbed(trip)}

    <nav class="daynav">
      ${prevLink}
      ${nextLink}
    </nav>
  </main>

  ${footer(trip)}
  ${scripts({
    type: 'day',
    coords: d.location.coords,
    place: d.location.name,
    date: d.date,
    route: dayRoute,
    stops: stops,
  })}`;
}

/* --------------------------------------------------------------------------
 * Assets (CSS + JS)
 * ------------------------------------------------------------------------ */

function stylesCss() {
  return fs.readFileSync(path.join(ROOT, 'src', 'styles.css'), 'utf8');
}
function appJs() {
  return fs.readFileSync(path.join(ROOT, 'src', 'app.js'), 'utf8');
}

/* --------------------------------------------------------------------------
 * Main
 * ------------------------------------------------------------------------ */

function main() {
  const md = fs.readFileSync(SRC, 'utf8');
  const data = parseFrontmatter(md);
  const trip = data.trip || {};
  const days = (data.days || []).slice().sort((a, b) => a.day - b.day);

  // Merge travelers/flights/essentials that live at top level of frontmatter.
  trip.travelers = data.travelers || trip.travelers || [];
  trip.flights = data.flights || trip.flights || [];
  trip.essentials = data.essentials || trip.essentials || [];

  if (!days.length) {
    throw new Error('No days found in itinerary.md frontmatter.');
  }

  ensureDirs();

  // Landing page
  fs.writeFileSync(path.join(OUT, 'index.html'), renderIndex(trip, days));

  // Day pages
  days.forEach((_, i) => {
    fs.writeFileSync(path.join(OUT, `day-${days[i].day}.html`), renderDay(trip, days, i));
  });

  // Assets
  fs.writeFileSync(path.join(ASSETS, 'styles.css'), stylesCss());
  fs.writeFileSync(path.join(ASSETS, 'app.js'), appJs());

  // Copy any static assets (images, gifs, etc.) verbatim into docs/assets.
  const copiedStatic = [];
  if (fs.existsSync(STATIC)) {
    for (const file of fs.readdirSync(STATIC)) {
      const from = path.join(STATIC, file);
      if (fs.statSync(from).isFile()) {
        fs.copyFileSync(from, path.join(ASSETS, file));
        copiedStatic.push(file);
      }
    }
  }

  // Points of interest for the landing map. Includes a couple of photogenic
  // stops from each day (schedule items with coordinates + a gallery image),
  // plus any item explicitly flagged `landmark: true` (which always shows,
  // regardless of the per-day cap).
  const landmarks = [];
  const seenLandmark = new Set();
  const addLandmark = (s, d) => {
    if (!Array.isArray(s.coords) || s.coords.length !== 2) return false;
    const img = s.gallery && s.gallery.length ? s.gallery[0] : null;
    if (!img || !img.src) return false;
    const key = s.coords.join(',');
    if (seenLandmark.has(key)) return false;
    seenLandmark.add(key);
    landmarks.push({
      name: s.landmarkName || s.activity || d.title,
      coords: s.coords,
      day: d.day,
      url: `day-${d.day}.html`,
      image: img.src,
      caption: (img.caption || '').trim(),
    });
    return true;
  };
  // First pass: explicitly flagged landmarks always get included.
  days.forEach((d) => {
    (d.schedule || []).forEach((s) => { if (s.landmark) addLandmark(s, d); });
  });
  // Second pass: auto-fill up to 2 per day from the remaining stops.
  days.forEach((d) => {
    let perDay = 0;
    (d.schedule || []).forEach((s) => {
      if (perDay >= 2 || s.landmark) return;
      if (addLandmark(s, d)) perDay++;
    });
  });

  // Machine-readable data (handy for the map + debugging)
  const tripJson = {
    trip: {
      title: trip.title,
      country: trip.country,
      mapCenter: trip.mapCenter,
      mapZoom: trip.mapZoom,
      startDate: trip.startDate,
      endDate: trip.endDate,
    },
    days: days.map((d) => ({
      day: d.day,
      date: d.date,
      title: d.title,
      name: d.location && d.location.name,
      coords: d.location && d.location.coords,
      url: `day-${d.day}.html`,
    })),
    landmarks: landmarks,
  };
  fs.writeFileSync(path.join(DATA, 'trip.json'), JSON.stringify(tripJson, null, 2));

  // GitHub Pages: disable Jekyll processing
  fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

  console.log(`✓ Built site into ${path.relative(ROOT, OUT)}/`);
  console.log(`  • index.html`);
  days.forEach((d) => console.log(`  • day-${d.day}.html  (${d.title})`));
  console.log(`  • assets/, data/, .nojekyll`);
  if (copiedStatic.length) console.log(`  • static: ${copiedStatic.join(', ')}`);
}

main();
