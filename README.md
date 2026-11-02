# Adityaram Palace City — React + Vite + Tailwind CSS

The Palace City landing page, rebuilt from the single-file HTML version as a React app styled with Tailwind CSS v4.

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # production build in dist/
npm run preview   # serve the production build
```

Requires Node 18+.

## Project layout

```
index.html                 page shell, title and meta tags
public/media/              hero film, walkthrough film, posters, highlight photos
src/
  index.css                Tailwind import, design tokens (@theme), fonts, base element styles
  App.jsx                  page order
  data/content.js          all copy: villas, FAQs, amenities, chapters, etc.
  lib/ui.js                shared class strings (container, section, buttons)
  lib/site.jsx             in-page jumps, enquiry villa selection, WhatsApp note
  hooks/useMotionEffects   entrance, scroll reveals, count-up, map pulse (motion.dev)
  hooks/useWordPress       optional WordPress content (set WP_SITE to enable)
  components/              one file per section
```

## Notes

- **Breakpoints** are defined in `src/index.css` to match the original stylesheet exactly. For example, `max-md:` means max-width 760px and `md:` means min-width 761px. Each one is listed there with its pixel value.
- **Copy changes**: edit `src/data/content.js`. Most text lives there.
- **Thank-you page**: a successful lead submit goes to `/thank-you` (see `src/lib/route.js` and `components/ThankYou.jsx`). The host must serve `index.html` for that path (Netlify: `/* /index.html 200` in `public/_redirects`; Vercel and Cloudflare Pages have SPA fallback settings; Apache and nginx need a rewrite). If this site shares a domain with WordPress, make sure `/thank-you/` isn't also a WordPress page.
- **Contact Form 7**: lead forms post to CF7 form ID in `src/lib/cf7.js` (field names must match the CF7 tags). See that file for details.
- **WordPress**: set `WP_SITE` in `src/hooks/useWordPress.js` to fill the banner, highlights and testimonials from posts.
- **Media**: the videos and images that were embedded as base64 in the HTML are now normal files in `public/media/`. That makes the first load much smaller, and the walkthrough film downloads only when a visitor gets near it.
