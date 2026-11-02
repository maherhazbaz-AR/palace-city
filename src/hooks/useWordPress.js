import { useEffect, useState } from 'react'

/* ============================================================
   WORDPRESS CONTENT
   Set WP_SITE to your WordPress address, for example
   "https://www.adityarampalacecity.com". Then manage content with
   ordinary posts in three categories (slugs):
     banner       – newest post fills the banner. Title = headline,
                    excerpt = text, first link in the post = button,
                    featured image = optional picture, first tag = small label.
     highlight    – each post is one highlight card (up to 6).
                    Title = heading, excerpt = text, featured image = photo.
     testimonial  – each post is one testimonial (up to 6).
                    Title = name, excerpt = quote, first tag = villa type or city.
   If WP_SITE is empty or WordPress can’t be reached, the built-in
   content shows (and the testimonial section hides on the live site).
   ============================================================ */
export const WP_SITE = 'https://adityarampalacecity.com'

const text = (html) => {
  const d = new DOMParser().parseFromString(html || '', 'text/html')
  return (d.body.textContent || '').replace(/\s+/g, ' ').trim()
}
const safeUrl = (u) => (/^(https?:|tel:|mailto:|#)/i.test(u || '') ? u : '')
const featured = (p) => {
  try {
    const m = p._embedded['wp:featuredmedia'][0]
    const s = (m.media_details && m.media_details.sizes) || {}
    return safeUrl((s.large || s.medium_large || s.medium || m).source_url)
  } catch {
    return ''
  }
}
const firstTag = (p) => {
  try {
    return p._embedded['wp:term'].flat().find((x) => x.taxonomy === 'post_tag').name
  } catch {
    return ''
  }
}
const firstLink = (html) => {
  const a = new DOMParser().parseFromString(html || '', 'text/html').querySelector('a[href]')
  return a ? { href: safeUrl(a.getAttribute('href')), label: a.textContent.trim() } : null
}

async function posts(base, slug, n) {
  const c = await (await fetch(`${base}/categories?slug=${encodeURIComponent(slug)}`)).json()
  if (!Array.isArray(c) || !c.length) return []
  const r = await (await fetch(`${base}/posts?categories=${c[0].id}&per_page=${n}&_embed=1`)).json()
  return Array.isArray(r) ? r : []
}

/**
 * Returns WordPress overrides once loaded. Every field is null until (and
 * unless) WordPress answers, so components fall back to built-in content.
 * `testimonialsHidden` is true on the live site until real testimonials arrive.
 */
export function useWordPress() {
  const [state, setState] = useState({
    banner: null,
    highlights: null,
    testimonials: null,
    testimonialsHidden: Boolean(WP_SITE),
  })

  useEffect(() => {
    if (!WP_SITE) return
    const base = WP_SITE.replace(/\/+$/, '') + '/wp-json/wp/v2'
    const patch = (p) => setState((s) => ({ ...s, ...p }))

    posts(base, 'banner', 1)
      .then(([p]) => {
        if (!p) return
        const link = firstLink(p.content.rendered)
        patch({
          banner: {
            title: text(p.title.rendered),
            text: text(p.excerpt.rendered) || null,
            tag: firstTag(p),
            link: link && link.href ? link : null,
            image: featured(p),
          },
        })
      })
      .catch(() => {})

    posts(base, 'highlight', 6)
      .then((list) => {
        if (!list.length) return
        patch({ highlights: list.map((p) => ({ img: featured(p), title: text(p.title.rendered), text: text(p.excerpt.rendered) })) })
      })
      .catch(() => {})

    posts(base, 'testimonial', 6)
      .then((list) => {
        if (!list.length) return
        patch({
          testimonials: list.map((p) => ({
            quote: text(p.excerpt.rendered) || text(p.content.rendered),
            name: text(p.title.rendered),
            tag: firstTag(p),
          })),
          testimonialsHidden: false,
        })
      })
      .catch(() => {})
  }, [])

  return state
}
