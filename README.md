# Our Journey Travel Hub

Travel planning PWA for all trips in **Our Journey**.

> **IMPORTANT — READ THIS README BEFORE ADDING OR MODIFYING A TRIP.**
> A new trip must inherit the same shared functions as the existing trips. Do not finish a new trip after only creating `<trip>/index.html`.

## Current trip registry

- `tokyo`
- `kansai`
- `hongkong`
- `danang`
- `yunnan`
- `chongqing`
- `harbin`

---

# Mandatory rule: New Trip = Full Feature Parity

Before adding a new trip:

1. Read this README.
2. Inspect the current shared implementation.
3. Register the trip everywhere required.
4. Give it every applicable shared feature below.
5. Update this README / Change Log when architecture or coverage changes.

## Standard features every trip must inherit

### Our Journey integration
- Home/trip card.
- Country/region map relationship.
- Start/end dates in `travelHubStateV2`.
- Same home ↔ trip navigation behavior.

### Trip page
- Mobile-friendly header/navigation.
- Daily itinerary.
- Maps / location links.
- Budget.
- Hotel/stay section.
- Transport notes.
- Muslim / halal / prayer information when relevant.
- Same shared UI/mobile fixes.

### Trip Tools
The trip must be selectable in Trip Tools and inherit applicable:
- Today / itinerary
- Expense tracking
- Map
- Wallet
- Muslim / halal
- Search
- Notes
- Sync
- Settings

### Memories / cloud
Keep compatibility with:
- Memories / locations
- Photos / media
- Cloud sync
- Google Photos / Drive where enabled
- Notes / wallet sync
- Delete-everywhere and media management

---

# Live Price Refresh — mandatory for every trip

Shared client: `live-price-refresh-v2.js`

Behavior:
- Main `↻` checks current prices; it is not a plain page reload.
- Every trip page also gets its own `↻` current-price button automatically.
- Default hotel request: **2 travelers / 1 room**.
- Uses saved trip dates.
- Multi-city plans can use hotel date offsets for the relevant stay segment.
- Checks current hotel pricing via Google Hotels current listing.
- Checks current FX → THB.
- Checks attraction/ticket prices from Official or current booking sources.
- Shows `Live checked` / `Last checked` truthfully.
- If verification fails, show unavailable/check failed. **Never show an old value as LIVE.**
- If dates are missing, ask for dates instead of inventing a hotel price.

Backend:
- `cloudflare/live-prices.js`
- routed by `cloudflare/worker.js`

## Hotel catalog currently registered

### Tokyo
- APA Hotel Asakusa Tawaramachi-Ekimae

### Kansai
- Holiday Inn Osaka Namba

### Hong Kong
- Silka Far East Hotel
- Ramada Grand Tsim Sha Tsui
- Silka Tsuen Wan, Hong Kong
- Dorsett Mongkok, Hong Kong

### Da Nang + Hoi An
- HAIAN Beach Hotel & Spa
- Little Riverside Hoi An

### Yunnan
- Atour X Hotel Kunming Old Street Wuyi Road
- Hilton Garden Inn Dali Ancient City

### Chongqing
- Four Points by Sheraton Chongqing

### Harbin / Yabuli / Snow Town
- Home2 Suites by Hilton Harbin Central Street
- Club Med Yabuli Resort
- Xuexiang Zhanglicheng Homestay

The named options above are shared live-price candidates. A plan can still change hotels later; update the shared catalog when a final hotel is selected.

---

# Booking / price-source links — mandatory

Shared client: `live-price-booking-links-v1.js`

Required behavior:
- Hotel name is clickable.
- Show `ดูราคา / จอง ↗` even before a successful live refresh when a real hotel name exists.
- Before a live result exists, hotel link opens a Google Hotels search using the saved dates when available.
- After live refresh, use the latest returned `sourceUrl` when available.
- Live hotel result shows `จอง / ดูราคาที่เจอ ↗`.
- Attraction/ticket names link to the source used for current price checking.
- Never hard-code a fake price source if the current source is unavailable.

---

# Attraction / ticket source coverage

Current price-source catalog is registered for **all seven trip routes**.

### Tokyo
- Tokyo Disneyland 1-Day Passport — Official

### Kansai
- Osaka Castle Museum — Official
- Umeda Sky Building Kuchu Teien Observatory — Official
- Kinkaku-ji — Official

### Hong Kong
- Hong Kong Disneyland — Official
- Ngong Ping 360 — Official
- Peak Tram / Sky Terrace — Official

### Da Nang
- Sun World Ba Na Hills — Official

### Yunnan
- Stone Forest Scenic Area — current booking source
- Chongsheng Temple & Three Pagodas — current booking source

### Chongqing
- Yangtze River Cableway — current booking source
- Wulong Three Natural Bridges — current booking source
- Dazu Rock Carvings — current booking source

### Harbin
- Harbin Ice and Snow World — current booking source
- Club Med Yabuli / Ski Resort — Club Med Official
- China Snow Town (Xuexiang) — current booking source

Important: **registered source ≠ guaranteed LIVE result.** Websites can block automated reads or change markup. Only a successfully parsed value during the current refresh may be labeled LIVE. The source link must still remain useful when price parsing is unavailable.

---

# PWA / shared registration

A new trip must be checked in all relevant shared route lists and PWA behavior.

Check at minimum:
- `sw.js` plan path detection / CORE where applicable
- Home → trip transition route list
- `trip-tools-v1.js`
- `plan-ui-fixes-v1.js`
- shared bottom navigation / plan-first UI
- collapse/expand and motion scripts
- `live-price-refresh-v2.js`
- `live-price-booking-links-v1.js`
- `cloudflare/live-prices.js`

China trips should prefer Amap where appropriate, with Google Maps as backup when useful.

---

# Price truth rules

1. `LIVE` = successfully verified in the current/recent refresh.
2. Planning budgets remain estimates.
3. Previous observed prices must never silently become current prices.
4. Failed verification must show unavailable/check failed.
5. Use real saved trip dates whenever possible.
6. Only claim taxes/fees when the source provides enough information.
7. Preserve the source URL so the user can open the same/current source.
8. Prefer Official sources for attractions when available; use a current booking source when an accessible Official price source is unavailable.

---

# Test checklist before calling a trip complete

- Home → trip opens.
- Trip → home returns.
- Mobile layout works.
- Trip Tools opens; tabs are not clipped.
- Trip appears in Trip Tools.
- Dates save correctly.
- `↻` exists on home and trip page.
- `↻` checks prices instead of just reloading.
- Live/Last Checked label is truthful.
- Named hotel appears and can be price-checked.
- Hotel name / `ดูราคา / จอง ↗` opens.
- Attraction source link opens.
- Offline/PWA behavior is not broken.
- Existing trips are not regressed.

---

# Key shared files

- `index.html` — home / dates / maps / trip cards
- `sw.js` — PWA + shared page injection
- `trip-tools-v1.js` / `trip-tools-v1.css` — Trip Tools
- `trip-cloud-sync-v3.js` — cloud state sync
- `plan-ui-fixes-v1.js` — shared mobile fixes
- `ui-motion-v1.js` — shared UI + module loader
- `live-price-refresh-v2.js` — all-trip current price refresh + per-trip refresh button + shared hotel options
- `live-price-booking-links-v1.js` — hotel/ticket click-through links
- `cloudflare/worker.js` — API router
- `cloudflare/live-prices.js` — hotel / FX / ticket current-price backend
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/cloudflare-control.yml` — Cloudflare Worker deployment

---

# Current coverage status

As of **2026-08-23**:

- Tokyo — shared live-price framework ✅ named hotel ✅ ticket source ✅ booking links ✅ per-trip refresh ✅
- Kansai — shared live-price framework ✅ named hotel ✅ ticket sources ✅ booking links ✅ per-trip refresh ✅
- Hong Kong — shared live-price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ per-trip refresh ✅
- Da Nang — shared live-price framework ✅ named hotels ✅ ticket source ✅ booking links ✅ per-trip refresh ✅
- Yunnan — shared live-price framework ✅ named Kunming/Dali hotels ✅ ticket sources ✅ booking links ✅ per-trip refresh ✅
- Chongqing — shared live-price framework ✅ named hotel ✅ ticket sources ✅ booking links ✅ per-trip refresh ✅
- Harbin — shared live-price framework ✅ named Harbin/Yabuli/Snow Town stays ✅ ticket sources ✅ booking links ✅ per-trip refresh ✅

**Functional coverage is now registered across all seven trips.** Live price success still depends on the external source responding and exposing a verifiable price at refresh time.

---

# Change Log

## 2026-08-23 — Full price/booking parity across all trips
- Added `live-price-refresh-v2.js`.
- Added a `↻` current-price control to every trip page via shared code.
- Added named hotel candidates for Kansai, Yunnan, Chongqing and Harbin segments.
- Preserved existing Tokyo, Hong Kong and Da Nang hotel candidates.
- Expanded current attraction/ticket source catalog to all seven trips.
- Expanded booking-link detection for Atour, Hilton/Home2, Four Points, Club Med and homestay-type stays.
- Hotel and attraction names can open price/booking sources.
- Updated truth rules so unavailable sources cannot be shown as LIVE.

## Rule for every future meaningful update
Update this README / Change Log whenever architecture, setup, behavior, trip parity, price coverage or known limitations change.
