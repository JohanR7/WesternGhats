import { useLayoutEffect, useRef } from 'react'
import Reveal from '../components/Reveal'
import { gsap, ScrollTrigger } from '../lib/gsap'

const STEPS = [
  {
    title: 'Respectful Forest Sourcing',
    body: 'Ingredients are gathered by indigenous communities using their own traditional knowledge — fairly compensating the people whose expertise makes this possible.',
  },
  {
    title: 'Community-Rooted Production',
    body: 'Handcrafted production by tribal women in their own villages — keeping the work, and its benefits, close to the communities who hold the knowledge.',
  },
  {
    title: 'Careful Packaging & Storytelling',
    body: 'Quality inspection, clay pot packaging, and story-led presentation at our facility — where the craft and the story behind each item are given the care they deserve.',
  },
  {
    title: 'Direct Connection to Supporters',
    body: 'A direct-to-supporter model keeps us close to the people we serve, preserves the integrity of the story we tell, and builds a lasting community around this work.',
  },
  {
    title: 'A Relationship, Not a Transaction',
    body: 'Supporters engage with the story, the ceremony, and the community connection — not just the product. The unboxing experience is designed to deepen that connection with every order.',
  },
]

export default function Operations() {
  const stepsRef = useRef(null)
  const fillRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(fillRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      })
    }, stepsRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="section-wrap dark" id="process">
      <div className="inner">
        <Reveal>
          <div className="eyebrow lt">How We Work</div>
          <h2 className="display on-dark">
            A Simple, Community-First
            <br />
            <em>Way of Working</em>
          </h2>
          <div className="rule" />
        </Reveal>
        <div className="tl-steps" ref={stepsRef}>
          <div className="tl-line">
            <div className="tl-line-fill" ref={fillRef} />
          </div>
          {STEPS.map((s, i) => (
            <Reveal as="div" key={s.title} delay={i * 0.05} className="tl-step">
              <div className="tl-dot" />
              <div className="tl-num">Step {String(i + 1).padStart(2, '0')}</div>
              <div className="tl-title">{s.title}</div>
              <div className="tl-body">{s.body}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
