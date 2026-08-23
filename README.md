# Our Journey Travel Hub

Travel planning PWA for all trips in **Our Journey**.

> **READ THIS README BEFORE ADDING OR MODIFYING A TRIP.**
> **README / CHANGE LOG MUST BE UPDATED IN THE SAME IMPROVEMENT ROUND** whenever trip functions, shared UI, pricing, booking, navigation, hide/unhide, layout, storage, routes, PWA behavior, or architecture change.

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

## Current shared modules
- `live-price-v2.js` — current-price refresh + per-trip snapshots
- `trip-live-budget-sync-v2.js` — LIVE/ESTIMATE budget sync
- `trip-page-ux-v2.js` — CSS hide/unhide + booking routing
- `trip-jump-fix-v1.js` — reliable Quick Jump targets
- `app-layout-polish-v1.js` — shared Home/trip/Trip Tools layout normalization
- `ui-motion-v1.js` — shared loader
- `cloudflare/live-prices.js` / `cloudflare/worker.js` — current-price backend

## Refresh / price rules
- Trip-page Refresh checks only that trip; Home Refresh checks all trips.
- Hotel request default: 2 adults / 1 room.
- Use saved trip dates whenever available.
- `LIVE` means verified during the current/recent refresh.
- Old values must never silently become LIVE.
- Missing dates must not create a fabricated exact hotel total.
- Unsupported categories remain `ESTIMATE`.
- Refreshing one trip must not overwrite another trip's snapshot.

## Hotel booking rules
- Hotel name and main booking button open Booking.com using the exact hotel name, saved dates when available, 2 adults, 1 room, THB preference.
- Our Journey navigation must never intercept a hotel booking click.
- The current price source (for example Google Hotels) is price evidence, not the main booking destination.
- Attraction/ticket links open their Official/current source.

## Quick Jump rules
- `☰ หัวข้อ` appears on trip pages only.
- Show **top-level trip sections only**.
- Do not list nested Disney ride groups, media subsections, or headings inside another main section as separate destinations.
- Remove duplicate headings and duplicated decorative emoji.
- Every listed target must exist in the current DOM and have a real page position.
- Open collapsed destination/parent before scrolling.
- Scroll with a fixed-header offset so the heading is not hidden under the top bar.
- Include `บนสุด`, `ย่อหัวข้อรอง`, and `เปิดทั้งหมด`.

## Hide / Unhide rules
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

## App-wide layout standard
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

## Hong Kong mode rule
- `5D4N` = 4 hotel nights / 5 food days
- `6D5N` = 5 hotel nights / 6 food days

## Current hotel coverage
- Tokyo: APA Hotel Asakusa Tawaramachi-Ekimae; Richmond Hotel Premier Asakusa International
- Kansai: Sotetsu Fresa Inn Osaka-Namba; Hotel Keihan Namba Grande
- Hong Kong: Silka Far East Hotel; Ramada Grand Tsim Sha Tsui; Silka Tsuen Wan; Dorsett Mongkok
- Da Nang/Hoi An: HAIAN Beach Hotel & Spa; Little Riverside Hoi An
- Yunnan: Holiday Inn Express Kunming Panlong; Dali Old Courtyard Boutique Inn
- Chongqing: Glenview ITC Plaza Chongqing; Ascott Raffles City Chongqing
- Harbin/Yabuli: Holiday Inn Express Harbin Central Avenue; Fairfield by Marriott Harbin Downtown; Yabuli Sun Mountain Resort

`Hotel TBD` is never treated as a real hotel.

## PWA / offline
Current cache generation: **`our-journey-v87`**.

Offline core includes:
- `ui-motion-v1.js`
- `live-price-v2.js`
- `trip-live-budget-sync-v2.js`
- `trip-page-ux-v2.js`
- `trip-jump-fix-v1.js`
- `app-layout-polish-v1.js`

`sw.js` injects `ui-motion-v1.js?v=5` into Home and trip pages.

## Test checklist before calling a trip complete
- Home ↔ trip navigation works
- Mobile layout is proportionate
- Trip Tools tabs/cards/items are visually consistent
- Refresh shows progress and checks only the intended trip
- Ticket section stays collapsed after Refresh
- Secondary sections collapse without leaving huge empty frames
- `☰ หัวข้อ` contains only working top-level destinations
- No dead Quick Jump item remains
- Jump opens collapsed destinations and lands below fixed header
- Booking opens the intended hotel externally
- Ticket links open the intended source
- LIVE / LAST CHECKED / ESTIMATE labels are truthful
- Bottom navigation does not cover final content
- Offline/PWA behavior still works
- README / Change Log is updated in the same round

# Change Log

## 2026-08-23 — Quick Jump target fix + app-wide layout pass + PWA v87
- Added `trip-jump-fix-v1.js` to filter Quick Jump to real top-level sections and use reliable offset scrolling.
- Removed nested/dead/duplicate destinations from the Quick Jump menu.
- Added `app-layout-polish-v1.js` for Home, all seven trip pages, Trip Tools, and shared sheets.
- Normalized section spacing, card proportions, padding, mobile hotel layout, supporting-card gaps, and bottom-nav clearance.
- Updated `ui-motion-v1.js` to load the new shared modules.
- Bumped PWA cache to `our-journey-v87` and added the active price/UX/layout modules to offline core.
- `sw.js` now injects `ui-motion-v1.js?v=5`.

## 2026-08-23 — Stable Collapse v2
- Replaced DOM-moving collapse logic with CSS-class state.
- Fixed ticket sections reopening after dynamic price Refresh.
- Added `trip-live-budget-sync-v2.js` so budget sync no longer rewrites ticket DOM.
- Kept hotel booking routing independent from price-source URLs.

## Permanent rule
Every meaningful trip-function or shared-app change must update this README / Change Log in the same improvement round.
