# Our Journey Travel Hub

Travel planning PWA for all trips in **Our Journey**.

> **IMPORTANT — READ THIS README BEFORE ADDING OR MODIFYING A TRIP.**
> A new trip must inherit the same shared functions as the existing trips. Do not finish a new trip after only creating `<trip>/index.html`.

> **README UPDATE RULE — MANDATORY.**
> Whenever any trip function, shared UI behavior, price behavior, booking behavior, navigation, hide/unhide rule or architecture is changed, update this README / Change Log in the same improvement round. Do not leave README behind the code.

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
3. Register the new route in Home, Trip Tools, PWA/shared injection, price refresh, live-budget sync, quick-section navigation, collapse/hide-unhide and booking/source-link systems.
4. Give it every applicable function the existing trips already have.
5. Update this README / Change Log whenever architecture or trip coverage changes.

A trip is not complete until mobile layout, Trip Tools, Memories/Sync, live-price refresh, live-budget sync, quick section navigation, sensible collapsed sections and external booking/source links are checked.

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
- A persistent **`☰ หัวข้อ` quick-jump button** for long pages.
- Suitable secondary sections must support **hide/unhide** and start collapsed when appropriate.
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

Long-page navigation / booking UX:
- `trip-page-ux-v1.js`

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
- Trip Tools start dates are synchronized into the shared price-date state before a trip refresh when available.
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

Hotel booking and price-source links have different jobs and must not be mixed:

- Hotel name is clickable.
- The main hotel action is **`จองโรงแรม ↗`**.
- Hotel name / booking button opens a Booking.com search constrained by **hotel name + saved check-in/check-out + 2 adults + 1 room** when dates are available.
- The booking action must never open Our Journey Home and must not use a broad Google Hotels landing page as the main booking destination.
- If the current price was verified from Google Hotels or another source, show a separate smaller **`ดูแหล่งราคาที่เช็ก ↗`** link.
- The price-source link preserves the source used for the current price result.
- External booking clicks must stop app navigation handlers so they are not intercepted by Home navigation.
- Attraction/ticket names continue to open their Official/current booking source.

---

# Long-page UX / Quick Jump / Hide-Unhide — mandatory for every trip

Long trip pages must stay easy to navigate on mobile.

Rules:

1. Every trip page shows a persistent **`☰ หัวข้อ`** button above the bottom navigation.
2. Tapping it opens a compact section list generated from the headings currently present on that trip page.
3. The list includes a **back-to-top** action and jumps smoothly to the selected heading.
4. If the selected heading belongs to a collapsed section, the section opens before scrolling to it.
5. Primary content should stay readily visible: hotel/stay and daily itinerary are not collapsed by the generic rule.
6. Secondary/long content should start collapsed when appropriate, including budget details, season/best-time info, checklists/preparation, souvenir guides, travel-app guides and similar supporting sections.
7. Every collapsed section has a visible **`ดูรายละเอียด / ซ่อน`** control.
8. The user's open/closed preference may be preserved per trip in `tripSectionOpenV1`.
9. `🎟️ ราคา / ลิงก์ตั๋ว` retains its dedicated collapsed-by-default behavior.
10. These rules apply to **all seven registered trips and every future trip**.

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

# Hotel-card mobile standard

Hotel cards must stay compact and readable on a phone across all trips:

- Controlled responsive hotel-name size and line height.
- Long hotel names must wrap naturally without oversized typography or dashed underlines across multiple lines.
- Badges wrap cleanly.
- Price box uses tighter spacing.
- Main booking action remains compact.
- `จองโรงแรม ↗` and `ดูแหล่งราคาที่เช็ก ↗` stay visually separate.
- A verified current hotel result may replace the static sample price box with the newest current value and timestamp.
- If no current result exists, static observed prices must be treated as a sample/snapshot, not silently presented as LIVE.

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
- `trip-page-ux-v1.js`
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
8. Preserve/open the current source URL separately from the main hotel booking destination.
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
- `☰ หัวข้อ` appears and can jump to every meaningful current section.
- Secondary sections can hide/unhide without breaking their content.
- Jumping to a collapsed section opens it before scrolling.
- Trip Budget replaces only verified categories with live values.
- Non-live budget categories remain visibly marked `ESTIMATE`.
- Budget total recalculates after a live category changes.
- Hong Kong 5D4N budget uses 4 hotel nights / 5 food days.
- Live/Last Checked label is truthful per trip.
- Hotel names remain readable on mobile without oversized wrapping.
- Hotel name / `จองโรงแรม ↗` opens Booking.com for that named hotel with trip dates when available.
- `ดูแหล่งราคาที่เช็ก ↗` opens the source used for the current hotel price when available.
- Hotel booking must not return to Our Journey Home.
- Attraction source link opens.
- Offline/PWA behavior is not broken.
- Existing trips are not regressed.
- README / Change Log is updated for the same function change.

---

# Key shared files

- `index.html` — Home / dates / maps / trip cards
- `sw.js` — PWA + shared page injection
- `trip-tools-v1.js` / `trip-tools-v1.css` — Trip Tools
- `trip-cloud-sync-v3.js` — cloud state sync
- `plan-extras-v1.js` — planning extras + base budget breakdown
- `plan-ui-fixes-v1.js` — shared mobile fixes
- `plan-first-v1.js` / `plan-first-v2.js` — Plan First UI
- `ui-motion-v1.js` — shared UI + price/budget/long-page UX module loader
- `live-price-v2.js` — trip-scoped current-price refresh, per-trip snapshots, result sheet and price-source data
- `trip-live-budget-sync-v1.js` — collapsed ticket-link section + LIVE/ESTIMATE budget synchronization for every trip
- `trip-page-ux-v1.js` — quick section navigation, generic sensible hide/unhide, mobile hotel typography, Booking.com hotel destination and separate price-source links
- `cloudflare/worker.js` — API router
- `cloudflare/live-prices.js` — hotel / FX / ticket current-price backend
- `.github/workflows/pages.yml` — GitHub Pages deployment
- `.github/workflows/cloudflare-control.yml` — Cloudflare Worker deployment

---

# Current coverage status

As of **2026-08-23**:

- Tokyo — price framework ✅ named hotels ✅ ticket source ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ section hide/unhide ✅
- Kansai — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ section hide/unhide ✅
- Hong Kong — price framework ✅ named hotels ✅ ticket sources ✅ reliable Booking.com hotel destination ✅ separate checked-price source ✅ visible trip refresh ✅ compact mobile hotel cards ✅ trip-scoped refresh ✅ mode-aware live budget ✅ collapsed ticket links ✅ quick jump ✅ section hide/unhide ✅
- Da Nang — price framework ✅ named hotels ✅ ticket source ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ section hide/unhide ✅
- Yunnan — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ section hide/unhide ✅
- Chongqing — price framework ✅ named hotels ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ section hide/unhide ✅
- Harbin — price framework ✅ named hotel options ✅ ticket sources ✅ booking links ✅ visible trip refresh ✅ trip-scoped refresh ✅ live-aware budget ✅ collapsed ticket links ✅ quick jump ✅ section hide/unhide ✅

**Functional registration is complete across all seven trips.** A LIVE result still depends on the external source responding and exposing a verifiable price at refresh time.

---

# Change Log

## 2026-08-23 — Long-page Quick Jump + all-trip hide/unhide + booking destination fix
- Added `trip-page-ux-v1.js` and loaded it from the shared `ui-motion-v1.js` loader.
- Added persistent `☰ หัวข้อ` quick navigation on every trip page.
- Quick navigation builds its menu from the actual headings present on the current trip page, includes Back to Top, opens a collapsed destination when needed and scrolls to it smoothly.
- Added generic sensible collapse behavior for supporting long sections such as budget detail, season/best time, preparation/checklists, souvenirs, travel apps and similar secondary content.
- Preserved hotel/stay and daily itinerary as primary open content.
- Added per-trip open/closed preference storage in `tripSectionOpenV1`.
- Changed the hotel title / main booking button to a Booking.com search constrained by hotel name, saved dates, 2 adults and 1 room.
- Separated the main booking destination from the current price-check source; a verified result may show `ดูแหล่งราคาที่เช็ก ↗` independently.
- Added a capture-level booking click handler so older app navigation or price handlers cannot redirect the booking click back to Our Journey Home.
- Added smaller mobile hotel-name typography and removed the dashed multi-line link treatment from hotel names.
- Verified current hotel results can refresh the visible hotel price box; static old card prices are relabeled as sample/snapshot when no current live result exists.
- Added Trip Tools date fallback/synchronization for booking links and current-price requests.
- Reaffirmed the mandatory rule that README / Change Log must be updated whenever trip functionality changes.

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
