import { useEffect, useRef } from 'react'
import { RoyalOrn } from './Ornaments'
import { CHAPTERS, CLIP_LEN, MEDIA } from '../data/content'
import { cx, wrap } from '../lib/ui'
import { prefersReducedMotion } from '../lib/site'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

/**
 * Scroll-scrubbed villa film. The section is 1000vh tall (720vh on phones);
 * its sticky stage maps scroll progress to the video's currentTime, with a
 * short glide so it feels smooth at 60 and 120 Hz.
 */
function useScrollScrub({ walkRef, videoRef, loaderRef, barRef, captionRefs, railRefs }) {
  useEffect(() => {
    const walk = walkRef.current
    const video = videoRef.current
    const loader = loaderRef.current
    const barFill = barRef.current
    const capEls = captionRefs.current
    const railLis = railRefs.current
    const reduce = prefersReducedMotion()
    const cleanups = []
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts)
      cleanups.push(() => target.removeEventListener(type, fn, opts))
    }

    /* ---------- load the clip only when the walkthrough is near ---------- */
    let ready = false
    let started = false
    let objectUrl = ''
    const controller = new AbortController()
    function startVideo() {
      if (started) return
      started = true
      // download the whole clip first so every seek is local and instant
      fetch(MEDIA.walkFilm, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error(String(r.status))
          return r.blob()
        })
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob)
          video.src = objectUrl
          video.load()
        })
        .catch((err) => {
          if (err.name === 'AbortError') return
          video.src = MEDIA.walkFilm
          video.load()
        })
    }

    on(video, 'loadeddata', () => {
      ready = true
      loader.toggleAttribute('data-done', true)
      render(current)
    })
    // iOS: a touch unlocks seeking on a muted video
    on(window, 'touchstart', () => video.play().then(() => video.pause()).catch(() => {}), { once: true, passive: true })

    let io
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries, o) => {
          if (entries.some((x) => x.isIntersecting)) {
            o.disconnect()
            startVideo()
          }
        },
        { rootMargin: '150% 0px' },
      )
      io.observe(walk)
    }
    let idleTimer
    const startWhenIdle = () => {
      idleTimer = setTimeout(() => {
        window.requestIdleCallback ? requestIdleCallback(startVideo, { timeout: 2000 }) : startVideo()
      }, 1200)
    }
    if (document.readyState === 'complete') startWhenIdle()
    else on(window, 'load', startWhenIdle)

    /* ---------- scroll → progress → video time ---------- */
    let walkTop = 0
    let span = 1
    let vh = innerHeight
    const measure = () => {
      vh = innerHeight
      walkTop = walk.getBoundingClientRect().top + scrollY
      span = Math.max(1, walk.offsetHeight - vh)
    }

    let target = 0
    let current = 0
    let running = false
    let seeking = false
    let wantTime = -1
    let lastSet = -1
    on(video, 'seeked', () => {
      seeking = false
      if (wantTime >= 0) seekTo(wantTime)
    })
    function seekTo(t) {
      if (!ready) return
      if (seeking) {
        wantTime = t
        return
      }
      wantTime = -1
      if (Math.abs(t - lastSet) < 1 / 24) return
      lastSet = t
      seeking = true
      video.currentTime = t
    }

    // only touch the DOM when a value actually changes
    const cache = new WeakMap()
    const css = (el, prop, val) => {
      let m = cache.get(el)
      if (!m) cache.set(el, (m = {}))
      if (m[prop] !== val) {
        m[prop] = val
        el.style[prop] = val
      }
    }

    let lastActive = -1
    function render(p) {
      css(barFill, 'transform', `scaleX(${p.toFixed(4)})`)
      const t = p * (CLIP_LEN - 0.1)
      seekTo(t)
      let active = 0
      for (let i = 0; i < CHAPTERS.length; i++) if (t >= CHAPTERS[i].at) active = i
      for (let i = 0; i < capEls.length; i++) {
        const s = CHAPTERS[i].at
        const e = i < CHAPTERS.length - 1 ? CHAPTERS[i + 1].at : CLIP_LEN + 5
        if (t < s - 1 || t > e + 1) {
          css(capEls[i], 'opacity', '0')
          continue
        }
        const inA = i === 0 ? 1 : clamp((t - (s + 0.8)) / 1.2, 0, 1)
        const outA = 1 - clamp((t - (e - 2)) / 1.2, 0, 1)
        const o = Math.min(inA, outA)
        css(capEls[i], 'opacity', o.toFixed(3))
        css(capEls[i], 'transform', `translateY(${((1 - o) * 24).toFixed(1)}px)`)
      }
      if (active !== lastActive) {
        railLis.forEach((li, i) => li.toggleAttribute('data-on', i === active))
        lastActive = active
      }
    }

    let lastTs = 0
    let raf = 0
    function loop(ts) {
      const dt = lastTs ? Math.min(64, ts - lastTs) : 16
      lastTs = ts
      const k = reduce ? 1 : 1 - Math.exp(-dt / 110) // ~110 ms glide
      current += (target - current) * k
      if (Math.abs(target - current) < 0.00003) current = target
      render(current)
      if (current !== target) raf = requestAnimationFrame(loop)
      else {
        running = false
        lastTs = 0
      }
    }

    function onScroll() {
      const y = scrollY
      if (y < walkTop - vh || y > walkTop + span + vh) return
      target = clamp((y - walkTop) / span, 0, 1)
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    on(window, 'scroll', onScroll, { passive: true })
    let rz
    on(window, 'resize', () => {
      clearTimeout(rz)
      rz = setTimeout(() => {
        measure()
        onScroll()
      }, 120)
    })
    on(window, 'load', () => {
      measure()
      onScroll()
    })
    measure()
    onScroll()
    render(0)

    return () => {
      cleanups.forEach((f) => f())
      io?.disconnect()
      controller.abort()
      clearTimeout(idleTimer)
      clearTimeout(rz)
      cancelAnimationFrame(raf)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [walkRef, videoRef, loaderRef, barRef, captionRefs, railRefs])
}

export default function Walkthrough() {
  const walkRef = useRef(null)
  const videoRef = useRef(null)
  const loaderRef = useRef(null)
  const barRef = useRef(null)
  const captionRefs = useRef([])
  const railRefs = useRef([])
  useScrollScrub({ walkRef, videoRef, loaderRef, barRef, captionRefs, railRefs })

  return (
    <>
      <div id="walkthrough" className="bg-ground pt-[clamp(5.5rem,11vw,9rem)] pb-[clamp(3rem,5vw,4rem)] text-ink">
        <div className={cx(wrap, 'flex flex-wrap items-end justify-between gap-8')}>
          <div data-reveal>
            <RoyalOrn tight />
            <h2 className="max-w-[15ch] text-[clamp(2.1rem,4.4vw,3.5rem)] leading-[1.08]">Step inside a Palace City villa</h2>
          </div>
          <p data-reveal className="m-0 max-w-[38ch] text-muted">
            Scroll to move through a finished villa, from the facade to the living room, bedrooms and garden.
          </p>
        </div>
      </div>

      <section
        id="walk"
        ref={walkRef}
        aria-label="Scroll walkthrough of a Palace City villa"
        className="relative h-[1000vh] bg-[#2A1F17] max-md:h-[720vh]"
      >
        <div className="sticky top-0 h-svh overflow-hidden bg-[#2A1F17] bg-cover bg-center bg-no-repeat text-white">
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover [backface-visibility:hidden] [transform:translateZ(0)]"
            poster={MEDIA.walkPoster}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.5)_0%,rgba(0,0,0,0)_22%,rgba(0,0,0,0)_52%,rgba(0,0,0,.75)_100%)]" />

          <div>
            {CHAPTERS.map((c, i) => (
              <div
                key={c.name}
                ref={(el) => (captionRefs.current[i] = el)}
                className={cx(
                  'absolute bottom-[calc(3rem_+_env(safe-area-inset-bottom,0px))] left-[max(1.5rem,calc((100vw_-_1240px)/2_+_1.5rem))]',
                  'max-w-[min(560px,calc(100vw_-_6rem))] opacity-0 [text-shadow:0_1px_18px_rgba(0,0,0,.45)] will-change-[opacity,transform]',
                  'max-md:right-5 max-md:bottom-[calc(7rem_+_env(safe-area-inset-bottom,0px))] max-md:left-5 max-md:max-w-none short-land-520:bottom-5',
                )}
              >
                <div className="text-[.85rem] text-gold-bright">
                  {i + 1} of {CHAPTERS.length}
                </div>
                <h3 className="mt-[.35rem] mb-[.6rem] text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] max-md:text-[clamp(1.7rem,8vw,2.4rem)] short-land-520:mt-[.2rem] short-land-520:mb-[.3rem] short-land-520:text-[1.7rem]">
                  {c.title}
                </h3>
                <p className="m-0 text-[1.05rem] text-on-dark-muted max-md:text-[.98rem] short-land-520:text-[.9rem]">{c.text}</p>
              </div>
            ))}
          </div>

          <ol className="absolute top-1/2 right-[max(1.25rem,calc((100vw_-_1240px)/2_+_1.5rem))] m-0 flex -translate-y-1/2 list-none flex-col gap-[1.1rem] p-0 max-lg:hidden">
            {CHAPTERS.map((c, i) => (
              <li
                key={c.name}
                ref={(el) => (railRefs.current[i] = el)}
                className={cx(
                  'flex items-center justify-end gap-[.7rem] text-[.82rem] text-on-dark-muted transition-[color] duration-300 ease-[ease] [text-shadow:0_1px_10px_rgba(0,0,0,.5)]',
                  'after:h-px after:w-[22px] after:bg-current after:transition-[width] after:duration-300 after:ease-[ease]',
                  'data-on:text-white data-on:after:w-11 data-on:after:bg-gold-bright',
                )}
              >
                {c.name}
              </li>
            ))}
          </ol>

          <div aria-hidden="true" className="absolute inset-x-0 top-[calc(env(safe-area-inset-top,0px)_+_70px)] h-[2px] bg-white/18 short-land-520:top-[calc(env(safe-area-inset-top,0px)_+_60px)]">
            <b ref={barRef} className="absolute inset-0 origin-left bg-gold-bright [transform:scaleX(0)]" />
          </div>
          <div
            ref={loaderRef}
            role="status"
            className="absolute top-[calc(env(safe-area-inset-top,0px)_+_86px)] right-6 flex items-center gap-[.6rem] rounded-full border border-white/30 bg-black/40 px-[.7rem] py-1 text-[.75rem] text-on-dark-muted transition-opacity duration-500 ease-[ease] data-done:opacity-0 max-md:top-[calc(env(safe-area-inset-top,0px)_+_82px)] max-md:right-4"
          >
            Preparing walkthrough
          </div>
        </div>
      </section>
    </>
  )
}
