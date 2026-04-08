# Portfolio Development Notes

## Architectural Decisions
- **Single Page Application (SPA):** Uses smooth section transitions managed via `script.js`.
- **Responsive Design:** Mobile-first approach with a bottom navigation bar (`.mobile-nav`) for phone screens (max-width: 768px).
- **Cinematic Aesthetic:** Uses `Anton` and `Bebas Neue` typography with a Black/Red/Gold color palette.
- **Dynamic Layout:** Mobile navigation dynamically switches positions—Top for the Home section (`.nav-top`) and Bottom for all other sections—to optimize visual space.

## Key Features & Fixes
- **Waves Animation:** Integrated a custom Vanilla JS `Waves` engine (powered by `simplex-noise`) for the home section background.
- **Performance Lifecycle:** Animation automatically starts/stops based on section active/inactive states to conserve system resources.
- **Masonry Gallery:** Photography and Pottery sections use a 3-column (desktop) / 2-column (mobile) masonry layout using CSS `column-count`.
- **Video Control:** Implemented a system to prevent background audio by resetting `iframe` sources when switching sections/categories.
- **Mobile Spacing:** Hero image on mobile is positioned at `bottom: 20px` when the nav is at the top to fill the vacant space.
- **Transparent Assets:** Hero image (`Media/Hero-Image.png`) is a transparent PNG to allow waves to flow behind the subject.
- **SEO & Domain:** Configured for `tasdidnoor.com` with `sitemap.xml` and `robots.txt`.

## Technical Preferences
- **Favicon Path:** Must be `Media/Favicon.png` (case-sensitive).
- **Git Workflow:** Standard `add`, `commit`, `push` to `origin main`. Used `feature/waves-animation` for complex interactive updates.
- **HTTPS:** Managed via GitHub Pages; require DNS records to be "DNS Only" (Grey Cloud) in Cloudflare during certificate provisioning.
