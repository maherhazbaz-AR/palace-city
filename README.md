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
  hooks/useWordPress       WordPress posts (highlights, testimonials); WP address comes from VITE_WP_URL
  hooks/useBanner          announcement banner from the WordPress plugin endpoint
  components/              one file per section
```

## Notes

- **Breakpoints** are defined in `src/index.css` to match the original stylesheet exactly. For example, `max-md:` means max-width 760px and `md:` means min-width 761px. Each one is listed there with its pixel value.
- **Copy changes**: edit `src/data/content.js`. Most text lives there.
- **Thank-you page**: a successful lead submit goes to `/thank-you` (see `src/lib/route.js` and `components/ThankYou.jsx`). The host must serve `index.html` for that path (Netlify: `/* /index.html 200` in `public/_redirects`; Vercel and Cloudflare Pages have SPA fallback settings; Apache and nginx need a rewrite). If this site shares a domain with WordPress, make sure `/thank-you/` isn't also a WordPress page.
- **Loading and error pages**: `index.html` contains a pure-HTML loading splash that shows while the JavaScript downloads (and turns into a "Reload" message if the app fails to start). `components/Preloader.jsx` then keeps the same screen up until fonts and the hero image are ready. Unknown URLs show `NotFound` and render crashes show `ErrorPage` (`components/StatusPage.jsx`, `components/ErrorBoundary.jsx`). Because this is a single-page app, the 404 page is served with HTTP status 200 (it is marked `noindex`); the host still needs the SPA fallback described above.
- **Contact Form 7**: lead forms post to CF7 form ID in `src/lib/cf7.js` (field names must match the CF7 tags). See that file for details.
- **WordPress**: the site address is `VITE_WP_URL` (copy `.env.example` to `.env`; it is read at build time, so change it before `npm run build`). The announcement banner is controlled entirely from the WordPress dashboard (`/wp-json/site/v1/banner`, `src/hooks/useBanner.js`): the site shows exactly what is saved there and has no built-in banner text. It shows nothing while loading, if WordPress can't be reached, if the banner is switched off, or if it is empty. Tag, title and text appear only when filled in; the button only when the link has a label (with a link address it opens it, without one it scrolls to the enquiry form). Images: `image` is the desktop and tablet image (**1920 × 800 px**, shown from 768px up) and `imageMobile` is the mobile image (**768 × 1024 px**, shown below 768px). Neither replaces the other, and each is shown full width and uncropped. The request is not cached by the browser; the host caches it for about a minute, and the site re-checks on every page load and when a visitor returns to the tab. Highlights and testimonials still come from posts in the `highlight` and `testimonial` categories.
- **Media**: the videos and images that were embedded as base64 in the HTML are now normal files in `public/media/`. That makes the first load much smaller, and the walkthrough film downloads only when a visitor gets near it.
