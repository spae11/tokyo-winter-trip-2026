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

## Current shared modules
- `hotel-quality-v1.js` — approved hotel catalog, review threshold, 10K/15K ranking, old-hotel filtering
- `live-price-v2.js` — current-price refresh + per-trip snapshots
- `trip-live-budget-sync-v2.js` — LIVE/ESTIMATE budget sync with hotel budget ceiling
- `trip-page-ux-v2.js` — CSS hide/unhide + booking routing
- `trip-jump-fix-v1.js` — reliable Quick Jump targets
- `app-layout-polish-v1.js` — shared Home/trip/Trip Tools layout normalization
- `trip-settings-all-v1.js` — all-trip start-date + budget settings and shared date sync
- `ui-motion-v1.js` — shared loader
- `cloudflare/live-prices.js` / `cloudflare/worker.js` — current-price backend

# Hotel quality + budget policy

This is the default rule for **every current and future trip**.

## Review quality
- Prefer a public review score **≥ 4.0 / 5**.
- When a reliable 5-point score is unavailable, an established OTA guest score **≥ 8.0 / 10** may be used.
- Prefer large review samples and established hotels over guesthouses / unknown stays.
- Do not treat hotel star class as the same thing as guest review score.
- `Hotel TBD` is never an approved hotel.

## Stay-price target
The live full-stay total controls ranking:

1. **≤ 10,000 THB** — preferred / green
2. **10,001–15,000 THB** — acceptable fallback
3. **> 15,000 THB** — do not use as the main recommended hotel

Rules:
- Use the saved trip dates, 2 adults, 1 room.
- Exact current price comes from `↻ เช็กราคา`; static research prices are not treated as guaranteed live prices.
- If no approved hotel is ≤15K on the selected dates, keep the hotel budget as `ESTIMATE` and say the latest approved options are over budget instead of silently selecting an expensive stay.
- For split-city trips, the shortlist may contain hotels for different stay segments; exact segment-night totals should be refined when segment dates are available.

## Price request enforcement
`hotel-quality-v1.js` loads **before** `live-price-v2.js` and enforces the approved shortlist on `/api/prices/refresh` requests. This prevents old catalog hotels from reappearing through the existing price client.

It also:
- removes old/unapproved hotel snapshots from `travelHubLivePricesV2` and `travelHubTripPricesV1`
- hides old static hotel cards that are no longer approved
- shows the approved shortlist with review score and current budget band
- ranks current results by `≤10K` → `≤15K` → over budget
- updates visible legacy hotel wording in Trip Tools where applicable
- keeps Booking.com links date-aware

# Approved hotel shortlist

## Tokyo
- **APA Hotel Asakusa Kuramae Kita** — review 4.2/5; Booking 8.6/10
- **Tosei Hotel Cocone Asakusa Kuramae** — review 4.1/5; Booking 8.7/10

## Kansai / Osaka
- **KOKO HOTEL Osaka Namba Sennichimae** — review 4.4/5; Booking 8.7/10
- **Hotel Sobial Namba Daikokucho** — review 4.0/5; Booking 8.8/10

## Hong Kong
- **Page148, Page Hotels** — review 4.7/5; Booking 8.7/10
- **The Cityview - Chinese YMCA of Hong Kong** — review 4.0/5; Booking 8.5/10
- **Dorsett Mongkok, Hong Kong** — review 4.1/5; Booking 8.0/10

Dorsett remains because it was already a preferred saved option, but live total still must respect the 15K ceiling to become the main recommendation.

## Da Nang + Hoi An
- **Monarque Hotel Danang** — review 5.0/5; Booking 9.5/10
- **HAIAN Beach Hotel & Spa** — review 4.9/5; Booking 9.1/10
- **La Charm Hoi An Hotel - Peaceful Boutique In Old Town** — Booking 9.5/10

## Yunnan
- **Holiday Inn Express Kunming Panlong by IHG** — Booking 8.9/10
- **Hilton Garden Inn Dali Ancient City** — OTA score about 9.4/10

## Chongqing
- **Mercure Hotel Chongqing Jiefangbei** — review 4.5/5; OTA score about 9.5/10
- **Glenview ITC Plaza Chongqing** — review 4.5/5

## Harbin + Yabuli
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
- Every registered trip gets a **start date** field.
- Every registered trip gets a **Budget (THB)** field.
- Save writes all values to `travelToolsV1`.
- Dates also synchronize to `travelHubStateV2` so hotel Refresh and Booking links use the same dates.
- `travelHubStateV2` stores both start/end for price requests.
- Current 6D5N trips derive end date from start + 5 nights.
- Hong Kong derives end date from the currently selected `5D4N` or `6D5N` mode.
- Adding a new trip requires adding it to this all-trip Settings system in the same round.

# Refresh / price rules
- Trip-page Refresh checks only that trip; Home Refresh checks all trips.
- Hotel request default: 2 adults / 1 room.
- Use saved trip dates whenever available.
- Hotel requests use only the approved quality catalog.
- `LIVE` means verified during the current/recent refresh.
- Old values must never silently become LIVE.
- Missing dates must not create a fabricated exact hotel total.
- Unsupported categories remain `ESTIMATE`.
- Refreshing one trip must not overwrite another trip's snapshot.

# Hotel booking rules
- Hotel name and main booking button open Booking.com using the exact approved hotel name, saved dates when available, 2 adults, 1 room, THB preference.
- Our Journey navigation must never intercept a hotel booking click.
- The current price source (for example Google Hotels) is price evidence, not the main booking destination.
- Attraction/ticket links open their Official/current source.

# Quick Jump rules
- `☰ หัวข้อ` appears on trip pages only.
- Show **top-level trip sections only**.
- Do not list nested Disney ride groups, media subsections, or headings inside another main section as separate destinations.
- Remove duplicate headings and duplicated decorative emoji.
- Every listed target must exist in the current DOM and have a real page position.
- Open collapsed destination/parent before scrolling.
- Scroll with a fixed-header offset so the heading is not hidden under the top bar.
- Include `บนสุด`, `ย่อหัวข้อรอง`, and `เปิดทั้งหมด`.

# Hide / Unhide rules
Keep primary content easy to reach:
- Hotel/stay: normally open
- Daily itinerary: normally open / controlled by Day UI

Secondary content may start collapsed:
- `🎟️ ราคา / ลิงก์ตั๋ว`
- Budget details
- Best Season
- Checklist / preparation
- Souvenir guide
- Travel apps
- Before-you-go / travel rules
- Supporting Muslim/Halal sections
- Other long supporting sections

Dynamic Refresh must not automatically reopen a collapsed section.

# App-wide layout standard
`app-layout-polish-v1.js` is the shared visual normalization layer.

Goals:
- Consistent vertical spacing between sections
- Similar card radius/shadow across modules
- Avoid oversized blank frames and excessive padding
- Avoid cramped sections
- Consistent mobile heading size/line-height
- Compact, proportionate hotel cards
- Consistent budget/ticket/souvenir gaps and padding
- Bottom navigation must not cover final content
- Trip Tools cards/items/tabs and shared sheets should feel like the same UI family

Prefer fixing shared layout rules instead of adding one-off large margins/paddings to one trip.

# Hong Kong mode rule
- `5D4N` = 4 hotel nights / 5 food days
- `6D5N` = 5 hotel nights / 6 food days

# PWA / offline
Current cache generation: **`our-journey-v87`**.

Offline core includes the main shared loader/price/UX/layout files. `hotel-quality-v1.js` and `trip-settings-all-v1.js` are loaded by `ui-motion-v1.js` and are cached by the service worker script strategy after their first online load.

# Test checklist before calling a trip complete
- Home ↔ trip navigation works
- Mobile layout is proportionate
- Trip Tools tabs/cards/items are visually consistent
- Settings lists every registered trip
- Every trip date/budget saves and propagates to Refresh/Booking
- Approved hotel shortlist uses review ≥4/5 or OTA ≥8/10 fallback
- Old/unapproved hotel cards do not return after Refresh
- Hotel price ranking prefers ≤10K, accepts ≤15K, and does not auto-select >15K
- Refresh shows progress and checks only the intended trip
- Ticket section stays collapsed after Refresh
- Secondary sections collapse without leaving huge empty frames
- `☰ หัวข้อ` contains only working top-level destinations
- Booking opens the intended approved hotel externally
- Ticket links open the intended source
- LIVE / LAST CHECKED / ESTIMATE labels are truthful
- Bottom navigation does not cover final content
- Offline/PWA behavior still works
- README / Change Log is updated in the same round

# Change Log

## 2026-08-23 — Review-first hotel policy across all trips
- Added `hotel-quality-v1.js` as the shared approved-hotel catalog.
- Replaced the effective hotel shortlist for Tokyo, Kansai, Hong Kong, Da Nang/Hoi An, Yunnan, Chongqing and Harbin/Yabuli.
- New default quality threshold: review ≥4.0/5; OTA ≥8.0/10 fallback when a comparable 5-point score is unavailable.
- Added live stay-budget bands: preferred ≤10K THB, acceptable ≤15K THB, over 15K not selected as the main recommendation.
- Hotel quality policy now loads before `live-price-v2.js` and rewrites hotel price requests to approved candidates only.
- Old/unapproved stored hotel snapshots are removed from active price data.
- Added a review + budget shortlist UI to trip pages and hide obsolete hotel cards.
- Updated `trip-live-budget-sync-v2.js` so the hotel budget only uses approved LIVE hotels at or below 15K.
- Updated legacy visible hotel wording in Trip Tools where possible.
- Updated `ui-motion-v1.js` to load the hotel policy before price refresh.

## 2026-08-23 — All-trip date + budget Settings
- Added `trip-settings-all-v1.js`.
- Replaced the visible two-trip Settings card with grouped controls for all seven trips.
- Added start-date and THB budget fields for Tokyo, Kansai, Hong Kong, Da Nang/Hoi An, Yunnan, Chongqing, and Harbin.
- Saving dates also updates `travelHubStateV2` start/end values used by hotel Refresh and Booking links.

## 2026-08-23 — Quick Jump target fix + app-wide layout pass + PWA v87
- Added `trip-jump-fix-v1.js` and `app-layout-polish-v1.js`.
- Removed nested/dead/duplicate Quick Jump destinations.
- Normalized section spacing, card proportions, mobile hotel layout, Trip Tools and shared sheets.
- Bumped PWA cache to `our-journey-v87`.

## 2026-08-23 — Stable Collapse v2
- Replaced DOM-moving collapse logic with CSS-class state.
- Fixed ticket sections reopening after dynamic price Refresh.
- Added `trip-live-budget-sync-v2.js` so budget sync no longer rewrites ticket DOM.

## Permanent rule
Every meaningful trip-function or shared-app change must update this README / Change Log in the same improvement round.
