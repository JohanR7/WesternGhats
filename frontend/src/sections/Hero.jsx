import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

const LOGO_URL =
  'https://raw.githubusercontent.com/azure-2k4/WesternGhatsBrochure/d2edb106ea36ae4d9b6fe6ae23cf4fe9aaed42e4/Jun%2010%2C%202026%2C%2011_58_03%20AM.png'

export default function Hero() {
  const heroRef = useRef(null)
  const bgRef = useRef(null)
  const logoWrapRef = useRef(null)
  const eyebrowRef = useRef(null)
  const h1Ref = useRef(null)
  const subRef = useRef(null)
  const actionsRef = useRef(null)
  const scrollRef = useRef(null)
  const [logoError, setLogoError] = useState(false)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(bgRef.current, { scale: 1.06 })
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.to(bgRef.current, { scale: 1, duration: 2.4 }, 0)
        .from(logoWrapRef.current, { opacity: 0, y: 20, duration: 0.8 }, 0.2)
        .from(eyebrowRef.current, { opacity: 0, y: 16, duration: 0.7 }, 0.45)
        .from(h1Ref.current, { opacity: 0, y: 28, duration: 0.9 }, 0.6)
        .from(subRef.current, { opacity: 0, y: 20, duration: 0.8 }, 0.85)
        .from(actionsRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.05)
        .from(scrollRef.current, { opacity: 0, duration: 0.8 }, 1.3)

      gsap.to(bgRef.current, {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg" ref={bgRef} />
      <div className="hero-z">
        <div className="hero-logo-wrap" ref={logoWrapRef}>
          {!logoError ? (
            <img
              src={LOGO_URL}
              alt="Western Ghats"
              className="hero-logo-img"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="hero-logo-fallback">
              <div className="hero-logo-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C8 2 4 5.5 4 10c0 3 1.5 5.5 4 7v3h8v-3c2.5-1.5 4-4 4-7 0-4.5-4-8-8-8zm0 2c3.3 0 6 2.7 6 6 0 2.3-1.2 4.3-3 5.5l-.8.5H9.8l-.8-.5C7.2 14.3 6 12.3 6 10c0-3.3 2.7-6 6-6z" />
                  <path d="M10 7c0 2-2 4-2 4s2-.5 4-.5 4 .5 4 .5-2-2-2-4-1-1-2-1-2 0-2 1z" />
                </svg>
              </div>
            </div>
          )}
          <span className="hero-logo-name">Western Ghats</span>
        </div>
        <div className="hero-eyebrow" ref={eyebrowRef}>
          A Cultural Preservation Initiative · 2026
        </div>
        <h1 ref={h1Ref}>
          Keeping the <em>Forest&rsquo;s Stories</em>
          <br />
          Alive, for Generations
        </h1>
        <p className="hero-sub" ref={subRef}>
          A community-rooted effort to preserve the recipes, craftsmanship, and living
          traditions of the Western Ghats — carried by the tribal communities who have kept
          them for centuries, and shared with the world before they are lost.
        </p>
        <div className="hero-actions" ref={actionsRef}>
          <a href="#contact" className="btn-gold">
            Become a Cultural Steward
          </a>
          <a href="#products" className="btn-ghost">
            Explore the Heritage Collection
          </a>
        </div>
      </div>
      <div className="hero-scroll" ref={scrollRef}>
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
