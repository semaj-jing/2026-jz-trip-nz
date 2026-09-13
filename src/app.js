/* ==========================================================================
   Travel Itinerary — client-side logic (maps + dynamic weather)
   Generated into docs/assets/app.js by build.js
   ==========================================================================
   - Maps: Leaflet + OpenStreetMap tiles (no API key).
   - Weather: Open-Meteo (free, no API key). Uses the Forecast API when the
     date is within range, otherwise falls back to the Historical/Archive API
     (or climate normals for dates far in the future).
   ========================================================================== */

(function () {
  'use strict';

  /* ----------------------------- WMO weather codes ----------------------- */
  // https://open-meteo.com/en/docs -> WMO Weather interpretation codes
  var WMO = {
    0: ['Clear sky', '☀️'],
    1: ['Mainly clear', '🌤️'],
    2: ['Partly cloudy', '⛅'],
    3: ['Overcast', '☁️'],
    45: ['Fog', '🌫️'],
    48: ['Rime fog', '🌫️'],
    51: ['Light drizzle', '🌦️'],
    53: ['Drizzle', '🌦️'],
    55: ['Heavy drizzle', '🌧️'],
    56: ['Freezing drizzle', '🌧️'],
    57: ['Freezing drizzle', '🌧️'],
    61: ['Light rain', '🌦️'],
    63: ['Rain', '🌧️'],
    65: ['Heavy rain', '🌧️'],
    66: ['Freezing rain', '🌧️'],
    67: ['Freezing rain', '🌧️'],
    71: ['Light snow', '🌨️'],
    73: ['Snow', '🌨️'],
    75: ['Heavy snow', '❄️'],
    77: ['Snow grains', '🌨️'],
    80: ['Rain showers', '🌦️'],
    81: ['Rain showers', '🌧️'],
    82: ['Violent showers', '⛈️'],
    85: ['Snow showers', '🌨️'],
    86: ['Snow showers', '❄️'],
    95: ['Thunderstorm', '⛈️'],
    96: ['Thunderstorm + hail', '⛈️'],
    99: ['Thunderstorm + hail', '⛈️'],
  };

  function describe(code) {
    return WMO[code] || ['—', '🌡️'];
  }

  function todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  function daysBetween(aIso, bIso) {
    var a = new Date(aIso + 'T00:00:00');
    var b = new Date(bIso + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }

  /* ----------------------------- Weather fetch --------------------------- */
  /**
   * Fetch a daily weather summary for a given lat/lon on a specific date.
   * Chooses the right Open-Meteo endpoint based on how far away the date is.
   * Returns a Promise resolving to a normalized object, or rejecting.
   */
  function fetchWeather(lat, lon, dateIso) {
    var offset = daysBetween(todayIso(), dateIso);
    var daily = 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,precipitation_sum';
    var base;
    var params;
    var mode;

    if (offset < 0) {
      // Past date -> historical archive
      mode = 'historical';
      base = 'https://archive-api.open-meteo.com/v1/archive';
      params =
        '?latitude=' + lat +
        '&longitude=' + lon +
        '&start_date=' + dateIso +
        '&end_date=' + dateIso +
        '&daily=' + 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum' +
        '&timezone=auto';
    } else if (offset <= 15) {
      // Within forecast window
      mode = 'forecast';
      base = 'https://api.open-meteo.com/v1/forecast';
      params =
        '?latitude=' + lat +
        '&longitude=' + lon +
        '&daily=' + daily +
        '&start_date=' + dateIso +
        '&end_date=' + dateIso +
        '&timezone=auto';
    } else {
      // Far future -> seasonal expectation via last year's actuals on same date
      mode = 'seasonal';
      var ly = String(Number(dateIso.slice(0, 4)) - 1) + dateIso.slice(4);
      base = 'https://archive-api.open-meteo.com/v1/archive';
      params =
        '?latitude=' + lat +
        '&longitude=' + lon +
        '&start_date=' + ly +
        '&end_date=' + ly +
        '&daily=' + 'weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum' +
        '&timezone=auto';
    }

    return fetch(base + params)
      .then(function (r) {
        if (!r.ok) throw new Error('Weather HTTP ' + r.status);
        return r.json();
      })
      .then(function (j) {
        var d = j && j.daily;
        if (!d || !d.time || !d.time.length) throw new Error('No weather data');
        var code = d.weather_code ? d.weather_code[0] : null;
        return {
          mode: mode,
          code: code,
          desc: describe(code)[0],
          icon: describe(code)[1],
          tmax: d.temperature_2m_max ? Math.round(d.temperature_2m_max[0]) : null,
          tmin: d.temperature_2m_min ? Math.round(d.temperature_2m_min[0]) : null,
          pop: d.precipitation_probability_max ? d.precipitation_probability_max[0] : null,
          precip: d.precipitation_sum != null ? d.precipitation_sum[0] : null,
          wind: d.wind_speed_10m_max ? Math.round(d.wind_speed_10m_max[0]) : null,
        };
      });
  }

  /* ----------------------------- Weather rendering ----------------------- */
  function renderBadge(el, w) {
    el.innerHTML =
      '<span class="weather-badge">' +
      '<span class="weather-badge__icon">' + w.icon + '</span>' +
      '<span>' + (w.tmax != null ? w.tmax + '°' : '—') +
      (w.tmin != null ? ' / ' + w.tmin + '°' : '') + '</span>' +
      '</span>';
  }

  function noteFor(mode) {
    if (mode === 'forecast') return 'Live forecast for this date.';
    if (mode === 'historical') return 'Recorded conditions (past date).';
    if (mode === 'seasonal') return 'Seasonal estimate (same date last year).';
    return '';
  }

  function renderPanel(el, w, place) {
    var meta = [];
    if (w.pop != null) meta.push('<span>Chance of rain <b>' + w.pop + '%</b></span>');
    if (w.precip != null) meta.push('<span>Precip <b>' + w.precip + ' mm</b></span>');
    if (w.wind != null) meta.push('<span>Wind <b>' + w.wind + ' km/h</b></span>');
    if (w.tmin != null) meta.push('<span>Low <b>' + w.tmin + '°C</b></span>');

    el.innerHTML =
      '<div class="weather__now">' +
      '<span class="weather__icon">' + w.icon + '</span>' +
      '<div>' +
      '<div class="weather__temp">' + (w.tmax != null ? w.tmax + '°C' : '—') + '</div>' +
      '<div class="weather__desc">' + w.desc + (place ? ' · ' + place : '') + '</div>' +
      '</div>' +
      '</div>' +
      (meta.length ? '<div class="weather__meta">' + meta.join('') + '</div>' : '') +
      '<p class="weather__note">' + noteFor(w.mode) + '</p>';
  }

  function loadWeatherInto(el, render, place) {
    var lat = parseFloat(el.getAttribute('data-lat'));
    var lon = parseFloat(el.getAttribute('data-lon'));
    var date = el.getAttribute('data-date');
    fetchWeather(lat, lon, date).then(
      function (w) { render(el, w, place); },
      function (err) {
        el.innerHTML = '<p class="weather__error">Weather unavailable right now.</p>';
        if (window.console) console.warn('Weather error:', err);
      }
    );
  }

  /* ----------------------------- Maps ------------------------------------ */
  function pinIcon(label) {
    return L.divIcon({
      className: '',
      html: '<div class="route-pin"><span>' + label + '</span></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 28],
      popupAnchor: [0, -28],
    });
  }

  // Small circular "point of interest" marker for the landing map.
  function landmarkIcon() {
    return L.divIcon({
      className: '',
      html: '<div class="poi-pin"><span class="poi-pin__dot"></span></div>',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12],
    });
  }

  // Keyless OpenStreetMap standard tiles (no API key / token required).
  var TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  var TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  var ROUTE_COLOR = '#e04a5f';

  /**
   * Draw a driving route through the given ordered [lat,lon] waypoints using
   * the public OSRM demo router (keyless). Falls back to a straight dashed
   * "as-the-crow-flies" polyline if routing is unavailable.
   * Returns a Promise resolving to an L.latLngBounds covering what was drawn.
   */
  function drawDrivingRoute(map, latlngs) {
    function drawStraight() {
      L.polyline(latlngs, {
        color: ROUTE_COLOR, weight: 4, opacity: 0.85,
        dashArray: '2 10', lineCap: 'round',
      }).addTo(map);
      return L.latLngBounds(latlngs);
    }

    if (!latlngs || latlngs.length < 2) {
      return Promise.resolve(latlngs && latlngs.length ? L.latLngBounds(latlngs) : null);
    }

    // OSRM expects lon,lat pairs separated by semicolons.
    var coordStr = latlngs
      .map(function (p) { return p[1] + ',' + p[0]; })
      .join(';');
    var url = 'https://router.project-osrm.org/route/v1/driving/' + coordStr +
      '?overview=full&geometries=geojson';

    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('OSRM HTTP ' + r.status);
        return r.json();
      })
      .then(function (j) {
        var route = j && j.routes && j.routes[0];
        if (!route || !route.geometry || !route.geometry.coordinates) {
          throw new Error('No route geometry');
        }
        // GeoJSON is [lon,lat]; Leaflet wants [lat,lon].
        var line = route.geometry.coordinates.map(function (c) { return [c[1], c[0]]; });

        // Soft "casing" underneath for contrast on busy map tiles.
        L.polyline(line, {
          color: '#ffffff', weight: 7, opacity: 0.7, lineCap: 'round', lineJoin: 'round',
        }).addTo(map);
        L.polyline(line, {
          color: ROUTE_COLOR, weight: 4, opacity: 0.95, lineCap: 'round', lineJoin: 'round',
        }).addTo(map);

        return L.latLngBounds(line);
      })
      .catch(function (err) {
        if (window.console) console.warn('Routing unavailable, using straight line:', err);
        return drawStraight();
      });
  }

  function buildRouteMap(cfg) {
    var el = document.getElementById('route-map');
    if (!el || typeof L === 'undefined') return;

    var map = L.map(el, { scrollWheelZoom: true, zoomControl: true, attributionControl: true });
    L.tileLayer(TILES, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);

    fetch('data/trip.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var marks = (data.landmarks && data.landmarks.length)
          ? data.landmarks
          // Fallback to day locations if no landmarks were emitted.
          : (data.days || []).filter(function (d) { return d.coords; }).map(function (d) {
              return { name: d.title, coords: d.coords, day: d.day, url: d.url, image: null, caption: '' };
            });

        var pts = [];
        marks.forEach(function (m) {
          if (!m.coords) return;
          var latlng = [m.coords[0], m.coords[1]];
          pts.push(latlng);
          var html =
            '<div class="map-popup map-popup--landmark">' +
            (m.image
              ? '<img class="map-popup__img" src="' + m.image + '" alt="' + (m.name || '') + '" loading="lazy" />'
              : '') +
            '<div class="map-popup__body">' +
            '<div class="map-popup__day">Day ' + m.day + '</div>' +
            '<div class="map-popup__title">' + (m.name || '') + '</div>' +
            '<a href="' + m.url + '">View day →</a>' +
            '</div></div>';
          L.marker(latlng, { icon: landmarkIcon() }).addTo(map)
            .bindPopup(html, { maxWidth: 260, className: 'leaflet-popup--landmark' });
        });

        if (pts.length > 1) {
          map.fitBounds(L.latLngBounds(pts).pad(0.2));
        } else if (pts.length === 1) {
          map.setView(pts[0], 9);
        } else if (cfg.mapCenter) {
          map.setView(cfg.mapCenter, cfg.mapZoom || 5);
        }
      })
      .catch(function () {
        if (cfg.mapCenter) map.setView(cfg.mapCenter, cfg.mapZoom || 5);
      });
  }

  function endpointIcon(kind, label) {
    return L.divIcon({
      className: '',
      html: '<div class="route-pin route-pin--' + kind + '"><span>' + label + '</span></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 28],
      popupAnchor: [0, -28],
    });
  }

  function stopIcon(label, tbc) {
    return L.divIcon({
      className: '',
      html: '<div class="route-pin route-pin--stop' + (tbc ? ' route-pin--tbc' : '') + '"><span>' + label + '</span></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 28],
      popupAnchor: [0, -28],
    });
  }

  function buildDayMap(cfg) {
    var el = document.getElementById('day-map');
    if (!el || typeof L === 'undefined') return null;
    var map = L.map(el, { scrollWheelZoom: true, zoomControl: true, attributionControl: false });
    L.tileLayer(TILES, { maxZoom: 19 }).addTo(map);

    var markers = {}; // stop number -> marker

    // Preferred: one numbered node per schedule item that has coordinates.
    if (cfg.stops && cfg.stops.length) {
      var pts = [];
      cfg.stops.forEach(function (stop) {
        if (!stop.coords) return;
        pts.push(stop.coords);
        var marker = L.marker(stop.coords, { icon: stopIcon(stop.n, stop.tbc) }).addTo(map)
          .bindPopup(
            '<div class="map-popup">' +
            '<div class="map-popup__day">' + (stop.time || 'Stop ' + stop.n) + '</div>' +
            '<div class="map-popup__title">' + (stop.activity || '') + '</div>' +
            (stop.tbc ? '<div class="map-popup__tbc">To be confirmed</div>' : '') +
            '</div>'
          );
        markers[stop.n] = marker;
      });

      if (pts.length > 1) {
        // Fit to straight-line bounds immediately, then refine to the actual
        // driving route once it loads.
        map.fitBounds(L.latLngBounds(pts).pad(0.3));
        map._dayFitBounds = L.latLngBounds(pts).pad(0.3);
        drawDrivingRoute(map, pts).then(function (bounds) {
          if (bounds) {
            var padded = bounds.pad(0.15);
            map._dayFitBounds = padded;
            map.fitBounds(padded);
          }
        });
      } else if (pts.length === 1) {
        map.setView(pts[0], 12);
        map._dayFitBounds = null;
      }
      return { map: map, markers: markers };
    }

    // If the day has an explicit start -> end route, show both endpoints.
    if (cfg.route && cfg.route.start && cfg.route.end) {
      var s = cfg.route.start.coords;
      var e = cfg.route.end.coords;

      L.marker(s, { icon: endpointIcon('start', 'A') }).addTo(map)
        .bindPopup('<div class="map-popup"><div class="map-popup__day">Start</div><div class="map-popup__title">' + (cfg.route.start.name || '') + '</div></div>');
      L.marker(e, { icon: endpointIcon('end', 'B') }).addTo(map)
        .bindPopup('<div class="map-popup"><div class="map-popup__day">End</div><div class="map-popup__title">' + (cfg.route.end.name || '') + '</div></div>');

      var same = s[0] === e[0] && s[1] === e[1];
      if (!same) {
        map.fitBounds(L.latLngBounds([s, e]).pad(0.35));
        drawDrivingRoute(map, [s, e]).then(function (bounds) {
          if (bounds) map.fitBounds(bounds.pad(0.15));
        });
      } else {
        map.setView(s, 12);
      }
      return { map: map, markers: markers };
    }

    // Fallback: single location marker.
    if (!cfg.coords) return { map: map, markers: markers };
    map.setView(cfg.coords, 9);
    L.marker(cfg.coords, { icon: pinIcon('★') }).addTo(map)
      .bindPopup('<div class="map-popup"><div class="map-popup__title">' + (cfg.place || 'Here') + '</div></div>');
    return { map: map, markers: markers };
  }

  /* ----------------------------- Carousel -------------------------------- */
  function initCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel__slide'));
    if (slides.length === 0) return;
    var dots = Array.prototype.slice.call(root.querySelectorAll('.carousel__dot'));
    var indexEl = root.querySelector('[data-carousel-index]');
    var current = 0;
    var timer = null;
    var autoplay = parseInt(root.getAttribute('data-autoplay'), 10) || 0;

    function show(next) {
      next = (next + slides.length) % slides.length;
      slides[current].classList.remove('is-active');
      if (dots[current]) dots[current].classList.remove('is-active');
      current = next;
      slides[current].classList.add('is-active');
      if (dots[current]) dots[current].classList.add('is-active');
      if (indexEl) indexEl.textContent = String(current + 1);
    }

    function move(dir) { show(current + dir); }

    function restart() {
      if (!autoplay) return;
      if (timer) clearInterval(timer);
      timer = setInterval(function () { move(1); }, autoplay);
    }

    root.querySelectorAll('[data-dir]').forEach(function (btn) {
      btn.addEventListener('click', function () { move(parseInt(btn.getAttribute('data-dir'), 10)); restart(); });
    });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () { show(parseInt(dot.getAttribute('data-goto'), 10)); restart(); });
    });

    // Keyboard support when the carousel has focus.
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { move(-1); restart(); }
      else if (e.key === 'ArrowRight') { move(1); restart(); }
    });

    // Pause autoplay on hover/focus.
    if (autoplay) {
      root.addEventListener('mouseenter', function () { if (timer) clearInterval(timer); });
      root.addEventListener('mouseleave', restart);
      root.addEventListener('focusin', function () { if (timer) clearInterval(timer); });
      root.addEventListener('focusout', restart);
      restart();
    }

    // Basic touch swipe.
    var startX = null;
    root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (startX == null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { move(dx < 0 ? 1 : -1); restart(); }
      startX = null;
    }, { passive: true });

    // If an image fails to load, hide its slide gracefully.
    slides.forEach(function (slide) {
      var img = slide.querySelector('.carousel__img');
      if (img) {
        img.addEventListener('error', function () { slide.classList.add('is-broken'); });
      }
    });
  }

  /* --------- Filmstrip (multi-image-per-view) carousel ------------------- */
  function initFilmstrip(root) {
    var track = root.querySelector('.filmstrip__track');
    if (!track) return;
    var slides = Array.prototype.slice.call(track.querySelectorAll('.filmstrip__slide'));
    if (!slides.length) return;

    // Drop slides whose image fails to load.
    slides.forEach(function (slide) {
      var img = slide.querySelector('.filmstrip__img');
      if (img) img.addEventListener('error', function () { slide.style.display = 'none'; });
    });

    var index = 0; // index of the left-most visible slide

    function perView() {
      // Derived from CSS custom property so it stays in sync with breakpoints.
      var v = parseInt(getComputedStyle(root).getPropertyValue('--per-view'), 10);
      return v > 0 ? v : 1;
    }

    function maxIndex() {
      return Math.max(0, slides.length - perView());
    }

    function apply() {
      if (index > maxIndex()) index = maxIndex();
      if (index < 0) index = 0;
      // Each slide occupies (100% / perView); translate by whole slides.
      var pct = index * (100 / perView());
      track.style.transform = 'translateX(-' + pct + '%)';
      var prev = root.querySelector('.filmstrip__btn--prev');
      var next = root.querySelector('.filmstrip__btn--next');
      if (prev) prev.disabled = index <= 0;
      if (next) next.disabled = index >= maxIndex();
    }

    function move(dir) { index += dir; apply(); }

    root.querySelectorAll('[data-dir]').forEach(function (btn) {
      btn.addEventListener('click', function () { move(parseInt(btn.getAttribute('data-dir'), 10)); });
    });

    // Basic touch swipe.
    var startX = null;
    root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (startX == null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) move(dx < 0 ? 1 : -1);
      startX = null;
    }, { passive: true });

    window.addEventListener('resize', apply);
    apply();
  }

  /* --------- Alternatives popovers (schedule items) ---------------------- */
  function initAltPopovers() {
    var wraps = Array.prototype.slice.call(document.querySelectorAll('[data-altwrap]'));
    if (!wraps.length) return;

    function closeAll(except) {
      wraps.forEach(function (w) {
        if (w === except) return;
        var pop = w.querySelector('[data-altpop]');
        var btn = w.querySelector('[data-altbtn]');
        if (pop) pop.hidden = true;
        if (btn) btn.setAttribute('aria-expanded', 'false');
        w.classList.remove('is-open');
      });
    }

    wraps.forEach(function (wrap) {
      var btn = wrap.querySelector('[data-altbtn]');
      var pop = wrap.querySelector('[data-altpop]');
      var closeBtn = wrap.querySelector('[data-altclose]');
      if (!btn || !pop) return;

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = pop.hidden;
        closeAll(wrap);
        pop.hidden = !willOpen;
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        wrap.classList.toggle('is-open', willOpen);
        // Init any carousels inside the popover on first open.
        if (willOpen && !wrap._carouselsReady) {
          pop.querySelectorAll('[data-carousel]').forEach(initCarousel);
          wrap._carouselsReady = true;
        }
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          pop.hidden = true;
          btn.setAttribute('aria-expanded', 'false');
          wrap.classList.remove('is-open');
        });
      }

      // Clicks inside the popover shouldn't bubble to the timeline row / doc.
      pop.addEventListener('click', function (e) { e.stopPropagation(); });
    });

    document.addEventListener('click', function () { closeAll(null); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
  }

  /* ----------------------------- Init ------------------------------------ */
  function init(page) {
    page = page || {};

    // Weather badges (landing page day cards)
    document.querySelectorAll('[data-weather-badge]').forEach(function (el) {
      loadWeatherInto(el, renderBadge);
    });

    // Weather panel (day page)
    document.querySelectorAll('[data-weather-panel]').forEach(function (panel) {
      var target = panel.querySelector('[data-weather-target]') || panel;
      // copy data attrs onto target for the loader
      target.setAttribute('data-lat', panel.getAttribute('data-lat'));
      target.setAttribute('data-lon', panel.getAttribute('data-lon'));
      target.setAttribute('data-date', panel.getAttribute('data-date'));
      loadWeatherInto(target, renderPanel, panel.getAttribute('data-place'));
    });

    // Galleries (single-image-per-view carousels). Skip ones inside a
    // closed alternatives popover — those init lazily on first open.
    document.querySelectorAll('[data-carousel]').forEach(function (c) {
      if (c.closest('[data-altpop]')) return;
      initCarousel(c);
    });

    // Filmstrip galleries (3-pane top gallery on day pages)
    document.querySelectorAll('[data-filmstrip]').forEach(initFilmstrip);

    // Alternatives popovers on schedule items
    initAltPopovers();

    if (page.type === 'index') buildRouteMap(page);
    if (page.type === 'day') {
      var dayMap = buildDayMap(page);
      if (dayMap && dayMap.map) {
        wireScheduleToMap(dayMap);
        window.__dayMap = dayMap.map; // exposed for debugging/inspection
      }
    }
  }

  /* -------------- Link schedule items to the day map --------------------- */
  function wireScheduleToMap(dayMap) {
    var map = dayMap.map;
    var markers = dayMap.markers || {};
    var items = Array.prototype.slice.call(document.querySelectorAll('.timeline__item--clickable'));
    if (!items.length) return;
    var ZOOM = 14;

    function activate(item) {
      var lat = parseFloat(item.getAttribute('data-lat'));
      var lon = parseFloat(item.getAttribute('data-lon'));
      var n = parseInt(item.getAttribute('data-stop'), 10);
      if (isNaN(lat) || isNaN(lon)) return;

      // Center + zoom the map on this stop.
      map.setView([lat, lon], ZOOM, { animate: true });
      var marker = markers[n];
      if (marker) marker.openPopup();

      // Highlight the active schedule row.
      items.forEach(function (el) { el.classList.remove('is-active'); });
      item.classList.add('is-active');

      // Bring the map into view if it's off-screen (helps on mobile).
      var mapEl = document.getElementById('day-map');
      if (mapEl && typeof mapEl.scrollIntoView === 'function') {
        var rect = mapEl.getBoundingClientRect();
        var offscreen = rect.bottom < 0 || rect.top > (window.innerHeight || document.documentElement.clientHeight);
        if (offscreen) mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    items.forEach(function (item) {
      item.addEventListener('click', function (e) {
        // Don't hijack clicks on interactive children (galleries, alt chips,
        // popovers, links) inside the row.
        if (e.target.closest('.timeline__gallery, .altwrap, a, button')) return;
        activate(item);
      });
      item.addEventListener('keydown', function (e) {
        if (e.target !== item) return; // only when the row itself is focused
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(item); }
      });
    });
  }

  window.TripSite = { init: init, fetchWeather: fetchWeather };
})();
