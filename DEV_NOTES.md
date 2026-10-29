# Portfolio Development Notes

## Architectural Decisions
- **Single Page Application (SPA):** Uses smooth section transitions managed via `script.js`.
- **Responsive Design:** Mobile-first approach with a bottom navigation bar (`.mobile-nav`) for phone screens (max-width: 768px).
- **Cinematic Aesthetic:** Uses `Anton` and `Bebas Neue` typography with a Black/Red/Gold color palette.
- **Dynamic Layout:** Mobile navigation dynamically switches positions—Top for the Home section (`.nav-top`) and Bottom for all other sections—to optimize visual space.

## Key Features & Fixes
- **Startup Performance:** The unused waves animation and simplex-noise dependency were removed so the home section opens without unnecessary animation work.
- **Masonry Gallery:** Photography and Pottery sections use a 3-column (desktop) / 2-column (mobile) masonry layout using CSS `column-count`.
- **Video Control:** `iframe` sources are reset when switching sections/categories to prevent background audio, and the Soulpepper video uses a click-to-play thumbnail (`.video-facade`) so the embed is only injected after a visitor clicks it.
- **Mobile Spacing:** Hero image on mobile is positioned at `bottom: 20px` when the nav is at the top to fill the vacant space.
- **Transparent Assets:** Hero image (`Media/Hero-Image.png`) is a transparent PNG for layered home-section visuals.
- **Search Visibility (unlisted by design):** The site is meant to be reachable only through a link shared directly. `index.html` carries `noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate` robots meta tags (plus a `googlebot` copy); the sitemap and the schema.org `Person` structured data were removed. `robots.txt` intentionally does **not** block crawling, because crawlers must be able to fetch the page to read the `noindex` tag. Do not add `Disallow: /` until Google has dropped the site.

## Technical Preferences
- **Favicon Paths:** The hero/loading favicon is `Media/Favicon.png`; the browser tab uses `Media/Favicon_Tab.png`.
- **Git Workflow:** Standard `add`, `commit`, `push` to `origin main`. Used `feature/waves-animation` for complex interactive updates.
- **HTTPS:** Managed via GitHub Pages; require DNS records to be "DNS Only" (Grey Cloud) in Cloudflare during certificate provisioning.
