# Our Journey Travel Hub

Travel planning PWA for all trips in **Our Journey**.

> **READ THIS README BEFORE ADDING OR MODIFYING A TRIP.**
> A new trip is not complete after only creating `<trip>/index.html`. It must inherit the shared functions listed below.

> **README / CHANGE LOG RULE — MANDATORY**
> Whenever any trip function, shared UI, price logic, booking behavior, navigation, hide/unhide behavior, storage key, route coverage or architecture is changed, update this README in the **same improvement round**. README must never lag behind the code.

---

## Current trip registry

- `tokyo`
- `kansai`
- `hongkong`
- `danang`
- `yunnan`
- `chongqing`
- `harbin`

All shared trip features must cover every route above and every future route.

---

# New Trip = Full Feature Parity

Before adding a new trip:

1. Read this README.
2. Inspect the newest shared implementation, not only another trip's HTML.
3. Register the new route in Home, Trip Tools, PWA/shared injection, price refresh, live-budget sync, quick-section navigation, hide/unhide, booking/source links and Memories/Sync where applicable.
4. Give the new trip every applicable function the existing trips already have.
5. Test mobile layout and navigation.
6. Update this README / Change Log in the same round.

A trip is not complete until the checklist at the bottom passes.

---

# Standard functions every trip must inherit

## Our Journey integration

- Home trip card.
- Country/region relationship and map behavior.
- Start/end dates in shared state.
- Same Home ↔ Trip navigation behavior.
- PWA/shared script injection.

## Trip page

- Mobile-friendly header/navigation.
- Daily itinerary and day chips.
- Quick Edit.
- Maps / location links.
- Hotel/stay section or registered named hotel options.
- Budget breakdown.
- Transport notes.
- Muslim / halal / prayer information when relevant.
- Visible `↻ เช็กราคา` action.
- Persistent `☰ หัวข้อ` quick-jump action.
- Sensible hide/unhide for long secondary sections.
- Same shared booking/source-link rules.

## Trip Tools

The trip must be selectable and support the applicable tools:

- Today / itinerary
- Expense tracking
- Map
- Wallet
- Muslim / halal
- Search
- Notes
- Sync
- Settings

## Memories / cloud

Keep compatibility with:

- Memories / locations
- Photos / media / documents
- Cloud sync
- Google Photos / Drive where enabled
- Notes / wallet sync
- Delete-everywhere and media management

---

# Current Price System

Shared client:

- `live-price-v2.js`

Budget/ticket sync:

- `trip-live-budget-sync-v1.js`

Long-page / booking UX:

- `trip-page-ux-v1.js`

Backend:

- `cloudflare/live-prices.js`
- `cloudflare/worker.js`

Loader:

- `ui-motion-v1.js`

## Refresh rules

- Every trip page has a clear `↻ เช็กราคา` button.
- **Trip-page Refresh checks only the current trip.**
- **Home Refresh checks all registered trips.**
- Default hotel request: **2 travelers / 1 room**.
- Use saved trip dates whenever available.
- Trip Tools start date is synchronized into the shared price-date state before checking when needed.
- A trip result sheet must show only that trip.
- Refreshing one trip must not overwrite, refresh or relabel another trip as LIVE.
- Latest per-trip snapshots are stored in `travelHubTripPricesV1`.
- Merged shared snapshots remain in `travelHubLivePricesV2`.
- Hotel cards, ticket summary and live-aware budget update from the newest stored snapshot.

## Price truth rules

1. `LIVE` = successfully verified during the current/recent refresh.
2. `LAST CHECKED` = previously verified and timestamped.
3. If verification fails, show unavailable/check failed.
4. Never silently show an old value as LIVE.
5. If dates are missing, keep hotel total as an estimate and ask for dates rather than inventing a precise stay total.
6. Only claim taxes/fees when the source provides enough information.
7. Planning budgets can mix `LIVE` and `ESTIMATE`, but the distinction must be visible.

---

# Hotel Booking vs Price Source

These are **two separate links** and must not be mixed.

## Main hotel booking action

- Hotel name is clickable.
- Main button text: **`จองโรงแรม ↗`**.
- Hotel name and booking button open a Booking.com hotel search constrained by:
  - exact hotel name
  - saved check-in/check-out when available
  - 2 adults
  - 1 room
  - THB display preference
- Booking clicks must not be intercepted by Our Journey navigation.
- Booking clicks must never return the user to Our Journey Home.
- The same rule applies inside the current-price result sheet, not only on the hotel card.

## Current price-source link

- If the latest verified hotel price came from Google Hotels or another source, show a separate smaller link:
  - **`ดูแหล่งราคาที่เช็ก ↗`**
- This link preserves the source used for that price result.
- Do not use the broad Google Hotels landing page as the main hotel booking action.

## Attraction / ticket links

- Attraction/ticket names open their Official/current source.
- Registered source does not guarantee LIVE parsing; the source link can still remain available when parsing fails.

---

# Ticket Link UI

- `🎟️ ราคา / ลิงก์ตั๋ว` is **collapsed by default** on every trip page.
- Tap the heading to expand/collapse.
- This keeps mobile pages compact while keeping the official/current links accessible.

---

# Live-aware Trip Budget

The visible `TRIP BUDGET • 2 PEOPLE` area is a hybrid of verified current prices and planning estimates.

Rules:

1. A verified current hotel total may replace the hotel estimate.
2. Ticket/activity budget may replace its estimate only when the required registered ticket sources for that trip are successfully verified.
3. Flight, food, transport, eSIM, insurance and other categories without reliable live sources stay visibly marked `ESTIMATE`.
4. The visible total is recalculated from the category values currently shown.
5. Show the last checked timestamp and how many categories currently use LIVE data.
6. Never silently present an estimate as a current price.
7. The budget heading must use the **current hotel choice/catalog**, not an old hardcoded hotel name.
8. If a verified hotel exists, the budget heading may show that hotel.
9. Hong Kong mode must respect trip length:
   - `5D4N` → 4 hotel nights / 5 food days
   - `6D5N` → 5 hotel nights / 6 food days
10. The old Travelodge wording must not be used as the current Hong Kong stay when the plan uses Ramada/other current choices.
11. These rules apply to all registered trips.

---

# Long-page UX: Quick Jump + Hide/Unhide

Long trip pages must remain easy to use on a phone.

## Quick Jump

- Every trip page shows a persistent **`☰ หัวข้อ`** button.
- The button is positioned above the bottom navigation so it does not cover Trips / Map / Memories / More.
- Tapping it opens a compact list generated from the headings currently present on that page.
- Includes `บนสุด` / Back to Top.
- Selecting a heading smoothly scrolls to that section.
- If the destination is collapsed, it opens before scrolling.
- Quick Jump is scoped to **trip pages only** and must not appear on Home.

## Hide / Unhide

Primary content should remain easy to reach:

- Hotel/stay: normally open
- Daily itinerary: normally open / controlled by the existing day UI

Secondary or long supporting content may start collapsed when appropriate, including:

- Budget details
- Best season / suitable travel period
- Preparation / checklist
- Souvenir guide
- Travel apps / supporting guides
- Muslim / halal supporting sections when long
- Similar secondary information added later

Every generic collapsed section must have a clear:

- `ดูรายละเอียด ⌄`
- `ซ่อน ⌃`

Open/closed preference can be stored per trip in `tripSectionOpenV1`.

---

# Hotel-card Mobile Standard

Hotel cards must stay readable and compact across all trips.

- Long hotel names wrap naturally.
- Mobile hotel-name typography must not be oversized.
- Do not show a dashed underline across a multi-line hotel name.
- Badges must wrap cleanly.
- Booking button stays compact.
- `จองโรงแรม ↗` and `ดูแหล่งราคาที่เช็ก ↗` are visually separate.
- If a verified current hotel result exists, the visible price box can update to the current nightly/stay total and timestamp.
- If no current result exists, old hardcoded card prices must be treated as a **sample/snapshot**, not implied to be LIVE.

---

# Current Hotel Coverage

### Tokyo

- APA Hotel Asakusa Tawaramachi-Ekimae
- Richmond Hotel Premier Asakusa International

### Kansai

- Sotetsu Fresa Inn Osaka-Namba
- Hotel Keihan Namba Grande

### Hong Kong

- Silka Far East Hotel
- Ramada Grand Tsim Sha Tsui
- Silka Tsuen Wan, Hong Kong
- Dorsett Mongkok, Hong Kong

### Da Nang + Hoi An

- HAIAN Beach Hotel & Spa
- Little Riverside Hoi An

### Yunnan

- Holiday Inn Express Kunming Panlong, an IHG Hotel
- Dali Old Courtyard Boutique Inn

### Chongqing

- Glenview ITC Plaza Chongqing
- Ascott Raffles City Chongqing

### Harbin / Yabuli

- Holiday Inn Express Harbin Central Avenue
- Fairfield by Marriott Harbin Downtown
- Yabuli Sun Mountain Resort

The shared UI may also scan real named hotel cards already present on a trip page. `Hotel TBD` is never treated as a real hotel.

---

# Current Attraction / Ticket Coverage

### Tokyo

- Tokyo Disneyland 1-Day Passport

### Kansai

- Osaka Castle Museum
- Umeda Sky Building Kuchu Teien Observatory
- Kinkaku-ji

### Hong Kong

- Hong Kong Disneyland
- Ngong Ping 360
- Peak Tram / Sky Terrace

### Da Nang

- Sun World Ba Na Hills

### Yunnan

- Stone Forest Scenic Area
- Chongsheng Temple & Three Pagodas

### Chongqing

- Yangtze River Cableway
- Wulong Three Natural Bridges
- Dazu Rock Carvings

### Harbin

- Harbin Ice and Snow World
- Yabuli / Ski Resort
- China Snow Town (Xuexiang)

Only successfully parsed current values may be marked LIVE.

---

# PWA / Shared Registration Checklist

A new trip must be checked in the relevant shared route lists/files, including at minimum:

- `sw.js`
- Home route transitions
- `trip-tools-v1.js`
- `plan-first-v1.js`
- `plan-first-v2.js`
- `plan-ui-fixes-v1.js`
- `ui-motion-v1.js`
- `live-price-v2.js`
- `trip-live-budget-sync-v1.js`
- `trip-page-ux-v1.js`
- `cloudflare/live-prices.js`

China trips should prefer Amap where appropriate, with Google Maps as backup when useful.

---

# Key Shared Files

- `index.html` — Home / dates / maps / trip cards
- `sw.js` — PWA + shared page injection
- `trip-tools-v1.js` / `trip-tools-v1.css` — Trip Tools
- `trip-cloud-sync-v3.js` — cloud state sync
- `plan-extras-v1.js` — planning extras + base budget breakdown
- `plan-ui-fixes-v1.js` — shared mobile fixes
- `plan-first-v1.js` / `plan-first-v2.js` — Plan First UI
- `ui-motion-v1.js` — shared loader for price/budget/long-page modules
- `live-price-v2.js` — trip-scoped current-price refresh + per-trip snapshots
- `trip-live-budget-sync-v1.js` — collapsed ticket section + LIVE/ESTIMATE budget synchronization
- `trip-page-ux-v1.js` — quick section navigation, sensible hide/unhide, mobile hotel typography, Booking.com booking destination and separate checked-price source link
- `cloudflare/worker.js` — API router
- `cloudflare/live-prices.js` — hotel / FX / ticket current-price backend
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/cloudflare-control.yml` — Cloudflare Worker deployment

---

# Current Coverage Status — 2026-08-23

- Tokyo — price framework ✅ hotel options ✅ ticket source ✅ booking destination ✅ trip refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ hide/unhide ✅
- Kansai — price framework ✅ hotel options ✅ ticket sources ✅ booking destination ✅ trip refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ hide/unhide ✅
- Hong Kong — price framework ✅ hotel options ✅ ticket sources ✅ Booking.com main booking ✅ separate checked-price source ✅ compact mobile hotel card ✅ mode-aware budget ✅ stale Travelodge runtime header removed ✅ collapsed ticket links ✅ quick jump ✅ hide/unhide ✅
- Da Nang — price framework ✅ hotel options ✅ ticket source ✅ booking destination ✅ trip refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ hide/unhide ✅
- Yunnan — price framework ✅ hotel options ✅ ticket sources ✅ booking destination ✅ trip refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ hide/unhide ✅
- Chongqing — price framework ✅ hotel options ✅ ticket sources ✅ booking destination ✅ trip refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ hide/unhide ✅
- Harbin — price framework ✅ hotel options ✅ ticket sources ✅ booking destination ✅ trip refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ hide/unhide ✅

Functional registration is complete across all seven routes. A LIVE price still depends on the external source responding with a value the backend can verify.

---

# Test Checklist Before Calling a Trip Complete

- Home → trip opens.
- Trip → Home returns.
- Mobile layout works.
- Trip Tools opens; tabs are not clipped.
- Trip appears in Trip Tools.
- Dates save correctly.
- `↻ เช็กราคา` is visible.
- Refresh immediately shows progress.
- Trip refresh sends only the current trip ID.
- Result sheet shows only the current trip.
- Successful refresh updates only that trip's snapshot and visible hotel/ticket/budget data.
- Other trips remain unchanged.
- `🎟️ ราคา / ลิงก์ตั๋ว` starts collapsed and can expand.
- `☰ หัวข้อ` is visible above the bottom navigation.
- Quick Jump lists the current page headings and Back to Top.
- Jumping to a collapsed section opens it and scrolls correctly.
- Secondary sections hide/unhide without breaking layout or dynamic content.
- Hotel names remain readable on mobile.
- Hotel name / `จองโรงแรม ↗` opens Booking.com for that named hotel with dates when available.
- The same booking rule works inside the price result sheet.
- `ดูแหล่งราคาที่เช็ก ↗` opens the actual current price source when available.
- Booking does not return to Our Journey Home.
- Attraction source link opens.
- Budget uses current hotel choice/mode rather than stale hardcoded wording.
- `5D4N` / `6D5N` night/day counts are correct where applicable.
- LIVE / ESTIMATE / LAST CHECKED labels are truthful.
- Offline/PWA behavior is not broken.
- Existing trips are not regressed.
- README / Change Log is updated in the same improvement round.

---

# Change Log

## 2026-08-23 — Final long-page UX + booking destination pass

- Added `trip-page-ux-v1.js` across all seven trip routes.
- Added persistent `☰ หัวข้อ` quick navigation generated from the actual current page headings.
- Quick Jump now opens a collapsed destination before scrolling.
- Quick Jump is trip-page-only and does not appear on Home.
- Positioned Quick Jump dynamically above the bottom navigation.
- Added generic sensible hide/unhide for long supporting sections while preserving hotel/stay and itinerary as primary content.
- Added per-trip section open-state storage in `tripSectionOpenV1`.
- Changed hotel title and main booking action to Booking.com search using hotel name + saved dates + 2 adults + 1 room.
- Added capture-level booking handling so older navigation handlers cannot redirect the click back to Our Journey Home.
- Applied the same corrected hotel booking destination inside the current-price result sheet.
- Kept `ดูแหล่งราคาที่เช็ก ↗` separate from the main booking destination.
- Reduced mobile hotel-name size and removed dashed multi-line link styling.
- Current verified hotel results can refresh the visible hotel price box; static old prices are treated as snapshots when no current result exists.
- Added Trip Tools date fallback/synchronization before current-price use.
- Updated live-aware budget heading to use the current trip mode and current/verified hotel instead of stale Travelodge wording.
- Reaffirmed mandatory README updates for every future trip-function improvement.

## 2026-08-23 — Collapsed ticket links + live-aware budget sync

- Added `trip-live-budget-sync-v1.js`.
- `🎟️ ราคา / ลิงก์ตั๋ว` starts collapsed on every trip.
- Connected visible budget cards to the newest per-trip snapshot.
- Verified hotel totals can replace hotel estimate.
- Ticket budget changes to LIVE only when the required registered ticket sources are verified.
- Non-live categories remain visibly `ESTIMATE`.
- Hong Kong `5D4N` uses 4 hotel nights and 5 food days.

## 2026-08-23 — Trip-scoped Refresh

- Trip-page Refresh changed from all trips to the current trip only.
- Home Refresh remains all-trip.
- Added per-trip price snapshots in `travelHubTripPricesV1`.
- Refreshing one trip preserves other trip snapshots and timestamps.

## 2026-08-23 — Unified Live Price

- Consolidated overlapping price UI into the shared live-price module.
- Added visible trip Refresh.
- Added hotel options and attraction/ticket price-source coverage across all seven trip groups.
- Added hotel/ticket links and mobile price UI.

---

## Rule for every future meaningful update

**Update this README / Change Log whenever architecture, setup, behavior, trip parity, navigation, booking, price coverage, hide/unhide behavior or known limitations change.**
