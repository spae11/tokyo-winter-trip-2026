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
2. Inspect the newest shared implementation.
3. Register the new route in Home, Trip Tools, PWA/shared injection, price refresh and booking/source-link systems.
4. Give it every applicable function the existing trips already have.
5. Update this README / Change Log whenever architecture or trip coverage changes.

A trip is not complete until mobile layout, Trip Tools, Memories/Sync, live-price refresh and external booking/source links are checked.

---

# Standard functions every trip must inherit

## Our Journey integration
- Home/trip card.
- Country/region map relationship.
- Start/end dates in `travelHubStateV2`.
- Same Home ↔ Trip navigation behavior.

## Trip page
- Mobile-friendly header/navigation.
- Daily itinerary.
- Maps / location links.
- Budget.
- Hotel/stay section or shared named hotel options.
- Transport notes.
- Muslim / halal / prayer information when relevant.
- Quick Edit / day chips.
- Same shared UI/mobile fixes.

## Trip Tools
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

## Memories / cloud
Keep compatibility with:
- Memories / locations
- Photos / media / documents
- Cloud sync
- Google Photos / Drive where enabled
- Notes / wallet sync
- Delete-everywhere and media management

---

# Unified Live Price v3 — mandatory for every trip

Shared price UI/client:
- `live-price-v2.js`

Backend:
- `cloudflare/live-prices.js`
- routed by `cloudflare/worker.js`

Loader:
- `ui-motion-v1.js`

## Required behavior

- **Every trip page must show a clear `↻ เช็กราคา` button** near the Plan / Quick Edit controls.
- Home Refresh also checks prices; it must not be only a page reload.
- One refresh checks registered hotel options, attraction/ticket sources and current FX → THB.
- Default hotel request: **2 travelers / 1 room**.
- Uses saved trip dates.
- Shows visible progress immediately so the user knows Refresh started.
- Shows a current-price sheet when the check completes.
- Shows `LIVE` / `LAST CHECKED` truthfully.
- If verification fails, show unavailable/check failed. **Never show an old value as LIVE.**
- If dates are missing, ask for dates instead of inventing an exact hotel total.

## Booking / price-source links

- Hotel name is clickable.
- Show `ดูราคา / จอง ↗` on real hotel cards / shared hotel options.
- A hotel click must open an external hotel pricing/booking page, never Our Journey Home.
- When a live result returns a `sourceUrl`, that current source is used.
- Without a live source, fallback hotel search uses the hotel name + saved trip dates when available.
- Attraction/ticket names open the Official/current source used by the backend.
- External booking clicks must stop app navigation handlers so they are not intercepted by Home navigation.

---

# Current all-trip hotel coverage

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

The shared UI also scans real named hotel cards already present on each trip page. `Hotel TBD` is never treated as a real hotel.

---

# Attraction / ticket source coverage

Current price-source catalog is registered for **all seven trip routes**.

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

Important: **registered source ≠ guaranteed LIVE result.** Websites can block automated reads or change markup. Only a successfully parsed value during the current refresh may be labeled LIVE. The source link should still remain useful when parsing fails.

---

# Hong Kong mobile hotel-card standard

Hong Kong hotel cards must stay compact and readable on a phone:

- Smaller image height.
- Controlled responsive hotel-name size and line height.
- Badges wrap cleanly.
- Price box uses tighter spacing.
- `ดูราคา / จอง ↗` stays separate from price/status text.
- Long hotel names must not create oversized cards.

The unified `live-price-v2.js` applies the compact mobile override.

---

# PWA / shared registration

A new trip must be checked in all relevant shared route lists and PWA behavior.

Check at minimum:
- `sw.js` plan path detection / CORE where applicable
- Home → trip transition route list
- `trip-tools-v1.js`
- `plan-first-v1.js`
- `plan-first-v2.js`
- `plan-ui-fixes-v1.js`
- shared bottom navigation / plan-first UI
- `ui-motion-v1.js`
- `live-price-v2.js`
- `cloudflare/live-prices.js`

China trips should prefer Amap where appropriate, with Google Maps as backup when useful.

---

# Price truth rules

1. `LIVE` = successfully verified in the current/recent refresh.
2. `LAST CHECKED` = previously verified with a timestamp.
3. Planning budgets remain estimates.
4. Previous observed prices must never silently become current prices.
5. Failed verification must show unavailable/check failed.
6. Use real saved trip dates whenever possible.
7. Only claim taxes/fees when the source provides enough information.
8. Preserve/open the current source URL or a safe booking search URL.
9. Prefer Official sources for attractions when available; otherwise label the current booking source honestly.

---

# Test checklist before calling a trip complete

- Home → trip opens.
- Trip → home returns.
- Mobile layout works.
- Trip Tools opens; tabs are not clipped.
- Trip appears in Trip Tools.
- Dates save correctly.
- **Visible `↻ เช็กราคา` appears on the trip page.**
- Tapping Refresh immediately shows loading/progress.
- Live/Last Checked label is truthful.
- Named hotel appears and can be price-checked.
- Hotel name / `ดูราคา / จอง ↗` opens an external booking/price page, not Our Journey Home.
- Attraction source link opens.
- Offline/PWA behavior is not broken.
- Existing trips are not regressed.

---

# Key shared files

- `index.html` — Home / dates / maps / trip cards
- `sw.js` — PWA + shared page injection
- `trip-tools-v1.js` / `trip-tools-v1.css` — Trip Tools
- `trip-cloud-sync-v3.js` — cloud state sync
- `plan-ui-fixes-v1.js` — shared mobile fixes
- `plan-first-v1.js` / `plan-first-v2.js` — Plan First UI
- `ui-motion-v1.js` — shared UI + unified price module loader
- `live-price-v2.js` — current price refresh, result sheet, hotel/ticket links and mobile hotel-card overrides
- `cloudflare/worker.js` — API router
- `cloudflare/live-prices.js` — hotel / FX / ticket current-price backend
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/cloudflare-control.yml` — Cloudflare Worker deployment

---

# Current coverage status

As of **2026-08-23**:

- Tokyo — price framework ✅ named hotels ✅ ticket source ✅ booking links ✅ visible trip refresh ✅
- Kansai — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅
- Hong Kong — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ compact mobile hotel cards ✅
- Da Nang — price framework ✅ named hotels ✅ ticket source ✅ booking links ✅ visible trip refresh ✅
- Yunnan — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅
- Chongqing — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅
- Harbin — price framework ✅ named hotel options ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅

**Functional registration is complete across all seven trips.** A LIVE result still depends on the external source responding and exposing a verifiable price at refresh time.

---

# Change Log

## 2026-08-23 — Unified Live Price v3
- Consolidated overlapping price UI and booking click handlers into one shared `live-price-v2.js` module.
- Added visible `↻ เช็กราคา` on every trip page.
- Added current hotel options across all seven trips.
- Kept attraction/ticket price-source catalog across all seven trip groups.
- Fixed hotel booking clicks so app navigation does not intercept them and return to Home.
- Added tighter Hong Kong mobile hotel-card typography, image height, badges and price spacing.
- Added current result sheet with external hotel/ticket links.
- Forced GitHub Pages and Cloudflare Worker deploy after the unified update.

## Rule for every future meaningful update
Update this README / Change Log whenever architecture, setup, behavior, trip parity, price coverage or known limitations change.
