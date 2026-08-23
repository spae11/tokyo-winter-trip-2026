# Our Journey Travel Hub

Travel planning PWA for all trips in **Our Journey**.

> **READ THIS README BEFORE ADDING OR MODIFYING A TRIP.**
> **README / CHANGE LOG MUST BE UPDATED IN THE SAME IMPROVEMENT ROUND** whenever trip functions, shared UI, pricing, booking, navigation, hide/unhide, hotel policy, layout, storage, routes, PWA behavior, or architecture change.

## Current trips
- `tokyo`
- `kansai`
- `hongkong`
- `danang`
- `yunnan`
- `chongqing`
- `harbin`

A new trip is not complete until it has feature parity with the routes above.

## Required trip features
- Mobile-friendly header/navigation
- Daily itinerary + day chips
- Quick Edit
- Hotel/stay section or named hotel options
- Maps/location links
- Budget breakdown
- Muslim/halal/prayer information where relevant
- `↻ เช็กราคา` scoped to the current trip
- `☰ หัวข้อ` Quick Jump
- Hide/Unhide for long secondary sections
- Shared layout/spacing/card proportions
- Trip Tools + Memories/Sync compatibility
- **Trip Tools → Settings must include the trip's start date and budget**
- **Hotel shortlist must pass the shared review + budget policy below**
- **Hotel LIVE prices must pass the consistency checks below; otherwise show unavailable, never guess**

## Current shared modules
- `price-sanity-v1.js` — rejects inconsistent/implausible hotel price results before UI/storage
- `hotel-quality-v1.js` — approved hotel catalog, review threshold, 10K/15K ranking, old-hotel filtering
- `live-price-v2.js` — current-price refresh + per-trip snapshots
- `trip-live-budget-sync-v2.js` — LIVE/ESTIMATE budget sync with hotel budget ceiling and trip-mode night counts
- `trip-page-ux-v2.js` — CSS hide/unhide + booking routing
- `trip-jump-fix-v1.js` — reliable Quick Jump targets
- `app-layout-polish-v1.js` — shared Home/trip/Trip Tools layout normalization
- `trip-settings-all-v1.js` — all-trip start-date + budget settings and shared date sync
- `tokyo-flight-option-v1.js` — Tokyo 6D5N / backup 5D4N flight-plan switch
- `ui-motion-v1.js` — shared loader
- `cloudflare/live-prices.js` / `cloudflare/worker.js` — current-price backend

# Tokyo mode rules

Tokyo keeps the original **6D5N** plan and also has a saved **5D4N backup flight option**. The backup option is not treated as a booked ticket.

## Tokyo backup 5D4N flight option
Flight snapshot saved from the user-provided option:
- Outbound: **5 Dec 2026** BKK 18:05 → **6 Dec** NRT 08:30 (+1), 1 stop DAD
- Return: **10 Dec 2026** NRT 09:00 → BKK 17:00, 1 stop DAD
- Observed flight price at the time it was saved: about **20,070 THB/person**
- Status: **option / not booked**

Backup itinerary:
- 6 Dec: NRT → Asakusa → Senso-ji / Nakamise → easy evening
- 7 Dec: Tokyo Disneyland full day
- 8 Dec: Mt. Fuji / Kawaguchiko
- 9 Dec: Tokyo Camii → Harajuku → Shibuya → Shinjuku
- 10 Dec: early NRT departure, no sightseeing

Rules:
- `tokyo-trip-mode = 6d5n` keeps the original itinerary and 5 hotel nights.
- `tokyo-trip-mode = 5d4n` shows the backup itinerary and uses **4 hotel nights**.
- In Tokyo 5D4N backup mode, Trip Tools stores the **BKK departure date** as the trip start date, while hotel pricing/booking uses **check-in = next day** and **check-out = departure date + 5 days**.
- With the current saved flight date this means **hotel 6–10 Dec 2026 (4 nights)**.
- `↻ เช็กราคา`, Booking links, and budget sync must all use the mode-specific hotel dates.
- The Fuji day may be swapped with the Tokyo-city day when the forecast is better on the other date.

# Hotel price truth / consistency rules

The old Google Hotels parser could accidentally combine unrelated THB numbers from the page, producing impossible combinations such as a stay total that did not equal the displayed nightly rate × nights. That behavior is prohibited.

## Backend rule
`cloudflare/live-prices.js` marks a hotel `LIVE` only when:
- check-in/check-out produce a valid night count
- a nightly/total pair can be found close enough together in the source page
- the pair is internally consistent for the requested number of nights
- the implied nightly value is above a conservative per-destination sanity floor

When a valid pair is found:
- **stay total is the source of truth**
- displayed `nightlyTHB = totalTHB ÷ nights`
- the backend does not independently display two unrelated price values

If a reliable pair cannot be verified, return `status: unavailable` instead of estimating/guessing a LIVE price.

## Front-end guard
`price-sanity-v1.js` loads before the hotel policy and live-price client. It rejects a hotel result if:
- `totalTHB ÷ nights` and `nightlyTHB` differ materially
- the implied nightly value is implausibly low for the destination
- total/night count is invalid

Rejected legacy/cache results are converted to `unavailable` and their bad price fields are removed from `travelHubLivePricesV2` / `travelHubTripPricesV1`.

**Permanent rule:** showing no LIVE hotel price is better than showing a wrong LIVE hotel price.

# Hotel quality + budget policy

This is the default rule for **every current and future trip**.

## Review quality
- Prefer a public review score **≥ 4.0 / 5**.
- When a reliable 5-point score is unavailable, an established OTA guest score **≥ 8.0 / 10** may be used.
- Prefer large review samples and established hotels over guesthouses / unknown stays.
- Do not treat hotel star class as the same thing as guest review score.
- `Hotel TBD` is never an approved hotel.

## Stay-price target
The verified full-stay total controls ranking:
1. **≤ 10,000 THB** — preferred / green
2. **10,001–15,000 THB** — acceptable fallback
3. **> 15,000 THB** — do not use as the main recommended hotel

Rules:
- Use saved trip dates, 2 adults, 1 room.
- Exact current price comes from `↻ เช็กราคา`; static research prices are not guaranteed live prices.
- If no approved hotel is ≤15K on selected dates, keep the hotel budget as `ESTIMATE` and state that current approved options are over budget.
- For split-city trips, exact segment-night totals should be refined when segment dates are available.

## Approved hotel shortlist
### Tokyo
- **APA Hotel Asakusa Kuramae Kita** — review 4.2/5; Booking 8.6/10
- **Tosei Hotel Cocone Asakusa Kuramae** — review 4.1/5; Booking 8.7/10

### Kansai / Osaka
- **KOKO HOTEL Osaka Namba Sennichimae** — review 4.4/5; Booking 8.7/10
- **Hotel Sobial Namba Daikokucho** — review 4.0/5; Booking 8.8/10

### Hong Kong
- **Page148, Page Hotels** — review 4.7/5; Booking 8.7/10
- **The Cityview - Chinese YMCA of Hong Kong** — review 4.0/5; Booking 8.5/10
- **Dorsett Mongkok, Hong Kong** — review 4.1/5; Booking 8.0/10

### Da Nang + Hoi An
- **Monarque Hotel Danang** — review 5.0/5; Booking 9.5/10
- **HAIAN Beach Hotel & Spa** — review 4.9/5; Booking 9.1/10
- **La Charm Hoi An Hotel - Peaceful Boutique In Old Town** — Booking 9.5/10

### Yunnan
- **Holiday Inn Express Kunming Panlong by IHG** — Booking 8.9/10
- **Hilton Garden Inn Dali Ancient City** — OTA score about 9.4/10

### Chongqing
- **Mercure Hotel Chongqing Jiefangbei** — review 4.5/5; OTA score about 9.5/10
- **Glenview ITC Plaza Chongqing** — review 4.5/5

### Harbin + Yabuli
- **Mercure Harbin Central Street Sophia Church** — review 4.2/5; OTA score about 9.7/10
- **Yabu Loni Hotel Yabuli** — OTA score about 8.7/10

# Trip Tools settings parity
`⚙️ ตั้งค่า → วันที่ + งบ` must never be hardcoded to only a subset of trips.

Current Settings groups:
- Japan: Tokyo, Kansai
- Hong Kong: Hong Kong
- Vietnam: Da Nang + Hoi An
- China: Yunnan, Chongqing, Harbin

Rules:
- Every registered trip gets a start-date field and Budget (THB) field.
- Save writes all values to `travelToolsV1`.
- Dates synchronize to `travelHubStateV2` for Refresh and Booking.
- Hong Kong derives end date from selected 5D4N / 6D5N mode.
- Tokyo derives night count from selected 5D4N / 6D5N mode.
- Tokyo backup 5D4N uses BKK departure day in Trip Tools but next-day hotel check-in.
- Adding a new trip requires adding it to this all-trip Settings system in the same round.

# Refresh / booking rules
- Trip-page Refresh checks only that trip; Home Refresh checks all trips.
- Hotel request default: 2 adults / 1 room.
- Hotel requests use only the approved quality catalog.
- `LIVE` means verified during the current/recent refresh and passed price sanity validation.
- Old values must never silently become LIVE.
- Missing dates must not create a fabricated exact hotel total.
- Refreshing one trip must not overwrite another trip's snapshot.
- Hotel name and main booking button open Booking.com using the exact approved hotel name and saved mode-aware dates.
- The current price source is price evidence, not the main booking destination.
- Attraction/ticket links open their Official/current source.

# Quick Jump / Hide-Unhide / Layout
- `☰ หัวข้อ` appears on trip pages only and lists top-level sections only.
- Do not list nested Disney ride groups, media subsections, or duplicate/dead headings.
- Open collapsed destination before scrolling and account for the fixed header.
- Secondary sections such as ticket links, detailed budget, season, checklist, souvenir guide, apps, and supporting info may start collapsed.
- Hotel/stay and daily itinerary remain primary content.
- Dynamic Refresh must not automatically reopen collapsed sections.
- Shared layout rules should keep spacing, card radii, mobile typography, and bottom-nav clearance consistent across all trips and Trip Tools.

# Hong Kong mode rule
- `5D4N` = 4 hotel nights / 5 food days
- `6D5N` = 5 hotel nights / 6 food days

# PWA / offline
Current cache generation: **`our-journey-v87`**.

Offline core includes the main shared loader/price/UX/layout files. Additional shared scripts are cached by the service worker script strategy after their first online load.

# Test checklist before calling a trip complete
- Home ↔ trip navigation works
- Mobile layout is proportionate
- Settings lists every registered trip
- Every trip date/budget saves and propagates to Refresh/Booking
- Tokyo 5D4N uses 4 hotel nights and next-day check-in
- Switching Tokyo back to 6D5N restores original itinerary and 5-night behavior
- Approved hotel shortlist uses review ≥4/5 or OTA ≥8/10 fallback
- Old/unapproved hotel cards do not return after Refresh
- For every LIVE hotel: `totalTHB ÷ nights` approximately equals displayed nightly price
- Implausibly low/inconsistent hotel prices are rejected, not displayed
- Hotel price ranking prefers ≤10K, accepts ≤15K, and does not auto-select >15K
- Refresh checks only the intended trip
- Ticket section stays collapsed after Refresh
- `☰ หัวข้อ` contains only working top-level destinations
- Booking opens the intended approved hotel externally
- LIVE / LAST CHECKED / ESTIMATE labels are truthful
- Bottom navigation does not cover final content
- Offline/PWA behavior still works
- README / Change Log is updated in the same round

# Change Log

## 2026-08-23 — Tokyo 5D4N backup flight plan
- Added `tokyo-flight-option-v1.js`.
- Preserved Tokyo 6D5N as the default/main plan and added a switchable 5D4N backup option.
- Saved the candidate Vietnam Airlines timing: BKK 5 Dec 18:05 → NRT 6 Dec 08:30 (+1), return NRT 10 Dec 09:00 → BKK 17:00, both via DAD.
- Marked the observed ~20,070 THB/person airfare as an unbooked snapshot, not a live/confirmed fare.
- Added compact 5D4N itinerary: Arrival/Asakusa, Disneyland, Fuji, Tokyo City, Return.
- Tokyo 5D4N now uses hotel dates 6–10 Dec (4 nights) for Refresh/Booking with the current saved flight date.
- Updated `trip-settings-all-v1.js` so Tokyo mode controls hotel-night calculation and backup mode uses next-day check-in.
- Updated `trip-live-budget-sync-v2.js` so Tokyo 5D4N uses 4 hotel nights / 5 days.
- Updated `ui-motion-v1.js` to load the Tokyo backup module on the Tokyo route only.

## 2026-08-23 — Hotel price consistency fix
- Fixed the Google Hotels parser behavior that could combine unrelated THB values.
- Stay total is now the source of truth; nightly is derived from `total ÷ nights`.
- Added conservative sanity checks and `price-sanity-v1.js`.
- Inconsistent evidence returns `unavailable` instead of a guessed LIVE price.

## 2026-08-23 — Review-first hotel policy across all trips
- Added `hotel-quality-v1.js` and review ≥4.0/5 (or OTA ≥8.0/10 fallback) policy.
- Added preferred ≤10K / acceptable ≤15K full-stay budget bands.
- Replaced effective hotel shortlist across all seven trips.

## 2026-08-23 — All-trip date + budget Settings
- Added `trip-settings-all-v1.js` and grouped settings for all seven trips.
- Saving dates updates Refresh/Booking state.

## 2026-08-23 — Quick Jump target fix + app-wide layout pass + PWA v87
- Added reliable top-level Quick Jump filtering and shared layout normalization.

## 2026-08-23 — Stable Collapse v2
- Replaced DOM-moving collapse behavior with stable CSS-class state.

## Permanent rule
Every meaningful trip-function or shared-app change must update this README / Change Log in the same improvement round.
