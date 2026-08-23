# Our Journey Travel Hub

Travel planning PWA for all trips in **Our Journey**.

> **READ THIS README BEFORE ADDING OR MODIFYING A TRIP.**
> **README / CHANGE LOG MUST BE UPDATED IN THE SAME IMPROVEMENT ROUND** whenever trip functions, UI, pricing, booking, navigation, hide/unhide, hotel policy, layout, storage, routes, PWA behavior, or architecture change.

## Current trips
- `tokyo`
- `kansai`
- `hongkong`
- `danang`
- `yunnan`
- `chongqing`
- `harbin`
- `shanghai`

A new trip is not complete until it follows the same functional rules as the active trips above.

## Required trip features
- Mobile-friendly header/navigation
- Daily itinerary + day navigation
- Quick Edit for date + budget
- Hotel/stay section with named hotel options
- Maps/location links
- Budget breakdown
- Muslim/Halal/prayer information where relevant
- `↻ เช็กราคา` scoped to the current trip
- Booking / Official links
- Quick Jump / section navigation
- Hide/Unhide for long secondary sections
- Consistent shared spacing/card proportions
- Saved date/budget must use `travelHubStateV2` + `travelToolsV1`
- **Trip Tools → Settings must include every registered trip**
- README/Change Log updated in the same round

# Shanghai + Disneyland 5D4N

Route: `shanghai/`

Default structure:
- Day 1: Arrival → Nanjing Road → The Bund
- Day 2: Shanghai Disneyland full day
- Day 3: Yu Garden → Xiaotaoyuan Mosque → Lujiazui / Shanghai Tower
- Day 4: Zhujiajiao → Xintiandi / Shopping
- Day 5: Souvenir / Airport

Rules:
- Dates start blank until the user chooses them.
- `5D4N` = **4 hotel nights**.
- Default planning budget = **55,000 THB / 2 people**.
- Shanghai Refresh checks **Shanghai only**.
- Shanghai hotel/ticket Refresh uses the dedicated Cloudflare handler before the generic price handler.
- Ticket/booking source: Shanghai Disney Resort Official channel.
- Shanghai page uses Amap links for China navigation.
- Shared Trip Tools country/trip picker exposes **Shanghai + Disneyland** under China; choosing it opens the Shanghai trip page.

## Shanghai approved hotels
Review-first shortlist:
- **Holiday Inn Express Shanghai Kangqiao by IHG** — Booking guest score 9.1/10
- **Courtyard by Marriott Shanghai International Tourism and Resorts Zone** — Booking guest score 8.6/10

Stay-price target remains:
1. **≤10,000 THB total** — preferred
2. **10,001–15,000 THB** — acceptable fallback
3. **>15,000 THB** — do not promote as main recommendation

# Hotel quality policy — all trips
- Prefer guest review **≥4.0/5**.
- If a comparable 5-point score is unavailable, established OTA guest score **≥8.0/10** is acceptable.
- Prefer established hotels with meaningful review volume.
- Avoid Guesthouse / unknown stays for the main recommendation.
- Hotel star class is not the same as guest review score.
- `Hotel TBD` is never a real approved hotel.
- Use saved trip dates, 2 adults, 1 room.
- If no approved hotel is ≤15K, keep the budget as `ESTIMATE`; do not silently choose an expensive hotel.

## Current approved hotel examples
- Tokyo: APA Hotel Asakusa Kuramae Kita; Tosei Hotel Cocone Asakusa Kuramae
- Kansai: KOKO HOTEL Osaka Namba Sennichimae; Hotel Sobial Namba Daikokucho
- Hong Kong: Page148; The Cityview; Dorsett Mongkok
- Da Nang/Hoi An: Monarque; HAIAN Beach; La Charm Hoi An
- Yunnan: Holiday Inn Express Kunming Panlong; Hilton Garden Inn Dali Ancient City
- Chongqing: Mercure Jiefangbei; Glenview ITC Plaza
- Harbin/Yabuli: Mercure Harbin Central Street; Yabu Loni Hotel Yabuli
- Shanghai: Holiday Inn Express Shanghai Kangqiao; Courtyard Shanghai International Tourism and Resorts Zone

# Hotel LIVE price truth rules
Showing **no LIVE price is better than showing a wrong LIVE price**.

For every hotel marked LIVE:
- check-in/check-out must create a valid night count
- stay total must be internally consistent with the displayed nightly value
- displayed nightly should be derived from `totalTHB ÷ nights`
- implausibly low or inconsistent values must be rejected
- failed verification must show `unavailable` / `ยังยืนยันราคาสดไม่ได้`, never a guessed value

Shared guard: `price-sanity-v1.js`.
Generic backend: `cloudflare/live-prices.js`.
Shanghai backend: `cloudflare/shanghai-prices.js`.

# Refresh / booking rules
- Trip-page Refresh checks only the current trip.
- Home Refresh is the all-trip control where supported by the shared client.
- Refreshing one trip must not overwrite another trip's snapshot.
- `LIVE` means verified during the current/recent refresh and passed sanity validation.
- Old values must never silently become LIVE.
- Missing dates must not create a fabricated exact hotel total.
- Unsupported categories remain `ESTIMATE`.
- Hotel booking links use the exact hotel name, saved dates, 2 adults, 1 room, THB preference.
- Attraction/ticket links open Official/current source.

# Trip Tools / Settings parity
`⚙️ ตั้งค่า → วันที่ + งบ` must list all current trips.

Groups:
- Japan: Tokyo, Kansai
- Hong Kong: Hong Kong
- Vietnam: Da Nang + Hoi An
- China: Yunnan, Chongqing, Harbin, **Shanghai**

Rules:
- Every trip gets a start-date field and Budget (THB) field.
- Save writes to `travelToolsV1` and synchronizes price/booking dates into `travelHubStateV2`.
- Shanghai = 4 nights.
- Shared Trip Tools picker must expose Shanghai under China and route to `/shanghai/`.
- Tokyo 5D4N backup uses next-day hotel check-in.
- Hong Kong derives nights from selected 5D4N/6D5N mode.

# Tokyo backup mode
Tokyo keeps 6D5N as the main plan plus a saved 5D4N backup flight option.
- BKK departure 5 Dec 2026
- NRT arrival 6 Dec 08:30
- NRT return 10 Dec 09:00
- backup hotel stay = 6–10 Dec, 4 nights
- observed airfare snapshot ≈20,070 THB/person; **not booked / not live fare**

# Quick Jump / Hide-Unhide / Layout
- Quick Jump lists real top-level sections only.
- No dead, nested, or duplicate headings.
- Open collapsed destination before scrolling.
- Long secondary sections may start collapsed: ticket links, detailed budget, season, checklist, souvenir, apps, supporting information.
- Hotel/stay and daily itinerary remain primary content.
- Dynamic Refresh must not reopen collapsed sections automatically.
- Keep spacing, mobile typography, card radius, card padding, and bottom-nav clearance consistent.

# Shared modules
- `ui-motion-v1.js` — shared loader
- `shanghai-register-v1.js` — registers Shanghai on Home / China card and shared Trip Tools picker
- `trip-settings-all-v1.js` — all-trip date + budget settings
- `price-sanity-v1.js` — bad-price guard
- `hotel-quality-v1.js` — generic approved-hotel policy
- `live-price-v2.js` — generic trip price client
- `trip-live-budget-sync-v2.js` — generic LIVE/ESTIMATE budget sync
- `trip-page-ux-v2.js` — booking/collapse behavior
- `trip-jump-fix-v1.js` — reliable top-level Quick Jump
- `app-layout-polish-v1.js` — shared visual normalization
- `tokyo-flight-option-v1.js` — Tokyo backup mode
- `cloudflare/shanghai-prices.js` — Shanghai-specific verified hotel + Disney price handler

# Test checklist
Before calling a trip complete:
- Home ↔ trip navigation works
- Mobile layout is proportionate
- Date/budget saves and survives reopening
- Settings lists every registered trip
- Trip Tools picker exposes Shanghai under China
- Refresh checks only intended trip
- Booking opens intended hotel externally
- Official ticket link opens intended source
- LIVE / LAST CHECKED / ESTIMATE labels are truthful
- For LIVE hotel: `totalTHB ÷ nights ≈ displayed nightly`
- Bad/implausible prices are rejected
- Secondary sections collapse correctly
- Quick Jump destinations work
- Bottom navigation does not cover final content
- README / Change Log updated in same round

# Change Log

## 2026-08-23 — Shanghai + Disneyland 5D4N
- Added `shanghai/index.html` as a new Shanghai + Shanghai Disneyland trip.
- Added 5D4N itinerary, Amap navigation, Muslim/Halal section, budget, collapsed secondary sections, Quick Jump, Quick Edit and Shanghai-only Refresh.
- Added review-first Shanghai hotel shortlist: Holiday Inn Express Shanghai Kangqiao and Courtyard Shanghai International Tourism and Resorts Zone.
- Added Booking.com date-aware booking links.
- Added Shanghai Disney Resort Official ticket link.
- Added `cloudflare/shanghai-prices.js` with verified-pair hotel parsing and Shanghai Disney official ticket price extraction.
- Updated Cloudflare Worker to route Shanghai-only refresh before generic live prices.
- Added `shanghai-register-v1.js` to register Shanghai on Our Journey Home / China card and shared Trip Tools picker.
- Added Shanghai to `trip-settings-all-v1.js` under China with 4 nights and 55K default budget.
- Updated `ui-motion-v1.js` to load the Shanghai registration module.

## 2026-08-23 — Tokyo 5D4N backup flight plan
- Preserved Tokyo 6D5N and added a switchable 5D4N backup plan.
- Backup hotel stay uses 4 nights and next-day check-in.

## 2026-08-23 — Hotel price consistency fix
- Rejected inconsistent Google Hotels values instead of showing guessed LIVE prices.
- Stay total is source of truth; nightly derived from total ÷ nights.

## Permanent rule
Every meaningful trip-function or shared-app change must update this README / Change Log in the same improvement round.
