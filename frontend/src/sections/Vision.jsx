import { useLayoutEffect, useRef } from 'react'
import Reveal from '../components/Reveal'
import { gsap, ScrollTrigger } from '../lib/gsap'

export default function Vision() {
  const wrapRef = useRef(null)
  const bgRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="vision-wrap dark" ref={wrapRef}>
      <div className="vision-bg" ref={bgRef} />
      <div className="inner">
        <Reveal as="div" className="eyebrow lt" style={{ position: 'relative', zIndex: 2 }}>
          Mission
        </Reveal>
        <Reveal
          as="h2"
          delay={0.1}
          className="display on-dark"
          style={{ position: 'relative', zIndex: 2 }}
        >
          Built to Become India&rsquo;s
          <br />
          Most Trusted <em>Guardian of Forest Heritage</em>
        </Reveal>
        <Reveal
          as="div"
          delay={0.2}
          className="rule center"
          style={{ position: 'relative', zIndex: 2 }}
        />
        <Reveal
          as="p"
          delay={0.3}
          className="vision-quote"
          style={{ position: 'relative', zIndex: 2 }}
        >
          &ldquo;To become India&rsquo;s most trusted steward of forest-origin heritage —
          preserving and sharing the unique flavors, traditions, and cultural knowledge of the
          Western Ghats with the world, for as long as they endure.&rdquo;
        </Reveal>
      </div>
    </div>
  )
}
