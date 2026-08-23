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
3. Register the new route in Home, Trip Tools, PWA/shared injection, price refresh, live-budget sync and booking/source-link systems.
4. Give it every applicable function the existing trips already have.
5. Update this README / Change Log whenever architecture or trip coverage changes.

A trip is not complete until mobile layout, Trip Tools, Memories/Sync, live-price refresh, live-budget sync and external booking/source links are checked.

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
- Budget breakdown.
- Budget must react to the newest price snapshot: verified categories may replace estimates; unavailable categories must remain clearly labeled `ESTIMATE`.
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

# Unified Live Price v4 — mandatory for every trip

Shared price UI/client:
- `live-price-v2.js`

Live budget / compact ticket UI:
- `trip-live-budget-sync-v1.js`

Backend:
- `cloudflare/live-prices.js`
- routed by `cloudflare/worker.js`

Loader:
- `ui-motion-v1.js`

## Required behavior

- **Every trip page must show a clear `↻ เช็กราคา` button** near the Plan / Quick Edit controls.
- **Trip-page Refresh is scoped to the current trip only.** Example: Hong Kong checks only Hong Kong hotels, Hong Kong tickets/attractions and the relevant FX rate.
- **Home Refresh checks all registered trips.**
- Default hotel request: **2 travelers / 1 room**.
- Uses saved trip dates.
- Shows visible progress immediately so the user knows Refresh started.
- The result sheet on a trip page shows **only that trip**, never unrelated trips.
- After a successful trip refresh, the latest hotel/ticket results are merged into the stored data for **that trip only**; other trips keep their previous snapshots.
- Current trip snapshots are stored in `travelHubTripPricesV1` and the merged shared store remains in `travelHubLivePricesV2`.
- Hotel cards, ticket summary and live-aware budget on the current trip page update from the newest stored snapshot.
- Shows `LIVE` / `LAST CHECKED` truthfully using per-trip/per-result timestamps.
- If verification fails, show unavailable/check failed. **Never show an old value as LIVE.**
- If dates are missing, ask for dates instead of inventing an exact hotel total.

## Ticket / attraction link UI

- The **`🎟️ ราคา / ลิงก์ตั๋ว` section is collapsed by default** on every trip page.
- The user taps the section title to expand or collapse it.
- The collapsed state keeps the plan compact on mobile but source links remain available when expanded.
- Attraction/ticket names open the Official/current source used by the backend.

## Booking / price-source links

- Hotel name is clickable.
- Show `ดูราคา / จอง ↗` on real hotel cards / shared hotel options.
- A hotel click must open an external hotel pricing/booking page, never Our Journey Home.
- When a live result returns a `sourceUrl`, that current source is used.
- Without a live source, fallback hotel search uses the hotel name + saved trip dates when available.
- External booking clicks must stop app navigation handlers so they are not intercepted by Home navigation.

---

# Live-aware trip budget — mandatory for every trip

The visible `TRIP BUDGET • 2 PEOPLE` section is a hybrid of verified current prices and planning estimates.

Rules:

1. After `↻ เช็กราคา`, a hotel category with a verified current total may replace the old hotel estimate.
2. Ticket/activity budget may replace the planning estimate only when all registered required ticket sources for that trip are successfully verified in the current snapshot.
3. Flight, food, transport, eSIM, insurance or other categories that do not have a reliable live source remain `ESTIMATE`.
4. The total budget is recalculated from the values currently shown in the category cards.
5. The budget shows the latest checked timestamp and how many categories currently use `LIVE` data.
6. Never silently present an estimate as a current/live price.
7. A trip without confirmed dates keeps hotel cost as `ESTIMATE` and asks the user to set dates before exact refresh.
8. Hong Kong mode must respect the selected trip length. `5D4N` uses 4 hotel nights and 5 food days; `6D5N` uses 5 hotel nights and 6 food days.
9. Stale hotel names in the planning budget must not be treated as the current selected option. The shared sync layer uses the current hotel catalog / current trip choice when describing the estimate.
10. These rules apply to **all registered trips**, not only Hong Kong.

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
- `trip-live-budget-sync-v1.js`
- `cloudflare/live-prices.js`

China trips should prefer Amap where appropriate, with Google Maps as backup when useful.

---

# Price truth rules

1. `LIVE` = successfully verified in the current/recent refresh.
2. `LAST CHECKED` = previously verified with a timestamp.
3. Planning budgets remain estimates where no reliable current source exists.
4. Previous observed prices must never silently become current prices.
5. Failed verification must show unavailable/check failed.
6. Use real saved trip dates whenever possible.
7. Only claim taxes/fees when the source provides enough information.
8. Preserve/open the current source URL or a safe booking search URL.
9. Prefer Official sources for attractions when available; otherwise label the current booking source honestly.
10. Refreshing one trip must never refresh, overwrite or relabel another trip as LIVE.
11. Budget totals may mix `LIVE` and `ESTIMATE`, but every category must make that distinction visible.

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
- Trip-page result sheet contains only the current trip.
- Refresh request contains only the current trip ID when used inside a trip page.
- Successful refresh updates that trip's stored snapshot and visible hotel/ticket data.
- Other trip snapshots remain unchanged.
- `🎟️ ราคา / ลิงก์ตั๋ว` is collapsed by default and can be expanded manually.
- Trip Budget replaces only verified categories with live values.
- Non-live budget categories remain visibly marked `ESTIMATE`.
- Budget total recalculates after a live category changes.
- Hong Kong 5D4N budget uses 4 hotel nights / 5 food days.
- Live/Last Checked label is truthful per trip.
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
- `plan-extras-v1.js` — planning extras + base budget breakdown
- `plan-ui-fixes-v1.js` — shared mobile fixes
- `plan-first-v1.js` / `plan-first-v2.js` — Plan First UI
- `ui-motion-v1.js` — shared UI + unified price/budget module loader
- `live-price-v2.js` — trip-scoped current-price refresh, per-trip snapshots, result sheet, hotel/ticket links and mobile hotel-card overrides
- `trip-live-budget-sync-v1.js` — collapsed ticket-link section + LIVE/ESTIMATE budget synchronization for every trip
- `cloudflare/worker.js` — API router
- `cloudflare/live-prices.js` — hotel / FX / ticket current-price backend
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/cloudflare-control.yml` — Cloudflare Worker deployment

---

# Current coverage status

As of **2026-08-23**:

- Tokyo — price framework ✅ named hotels ✅ ticket source ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅
- Kansai — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅
- Hong Kong — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ compact mobile hotel cards ✅ trip-scoped refresh ✅ mode-aware live budget ✅ collapsed ticket links ✅
- Da Nang — price framework ✅ named hotels ✅ ticket source ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅
- Yunnan — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅
- Chongqing — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅
- Harbin — price framework ✅ named hotel options ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅

**Functional registration is complete across all seven trips.** A LIVE result still depends on the external source responding and exposing a verifiable price at refresh time.

---

# Change Log

## 2026-08-23 — Collapsed ticket links + live-aware budget sync
- Added `trip-live-budget-sync-v1.js` and loaded it globally from `ui-motion-v1.js`.
- `🎟️ ราคา / ลิงก์ตั๋ว` now starts collapsed on every trip and expands when the user taps the heading.
- Connected the visible `TRIP BUDGET • 2 PEOPLE` cards to the latest per-trip price snapshot.
- Verified hotel totals replace the hotel planning estimate when available.
- Ticket/activity budget replaces the estimate only when all registered required ticket sources are verified; partial verification stays clearly marked as an estimate.
- Recalculates the visible total from the currently displayed category values.
- Marks non-live categories as `ESTIMATE` rather than implying that flights, food, transport or other unsupported costs are live.
- Hong Kong `5D4N` now uses 4 hotel nights and 5 food days in the planning budget when no verified live value is available.
- Removed stale Travelodge wording from the runtime Hong Kong budget description by using the current hotel choice/catalog instead.
- Applied the same live-aware budget rules to all registered trips.

## 2026-08-23 — Trip-scoped Refresh + per-trip price data
- Changed Trip-page `↻ เช็กราคา` to request only the current trip instead of all seven trips.
- Trip result sheet now displays only the current trip.
- Home Refresh remains the all-trip refresh action.
- Added merge behavior so refreshing one trip replaces only that trip's hotel/ticket results and preserves other trip snapshots.
- Added `travelHubTripPricesV1` for explicit per-trip price snapshots.
- Added per-result/per-trip timestamps so refreshing another trip cannot make old prices look LIVE.
- Current hotel cards and ticket summaries update immediately after the current trip refresh.
- Bumped unified price loader to `live-price-v2.js?v=4`.

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
