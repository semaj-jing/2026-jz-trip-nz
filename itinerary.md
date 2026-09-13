---
# ============================================================================
# TRIP ITINERARY — SINGLE SOURCE OF TRUTH
# ----------------------------------------------------------------------------
# Edit this file, then run `node build.js` (or `npm run build`) to regenerate
# the static website. Everything below drives the generated pages.
# ============================================================================

trip:
  title: "NZ 2026"
  subtitle: ""
  # Short blurb used for the browser tab description + social share previews.
  tagline: "6 days skiing & road-tripping New Zealand's South Island — Lake Tekapo, Queenstown, Coronet Peak & The Remarkables."
  # Public base URL (GitHub Pages) so shared links can show an absolute preview image.
  siteUrl: "https://semaj-jing.github.io/2026-jz-trip-nz"
  country: "New Zealand"
  # Giscus (GitHub Discussions comments) config for the day pages.
  # After enabling Discussions on the repo + installing the giscus app, get the
  # repoId/categoryId from https://giscus.app and paste them below.
  giscus:
    repo: "semaj-jing/2026-jz-trip-nz"
    repoId: "R_kgDOUP-bIQ"
    category: "Announcements"
    categoryId: "DIC_kwDOUP-bIc4DE_cG"
    mapping: "pathname"
    strict: "0"
    reactionsEnabled: "1"
    inputPosition: "bottom"
    theme: "light"
    lang: "en"
  # Country-level map centering + zoom for the route overview map
  mapCenter: [-44.7, 169.3]
  mapZoom: 7
  startDate: "2026-09-22"
  endDate: "2026-09-27"
  summary: >
    Six days chasing the light across the South Island — from the glacier-blue
    hush of the Mackenzie Country to the gold-and-tussock passes of Central
    Otago. We sleep beneath the darkest skies on Earth at Lake Tekapo, then
    carve four days of fresh snow off Coronet Peak and The Remarkables, with
    Queenstown and the lake waiting each evening below.

travelers:
  - name: "Zhanqiu C."
    nickname: "&"
    role: "Trip Organizer"
    avatar: "assets/amber-c-dp.png"
  - name: "Muqing S."
    nickname: "Daneel"
    role: "Navigator"
    avatar: "assets/daniel-s-dp.png"
  - name: "James Z."
    nickname: "Jam"
    role: "Photographer"
    avatar: "assets/skigif.gif"

flights:
  - type: "Outbound"
    airline: "Virgin Australia"
    flightNumber: "VA0163"
    from: "Sydney (SYD)"
    to: "Queenstown (ZQN)"
    departure: "2026-09-22 08:30"
    arrival: "2026-09-22 13:30"
  - type: "Return"
    airline: "Jetstar"
    flightNumber: "JQ224"
    from: "Queenstown (ZQN)"
    to: "Sydney (SYD)"
    departure: "2026-09-27 20:50"
    arrival: "2026-09-27 21:05"

# Optional extra info blocks shown on the landing page
essentials:
  - label: "Currency"
    value: "New Zealand Dollar (NZD)"
  - label: "Timezone"
    value: "NZDT (UTC+13)"
  - label: "Emergency"
    value: "111 (Police / Fire / Ambulance)"
  - label: "Driving"
    value: "Left-hand side, valid overseas licence OK. 4WD recommended — snow/ice on Lindis Pass and Crown Range in late Sept"
  - label: "Plug Type"
    value: "Type I, 230V"
  - label: "SIM / Data"
    value: "Spark or One NZ tourist SIM at airport"
  - label: "Rental Car"
    value: "TODO — not yet booked. Need 4WD for winter road conditions"

# ----------------------------------------------------------------------------
# DAYS
# Each day becomes its own internal page (day-1.html, day-2.html, ...).
# `location.coords` are used for the route map + weather lookups.
# ----------------------------------------------------------------------------
days:
  - day: 1
    date: "2026-09-22"
    title: "Arrival & Drive to Lake Tekapo"
    landmarks: ["Queenstown", "Lindis Pass", "Lake Tekapo"]
    location:
      name: "Lake Tekapo"
      coords: [-44.0046, 170.4779]
      start:
        name: "Queenstown Airport (ZQN)"
        coords: [-45.0211, 168.7392]
      end:
        name: "Lake Tekapo"
        coords: [-44.0046, 170.4779]
    summary: >
      Land in Queenstown, pick up the rental car, and drive north through
      Central Otago and the Mackenzie Basin to Lake Tekapo, with snack and
      dinner stops along the way. Arrive around sunset in time for
      stargazing under some of the darkest skies on Earth.
    highlights:
      - "Virgin Australia VA0163 — SYD to ZQN"
      - "Scenic drive via Cromwell, Lindis Pass, Omarama, and Lake Pukaki"
      - "Dinner en route in Omarama"
      - "Tekapo stargazing after dark"
    gallery:
      - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Hills in Lindis Pass, New Zealand.jpg?width=1600"
        caption: "Tussock-covered hills at Lindis Pass, the highest point on the South Island's state highway network — one of today's photo stops."
        credit: "Michal Klajban, CC BY-SA 4.0, via Wikimedia Commons"
    schedule:
      - time: "08:30"
        activity: "Depart Sydney (SYD)"
        desc: >
          Virgin Australia VA0163, Boeing 737-8.
        notes: "3hr flight"
      - time: "13:30"
        activity: "Arrive Queenstown (ZQN)"
        coords: [-45.0211, 168.7392]
        desc: >
          Land at Queenstown Airport, clear the domestic arrivals hall, and
          collect luggage. Seats 26A/26B/26C.
      - time: "14:00"
        activity: "Pick up rental car"
        coords: [-45.0211, 168.7392]
        desc: >
          Not yet booked — need a 4WD given winter/snow conditions possible
          on Lindis Pass and Crown Range in late September.
        notes: "TODO: book rental (4WD)"
        tbc: true
      - time: "14:45"
        activity: "Cromwell (snack stop)"
        coords: [-45.0333, 169.2000]
        link: "https://www.cromwell.org.nz/"
        desc: >
          Fruit stalls and fresh Central Otago stone fruit — a quick
          stretch-the-legs stop, ~45 min from the airport.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Historic Cromwell.jpg?width=1600"
            caption: "Old Cromwell Town's restored historic precinct by Lake Dunstan."
            credit: "CHCBOY, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "15:55"
        activity: "Lindis Pass summit lookout"
        coords: [-44.5878, 169.6478]
        link: "https://en.wikipedia.org/wiki/Lindis_Pass"
        desc: >
          The highest point on the South Island's state highway network
          (971m). Sweeping alpine tussock scenery — a great photo stop.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lindis Pass, Otago, New Zealand.jpg?width=1600"
            caption: "Golden tussock hills rolling over the Lindis Pass summit."
            credit: "Charlie Mitchell, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "16:30"
        activity: "Dinner: Omarama"
        coords: [-44.4842, 169.9666]
        desc: >
          Dinner en route rather than in Tekapo. Try The Love Shack Kebabs
          food van, or the local chicken pie.
        notes: "45 min stop"
        tbc: true
      - time: "17:35"
        activity: "Twizel (optional stop)"
        coords: [-44.2599, 170.0989]
        desc: >
          Small alpine town with cafes — optional coffee/bathroom break if
          time allows.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Twizel War Memorial, Twizel, New Zealand 04.jpg?width=1600"
            caption: "Twizel, the small service town gateway to the Mackenzie lakes."
            credit: "Michal Klajban, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "18:10"
        activity: "Lake Pukaki lookout"
        coords: [-44.2231, 170.1281]
        link: "https://www.doc.govt.nz/parks-and-recreation/places-to-go/canterbury/places/aoraki-mount-cook-national-park/things-to-do/lake-pukaki/"
        desc: >
          Turquoise glacial lake with Aoraki/Mt Cook in the background.
          Sunset views. Mt Cook Alpine Salmon Shop nearby if still open
          (9am–5pm).
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lake Pukaki & Aoraki Mount Cook 01.jpg?width=1600"
            caption: "Turquoise Lake Pukaki with Aoraki/Mt Cook on the horizon."
            credit: "Krzysztof Golik, CC BY-SA 4.0, via Wikimedia Commons"
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lake Pukaki 21.jpg?width=1600"
            caption: "The glacier-fed blue of Lake Pukaki."
            credit: "Krzysztof Golik, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "19:00"
        activity: "Arrive Lake Tekapo"
        coords: [-44.0046, 170.4779]
        landmark: true
        landmarkName: "Lake Tekapo"
        desc: >
          Arriving right around sunset in late September (~7pm).
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lake Tekapo 01.jpg?width=1600"
            caption: "Lake Tekapo's milky-turquoise water backed by the Southern Alps."
            credit: "Krzysztof Golik, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "19:00"
        activity: "Find accommodation"
        coords: [-44.0046, 170.4779]
        desc: >
          Not yet booked — 1 night in Lake Tekapo.
        notes: "TODO: book accommodation"
        tbc: true
      - time: "20:00"
        activity: "Stargazing (option TBD)"
        coords: [-44.0046, 170.4713]
        desc: >
          Choose on the night — all close together: Tekapo Stargazing (hot
          pools + telescopes), Tekapo Chinese Stargazing (Mandarin guiding),
          Astro Tekapo (lakefront telescopes), or self-guided.
        notes: >
          Tekapo Stargazing: tekapostargazing.co.nz | Astro Tekapo:
          laketekaponz.co.nz/activities/astro-tekapo | Tekapo Chinese
          Stargazing: mackenzienz.com
        tbc: true
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Milky way galaxy, lake Tekapo, stargazing view 3.jpg?width=1600"
            caption: "The Milky Way over Lake Tekapo — part of an International Dark Sky Reserve."
            credit: "Sky_xe, CC BY-SA 4.0, via Wikimedia Commons"
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Church of the Good Shepherd, Lake Tekapo, New Zealand 03.jpg?width=1600"
            caption: "The tiny Church of the Good Shepherd on the Tekapo lakeshore."
            credit: "Michal Klajban, CC BY-SA 4.0, via Wikimedia Commons"
    stay:
      name: "TODO — Lake Tekapo accommodation not yet booked"
      area: "Lake Tekapo"

  - day: 2
    date: "2026-09-23"
    title: "Scenic Drive to Queenstown"
    landmarks: ["Lake Pukaki", "Lake Wānaka", "Arrowtown", "Queenstown"]
    location:
      name: "Queenstown (Frankton)"
      coords: [-45.0333, 168.7333]
      start:
        name: "Lake Tekapo"
        coords: [-44.0046, 170.4779]
      end:
        name: "9 Juniper Place, Frankton, Queenstown 9300"
        coords: [-45.0333, 168.7333]
    summary: >
      A full day retracing part of the route back toward Queenstown, with
      stops at Lake Pukaki, the Clay Cliffs, Cromwell, Lake Wanaka, the
      Crown Range, and Arrowtown before settling into the Frankton
      accommodation for the rest of the trip.
    highlights:
      - "Clay Cliffs, Omarama"
      - "Lake Wanaka and 'That Wanaka Tree'"
      - "Crown Range lookout — highest main road in NZ"
      - "Historic Arrowtown"
      - "Fergburger and Onsen Hot Pools in the evening"
    schedule:
      - time: "09:00"
        activity: "Breakfast in Lake Tekapo"
        coords: [-44.0046, 170.4779]
        desc: >
          Jack Rabbit Café (Godley Hotel) for lake/mountain/church views, or
          The Greedy Cow for a hearty local favourite (can get busy, arrive
          early).
        notes: "Suggestion, not booked"
        tbc: true
      - time: "10:00"
        activity: "Depart Lake Tekapo"
        coords: [-44.0046, 170.4779]
        desc: "Assumed departure time."
      - time: "10:30"
        activity: "Lake Pukaki lookout"
        coords: [-44.2231, 170.1281]
        desc: >
          Turquoise glacial lake with Aoraki/Mt Cook views, right on SH8.
        notes: "15 min stop"
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lake Pukaki & Aoraki Mount Cook 01.jpg?width=1600"
            caption: "Lake Pukaki's turquoise water with Aoraki/Mt Cook beyond."
            credit: "Krzysztof Golik, CC BY-SA 4.0, via Wikimedia Commons"
        alternatives:
          - title: "Lake Ohau"
            description: >
              Skip Pukaki or swap it for a longer stop at quieter Lake Ohau,
              a serene alpine lake off the main highway.
            gallery:
              - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lake Ohau From the Alpine Village.jpg?width=1600"
                caption: "Lake Ohau seen from the alpine village."
                credit: "Wildman NZ, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "13:15"
        activity: "Lindis Pass summit lookout"
        coords: [-44.5878, 169.6478]
        desc: "Second pass through — alpine tussock scenery."
        notes: "15 min stop"
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Hills in Lindis Pass, New Zealand.jpg?width=1600"
            caption: "Tussock-covered hills at the Lindis Pass summit."
            credit: "Michal Klajban, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "14:25"
        activity: "Cromwell (lunch)"
        coords: [-45.0333, 169.2000]
        desc: >
          Fruit stalls, Old Cromwell Town historic precinct.
        notes: "1hr lunch stop"
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Historic Cromwell.jpg?width=1600"
            caption: "Restored heritage buildings of Old Cromwell Town."
            credit: "CHCBOY, CC BY-SA 4.0, via Wikimedia Commons"
        alternatives:
          - title: "Bannockburn"
            description: >
              Continue straight to Bannockburn instead for orchards,
              wineries and historic gold-mining sluicings.
            gallery:
              - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Bannockburn (2), Central Otago.jpg?width=1600"
                caption: "The dry, vineyard-dotted hills of Bannockburn, Central Otago."
                credit: "AnnWoolliams, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "16:00"
        activity: "Lake Wānaka"
        coords: [-44.6983, 169.1175]
        link: "https://en.wikipedia.org/wiki/That_W%C4%81naka_Tree"
        desc: >
          Lakefront town, home of the famous "That Wānaka Tree".
        notes: "1hr stop"
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/That Wanaka Tree, New Zealand.jpg?width=1600"
            caption: "\"That Wānaka Tree\" standing alone in Lake Wānaka."
            credit: "Kate Branch, CC BY-SA 4.0, via Wikimedia Commons"
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Lake Wanaka.jpg?width=1600"
            caption: "The calm shoreline of Lake Wānaka."
            credit: "via Wikimedia Commons"
        alternatives:
          - title: "Puzzling World"
            description: >
              Swap or add Puzzling World for something more interactive —
              tilted rooms, illusions and a large outdoor maze.
            gallery:
              - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Puzzling World, Wanaka, New Zealand.jpg?width=1600"
                caption: "The leaning tower and quirky architecture of Puzzling World."
                credit: "Ulrich Lange, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "17:30"
        activity: "Crown Range lookout"
        coords: [-44.9298, 168.8188]
        desc: >
          Highest main road in New Zealand — sweeping views over the
          Wakatipu Basin.
        notes: "15 min stop"
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Crown Range.jpg?width=1600"
            caption: "The switchbacks and basin views from the Crown Range Road."
            credit: "Donovan Govan, CC BY-SA 3.0, via Wikimedia Commons"
        alternatives:
          - title: "Cardrona Valley route"
            description: >
              Take the Cardrona Valley route instead and stop at the
              historic Cardrona Hotel or the Cardrona Distillery.
            gallery:
              - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Cardrona Hotel in autumn, New Zealand.jpg?width=1600"
                caption: "The much-photographed historic Cardrona Hotel."
                credit: "AnnWoolliams, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "18:05"
        activity: "Arrowtown"
        coords: [-44.9370, 168.8319]
        link: "https://www.arrowtown.com/"
        desc: >
          Historic gold-mining town with a preserved 19th-century main
          street and autumn colours.
        notes: "45 min stop"
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Autumn in Arrowtown, New Zealand.jpg?width=1600"
            caption: "Arrowtown's historic main street ablaze with autumn colour."
            credit: "Vera & Jean-Christophe, CC BY-SA 2.0, via Wikimedia Commons"
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/00 0352 Buildings in Arrowtown.jpg?width=1600"
            caption: "Preserved gold-rush-era shopfronts on Buckingham Street."
            credit: "W. Bulach, CC BY-SA 4.0, via Wikimedia Commons"
        alternatives:
          - title: "Kawarau Bridge Bungy"
            description: >
              On the way in, detour past the Kawarau Bridge bungy lookout —
              the world's first commercial bungy site, in the gorge used as
              the LOTR \"Gates of Argonath\".
            gallery:
              - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Kawarau Bridge 43m Bungy Jumping.jpg?width=1600"
                caption: "The 43m Kawarau Bridge bungy over the Kawarau Gorge."
                credit: "sussexbirder, CC BY 2.0, via Wikimedia Commons"
          - title: "Gibbston Valley wineries"
            description: >
              If time allows, stop in the Gibbston Valley for cellar-door
              tastings among the pinot noir vineyards.
            gallery:
              - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Gibbston Valley vineyard 1.jpg?width=1600"
                caption: "Vineyards lining the Gibbston Valley wine region."
                credit: "tjabeljan, CC BY 2.0, via Wikimedia Commons"
      - time: "19:30"
        activity: "Arrive at accommodation"
        coords: [-45.0333, 168.7333]
        desc: "9 Juniper Place, Frankton, Queenstown 9300."
      - time: "21:00"
        activity: "Dinner: Fergburger"
        coords: [-45.0311, 168.6612]
        link: "https://fergburger.com/"
        desc: >
          Queenstown's iconic burger joint. Expect a queue — no
          reservations.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Fergburger restaurant.jpg?width=1600"
            caption: "The ever-busy Fergburger storefront in central Queenstown."
            credit: "Athn, CC BY-SA 3.0, via Wikimedia Commons"
    otherActivities:
      - title: "Clay Cliffs, Omarama"
        description: >
          Otherworldly eroded pinnacle formations, ~20 min walk, via a gravel
          detour off SH8 (small donation for parking). A ~40 min stop if added
          to the drive.
        impact: >
          Skip to save roughly an hour and reach Queenstown sooner, or swap
          the walk for a soak at the nearby Omarama Hot Tubs.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Omarama Clay Cliffs.jpg?width=1600"
            caption: "The eroded pinnacles and ravines of the Omarama Clay Cliffs."
            credit: "Bernard Spragg. NZ, CC0, via Wikimedia Commons"
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Clay Cliffs in morning light.jpg?width=1600"
            caption: "Clay Cliffs catching early morning light."
            credit: "Pseudopanax, Public domain, via Wikimedia Commons"
    stay:
      name: "9 Juniper Place, Frankton, Queenstown 9300"
      area: "Frankton"

  - day: 3
    date: "2026-09-24"
    title: "Ski Day — The Remarkables"
    landmarks: ["The Remarkables", "Queenstown"]
    location:
      name: "Queenstown (Frankton)"
      coords: [-45.0333, 168.7333]
    summary: >
      First relaxed ski day at The Remarkables. Lift tickets valid 9am–4pm,
      but no need to catch the first or last lift. Pick up rental gear first.
    highlights:
      - "Pick up rental gear (skis/board/boots)"
      - "Skiing/snowboarding at The Remarkables"
      - "Dinner at Flame Bar & Grill"
    schedule:
      - time: "09:00"
        activity: "Relaxed morning at accommodation"
        coords: [-45.0333, 168.7333]
        desc: >
          No rush — lift tickets valid 9am–4pm but no need to catch the
          first lift.
      - time: "11:00"
        activity: "Drive to The Remarkables"
        coords: [-45.0534, 168.8139]
        desc: >
          Head to The Remarkables ski field, ~45 min from Frankton via the
          access road (last section is unsealed).
        notes: >
          Pick up our rental gear first — hire skis/board/boots (Snow Centre
          in Queenstown or at the base building). The Remarkables:
          nzski.com/the-remarkables
      - time: "12:00"
        activity: "Ski/snowboard — The Remarkables"
        coords: [-45.0534, 168.8139]
        desc: >
          Lift tickets 9am–4pm — join partway through, no need to ski the
          full window or catch the last lift.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/The Remarkables from Queenstown, New Zealand 02.jpg?width=1600"
            caption: "The Remarkables range rising above Lake Wakatipu."
            credit: "Σ64, CC BY 4.0, via Wikimedia Commons"
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/The Remarkables from Queenstown, New Zealand 08.jpg?width=1600"
            caption: "Snow on The Remarkables above the Wakatipu Basin."
            credit: "Σ64, CC BY 4.0, via Wikimedia Commons"
      - time: "16:30"
        activity: "Drive back to accommodation"
        coords: [-45.0333, 168.7333]
        desc: "Head back once you've had enough on the slopes."
      - time: "19:00"
        activity: "Dinner: Flame Bar & Grill"
        coords: [-45.0341, 168.6588]
        link: "https://flamebargrill.co.nz/"
        desc: >
          South African-style steakhouse on Steamer Wharf, known for ribs
          and steaks, lake and Remarkables views. Confirmed.
      - time: "21:00"
        activity: "Onsen Hot Pools"
        coords: [-44.9987, 168.6928]
        landmark: true
        link: "https://www.onsen.co.nz/"
        desc: >
          Wind down after a day on the slopes in private cedar hot tubs
          overlooking Shotover Canyon, open till 11pm, complimentary shuttle
          available.
        gallery:
          - src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS-OgVOQqoqIO8GFs3Uw1OI4eNufbZFXjOBRyFvl9VZQ&s=10"
            caption: "Private cedar hot tubs at Onsen Hot Pools overlooking Shotover Canyon."
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Shotover River at Shotover Canyon at Arthur's Point.jpg?width=1600"
            caption: "The Shotover River canyon near Arthur's Point — the view the cedar tubs look out over."
            credit: "Pseudopanax, Public domain, via Wikimedia Commons"
    otherActivities:
      - title: "Skyline Gondola"
        description: >
          Ride the steep gondola up Bob's Peak for sunset views over
          Queenstown, plus the luge and the evening Kiwi Haka cultural show.
        impact: >
          Great low-effort post-ski evening — a short drive or walk from the
          waterfront. Book the Kiwi Haka show ahead in peak season.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Skyline Gondola Queenstown.jpg?width=1600"
            caption: "The Skyline Gondola climbing Bob's Peak above Queenstown."
            credit: "Vincent60030, CC BY-SA 4.0, via Wikimedia Commons"
      - title: "Queenstown Hill Time Walk"
        description: >
          A ~4.2km loop (2–3hrs return) climbing through pine forest to
          panoramic views over Lake Wakatipu and The Remarkables.
        impact: >
          Moderate effort — a good leg-stretch if you want more than skiing,
          with the best light late afternoon.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Queenstown, New Zealand - panoramio (23).jpg?width=1600"
            caption: "Panorama over Queenstown and Lake Wakatipu from the hills above town."
            credit: "Michelle Maria, CC BY 3.0, via Wikimedia Commons"
      - title: "TSS Earnslaw evening cruise"
        description: >
          A vintage 1912 coal-fired steamship cruise on Lake Wakatipu, with
          an optional Walter Peak farm BBQ dinner.
        impact: >
          Relaxed alternative to a restaurant dinner; sailings are timed, so
          check the schedule and book ahead.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/TSS Earnslaw Vintage Steamship.jpg?width=1600"
            caption: "The historic TSS Earnslaw steaming across Lake Wakatipu."
            credit: "Jocelyn Kinghorn, CC BY-SA 2.0, via Wikimedia Commons"
      - title: "Frankton Arm Walkway"
        description: >
          Flat, easy lakeside path right from the Frankton accommodation,
          following the Frankton Arm with Remarkables views.
        impact: >
          Very low effort and no booking — an easy stroll before or after
          dinner near the accommodation.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/The Frankton Arm. Lake Wakatipu. NZ (27027500700).jpg?width=1600"
            caption: "The Frankton Arm of Lake Wakatipu, followed by the walkway."
            credit: "Bernard Spragg. NZ, CC0, via Wikimedia Commons"
    stay:
      name: "9 Juniper Place, Frankton, Queenstown 9300"
      area: "Frankton"

  - day: 4
    date: "2026-09-25"
    title: "Ski Day — Coronet Peak"
    landmarks: ["Coronet Peak", "Queenstown"]
    location:
      name: "Queenstown (Frankton)"
      coords: [-45.0333, 168.7333]
    summary: >
      Second relaxed ski day, this time at Coronet Peak — same lift-ticket
      structure as Day 3.
    highlights:
      - "Skiing/snowboarding at Coronet Peak"
      - "Dinner suggestion: Madam Woo (or Fergburger again)"
    schedule:
      - time: "09:00"
        activity: "Relaxed morning at accommodation"
        coords: [-45.0333, 168.7333]
        desc: "No rush — lift tickets valid 9am–4pm."
      - time: "11:00"
        activity: "Drive to Coronet Peak"
        coords: [-44.9269, 168.7364]
        desc: "Coronet Peak — ~25 min from Frankton on a fully sealed alpine road."
      - time: "12:00"
        activity: "Ski/snowboard — Coronet Peak"
        coords: [-44.9269, 168.7364]
        desc: >
          Join partway through, no need to ski the full window or catch the
          last lift.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Snow Fields Coronet Peak NZ 1.jpg?width=1600"
            caption: "Snow fields spread across Coronet Peak."
            credit: "Kimble Young, CC BY-SA 2.0, via Wikimedia Commons"
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Coronet Peak 02.jpg?width=1600"
            caption: "Groomed runs and basin views at Coronet Peak."
            credit: "Kiwi Discovery Queenstown, CC BY 2.0, via Wikimedia Commons"
      - time: "16:30"
        activity: "Drive back to accommodation"
        coords: [-45.0333, 168.7333]
        desc: "Head back once you've had enough on the slopes."
      - time: "19:00"
        activity: "Dinner: Madam Woo (suggestion)"
        coords: [-45.0322, 168.6600]
        link: "https://madamwoo.co.nz/"
        desc: >
          Buzzy Malaysian-inspired hawker food, good casual post-ski spot.
          Feel free to swap for something else.
        tbc: true
        alternatives:
          - title: "Fergburger"
            description: >
              Swap for Fergburger — Queenstown's iconic burger joint. Expect
              a queue, no reservations.
            gallery:
              - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Fergburger 714.jpg?width=1600"
                caption: "A classic Fergburger, Queenstown's most famous burger."
                credit: "Florian Bugiel, CC BY-SA 2.0, via Wikimedia Commons"
      - time: "21:00"
        activity: "Evening activity — open"
        coords: [-45.0333, 168.7333]
        desc: "To be filled in."
        tbc: true
    otherActivities:
      - title: "Kawarau Falls Scenic Reserve"
        description: >
          Short, easy stroll right by Frankton where Lake Wakatipu drains
          into the Kawarau River, with mountain reflections on a calm day.
        impact: >
          Under an hour and very close to the accommodation — easy to slot
          in before dinner.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Kawarau River.jpg?width=1600"
            caption: "The Kawarau River leaving Lake Wakatipu at Kawarau Falls."
            credit: "Sgroey, CC BY-SA 4.0, via Wikimedia Commons"
      - title: "Bob's Cove"
        description: >
          Easy/moderate lakeside walk (~3.3km) west of town with a short,
          steeper detour to a Moke Lake viewpoint — a scenic sunset option.
        impact: >
          A bit further to reach, so best on a lighter ski day when you have
          the afternoon free.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Queenstown Bay in morning light.jpg?width=1600"
            caption: "Lake Wakatipu shoreline near Queenstown — representative of the Bob's Cove walk."
            credit: "Pseudopanax, Public domain, via Wikimedia Commons"
      - title: "Queenstown Ice Arena"
        description: >
          Indoor ice rink in central Queenstown with public skating, ice
          hockey and bumper cars — a fun wet-weather backup.
        impact: >
          Indoors and weatherproof, walkable from the waterfront; check
          public session times.
      - title: "Ice Bar (Below Zero / Minus 5°)"
        description: >
          A bar carved from ice on Steamer Wharf — coats and gloves
          provided, a quick novelty stop for a single drink.
        impact: >
          Short visit, right on the waterfront; easy to combine with dinner.
    stay:
      name: "9 Juniper Place, Frankton, Queenstown 9300"
      area: "Frankton"

  - day: 5
    date: "2026-09-26"
    title: "Flexible Day — Market, Skiing or Hiking"
    landmarks: ["Queenstown", "Coronet Peak"]
    location:
      name: "Queenstown (Frankton)"
      coords: [-45.0333, 168.7333]
    summary: >
      A deliberately flexible day. The Queenstown Lakefront Market runs
      every Saturday and falls right on this date. If legs are tired after
      two days on the mountain, swap a full ski day for a half-day, or skip
      skiing entirely for a light hike near Frankton/Queenstown instead.
    highlights:
      - "Queenstown Lakefront Market"
      - "Optional half-day at Coronet Peak, or a light hike instead"
      - "Dinner suggestion: Bella Cucina"
    schedule:
      - time: "09:00"
        activity: "Queenstown Lakefront Market"
        coords: [-45.0311, 168.6600]
        desc: >
          Every Saturday on the Queenstown lakefront — handmade goods,
          local artisans, live entertainment. Falls right on this day of
          the trip, worth a browse before or after skiing.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Queenstown Bay Lake Wakatipu 01.jpg?width=1600"
            caption: "Queenstown Bay lakefront, where the Saturday market is held."
            credit: "Krzysztof Golik, CC BY-SA 4.0, via Wikimedia Commons"
      - time: "10:00"
        activity: "Relaxed morning at accommodation"
        coords: [-45.0333, 168.7333]
        desc: >
          OPTIONAL/FLEXIBLE DAY — if legs are tired after 2 days on the
          mountain, feel free to skip skiing entirely or just do a
          half-day (e.g. 9am–12pm or 1pm–4pm) instead of the full window.
      - time: "11:00"
        activity: "Drive to Coronet Peak (optional)"
        coords: [-44.9269, 168.7364]
        desc: >
          Back to Coronet Peak. Skip this entirely if opting for a
          rest/activity day instead.
        tbc: true
      - time: "12:00"
        activity: "Ski/snowboard — Coronet Peak (optional, half-day)"
        coords: [-44.9269, 168.7364]
        desc: >
          Half-day option: ski just a morning or afternoon session instead
          of the full 9am–4pm window.
        tbc: true
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Coronet Peak 02.jpg?width=1600"
            caption: "Coronet Peak — an easy half-day option, ~25 min from Frankton."
            credit: "Kiwi Discovery Queenstown, CC BY 2.0, via Wikimedia Commons"
      - time: "16:30"
        activity: "Drive back to accommodation"
        coords: [-45.0333, 168.7333]
        desc: "Head back once you've had enough on the slopes, or after your hike."
      - time: "19:00"
        activity: "Dinner: Bella Cucina (suggestion)"
        coords: [-45.0330, 168.6605]
        desc: >
          Casual wood-fired pizzas and pastas in the Brecon Street dining
          precinct, easier on the wallet than fine dining. Feel free to
          swap for something else.
        tbc: true
      - time: "21:00"
        activity: "Evening activity — open"
        coords: [-45.0333, 168.7333]
        desc: "To be filled in."
        tbc: true
    # Optional extra activities around Queenstown/Frankton. When present, the
    # day page shows a collapsible "Other Activities" section.
    otherActivities:
      - title: "Frankton Arm Walkway"
        description: >
          Flat, easy, stroller-friendly walk right from the accommodation
          base in Frankton, following Lake Wakatipu with Remarkables views.
        impact: >
          Good low-effort swap for skiing — walk a short stretch or the
          full 2–3hr return, then still make it back in time for the
          market or dinner. No booking needed.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/The Frankton Arm. Lake Wakatipu. NZ (27027500700).jpg?width=1600"
            caption: "The Frankton Arm of Lake Wakatipu, followed by the walkway."
            credit: "Bernard Spragg. NZ, CC0, via Wikimedia Commons"
      - title: "Kawarau Falls Scenic Reserve"
        description: >
          Short, easy stroll very close to Frankton with mountain
          reflections on the lake — good if time is tight.
        impact: >
          Minimal time commitment (under an hour), easy to combine with the
          market or an early dinner.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Kawarau River.jpg?width=1600"
            caption: "The Kawarau River leaving Lake Wakatipu at Kawarau Falls, near Frankton."
            credit: "Sgroey, CC BY-SA 4.0, via Wikimedia Commons"
      - title: "Bob's Cove"
        description: >
          Easy/moderate lakeside walk (~3.3km) with a secret Moke Lake
          viewpoint if up for a steeper detour — a nice sunset option.
        impact: >
          Takes a bit longer to reach than the other two, so best if
          skiing is skipped entirely rather than combined with a half-day
          on the mountain.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Queenstown Bay in morning light.jpg?width=1600"
            caption: "Lake Wakatipu shoreline near Queenstown — representative of the Bob's Cove walk."
            credit: "Pseudopanax, Public domain, via Wikimedia Commons"
    stay:
      name: "9 Juniper Place, Frankton, Queenstown 9300"
      area: "Frankton"

  - day: 6
    date: "2026-09-27"
    title: "Final Ski Session & Departure"
    landmarks: ["The Remarkables", "Queenstown"]
    location:
      name: "Queenstown"
      coords: [-45.0333, 168.7333]
      start:
        name: "9 Juniper Place, Frankton, Queenstown 9300"
        coords: [-45.0333, 168.7333]
      end:
        name: "Queenstown Airport (ZQN)"
        coords: [-45.0211, 168.7392]
    summary: >
      A final, shorter ski session, then an early dinner in Frankton before
      returning the rental car and catching the evening flight home.
    highlights:
      - "Final ski/snowboard session at The Remarkables"
      - "Early dinner at The Shelter, Frankton"
      - "Return rental car"
      - "Jetstar JQ224 — ZQN to SYD"
    schedule:
      - time: "09:00"
        activity: "Relaxed morning at accommodation"
        coords: [-45.0333, 168.7333]
        desc: >
          Final ski day — lift tickets valid 9am–4pm, no need to catch the
          first lift. Keep this shorter to leave time for car return and
          the flight.
      - time: "11:00"
        activity: "Drive to The Remarkables"
        coords: [-45.0534, 168.8139]
        desc: "Back to The Remarkables for a final session, ~45 min from Frankton."
      - time: "12:00"
        activity: "Ski/snowboard — The Remarkables"
        coords: [-45.0534, 168.8139]
        desc: >
          Aim to finish by early afternoon to leave time for dinner, car
          return, and the flight.
        notes: "Finish by ~1:00pm"
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/The Remarkables from Queenstown, New Zealand 08.jpg?width=1600"
            caption: "A final run on The Remarkables above the Wakatipu Basin."
            credit: "Σ64, CC BY 4.0, via Wikimedia Commons"
      - time: "13:00"
        activity: "Drive back to accommodation"
        coords: [-45.0333, 168.7333]
        desc: "Shower and pack before heading out for dinner."
      - time: "16:00"
        activity: "Dinner: The Shelter, Frankton"
        coords: [-45.0333, 168.7333]
        link: "https://www.theshelterqueenstown.co.nz/"
        desc: >
          Confirmed — light, airy spot near the airport with Remarkables
          views, burgers/pizzas/vegan options, plenty of parking. Eating
          early avoids any time pressure before the flight.
        notes: "4:00–5:00pm"
      - time: "17:15"
        activity: "Return rental car"
        coords: [-45.0211, 168.7392]
        desc: "Drop off at Queenstown airport before the flight."
        notes: "TODO"
      - time: "18:00"
        activity: "Check-in & security"
        coords: [-45.0211, 168.7392]
        desc: "International flight — arrive with buffer for check-in and security."
      - time: "20:50"
        activity: "Depart Queenstown (ZQN)"
        coords: [-45.0211, 168.7392]
        desc: "Jetstar JQ224, Airbus A320neo. Seats 10A/10B/10C."
      - time: "21:05"
        activity: "Arrive Sydney (SYD)"
        desc: "International Terminal T1."
    otherActivities:
      - title: "Frankton Arm Walkway"
        description: >
          A last flat, easy lakeside stroll straight from the Frankton
          accommodation — minutes from the airport for the departure.
        impact: >
          Very low effort and no booking; ideal for the morning if you'd
          rather skip a final ski session before flying out.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/The Frankton Arm. Lake Wakatipu. NZ (27027500700).jpg?width=1600"
            caption: "The Frankton Arm of Lake Wakatipu, right by the airport."
            credit: "Bernard Spragg. NZ, CC0, via Wikimedia Commons"
      - title: "Kawarau Falls Scenic Reserve"
        description: >
          Quick, easy walk beside Kawarau Falls next to Frankton — a scenic
          spot to stretch your legs before the drive to the airport.
        impact: >
          Under an hour and right on the way to the airport, so it fits even
          on a tight departure-day schedule.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Queenstown Trail Frankton.jpg?width=1600"
            caption: "The lakeside trail around Frankton near Kawarau Falls."
            credit: "André Richard Chalmers, CC BY-SA 4.0, via Wikimedia Commons"
      - title: "Skyline Gondola (only if skipping the ski)"
        description: >
          If you swap the final ski session for a relaxed morning, ride the
          gondola for one last panorama over Queenstown and Lake Wakatipu.
        impact: >
          Only realistic if you skip skiing — leave plenty of buffer for the
          car return and international check-in.
        gallery:
          - src: "https://commons.wikimedia.org/wiki/Special:FilePath/Queenstown Luge.jpg?width=1600"
            caption: "Views over Queenstown from the top of the Skyline Gondola."
            credit: "timsdad, CC BY-SA 3.0, via Wikimedia Commons"
    stay:
      name: "—"
      area: "Flight home"
---

# NZ 2026

This markdown file is the **single source of truth** for the trip website.

- Edit the YAML frontmatter above to change trip details, travelers, flights, or day-by-day plans.
- Run `npm run build` (or `node build.js`) to regenerate the static site into the `docs/` folder.
- The `docs/` folder is what GitHub Pages serves.

Everything below the frontmatter is free-form notes and is **not** used by the build.

## Notes

### Open TODOs
- Book Lake Tekapo accommodation (1 night, Tue 22 Sep)
- Book rental car — needs to be 4WD for winter/snow conditions on Lindis Pass and Crown Range
- Return rental car before the Sun 27 Sep flight — allow ~1hr15 buffer before check-in
- Decide on Day 1 stargazing option (Tekapo Stargazing / Tekapo Chinese Stargazing / Astro Tekapo / self-guided)
- Decide evening activities for Thu 24, Fri 25, and Sat 26 Sep (currently open)
- Confirm whether Sat 26 Sep is a half-day ski, full ski day, or hike-only day

### Post-ski evening activity shortlist (not yet slotted into a specific day)
- Skyline Gondola — sunset views, luge, Kiwi Haka show (skyline.co.nz)
- Ice Bar / Below Zero (Minus 5°) — Steamer Wharf
- TSS Earnslaw evening cruise — vintage steamship, optional Walter Peak BBQ
- Queenstown Ice Arena — skating, ice hockey, bumper cars
- Game Over indoor karting/arcade
- Escape room / mini golf

### Landscapes & hikes shortlist (not yet slotted into a specific day)
- Queenstown Hill "Time Walk" — ~4.2km, 2–3hrs return, panoramic views
- Frankton Arm Walkway — flat, easy, right from the accommodation
- Bob's Cove — ~3.3km lakeside walk, Moke Lake viewpoint option
- Kawarau Falls Scenic Reserve — short, easy, close to Frankton

### Shops & other Queenstown/Frankton spots
- Remarkables Park Town Centre (Frankton) — supermarket, shops, cafés
- Arrowtown shops & bakery
- Vudu Café & Larder / Bespoke Kitchen — popular local cafés

### Image credits still needed
A few day pages don't yet have a verified, appropriately-licensed Wikimedia
Commons image. Good starting points when filling these in:
- Lake Tekapo / Church of the Good Shepherd — see Wikimedia Commons category "Church of the Good Shepherd, Lake Tekapo"
- Lake Pukaki — see Wikimedia Commons Category:Lake Pukaki
- That Wānaka Tree — search Wikimedia Commons for "Wanaka Tree" or "Lake Wanaka"
- Crown Range, Arrowtown, Coronet Peak, The Remarkables — search Wikimedia Commons by name
