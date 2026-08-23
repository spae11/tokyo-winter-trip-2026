# Our Journey Travel Hub

Travel planning PWA for all trips in **Our Journey**.

> **READ THIS README BEFORE ADDING OR MODIFYING A TRIP.**
> A new trip is not complete after creating only `<trip>/index.html`; it must inherit the shared functions below.

> **README / CHANGE LOG RULE — MANDATORY**
> Whenever any trip function, shared UI, price logic, booking behavior, navigation, hide/unhide behavior, layout/spacing standard, storage key, route coverage or architecture changes, update this README in the **same improvement round**. README must never lag behind the code.

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
3. Register the route in Home, Trip Tools, PWA/shared injection, Refresh, live-budget sync, booking links, Quick Jump, hide/unhide, layout polish and Memories/Sync where applicable.
4. Give the new trip every applicable function existing trips already have.
5. Test on mobile.
6. Update this README / Change Log in the same round.

---

# Standard Trip Functions

Every trip should inherit, where applicable:

- Mobile-friendly header/navigation.
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
- Shared layout/spacing/card proportions.
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

Quick Jump target correction:
- `trip-jump-fix-v1.js`

Shared app layout polish:
- `app-layout-polish-v1.js`

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

Hotel name / main booking button must open a Booking.com hotel search using:

- exact hotel name
- saved check-in/check-out when available
- 2 adults
- 1 room
- THB display preference

The booking action must never be intercepted by Our Journey navigation or return to Home.

The backend may use Google Hotels or another source to verify a current price. That source is **price evidence**, not the main booking destination.

Attraction/ticket links continue to open their Official/current source.

---

# Long-page UX — Quick Jump + Hide/Unhide

All seven trip pages use the shared long-page system.

## Quick Jump

- Persistent `☰ หัวข้อ` button above bottom navigation.
- Includes `บนสุด`.
- **Only real top-level trip sections are listed.**
- Nested sub-sections such as individual Disney ride groups, media subsections or headings inside another main section must not appear as separate Quick Jump destinations.
- Duplicate headings are removed.
- Decorative emoji are normalized so the menu does not show duplicated icons.
- Every listed destination must be connected to the current DOM and have a real page position.
- Jumping uses a fixed-header offset rather than relying only on browser `scrollIntoView`.
- If the destination or its parent is collapsed, it opens before scrolling.
- Jump sheet includes `ย่อหัวข้อรอง` and `เปิดทั้งหมด`.
- Quick Jump appears on trip pages only, not Home.

## Default open sections

Keep primary content easy to reach:

- Hotel/stay section: open.
- Daily itinerary / daily plan: open or controlled by the existing Day UI.

## Default collapsed sections

Secondary/long sections should start collapsed when appropriate:

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

The stable implementation uses CSS classes and existing headings instead of moving/rebuilding section DOM. Dynamic Refresh must not automatically reopen a collapsed ticket/secondary section.

Manual section state is stored per trip in `tripSectionOpenV2`.

---

# App-wide Layout Standard

`app-layout-polish-v1.js` is the shared visual normalization layer for Home and all trip routes.

Goals:

- Consistent vertical rhythm between sections.
- Similar card radius/shadow across modules.
- Avoid oversized empty cards and excessive blank space.
- Avoid sections being packed too tightly.
- Consistent mobile heading line-height and margins.
- Hotel cards stay compact and proportionate on phones.
- Budget, ticket, souvenir and secondary cards use similar gaps/padding.
- Bottom navigation must not cover the last visible content.
- Sheets/popups use compatible radius/padding.
- Trip Tools cards/items/tabs use the same compact spacing language as the rest of the app.

### Home standard

- Main sections use a consistent moderate vertical gap.
- Trip / country / memory cards share a similar card radius and shadow.
- Card internal padding should be compact but not cramped.
- Cover images should not make cards unnecessarily tall on mobile.

### Trip-page standard

- Top-level sections use one shared horizontal width and vertical rhythm.
- Long hotel names wrap naturally without oversized typography.
- Hotel image height/padding/badges/price box are kept compact on mobile.
- Injected price/ticket sections align to the same page width as normal content.
- Budget and supporting guides use consistent gap/padding values.
- Collapsed sections should become genuinely compact rather than leaving a large empty frame.

### Trip Tools / overlays

- Tabs and main content use consistent compact padding.
- `.tt-card` and `.tt-item` use compatible radii and spacing.
- Bottom sheets / price sheets / More panels should feel like one UI family.

Do not add one-off huge margins/paddings to a single trip unless there is a real content-specific reason. If a shared spacing problem is found, prefer fixing the shared layout layer.

---

# Ticket Link UI

- `🎟️ ราคา / ลิงก์ตั๋ว` must start collapsed.
- Tap its heading to expand/collapse.
- Refresh may rewrite ticket cards but must not automatically reopen the section.
- Official/current ticket links remain accessible after expanding.

---

# Live-aware Trip Budget

1. Verified hotel total may replace the hotel estimate.
2. Ticket/activity budget may become LIVE only when required registered sources are successfully verified.
3. Flights, food, transport, eSIM, insurance and unsupported categories stay `ESTIMATE`.
4. Visible total is recalculated from displayed category values.
5. Show last checked timestamp and LIVE-category count.
6. Budget heading must use current hotel/catalog rather than stale hardcoded hotel text.
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

Only successfully verified current values may be labeled LIVE.

---

# Key Shared Files

- `index.html` — Home / trip cards / dates
- `sw.js` — PWA + shared injection
- `trip-tools-v1.js` / `trip-tools-v1.css` — Trip Tools
- `trip-cloud-sync-v3.js` — cloud state sync
- `plan-extras-v1.js` — planning extras + base budget
- `plan-first-v1.js` / `plan-first-v2.js` — Plan First UI
- `plan-ui-fixes-v1.js` — shared mobile fixes
- `ui-motion-v1.js` — loads current price/budget/UX/layout modules
- `live-price-v2.js` — current-price refresh + per-trip snapshots
- `trip-live-budget-sync-v2.js` — budget-only LIVE/ESTIMATE synchronization
- `trip-page-ux-v2.js` — base CSS hide/unhide + booking routing + section UX
- `trip-jump-fix-v1.js` — filters Quick Jump to real top-level sections and performs reliable offset scrolling
- `app-layout-polish-v1.js` — shared Home/trip/Trip Tools spacing and card proportions
- `cloudflare/live-prices.js` — hotel / FX / ticket backend
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/cloudflare-control.yml` — Cloudflare deployment

---

# Test Checklist Before Calling a Trip Complete

- Home → trip and trip → Home work.
- Mobile layout is proportionate and uses shared spacing.
- Trip Tools tabs/cards/items are visually consistent.
- Dates save correctly.
- `↻ เช็กราคา` is visible and shows progress immediately.
- Trip Refresh checks only that trip.
- Result sheet contains only that trip.
- Other trip snapshots remain unchanged.
- Ticket section starts collapsed even after Refresh rebuilds content.
- Secondary long sections collapse without leaving oversized empty frames.
- Hotel/stay and daily itinerary remain readily accessible.
- `☰ หัวข้อ` lists **top-level destinations only**.
- No dead/non-scrolling Quick Jump item remains.
- No duplicate decorative emoji/icon appears in the Quick Jump label.
- Jumping to a collapsed section opens it first and lands below the fixed header.
- `ย่อหัวข้อรอง` and `เปิดทั้งหมด` work.
- Hotel name / booking button opens Booking.com for that hotel and saved dates.
- Ticket/attraction links open Official/current source.
- LIVE / LAST CHECKED / ESTIMATE labels are truthful.
- Bottom navigation does not cover final content.
- Hong Kong 5D4N / 6D5N counts are correct.
- Offline/PWA behavior is not broken.
- README / Change Log is updated in the same improvement round.

---

# Change Log

## 2026-08-23 — Quick Jump target fix + app-wide layout pass

- Added `trip-jump-fix-v1.js`.
- Quick Jump now lists only real top-level trip sections instead of every nested `<section>`.
- Removed duplicate/decorative heading entries and normalized menu labels/icons.
- Jump now opens collapsed ancestors and scrolls using a fixed-header offset for more reliable positioning.
- Added `app-layout-polish-v1.js` for Home + all seven trip pages.
- Normalized section spacing, card radius/shadow, card padding, mobile hotel proportions, budget/ticket/supporting section gaps and bottom-navigation clearance.
- Extended layout polish to Trip Tools cards/items/tabs and shared sheets/panels.
- Updated `ui-motion-v1.js` to load the Quick Jump fix and layout layer globally.

## 2026-08-23 — Stable Collapse v2 + broader all-trip folding

- Added `trip-page-ux-v2.js` for all seven routes.
- Replaced DOM-moving collapse logic with CSS-class state so dynamic price Refresh cannot reopen collapsed sections.
- Fixed the ticket section bug where `🎟️ ราคา / ลิงก์ตั๋ว` could appear expanded after Refresh rewrote its cards.
- Added `trip-live-budget-sync-v2.js`; budget sync no longer edits ticket DOM.
- Booking routing is enforced at the capture layer so dynamic price-card rewrites cannot replace the hotel booking destination.

## 2026-08-23 — Price Refresh / Booking / Live Budget foundation

- Trip-page Refresh scoped to current trip; Home Refresh remains all trips.
- Added per-trip price snapshots.
- Added hotel/ticket source coverage across all seven routes.
- Added live-aware budget behavior and Hong Kong 5D4N / 6D5N handling.
- Added Booking.com hotel destination rules and Quick Jump concept.

## Permanent rule

Every meaningful trip-function change must update this README / Change Log in the same improvement round.
