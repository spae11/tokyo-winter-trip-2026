# Our Journey Travel Hub

Travel planning PWA for all trips in **Our Journey**.

> **IMPORTANT — READ THIS README BEFORE ADDING OR MODIFYING A TRIP.**
> A new trip must not be created as an isolated page. It must inherit the same standard features used by the existing trips and be registered everywhere required by the shared app.

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

Whenever a new trip is added, **first read this README**, inspect the current shared implementation, and give the new trip every applicable feature that existing trips already have.

Do not finish a new trip after only creating `<trip>/index.html`.

A new trip is complete only after it passes the checklist below.

## Standard features every trip must inherit

### 1. Our Journey home integration
- Add the trip to the home/trip list.
- Add its country/region map relationship.
- Support trip start/end dates in `travelHubStateV2`.
- Opening and returning from the trip must use the same navigation/transition behavior as existing trips.

### 2. Trip page standard
- Mobile-friendly header/navigation.
- Daily itinerary.
- Maps / location links.
- Budget section.
- Stay/hotel section when applicable.
- Transport notes.
- Muslim / halal / prayer information when relevant to the destination.
- Same shared UI behavior and mobile fixes as other trips.

### 3. Trip Tools
The new trip must be registered in the shared Trip Tools data/selector and must receive the existing Trip Tools features, including applicable:
- Today / itinerary tools
- Expense tracking
- Map
- Wallet
- Muslim / halal tools
- Search
- Notes
- Sync
- Settings

Do not create a new trip that cannot be selected or used inside Trip Tools.

### 4. Memories and cloud features
The new trip must continue to work with the shared systems already injected into trip pages, including:
- Memories / locations
- Photos / media
- Cloud sync
- Google Photos / Drive integration where enabled
- Notes / wallet sync
- Delete-everywhere / media management behavior

### 5. Live Price Refresh
Every new trip must be registered in the live-price system.

Required behavior:
- The main `↻` Refresh action checks current prices instead of only reloading the page.
- Use the trip's real travel dates.
- Hotel request default: **2 travelers / 1 room**, unless the trip explicitly says otherwise.
- Current FX conversion to THB.
- Current hotel pricing when a real hotel has been selected.
- Current attraction/ticket pricing when a reliable official/current source is available.
- Show `Live checked` / `Last checked` time.
- If live verification fails, clearly say it failed. **Never display an old price as if it were live.**
- If travel dates are missing, show that dates are required instead of inventing a hotel price.

Files/components that may need registration when adding a trip:
- `live-price-refresh-v1.js`
- `cloudflare/live-prices.js`
- shared trip registry / route lists

### 6. Booking / source links
Any price shown from a live refresh should be easy to open.

Required behavior:
- Hotel name should be clickable when a valid price source URL exists.
- Show a clear `จอง / ดูราคาที่เจอ ↗` action for hotel results where possible.
- Attraction/ticket name should link to the Official/current source used for the price check.
- The link should follow the actual `sourceUrl` returned by the latest refresh, not a permanently hard-coded booking website when a better/current source was used.

Shared implementation:
- `live-price-booking-links-v1.js`

### 7. Service Worker / PWA registration
A new trip must be added everywhere needed by the PWA/shared injector.

Check at minimum:
- `sw.js` `CORE` list if the page should be pre-cached.
- `isPlan` / plan-path detection.
- Home → trip transition route list.
- Shared plan scripts/styles are injected into the new trip.
- Cache version is bumped when necessary so users do not remain on stale UI/code.

### 8. Shared mobile/UI fixes
Check shared plan-path lists and make sure the new trip receives the same fixes as the existing trips.

Examples:
- `plan-ui-fixes-v1.js`
- shared bottom navigation / plan-first UI
- Trip Tools mobile tab fixes
- collapse/expand behavior
- motion/UI scripts

### 9. China-specific trips
For China trips, prefer destination-appropriate navigation behavior used by the existing China plans:
- Amap as primary where appropriate.
- Google Maps as backup when useful.
- Keep China-specific transport/payment notes where relevant.

### 10. Test before calling it complete
At minimum test:
- Home → trip opens.
- Trip → home returns correctly.
- Mobile layout.
- Trip Tools opens and tabs are not clipped.
- Trip appears in Trip Tools.
- Dates save correctly.
- `↻` live price refresh does not behave as a plain page reload.
- Live/Last Checked label is truthful.
- Hotel live price appears when a real hotel + dates are available.
- Hotel booking/source link opens.
- Attraction Official/source link opens when supported.
- Offline/PWA behavior does not break.
- Existing trips are not regressed.

---

# Price data truth rules

These rules are mandatory.

1. `LIVE` means the price was successfully verified during the current/recent refresh.
2. Static planning budgets are estimates and must stay labeled as estimates.
3. A previous observed price must not be silently presented as the current price.
4. If a source cannot be verified, show `CHECK FAILED`, `Unavailable`, or equivalent.
5. Hotel totals should use the actual trip dates when possible.
6. Show taxes/fees status only when the source actually provides enough information.
7. Preserve the source URL so the user can open the same/current price source.
8. For attractions, prefer Official sources when available.

---

# Current live-price coverage status

## Shared framework
The shared refresh/booking-link framework is registered for:

- Tokyo ✅
- Kansai ✅
- Hong Kong ✅
- Da Nang ✅
- Yunnan ✅
- Chongqing ✅
- Harbin ✅

This means all seven routes are part of the shared live-price/booking-link architecture.

## Hotel data coverage
Current hotel price checking is only useful when the plan contains a **real named hotel** and valid trip dates.

- Tokyo: named hotel available ✅
- Hong Kong: named hotel options available ✅
- Da Nang / Hoi An: named hotel options available ✅
- Kansai: current page still uses `Hotel TBD` ⚠️
- Yunnan: current page still uses `Hotel TBD` ⚠️
- Chongqing: current page still uses `Hotel TBD` ⚠️
- Harbin: verify/select real hotel names before claiming complete hotel live-price coverage ⚠️

Therefore: **the framework is on every trip, but hotel live-price data coverage is not yet 100% for every trip.**

## Attraction/ticket live-price catalog
Current explicit live ticket sources include major items for:

- Tokyo ✅
- Hong Kong ✅
- Da Nang ✅
- Kansai: needs official ticket catalog entries where useful ⚠️
- Yunnan: needs official/current attraction source entries where useful ⚠️
- Chongqing: needs official/current attraction source entries where useful ⚠️
- Harbin: needs official/current attraction source entries where useful ⚠️

Do not describe attraction live-pricing as complete for all trips until these sources have been added and tested.

---

# Key shared files

- `index.html` — Our Journey home / trip dates / map / trip cards
- `sw.js` — PWA cache + shared page injection
- `trip-tools-v1.js` / `trip-tools-v1.css` — Trip Tools
- `trip-cloud-sync-v3.js` — shared cloud state sync
- `plan-ui-fixes-v1.js` — shared trip/mobile fixes
- `ui-motion-v1.js` — shared UI behavior and shared module loading
- `live-price-refresh-v1.js` — current-price refresh UI/client
- `live-price-booking-links-v1.js` — click-through booking/source links
- `cloudflare/worker.js` — Cloudflare Worker API router
- `cloudflare/live-prices.js` — hotel / FX / attraction live-price backend
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/cloudflare-control.yml` — Cloudflare Worker deployment

---

# Change log rule

**Every meaningful feature update must also update this README when it changes architecture, setup, behavior, trip-parity requirements, or known coverage.**

When adding a new trip, the commit/change summary should explicitly confirm:

- New trip registered on home.
- New trip registered in Trip Tools.
- New trip registered in PWA/shared injector.
- New trip registered in Live Price Refresh.
- Hotel source/booking link behavior checked.
- Attraction source links checked where applicable.
- Mobile behavior checked.
- README coverage list updated.

This prevents future trips from being created with fewer functions than the existing ones.
