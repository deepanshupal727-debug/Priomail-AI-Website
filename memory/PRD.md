# PrioMail AI — Animated 3D Logo

## Original problem statement
> Create me Logo for my Saas here is snapshot for my logo, Make it working live 3d looking design logo do not change the design and colours of the logos just want to make it moving, example if i click on it it will fill with same colours or more shiny something that looks premium.

## User choices (confirmed)
- Both showcase page + reusable component
- True-3D capsule (CSS 3D transforms) + animated SVG bolt
- Click → fill + shimmer + spark burst (combined)
- Include "PrioMail AI" wordmark

## Architecture
Frontend-only feature. No backend / DB / 3rd-party integration required.

## What's implemented (2026-02)
- `src/components/PrioMailLogo.jsx` — reusable logo component (props: `size`, `showWordmark`)
  - Mouse-tilt parallax with `rotateX` / `rotateY` via perspective
  - Cursor-following specular highlight (radial gradient with mix-blend screen)
  - Continuous ambient violet halo pulse + capsule float idle animation
  - Bolt continuous soft-glow drop-shadow pulse
  - Click → bolt fill (white→violet gradient), stroke flash, shimmer sweep, ambient burst
  - 14 radial sparks per click with random angles & timings
  - Keyboard accessible (Enter / Space), `tabIndex=0`, `role="button"`
  - `prefers-reduced-motion` respected
- `src/components/PrioMailLogo.css` — all animation/styling
- `src/App.js` — showcase page consuming the component
- `src/App.css` — premium dark stage (radial backdrop + faint violet grid)
- All interactive / informational elements have `data-testid`

## Verified
Playwright screenshots captured for: idle, tilt-on-hover, click-charging — all rendering correctly with intended purple/indigo palette preserved.

## Backlog (P1 / P2)
- P1: Export as standalone SVG/Lottie for static contexts
- P1: Light-mode variant of the logo (currently dark-only)
- P2: Optional Three.js / React-Three-Fiber upgrade for true volumetric 3D capsule
- P2: Audio click feedback (subtle electric zap)
- P2: Drop into actual SaaS header/nav with shrink-on-scroll behaviour
