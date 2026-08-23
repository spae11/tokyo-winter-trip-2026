# Our Journey Travel Hub

Travel planning PWA for all trips in **Our Journey**.

> **READ THIS README BEFORE ADDING OR MODIFYING A TRIP.**
> A new trip is not complete after creating only `<trip>/index.html`; it must inherit the shared functions below.

> **README / CHANGE LOG RULE — MANDATORY**
> Whenever any trip function, shared UI, price logic, booking behavior, navigation, hide/unhide behavior, storage key, route coverage or architecture changes, update this README in the **same improvement round**. README must never lag behind the code.

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
3. Register the route in Home, Trip Tools, PWA/shared injection, Refresh, live-budget sync, booking links, Quick Jump, hide/unhide and Memories/Sync where applicable.
4. Give the new trip every applicable function existing trips already have.
5. Test on mobile.
6. Update this README / Change Log in the same round.

---

# Standard Trip Functions

Every trip should inherit, where applicable:

- Mobile-friendly header and navigation.
- Daily itinerary + day chips.
- Quick Edit.
- Hotel/stay section or registered named hotel options.
- Maps/location links.
- Transport notes.
- Muslim/halal/prayer information.
- Budget breakdown.
- `↻ เช็กราคา` for the current trip.
- `☰ หัวข้อ` Quick Jump.
- Sensible Hide/Unhide for long secondary sections.
- Trip Tools: Today, Expense, Map, Wallet, Search, Notes, Sync, Settings.
- Memories / photos / media / documents / cloud compatibility.

---

# Current Price System

Shared client:
- `live-price-v2.js`

Stable budget sync:
- `trip-live-budget-sync-v2.js`

Stable long-page / booking UX:
- `trip-page-ux-v2.js`

Loader:
- `ui-motion-v1.js`

Backend:
- `cloudflare/live-prices.js`
- `cloudflare/worker.js`

## Refresh rules

- Trip-page Refresh checks **only the current trip**.
- Home Refresh checks all registered trips.
- Default hotel request: **2 adults / 1 room**.
- Use saved trip dates whenever available.
- Trip Tools start date is synchronized into shared price-date state when needed.
- A trip result sheet shows only that trip.
- Refreshing one trip must not overwrite or relabel another trip as LIVE.
- Per-trip snapshots: `travelHubTripPricesV1`.
- Merged shared snapshots: `travelHubLivePricesV2`.

## Price truth rules

- `LIVE` = successfully verified during the current/recent refresh.
- `LAST CHECKED` = previously verified and timestamped.
- Failed verification must show unavailable/check failed.
- Never silently present an old price as LIVE.
- Missing dates must not produce a fabricated exact hotel total.
- Budget categories without reliable live data remain clearly marked `ESTIMATE`.

---

# Hotel Booking vs Price Source

These are separate concepts.

## Hotel booking action

Hotel name / booking buttons must open a Booking.com hotel search using:

- exact hotel name
- saved check-in/check-out when available
- 2 adults
- 1 room
- THB display preference

The booking action must never be intercepted by Our Journey navigation or return to Home.

`trip-page-ux-v2.js` enforces the destination at click time so dynamic price-card rewrites cannot replace the booking destination with a broad Google Travel page.

The same behavior applies to:

- hotel cards
- shared hotel options
- hotel entries inside the current-price result sheet

## Price source

The backend may use Google Hotels or another current source to verify a price. That source is for **price evidence**, not the main booking destination.

Attraction/ticket links continue to open their Official/current source.

---

# Long-page UX — Quick Jump + Hide/Unhide v2

All seven trip pages use the same stable system from `trip-page-ux-v2.js`.

## Quick Jump

- Persistent `☰ หัวข้อ` button above bottom navigation.
- Generates its list from the headings currently on the trip page.
- Includes `บนสุด`.
- Selecting a collapsed section opens it before scrolling.
- Jump sheet includes **ย่อหัวข้อรอง** and **เปิดทั้งหมด**.
- Quick Jump appears on trip pages only, not Home.

## Default open sections

Keep primary trip content easy to reach:

- Hotel/stay section: open.
- Daily itinerary / daily plan: open or controlled by the existing Day UI.

## Default collapsed sections

All other suitable secondary sections should start collapsed, including when present:

- `🎟️ ราคา / ลิงก์ตั๋ว`
- Budget details
- Best Season / suitable travel period
- Preparation / Checklist
- Souvenir guide
- Travel apps
- Before-you-go / travel rules
- Supporting Muslim / Halal information
- Tips / supporting guides
- Other long secondary sections added later

The v2 implementation uses **CSS classes and existing headings** instead of moving/rebuilding section DOM. This is required because dynamic Refresh can rewrite price content; DOM-moving collapse logic caused sections such as the ticket list to reopen unexpectedly.

Manual section open/closed state is stored per trip in `tripSectionOpenV2`.

---

# Ticket Link UI

- `🎟️ ราคา / ลิงก์ตั๋ว` must start **collapsed**.
- Tap its heading to expand/collapse.
- Its body is hidden by a CSS state on the existing ticket container.
- Refresh may rewrite ticket cards, but must not automatically reopen the section.
- Official/current ticket links remain accessible after expanding.

---

# Live-aware Trip Budget

The visible trip budget combines verified current prices with planning estimates.

Rules:

1. Verified hotel total may replace the hotel estimate.
2. Ticket/activity budget may become LIVE only when the required registered sources are successfully verified.
3. Flights, food, transport, eSIM, insurance and unsupported categories stay `ESTIMATE`.
4. Visible total is recalculated from the displayed category values.
5. Show last checked timestamp and LIVE-category count.
6. Budget heading must use the current hotel/catalog rather than stale hardcoded hotel text.
7. Hong Kong modes:
   - `5D4N` = 4 hotel nights / 5 food days
   - `6D5N` = 5 hotel nights / 6 food days
8. These rules apply to every registered trip.

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

`Hotel TBD` must never be treated as a real hotel.

---

# Current Ticket / Attraction Coverage

- Tokyo: Tokyo Disneyland 1-Day Passport
- Kansai: Osaka Castle Museum, Umeda Sky Building, Kinkaku-ji
- Hong Kong: Hong Kong Disneyland, Ngong Ping 360, Peak Tram / Sky Terrace
- Da Nang: Sun World Ba Na Hills
- Yunnan: Stone Forest, Chongsheng Temple & Three Pagodas
- Chongqing: Yangtze River Cableway, Wulong Three Natural Bridges, Dazu Rock Carvings
- Harbin: Ice and Snow World, Yabuli/Ski Resort, China Snow Town

Registered source does not guarantee successful LIVE parsing. Only successfully verified current values may be labeled LIVE.

---

# Key Shared Files

- `index.html` — Home / trip cards / dates
- `sw.js` — PWA + shared injection
- `trip-tools-v1.js` — Trip Tools
- `trip-cloud-sync-v3.js` — cloud state sync
- `plan-extras-v1.js` — planning extras + base budget
- `plan-first-v1.js` / `plan-first-v2.js` — Plan First UI
- `plan-ui-fixes-v1.js` — shared mobile fixes
- `ui-motion-v1.js` — loads current price/budget/page UX modules
- `live-price-v2.js` — current-price refresh + per-trip snapshots
- `trip-live-budget-sync-v2.js` — budget-only LIVE/ESTIMATE synchronization; intentionally does not rewrite ticket DOM
- `trip-page-ux-v2.js` — Quick Jump, CSS-based Hide/Unhide, stable ticket collapse, mobile hotel typography and Booking.com click routing
- `cloudflare/live-prices.js` — hotel / FX / ticket backend
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/cloudflare-control.yml` — Cloudflare deployment

---

# Test Checklist Before Calling a Trip Complete

- Home → trip and trip → Home work.
- Mobile layout works.
- Trip Tools tabs are usable.
- Dates save correctly.
- `↻ เช็กราคา` is visible and shows progress immediately.
- Trip Refresh checks only that trip.
- Result sheet contains only that trip.
- Other trip snapshots remain unchanged.
- Ticket section starts collapsed even after Refresh rebuilds its content.
- Ticket heading expands/collapses correctly.
- Secondary long sections start collapsed.
- Hotel/stay and daily itinerary remain readily accessible.
- `☰ หัวข้อ` lists the page sections.
- Jumping to a collapsed section opens it first.
- `ย่อหัวข้อรอง` and `เปิดทั้งหมด` work.
- Hotel name / booking button opens Booking.com for that hotel and saved dates.
- Ticket/attraction links open Official/current source.
- LIVE / LAST CHECKED / ESTIMATE labels are truthful.
- Hong Kong 5D4N / 6D5N counts are correct.
- Offline/PWA behavior is not broken.
- README / Change Log is updated in the same improvement round.

---

# Change Log

## 2026-08-23 — Stable Collapse v2 + broader all-trip folding

- Added `trip-page-ux-v2.js` for all seven routes.
- Replaced DOM-moving collapse logic with CSS-class state so dynamic price Refresh cannot reopen collapsed sections.
- Fixed the ticket section bug where `🎟️ ราคา / ลิงก์ตั๋ว` could appear expanded again after `live-price-v2.js` rewrote its cards.
- Ticket body now stays collapsed by default and only opens when the user taps its heading or jumps directly to it.
- Expanded default folding to all suitable secondary trip sections while keeping Hotel/Stay and Daily Itinerary readily accessible.
- Added `ย่อหัวข้อรอง` / `เปิดทั้งหมด` actions inside the Quick Jump sheet.
- Added `tripSectionOpenV2` so manual section state is separate from the older folding implementation.
- Added `trip-live-budget-sync-v2.js`; budget sync no longer edits ticket DOM.
- Booking routing is enforced at the window capture layer so price-card rewrites cannot send hotel booking clicks to the wrong destination.
- Updated `ui-motion-v1.js` to load v2 budget/UX modules.

## 2026-08-23 — Price Refresh / Booking / Live Budget foundation

- Trip-page Refresh scoped to current trip; Home Refresh remains all trips.
- Added per-trip price snapshots.
- Added hotel and ticket source coverage across all seven routes.
- Added live-aware budget behavior and Hong Kong 5D4N / 6D5N handling.
- Added Booking.com hotel destination rules and Quick Jump concept.

## Permanent rule

Every meaningful trip-function change must update this README / Change Log in the same improvement round.
