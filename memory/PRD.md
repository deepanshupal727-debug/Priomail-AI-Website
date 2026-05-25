# PrioMail AI — Landing Page PRD

## Original Problem Statement
Build a SaneBox-inspired landing page for PrioMail AI — an AI-powered email priority management SaaS. App connects Gmail/Outlook, classifies emails as CRITICAL/URGENT/NORMAL/SPAM/PHISHING via Claude AI, sends alarm-style notifications, detects phishing, drafts auto-replies, cleans inbox, and generates monthly health summaries. Build a 3D, professional, interactive marketing site within 30 credits.

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + shadcn/ui
- No backend in scope (landing page only)
- Single route `/` → `Landing.jsx`

## User Personas
- Founders / CEOs / executives drowning in email
- Operations leaders running 10+ inbox teams
- Security-conscious professionals worried about phishing

## Core Requirements (static)
- Hero with 3D email card stack and primary/secondary CTAs
- Live interactive demo of AI sorting emails into 5 priority buckets
- Bento grid of 7 features (alarm notifications, phishing radar, AI drafts, inbox cleanup, monthly report, Gmail+Outlook, command center)
- 3-step "How it works" (Connect → Classify → Notify)
- Pricing: Free / Pro ₹249/mo / Team ₹499/mo / Enterprise custom, monthly↔annual toggle (annual = 2 months free)
- Testimonials with avatars
- FAQ accordion (shadcn)
- Massive footer CTA with email capture + toast feedback
- Mobile responsive sticky header

## Implemented (Dec 2025)
- All sections above shipped, all data-testids present
- Frontend testing: 16/16 acceptance criteria pass, 0 console errors
- Dark Swiss-Brutalist aesthetic with signal-red (#FF3B30) accent
- Cabinet Grotesk + Manrope typography
- Framer-motion 3D card stack, parallax hero scroll, animated marquee, live demo

## Backlog (P1/P2 for future)
- P1: Connect Stripe Checkout to pricing CTAs (currently link to register page)
- P1: Wire footer waitlist form to backend (MongoDB) for lead capture
- P1: Add OG/meta tags and favicon for SEO
- P2: Customer logo cloud with real partner logos
- P2: Add /privacy, /terms, /security legal pages
- P2: Comparison table (PrioMail vs SaneBox vs Superhuman)
- P2: Blog / changelog section
