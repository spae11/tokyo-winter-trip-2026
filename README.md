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

Shared price engine: `live-price-refresh-v2.js`

Visible/current UX layer: `price-ui-v2.js`

Behavior:
- Main `↻` checks current prices; it is not a plain page reload.
- **Every trip page must show a clear `↻ เช็กราคาล่าสุด` bar.** Do not rely on an invisible/small icon-only refresh control on mobile.
- Refresh checks the registered hotel options, attraction/ticket sources and current FX → THB.
- Default hotel request: **2 travelers / 1 room**.
- Uses saved trip dates.
- Multi-city plans use stay-segment date offsets where defined.
- Shows visible progress immediately (`กำลังเช็ก…`) so the user knows the refresh started.
- Shows a current-price sheet when the check completes.
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
- Sotetsu Fresa Inn Osaka Namba
- Hotel Royal Classic Osaka

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
- Z.Garden — Dali Ancient City South Gate

### Chongqing
- Atour Hotel Chongqing Jiefangbei
- Chongqing Jiefangbei Jiayu Hotel

### Harbin / Yabuli / Snow Town
- Four Points by Sheraton Harbin City Center
- Club Med Yabuli
- Xuexiang Zhanglicheng Homestay

The named options above are shared current-price candidates. A plan can still change hotels later; update the shared catalog when a final hotel is selected.

---

# Booking / price-source links — mandatory

Shared helpers:
- `live-price-booking-links-v1.js`
- `price-booking-click-fix-v1.js`
- `price-ui-v2.js`

Required behavior:
- Hotel name is clickable.
- Show `ดูราคา / จอง ↗` on real hotel cards.
- Hotel booking action must open a **real booking search page**, not Our Journey home and not a generic Google home page.
- Current fallback booking action uses Booking.com search with the hotel name, **2 adults / 1 room**, and saved/current stay dates when available.
- If a live price result has a `sourceUrl`, show a separate `แหล่งราคาที่ตรวจ ↗` link so the user can inspect the same current source.
- Attraction/ticket actions link to the Official/current source used by the price engine.
- Do not pretend the booking-search price is the same as a live source result unless it was actually verified.

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

# Mobile hotel-card standard

Hotel cards must stay compact and readable on a phone.

Required:
- Hotel name must not dominate the full card.
- Keep badge/button rows compact and aligned.
- Price box should use smaller supporting text and a clear primary price line.
- Do not create an oversized blank frame/padding area.
- Booking button and location/source links must remain easy to tap.

Hong Kong has an explicit compact override in `price-ui-v2.js` because the shared plan styles previously made the hotel title/card too large on mobile.

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
- `price-ui-v2.js`
- `live-price-booking-links-v1.js`
- `price-booking-click-fix-v1.js`
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
7. Preserve the source URL so the user can inspect the same/current source.
8. Prefer Official sources for attractions when available; use a current booking source when an accessible Official price source is unavailable.

---

# Test checklist before calling a trip complete

- Home → trip opens.
- Trip → home returns.
- Mobile layout works.
- Trip Tools opens; tabs are not clipped.
- Trip appears in Trip Tools.
- Dates save correctly.
- Home refresh exists and does not just reload.
- **Visible `↻ เช็กราคาล่าสุด` appears on the trip page.**
- Tapping refresh immediately shows `กำลังเช็ก…` / a loading sheet.
- Live/Last Checked label is truthful.
- Named hotel appears and can be price-checked.
- Hotel name / `ดูราคา / จอง ↗` opens an external booking page, not Our Journey home.
- `แหล่งราคาที่ตรวจ ↗` opens when a current source URL exists.
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
- `live-price-refresh-v2.js` — shared price engine / legacy price UI
- `price-ui-v2.js` — clear per-trip refresh bar, full hotel catalog, result sheet and mobile hotel-card overrides
- `live-price-booking-links-v1.js` — source/booking link helper
- `price-booking-click-fix-v1.js` — forces hotel name/button to a real external booking search
- `cloudflare/worker.js` — API router
- `cloudflare/live-prices.js` — hotel / FX / ticket current-price backend
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/cloudflare-control.yml` — Cloudflare Worker deployment

---

# Current coverage status

As of **2026-08-23**:

- Tokyo — current-price framework ✅ named hotel ✅ ticket source ✅ booking links ✅ visible trip refresh ✅
- Kansai — current-price framework ✅ named hotel options ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅
- Hong Kong — current-price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ compact mobile hotel cards ✅
- Da Nang — current-price framework ✅ named hotels ✅ ticket source ✅ booking links ✅ visible trip refresh ✅
- Yunnan — current-price framework ✅ named Kunming/Dali hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅
- Chongqing — current-price framework ✅ named Jiefangbei hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅
- Harbin — current-price framework ✅ named Harbin/Yabuli/Snow Town stays ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅

**Functional registration is complete across all seven trips.** Live price success still depends on the external source responding and exposing a verifiable price at refresh time.

---

# Change Log

## 2026-08-23 — Visible refresh + booking-link + mobile-card fix
- Added `price-ui-v2.js` and loaded it from `ui-motion-v1.js` on home/trip pages.
- Replaced the confusing icon-only trip refresh UX with a clear `↻ เช็กราคาล่าสุด` bar.
- Refresh now shows visible progress immediately.
- Added/normalized named hotel choices for all seven trip routes.
- Added stay-segment logic for multi-city trips where applicable.
- Added `price-booking-click-fix-v1.js` so hotel name / `ดูราคา / จอง ↗` opens a real external Booking.com search instead of returning to Our Journey home.
- Kept current-price `sourceUrl` as a separate `แหล่งราคาที่ตรวจ ↗` link.
- Compactified Hong Kong hotel cards on mobile: smaller title, image, padding, badges and price box.
- Kept price truth rules: failed/stale checks are never labeled LIVE.

## 2026-08-23 — Full price/booking parity across all trips
- Added shared live-price framework across all seven trips.
- Expanded current attraction/ticket source catalog to all seven trips.
- Added named hotel candidates for Kansai, Yunnan, Chongqing and Harbin segments.
- Preserved existing Tokyo, Hong Kong and Da Nang hotel candidates.

## Rule for every future meaningful update
Update this README / Change Log whenever architecture, setup, behavior, trip parity, price coverage or known limitations change.
