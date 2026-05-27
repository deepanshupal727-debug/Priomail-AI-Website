# PrioMail AI Website — Product Requirements

## Original Problem Statement
Pull the user's GitHub repo `deepanshupal727-debug/Priomail-AI-Website` (branch `main--Website`) and integrate three additions without touching the existing landing-page content:
1. Add the official PrioMail logo (stored on the `logo-files-` branch) to the website header.
2. Build a Referral tracking system with admin dashboard so the owner can create codes, share links, and see click → signup → conversion analytics.
3. Build a Coupon-code system that admins can create, manage, and customers can apply at the Pricing page.

## Architecture
- **Frontend:** React 19 + react-router-dom, Tailwind, Framer Motion, Radix UI, sonner toasts.
- **Backend:** FastAPI + Motor (MongoDB async). All routes prefixed with `/api`.
- **DB:** MongoDB collections — `referrals`, `referral_events`, `coupons`, `coupon_redemptions`, plus original `status_checks`.

## Implemented (Feb 2026)
### Logo integration
- Header now renders the official PrioMail bolt mark from `/public/priomail-icon-white.svg` (replaces the lucide Zap placeholder). Logo files cherry-picked from the `logo-files-` branch into `/public` and `/src/components/PrioMailLogo.{jsx,css}` (the animated 3D mark stays available for future Hero/About use).

### Referral system
- Backend (`/app/backend/server.py`):
  - `POST/GET/PATCH/DELETE /api/referrals` — CRUD with auto-generated 8-char alphanumeric codes (or custom).
  - `POST /api/referrals/{code}/events` — log `click | signup | conversion` events (with optional amount).
  - `GET /api/referrals/{code}/events` — full event log.
  - Live stats per referral: clicks, signups, conversions, revenue, reward_earned (percent / fixed / month / credit).
- Frontend:
  - `/admin/referrals` — create form, list with copy-link, toggle active, delete, per-row metric tiles.
  - `/r/:code` (`ReferralRedirect.jsx`) — fires a click event, stores `priomail_ref` in localStorage, redirects to `/?ref={CODE}`.

### Coupon system
- Backend:
  - `POST/GET/PATCH/DELETE /api/coupons` — auto-generated `SAVExxxxxx` codes (or custom). Supports `percent`/`fixed` discount, `max_uses`, `valid_until`, `active`.
  - `POST /api/coupons/{code}/validate` — returns `valid`, `reason`, `discount_type`, `discount_value`, `description` (handles not-found, inactive, expired, max-uses-reached).
  - `POST /api/coupons/{code}/redeem` — re-validates, increments `current_uses`, records a `CouponRedemption`.
  - `GET /api/coupons/{code}/redemptions` — redemption history.
- Frontend:
  - `/admin/coupons` — create form, list with copy-code, toggle, delete, usage progress, expiry/exhaustion states.
  - **Public Pricing section now ships with a coupon input** (`/components/landing/Pricing.jsx`). Customers paste a code → backend validates → all plan prices update live (strikethrough original + discounted price + emerald "applied" pill). Coupon also threaded into the Register CTA URL as `?coupon=`.

### Admin overview
- `/admin` shows 8 live stat cards from `/api/admin/stats` (total/active referrals, clicks, signups, conversions, total/active coupons, redemptions, revenue, conversion rate).
- Sidebar nav for Overview / Referrals / Coupons with mobile bottom-nav.

## Routing (App.js)
```
/                   → Landing
/r/:code            → ReferralRedirect (tracks click → localStorage → /?ref=CODE)
/admin              → AdminOverview
/admin/referrals    → AdminReferrals
/admin/coupons      → AdminCoupons
```

## Testing Status (Feb 2026)
- `/app/backend/tests/test_referrals_coupons.py` — **23/23 passing** (CRUD + stats math + validate edge cases + redeem + admin stats + no regression on `/api/` and `/api/status`).
- Frontend E2E via Playwright — all flows pass (header logo, coupon apply/clear/strikethrough/CTA-param, admin overview stats, referrals & coupons CRUD with toasts, /r/:code redirect with localStorage).

## Backlog
### P1
- Admin authentication (admin routes are intentionally open for now — must be gated before production).
- Track signup/conversion events from the actual signup flow on `priomailai.in` (now that localStorage `priomail_ref` is set).
- Apply redeemed coupon to checkout — currently the code is passed via URL param to the external register page; Stripe/payment hook still needed.

### P2
- Refactor `server.py` into `/app/backend/routes/` + `/app/backend/models/` as feature count grows.
- Replace per-referral N+1 stats query with a single MongoDB aggregation pipeline once referral count > ~100.
- Email notifications to referral owners when they earn a conversion.
- CSV export of referrals & coupons from the admin pages.

## Key Endpoints
| Method | Route | Purpose |
|--------|-------|---------|
| GET    | /api/admin/stats | Dashboard counters |
| GET/POST/PATCH/DELETE | /api/referrals[/:code] | Referral CRUD |
| GET/POST | /api/referrals/:code/events | Event log / tracking |
| GET/POST/PATCH/DELETE | /api/coupons[/:code] | Coupon CRUD |
| POST | /api/coupons/:code/validate | Validate before applying |
| POST | /api/coupons/:code/redeem | Mark as redeemed (increments uses) |
| GET  | /api/coupons/:code/redemptions | Redemption history |

## Test Credentials
N/A — admin routes are intentionally unauthenticated for now. See backlog item P1.
